from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


PaidPlanId = Literal["student_premium", "teacher"]


class CheckoutRequest(BaseModel):
    plan_id: PaidPlanId
    success_url: HttpUrl | None = None
    cancel_url: HttpUrl | None = None


class CheckoutResponse(BaseModel):
    checkout_url: str


class BillingWebhookResponse(BaseModel):
    received: bool = True
    event_type: str | None = None
