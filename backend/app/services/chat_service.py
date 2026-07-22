from __future__ import annotations

from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.config import TOP_K
from app.db.models import ChatHistory, User
from app.services.document_service import DocumentService
from app.services.llm_service import LLMService
import math


class ChatService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.document_service = DocumentService(db)
        self.llm_service = LLMService()

    def ask(self, *, question: str, user: User) -> Dict[str, Any]:
        if not question.strip():
            raise ValueError("Question is required")
        retrieved = self.document_service.search(
            question,
            owner=user,
        )[:TOP_K]

        context = "\n\n".join(
            hit.get("content", "")
            for hit in retrieved
        )
        if not context:
            answer = "I could not find this information inside uploaded documents."
            confidence = 0.0
            sources = []
            pages = []
        else:
            answer = self.llm_service.generate_answer(
                question=question,
                context=context
            )

            # LLM could not answer from documents
            if answer.strip().lower().startswith(
                "i could not find this information"
            ):
                confidence = 0.0
                sources = []
                pages = []

            else:

                sources = sorted(
                    {
                        hit.get("metadata", {}).get("source", "unknown")
                        for hit in retrieved[:TOP_K]
                    }
                )

                pages = sorted(
                    {
                        hit.get("metadata", {}).get("page_number", 1)
                        for hit in retrieved[:TOP_K]
                    }
                )

                distances = [
                    hit.get("distance", 1.0)
                    for hit in retrieved[:TOP_K]
                ]

                if distances:

                    avg_distance = sum(distances) / len(distances)

                    confidence = 0.60 + (
                        0.39 * math.exp(-avg_distance)
                    )

                    confidence = round(
                        min(confidence, 0.99),
                        2,
                    )

                else:

                    confidence = 0.0
            
        chat_record = ChatHistory(
            user_id=user.id,
            question=question,
            answer=answer,
            confidence=round(confidence, 2),
            source_documents=sources,
            page_numbers=pages,
        )
        self.db.add(chat_record)
        self.db.commit()
        return {"answer": answer, "confidence": round(confidence, 2), "source_documents": sources, "page_numbers": pages}

    def history(self, user: User) -> List[ChatHistory]:
        return self.db.query(ChatHistory).filter(ChatHistory.user_id == user.id).order_by(ChatHistory.created_at.desc()).all()
    
    def clear_history(self, user: User):
        self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user.id
        ).delete()

        self.db.commit()