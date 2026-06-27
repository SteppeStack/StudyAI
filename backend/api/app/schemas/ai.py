from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    conversation_id: str | None = None
    title: str | None = Field(default=None, max_length=120)


class AIMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str | None = None


class UsageResponse(BaseModel):
    ai_requests_used: int
    monthly_ai_request_limit: int | None = None


class AIChatResponse(BaseModel):
    conversation_id: str
    user_message: AIMessageResponse
    assistant_message: AIMessageResponse
    usage: UsageResponse
    model_used: str | None = None
    fallback_used: bool = False
