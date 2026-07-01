from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


ExamPrepMode = Literal["studyPlan", "flashcards", "practiceQuiz", "weakTopics"]
ExamPrepStatus = Literal["draft", "generated", "in_progress", "completed", "archived"]


class ExamPrepCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=180)
    subject: str = Field(..., min_length=1, max_length=120)
    exam_date: date | None = None
    prep_mode: ExamPrepMode = "studyPlan"
    status: ExamPrepStatus = "draft"
    progress: int = Field(default=0, ge=0, le=100)
    readiness_score: int = Field(default=0, ge=0, le=100)
    topics: str = Field(..., min_length=1, max_length=20000)
    current_knowledge: str | None = Field(default=None, max_length=12000)


class ExamPrepUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    exam_date: date | None = None
    prep_mode: ExamPrepMode | None = None
    status: ExamPrepStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    readiness_score: int | None = Field(default=None, ge=0, le=100)
    topics: str | None = Field(default=None, min_length=1, max_length=20000)
    current_knowledge: str | None = Field(default=None, max_length=12000)
    generated_content: str | None = Field(default=None, max_length=60000)


class ExamPrepGenerateRequest(BaseModel):
    mode: ExamPrepMode | None = None


class ExamPrepResponse(BaseModel):
    id: str
    user_id: str
    title: str
    subject: str
    exam_date: str | None = None
    prep_mode: str
    status: str
    progress: int
    readiness_score: int
    topics: str
    current_knowledge: str | None = None
    generated_content: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class ExamPrepGenerateResponse(BaseModel):
    exam_prep: ExamPrepResponse
    mode: ExamPrepMode
    result: str
    model_used: str | None = None
    fallback_used: bool = False
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None
