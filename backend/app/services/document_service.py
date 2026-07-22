from __future__ import annotations

# import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.core.config import CHUNK_OVERLAP, CHUNK_SIZE, UPLOAD_DIR
# from app.core.config import UPLOAD_DIR
from app.db.models import Document, DocumentChunk, User
from app.services.embedding_service import get_embedding_service
from app.services.ocr_service import OCRService
from app.services.vectorstore_service import get_vector_store_service
from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.ocr = OCRService()
        self.embedding_service = get_embedding_service()
        self.vector_store = get_vector_store_service()

    def upload_documents(self, files: List[tuple[str, bytes]], owner: User) -> List[Dict[str, Any]]:
        results: List[Dict[str, Any]] = []
        for file_name, content in files:
            doc = self._process_pdf(file_name=file_name, content=content, owner=owner)
            results.append(doc)
        return results

    def _process_pdf(self, *, file_name: str, content: bytes, owner: User) -> Dict[str, Any]:
        storage_path = UPLOAD_DIR / f"{owner.username}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{Path(file_name).name}"
        storage_path.write_bytes(content)
        text = self.ocr.extract_text(content)
        if not text:
            raise ValueError("No extractable text found in the uploaded PDF")
        # cleaned = self._clean_text(text)
        # chunks = self._chunk_text(cleaned)
        # summary = self._summarize(chunks)
        # equipment_tags = self._extract_equipment(cleaned)
        cleaned = self._clean_text(text)

        chunks = self._chunk_text(cleaned)
        summary = self._summarize(chunks)
        equipment_tags = self._extract_equipment(cleaned)
        safety_keywords = self._extract_keywords(cleaned)
        document = Document(
            title=Path(file_name).stem,
            file_name=file_name,
            storage_path=str(storage_path),
            summary=summary,
            page_count=max(1, len(chunks)),
            chunk_count=len(chunks),
            owner_id=owner.id,
            owner_username=owner.username,
            equipment_tags=equipment_tags,
            safety_keywords=safety_keywords,
            document_metadata={"uploaded_by": owner.username},
            uploaded_at=datetime.now(timezone.utc),
        )
        self.db.add(document)
        self.db.flush()
        vector_docs: List[Dict[str, Any]] = []
        for idx, chunk in enumerate(chunks):
            chunk_id = f"{document.id}:{idx}"
            chunk_record = DocumentChunk(
                document_id=document.id,
                chunk_index=idx,
                page_number=1,
                content=chunk,
                chunk_metadata={"document_id": document.id, "page_number": 1, "owner": owner.username},
                embedding_id=chunk_id,
            )
            self.db.add(chunk_record)
            self.db.flush()
            vector_docs.append(
                {
                    "id": chunk_id,
                    "content": chunk,
                    "metadata": {
                        "document_id": document.id,
                        "page_number": 1,
                        "source": file_name,
                        "owner": owner.username,
                    },
                }
            )
        embeddings = self.embedding_service.embed_batch(chunks)
        try:
            self.vector_store.add_documents(vector_docs, embeddings=embeddings)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
        return {
            "id": document.id,
            "file_name": file_name,
            "summary": summary,
            "page_count": document.page_count,
            "chunk_count": len(chunks),
            "equipment_tags": equipment_tags,
            "safety_keywords": safety_keywords,
            "uploaded_at": document.uploaded_at.isoformat(),
        }

    def list_documents(self, owner: Optional[User] = None) -> List[Document]:
        query = self.db.query(Document)
        if owner and owner.role != "owner":
            query = query.filter(Document.owner_id == owner.id)
        return query.order_by(Document.uploaded_at.desc()).all()

    def delete_document(self, document_id: int, owner: User) -> bool:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document or (owner.role != "owner" and document.owner_id != owner.id):
            return False
        chunk_ids = [f"{document.id}:{chunk.chunk_index}" for chunk in document.chunks]
        self.vector_store.delete_by_ids(chunk_ids)
        self.db.delete(document)
        self.db.commit()
        return True

    def search(self, query_text: str, owner: Optional[User] = None) -> List[Dict[str, Any]]:
        query_embedding = self.embedding_service.embed_text(query_text)

        hits = self.vector_store.query(
            query_text,
            top_k=5,
            query_embedding=query_embedding,
        )
        return hits

    def _clean_text(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def _chunk_text(self, text: str) -> List[str]:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=[
                "\n\n",
                "\n",
                ". ",
                "! ",
                "? ",
                "; ",
                ", ",
                " ",
                "",
            ],
        )

        chunks = splitter.split_text(text)

        return [chunk.strip() for chunk in chunks if chunk.strip()]

    def _summarize(self, chunks: List[str]) -> str:
        if not chunks:
            return ""
        return " ".join(chunks[:3])[:500]

    def _extract_equipment(self, text: str) -> Dict[str, List[str]]:

        equipment_list = [
            "Pump",
            "Motor",
            "Valve",
            "Compressor",
            "Boiler",
            "Generator",
            "Turbine",
            "PLC",
            "Sensor",
            "Transmitter",
            "Bearing",
            "Gearbox",
            "Conveyor",
            "Fan",
            "Blower",
            "Heat Exchanger",
            "Tank",
            "Vessel",
            "Pipeline",
            "Pipe",
            "Filter",
            "Actuator",
            "Breaker",
            "Relay",
            "Transformer",
            "Cable",
            "Switchgear",
            "VFD",
            "HMI",
            "SCADA",
        ]

        found_equipment = []

        lower_text = text.lower()

        for item in equipment_list:
            if item.lower() in lower_text:
                found_equipment.append(item)

        equipment_ids = []

        for match in re.findall(r"\b[A-Z]{2,10}-\d{2,5}\b", text):

            # Ignore document ids
            if match.startswith(("DOC", "IND", "MAN", "SOP", "REV")):
                continue

            equipment_ids.append(match)

        safety = re.findall(
            r"\b(PPE|SOP|LOTO|Lockout|Tagout|Hazard|Permit|Isolation|Emergency)\b",
            text,
            flags=re.IGNORECASE,
        )

        return {
            "equipment_ids": sorted(set(equipment_ids)),
            "machine_names": sorted(set(found_equipment)),
            "safety_procedures": sorted(
                {x.title() for x in safety}
            ),
        }
    
    def _extract_keywords(self, text: str) -> Dict[str, List[str]]:
        words = re.findall(r"[A-Za-z]{4,}", text.lower())

        return {
            "keywords": sorted(set(words))[:20]
        }