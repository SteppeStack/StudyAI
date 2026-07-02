from fastapi import APIRouter, Depends, Header, Request, status

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.billing import BillingWebhookResponse, CheckoutRequest, CheckoutResponse
from app.services.billing import BillingService
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])


def get_billing_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
) -> BillingService:
    return BillingService(supabase=supabase)


@router.post("/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
async def create_checkout_session(
    payload: CheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
    service: BillingService = Depends(get_billing_service),
) -> CheckoutResponse:
    return await service.create_checkout_session(user=user, payload=payload)


@router.post("/webhook", response_model=BillingWebhookResponse)
async def handle_billing_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
    service: BillingService = Depends(get_billing_service),
) -> BillingWebhookResponse:
    event_type = await service.handle_webhook(
        payload=await request.body(),
        signature=stripe_signature,
    )
    return BillingWebhookResponse(received=True, event_type=event_type)
