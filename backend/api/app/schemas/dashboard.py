from pydantic import BaseModel


class DashboardProfileResponse(BaseModel):
    id: str
    email: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None
    account_role: str | None = None
    subscription_plan: str | None = None


class PlanResponse(BaseModel):
    id: str
    display_name: str
    audience: str
    monthly_price_cents: int
    currency: str
    daily_ai_request_limit: int | None = None
    monthly_ai_request_limit: int | None = None


class SubscriptionResponse(BaseModel):
    id: str
    status: str
    started_at: str | None = None
    expires_at: str | None = None
    plan: PlanResponse


class MonthlyUsageResponse(BaseModel):
    period_start: str
    ai_requests_used: int
    documents_generated: int


class ActivityEventResponse(BaseModel):
    id: str
    event_type: str
    title: str
    description: str | None = None
    status: str | None = None
    resource_type: str | None = None
    resource_id: str | None = None
    created_at: str | None = None


class DashboardResponse(BaseModel):
    profile: DashboardProfileResponse
    subscription: SubscriptionResponse
    usage: MonthlyUsageResponse
    recent_activity: list[ActivityEventResponse]
