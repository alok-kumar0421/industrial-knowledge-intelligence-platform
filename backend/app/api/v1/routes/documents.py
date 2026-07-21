from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
import traceback

from app.core.auth import require_owner
from app.db.models import User
from app.db.session import get_db
from app.schemas.models import DocumentSummary
from app.services.document_service import DocumentService

router = APIRouter()


@router.get("", response_model=list[DocumentSummary])
def list_documents(
    user: User = Depends(require_owner),
    db: Session = Depends(get_db),
) -> list[DocumentSummary]:
    service = DocumentService(db)
    documents = service.list_documents(owner=user)

    return [
        DocumentSummary(
            id=str(document.id),
            file_name=document.file_name,
            uploaded_at=document.uploaded_at.isoformat(),
            summary=document.summary,
            equipment=document.equipment_tags.get("machine_names", []) if document.equipment_tags else [],
            keywords=document.safety_keywords.get("keywords", []) if document.safety_keywords else [],
            page_count=document.page_count,
            chunk_count=document.chunk_count,
        )
        for document in documents
    ]


@router.post("", response_model=DocumentSummary)
async def upload_document(
    file: UploadFile = File(...),
    user: User = Depends(require_owner),
    db: Session = Depends(get_db),
) -> DocumentSummary:
    try:
        if not file.filename or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        content = await file.read()

        service = DocumentService(db)
        result = service.upload_documents(
            [(file.filename, content)],
            owner=user,
        )[0]

        return DocumentSummary(
            id=str(result["id"]),
            file_name=result["file_name"],
            uploaded_at=result["uploaded_at"],
            summary=result["summary"],
            equipment=result.get("equipment_tags", {}).get("machine_names", []),
            keywords=result.get("safety_keywords", {}).get("keywords", []),
            page_count=result.get("page_count", 1),
            chunk_count=result.get("chunk_count", 0),
        )

    except Exception as e:
        print("\n" + "=" * 80)
        print("UPLOAD ERROR")
        traceback.print_exc()
        print("=" * 80 + "\n")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    user: User = Depends(require_owner),
    db: Session = Depends(get_db),
) -> dict:
    service = DocumentService(db)
    deleted = service.delete_document(document_id, owner=user)

    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")

    return {"message": "Document deleted successfully"}