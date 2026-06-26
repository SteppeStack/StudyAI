from pydantic import BaseModel
from typing import Literal


class UserFileResponse(BaseModel):
    id: str
    user_id: str
    bucket_id: str
    storage_path: str
    original_name: str
    content_type: str | None = None
    file_type: str
    size_bytes: int
    status: str
    created_at: str | None = None
    updated_at: str | None = None


class SignedUrlResponse(BaseModel):
    signed_url: str
    expires_in: int


FileAnalysisAction = Literal[
    "summarize",
    "key_points",
    "flashcards",
    "quiz",
    "ask",
    "create_notes",
]


class FileAnalysisRequest(BaseModel):
    action: FileAnalysisAction
    question: str | None = None


class FileAnalysisResponse(BaseModel):
    file_id: str
    action: FileAnalysisAction
    result: str
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None
