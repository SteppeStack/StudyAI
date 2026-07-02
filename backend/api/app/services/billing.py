from typing import Any

import stripe
from fastapi import HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas.auth import CurrentUser
from app.schemas.billing import CheckoutRequest, CheckoutResponse
from app.services.supabase import SupabaseGateway


class BillingService:
    def __init__(
        self,
        supabase: SupabaseGateway,
        settings: Settings | None = None,
    ) -> None:
        self.supabase = supabase
        self.settings = settings or get_settings()

    async def create_checkout_session(
        self,
        user: CurrentUser,
        payload: CheckoutRequest,
    ) -> CheckoutResponse:
        if self.settings.payment_provider != "stripe":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unsupported payment provider",
            )
        if not self.settings.stripe_secret_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="STRIPE_SECRET_KEY is not configured",
            )

        price_id = self._price_id(payload.plan_id)
        success_url = str(payload.success_url or self.settings.payment_success_url)
        cancel_url = str(payload.cancel_url or self.settings.payment_cancel_url)
        if not success_url or not cancel_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment success/cancel URLs are not configured",
            )

        stripe.api_key = self.settings.stripe_secret_key
        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=user.id,
                customer_email=user.email,
                metadata={
                    "user_id": user.id,
                    "plan_id": payload.plan_id,
                },
                subscription_data={
                    "metadata": {
                        "user_id": user.id,
                        "plan_id": payload.plan_id,
                    }
                },
            )
        except stripe.StripeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Stripe checkout request failed: {exc.__class__.__name__}",
            ) from exc

        checkout_url = session.get("url")
        if not checkout_url:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Stripe checkout session returned no URL",
            )

        return CheckoutResponse(checkout_url=checkout_url)

    async def handle_webhook(self, payload: bytes, signature: str | None) -> str:
        if not self.settings.stripe_webhook_secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="STRIPE_WEBHOOK_SECRET is not configured",
            )
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Stripe signature",
            )

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=signature,
                secret=self.settings.stripe_webhook_secret,
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Stripe webhook payload",
            ) from exc
        except stripe.SignatureVerificationError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Stripe webhook signature",
            ) from exc

        event_type = event["type"]
        data_object = event["data"]["object"]

        if event_type == "checkout.session.completed":
            await self._handle_checkout_completed(data_object)
        elif event_type in {"customer.subscription.updated", "customer.subscription.deleted"}:
            await self._handle_subscription_changed(data_object, event_type)

        return event_type

    def _price_id(self, plan_id: str) -> str:
        price_ids = {
            "student_premium": self.settings.stripe_student_premium_price_id,
            "teacher": self.settings.stripe_teacher_price_id,
        }
        price_id = price_ids.get(plan_id)
        if not price_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Stripe price id is not configured for plan: {plan_id}",
            )
        return price_id

    async def _handle_checkout_completed(self, session: dict[str, Any]) -> None:
        metadata = session.get("metadata") or {}
        user_id = metadata.get("user_id") or session.get("client_reference_id")
        plan_id = metadata.get("plan_id")
        subscription_id = session.get("subscription")

        if not user_id or not plan_id or not subscription_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stripe checkout session is missing subscription metadata",
            )

        await self.supabase.activate_subscription(
            user_id=user_id,
            plan_id=plan_id,
            provider="stripe",
            external_reference=subscription_id,
        )

    async def _handle_subscription_changed(
        self,
        subscription: dict[str, Any],
        event_type: str,
    ) -> None:
        external_reference = subscription.get("id")
        if not external_reference:
            return

        if event_type == "customer.subscription.deleted":
            await self.supabase.mark_subscription_canceled(
                provider="stripe",
                external_reference=external_reference,
            )
            return

        status_map = {
            "active": "active",
            "trialing": "trialing",
            "past_due": "past_due",
            "canceled": "canceled",
            "unpaid": "past_due",
        }
        provider_status = subscription.get("status")
        mapped_status = status_map.get(provider_status)
        if mapped_status:
            await self.supabase.update_subscription_status(
                provider="stripe",
                external_reference=external_reference,
                status=mapped_status,
            )
