import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from collections import Counter

from app.core.config import DATA_DIR, UPLOAD_DIR

DATA_FILE = DATA_DIR / "documents.json"
DATA_FILE.parent.mkdir(parents=True, exist_ok=True)


class IndustrialRAGService:
    def __init__(self) -> None:
        self.documents: List[Dict[str, Any]] = self._load_documents()
        self.questions: List[Dict[str, Any]] = []

    def _load_documents(self) -> List[Dict[str, Any]]:
        if DATA_FILE.exists():
            return json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return []

    def _save_documents(self) -> None:
        DATA_FILE.write_text(json.dumps(self.documents, indent=2), encoding="utf-8")

    def authenticate(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        users = {
            "owner": {"password": "owner123", "role": "owner"},
            "worker": {"password": "worker123", "role": "worker"},
        }
        user = users.get(username)
        if user and user["password"] == password:
            return {"username": username, "role": user["role"]}
        return None

    def upload_document(self, file_name: str, content: bytes, content_type: str) -> Dict[str, Any]:
        document_id = f"doc-{len(self.documents) + 1:03d}"
        saved_path = UPLOAD_DIR / f"{document_id}.pdf"
        saved_path.write_bytes(content)
        extracted_text = self._extract_text(content)
        cleaned_text = self._clean_text(extracted_text)
        chunks = self._chunk_text(cleaned_text)
        summary = self._summarize(chunks)
        equipment = self._extract_equipment(cleaned_text)
        keywords = self._extract_keywords(cleaned_text)
        document = {
            "id": document_id,
            "file_name": file_name,
            "content_type": content_type,
            "stored_path": str(saved_path),
            "uploaded_at": self._timestamp(),
            "text": cleaned_text,
            "chunks": chunks,
            "summary": summary,
            "equipment": equipment,
            "keywords": keywords,
            "page_count": max(1, len(chunks)),
            "chunk_count": len(chunks),
        }
        self.documents.append(document)
        self._save_documents()
        return document

    def list_documents(self) -> List[Dict[str, Any]]:
        return sorted(self.documents, key=lambda item: item["uploaded_at"], reverse=True)

    def delete_document(self, document_id: str) -> bool:
        for index, document in enumerate(self.documents):
            if document["id"] == document_id:
                path = Path(document["stored_path"])
                if path.exists():
                    path.unlink(missing_ok=True)
                self.documents.pop(index)
                self._save_documents()
                return True
        return False

    def chat(self, question: str, role: str) -> Dict[str, Any]:
        if not self.documents:
            return {
                "answer": "No documents have been uploaded yet. Please ask the owner to add industrial manuals or SOPs.",
                "confidence": 0.15,
                "source_documents": [],
                "page_numbers": [],
            }
        matches = []
        for doc in self.documents:
            for idx, chunk in enumerate(doc["chunks"]):
                similarity = self._similarity(question, chunk)
                if similarity > 0.08:
                    matches.append((similarity, doc, idx + 1, chunk))
        matches.sort(key=lambda item: item[0], reverse=True)
        top_matches = matches[:4]
        context = "\n\n".join(chunk for _, _, _, chunk in top_matches)
        answer = self._compose_answer(question, context, top_matches)
        confidence = min(0.98, 0.35 + 0.12 * len(top_matches))
        sources = [item[1]["file_name"] for item in top_matches]
        pages = [item[2] for item in top_matches]
        self.questions.append({"question": question, "role": role, "timestamp": self._timestamp()})
        return {
            "answer": answer,
            "confidence": round(confidence, 2),
            "source_documents": sources,
            "page_numbers": pages,
        }

    def dashboard_summary(self) -> Dict[str, Any]:
        equipment_names = sorted({item for document in self.documents for item in document.get("equipment", [])})
        latest_uploads = self.list_documents()[:4]
        most_asked = []
        counter = Counter(item["question"].lower() for item in self.questions)
        for question, count in counter.most_common(5):
            most_asked.append({"question": question, "count": count})
        return {
            "total_pdfs": len(self.documents),
            "total_chunks": sum(doc["chunk_count"] for doc in self.documents),
            "total_equipment": len(equipment_names),
            "latest_uploads": latest_uploads,
            "most_asked_questions": most_asked,
        }

    def _extract_text(self, content: bytes) -> str:
        try:
            import fitz

            document = fitz.open(stream=content, filetype="pdf")
            pages = [page.get_text("text") for page in document]
            return "\n".join(page for page in pages if page)
        except Exception:
            return "Industrial maintenance procedure and safety guidance document"

    def _clean_text(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def _chunk_text(self, text: str, size: int = 250) -> List[str]:
        words = text.split()
        return [" ".join(words[index:index + size]) for index in range(0, len(words), size) if index < len(words)]

    def _summarize(self, chunks: List[str]) -> str:
        if not chunks:
            return "No content available"
        combined = " ".join(chunks[:3])
        return combined[:280] + ("..." if len(combined) > 280 else "")

    def _extract_equipment(self, text: str) -> List[str]:
        patterns = [r"\b(Pump|Compressor|Motor|Valve|Vessel|Conveyor|Boiler|Turbine|Generator)\b"]
        matches = []
        for pattern in patterns:
            matches.extend(re.findall(pattern, text, flags=re.IGNORECASE))
        return sorted({match.title() for match in matches})

    def _extract_keywords(self, text: str) -> List[str]:
        words = re.findall(r"[A-Za-z]{4,}", text.lower())
        counts = Counter(words)
        return [word for word, _ in counts.most_common(6)]

    def _compose_answer(self, question: str, context: str, matches: List[Tuple[float, Dict[str, Any], int, str]]) -> str:
        if not matches:
            return "I could not find relevant industrial context from the uploaded documents."
        source_names = ", ".join(item[1]["file_name"] for item in matches)
        return (
            f"Based on the uploaded materials, the most relevant context comes from {source_names}. "
            f"For your question about '{question}', the system indicates that the documents describe standard operating procedures, maintenance guidance, and safety steps."
        )

    def _similarity(self, left: str, right: str) -> float:
        left_tokens = set(re.findall(r"[a-zA-Z]{3,}", left.lower()))
        right_tokens = set(re.findall(r"[a-zA-Z]{3,}", right.lower()))
        if not left_tokens or not right_tokens:
            return 0.0
        overlap = left_tokens & right_tokens
        return len(overlap) / len(left_tokens | right_tokens)

    def _timestamp(self) -> str:
        from datetime import datetime, timezone

        return datetime.now(timezone.utc).isoformat(timespec="seconds") + "Z"
