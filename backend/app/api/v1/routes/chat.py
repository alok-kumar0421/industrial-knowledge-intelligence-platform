from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas.models import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ChatResponse:
    service = ChatService(db)
    result = service.ask(question=payload.question, user=user)
    return ChatResponse(**result)

@router.get("/history")
def history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ChatService(db)

    chats = service.history(user)

    messages = [
        {
            "role": "assistant",
            "content": "I can help you inspect maintenance procedures, safety requirements, and operational guidance from the indexed knowledge base.",
        }
    ]

    for chat in reversed(chats):

        messages.append({
            "role": "user",
            "content": chat.question,
        })

        messages.append({
            "role": "assistant",
            "content": chat.answer,
            "confidence": chat.confidence,
            "sources": chat.source_documents,
            "pages": chat.page_numbers,
        })

    return messages

@router.delete("/history")
def clear_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ChatService(db)

    service.clear_history(user)

    return {
        "message": "Chat history cleared"
    }