from typing import Literal

from pydantic import BaseModel, Field


DocumentType = Literal["essay", "summary", "research", "report", "outline", "notes", "custom"]
DocumentStatus = Literal["draft", "generated", "reviewed", "archived"]
DocumentLanguage = Literal["en", "ru", "kz"]
DocumentTone = Literal["academic", "simple", "formal", "concise", "persuasive"]
DocumentGenerateAction = Literal["outline", "draft", "summarize", "improve"]


class DocumentCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=180)
    course: str | None = Field(default=None, max_length=120)
    document_type: DocumentType = "essay"
    status: DocumentStatus = "draft"
    language: DocumentLanguage = "en"
    tone: DocumentTone = "academic"
    progress: int = Field(default=0, ge=0, le=100)
    instructions: str = Field(..., min_length=1, max_length=12000)
    source_text: str | None = Field(default=None, max_length=30000)


class DocumentUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    course: str | None = Field(default=None, max_length=120)
    document_type: DocumentType | None = None
    status: DocumentStatus | None = None
    language: DocumentLanguage | None = None
    tone: DocumentTone | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    instructions: str | None = Field(default=None, min_length=1, max_length=12000)
    source_text: str | None = Field(default=None, max_length=30000)
    generated_content: str | None = Field(default=None, max_length=60000)


class DocumentGenerateRequest(BaseModel):
    action: DocumentGenerateAction


class DocumentResponse(BaseModel):
    id: str
    user_id: str
    title: str
    course: str | None = None
    document_type: str
    status: str
    language: str
    tone: str
    progress: int
    instructions: str
    source_text: str | None = None
    generated_content: str | None = None
    word_count: int
    created_at: str | None = None
    updated_at: str | None = None


class DocumentGenerateResponse(BaseModel):
    document: DocumentResponse
    action: DocumentGenerateAction
    result: str
    model_used: str | None = None
    fallback_used: bool = False
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None
