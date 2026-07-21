from typing import List, Optional
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=3)


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=3)
    role: str = Field(default="worker", min_length=3)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str


class DocumentSummary(BaseModel):
    id: str
    file_name: str
    uploaded_at: str
    summary: str
    equipment: List[str]
    keywords: List[str]
    page_count: int
    chunk_count: int


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=3)


class ChatResponse(BaseModel):
    answer: str
    confidence: float
    source_documents: List[str]
    page_numbers: List[int]


class DashboardResponse(BaseModel):
    total_pdfs: int
    total_chunks: int
    total_equipment: int

    latest_uploads: List[DocumentSummary]

    most_asked_questions: List[dict]

    recent_worker_questions: List[dict]
