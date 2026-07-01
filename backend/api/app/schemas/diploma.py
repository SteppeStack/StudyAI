from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


ResearchType = Literal["mixed", "quantitative", "qualitative", "theoretical"]
DiplomaStatus = Literal["draft", "structured", "in_progress", "reviewed", "completed", "archived"]
ChapterStatus = Literal["notStarted", "inProgress", "draftReady", "reviewed"]
ChapterKey = Literal[
    "introduction",
    "literature",
    "methodology",
    "results",
    "discussion",
    "conclusion",
]
DiplomaGenerateAction = Literal["structure", "researchQuestions", "chapterPlan", "feedback"]


class DiplomaCreateRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=240)
    faculty: str | None = Field(default=None, max_length=160)
    research_area: str | None = Field(default=None, max_length=180)
    supervisor: str | None = Field(default=None, max_length=160)
    deadline: date | None = None
    research_type: ResearchType = "mixed"
    status: DiplomaStatus = "draft"
    progress: int = Field(default=0, ge=0, le=100)
    research_goal: str | None = Field(default=None, max_length=12000)
    objectives: str | None = Field(default=None, max_length=12000)
    chapter_statuses: dict[ChapterKey, ChapterStatus] | None = None


class DiplomaUpdateRequest(BaseModel):
    topic: str | None = Field(default=None, min_length=1, max_length=240)
    faculty: str | None = Field(default=None, max_length=160)
    research_area: str | None = Field(default=None, max_length=180)
    supervisor: str | None = Field(default=None, max_length=160)
    deadline: date | None = None
    research_type: ResearchType | None = None
    status: DiplomaStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    research_goal: str | None = Field(default=None, max_length=12000)
    objectives: str | None = Field(default=None, max_length=12000)
    chapter_statuses: dict[ChapterKey, ChapterStatus] | None = None
    generated_structure: str | None = Field(default=None, max_length=60000)


class DiplomaGenerateRequest(BaseModel):
    action: DiplomaGenerateAction = "structure"


class DiplomaResponse(BaseModel):
    id: str
    user_id: str
    topic: str
    faculty: str | None = None
    research_area: str | None = None
    supervisor: str | None = None
    deadline: str | None = None
    research_type: str
    status: str
    progress: int
    research_goal: str | None = None
    objectives: str | None = None
    chapter_statuses: dict[str, str]
    generated_structure: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class DiplomaGenerateResponse(BaseModel):
    diploma: DiplomaResponse
    action: DiplomaGenerateAction
    result: str
    model_used: str | None = None
    fallback_used: bool = False
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None
