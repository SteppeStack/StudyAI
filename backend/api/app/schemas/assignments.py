from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


AssignmentHelpType = Literal["solution_plan", "key_points", "answer_check"]
AssignmentPriority = Literal["low", "medium", "high", "urgent"]
AssignmentStatus = Literal["draft", "in_progress", "submitted", "checked", "completed"]


class AssignmentCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=160)
    subject: str | None = Field(default=None, max_length=100)
    help_type: AssignmentHelpType = "solution_plan"
    deadline: date | None = None
    priority: AssignmentPriority = "medium"
    status: AssignmentStatus = "draft"
    progress: int = Field(default=0, ge=0, le=100)
    description: str = Field(..., min_length=1, max_length=12000)
    student_answer: str | None = Field(default=None, max_length=12000)


class AssignmentUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    subject: str | None = Field(default=None, max_length=100)
    help_type: AssignmentHelpType | None = None
    deadline: date | None = None
    priority: AssignmentPriority | None = None
    status: AssignmentStatus | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    description: str | None = Field(default=None, min_length=1, max_length=12000)
    student_answer: str | None = Field(default=None, max_length=12000)


class AssignmentGenerateRequest(BaseModel):
    action: AssignmentHelpType


class AssignmentResponse(BaseModel):
    id: str
    user_id: str
    title: str
    subject: str | None = None
    help_type: str
    deadline: str | None = None
    priority: str
    status: str
    progress: int
    description: str
    student_answer: str | None = None
    generated_solution_plan: str | None = None
    generated_key_points: str | None = None
    ai_feedback: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class AssignmentGenerateResponse(BaseModel):
    assignment: AssignmentResponse
    action: AssignmentHelpType
    result: str
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None
