from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.models import ChatHistory, User
from app.db.session import get_db
from app.schemas.models import DashboardResponse, DocumentSummary
from app.services.document_service import DocumentService

router = APIRouter()


@router.get("", response_model=DashboardResponse)
def dashboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardResponse:

    service = DocumentService(db)
    documents = service.list_documents()

    latest_uploads = [
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
        for document in documents[:4]
    ]

    questions = (
        db.query(ChatHistory)
        .join(User)
        .filter(User.role == "worker")
        .order_by(ChatHistory.created_at.desc())
        .limit(5)
        .all()
    )

    most_asked_questions = [
        {
            "question": item.question,
            "count": 1,
        }
        for item in questions
    ]

    recent_worker_questions = [
        {
            "worker": item.user.name,
            "username": item.user.username,
            "question": item.question,
        }
        for item in questions
    ]

    return DashboardResponse(
        total_pdfs=len(documents),

        total_chunks=sum(
            document.chunk_count
            for document in documents
        ),

        total_equipment=sum(
            len(document.equipment_tags.get("machine_names", []))
            if document.equipment_tags
            else 0
            for document in documents
        ),

        latest_uploads=latest_uploads,

        most_asked_questions=most_asked_questions,

        recent_worker_questions=recent_worker_questions,
    )