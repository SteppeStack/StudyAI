from typing import Any

from app.schemas.auth import CurrentUser
from app.schemas.dashboard import (
    ActivityEventResponse,
    DashboardProfileResponse,
    DashboardResponse,
    MonthlyUsageResponse,
    PlanResponse,
    SubscriptionResponse,
)
from app.services.supabase import SupabaseGateway


class DashboardService:
    def __init__(self, supabase: SupabaseGateway) -> None:
        self.supabase = supabase

    async def get_dashboard(self, user: CurrentUser) -> DashboardResponse:
        profile = await self.supabase.get_profile(user.id)
        subscription_context = await self.supabase.get_subscription_context(user.id)
        usage = await self.supabase.get_current_monthly_usage(user.id)
        activity = await self.supabase.list_recent_activity(user.id, limit=5)

        return DashboardResponse(
            profile=self._profile_response(profile),
            subscription=self._subscription_response(
                subscription_context["subscription"],
                subscription_context["plan"],
            ),
            usage=self._usage_response(usage),
            recent_activity=[self._activity_response(row) for row in activity],
        )

    async def list_plans(self) -> list[PlanResponse]:
        rows = await self.supabase.list_active_plans()
        return [self._plan_response(row) for row in rows]

    @staticmethod
    def _profile_response(row: dict[str, Any]) -> DashboardProfileResponse:
        return DashboardProfileResponse(
            id=row["id"],
            email=row.get("email"),
            full_name=row.get("full_name"),
            avatar_url=row.get("avatar_url"),
            account_role=row.get("account_role"),
            subscription_plan=row.get("subscription_plan"),
        )

    @staticmethod
    def _plan_response(row: dict[str, Any]) -> PlanResponse:
        return PlanResponse(
            id=row["id"],
            display_name=row["display_name"],
            audience=row["audience"],
            monthly_price_cents=row["monthly_price_cents"],
            currency=row["currency"],
            daily_ai_request_limit=row.get("daily_ai_request_limit"),
            monthly_ai_request_limit=row.get("monthly_ai_request_limit"),
        )

    @classmethod
    def _subscription_response(
        cls,
        subscription: dict[str, Any],
        plan: dict[str, Any],
    ) -> SubscriptionResponse:
        return SubscriptionResponse(
            id=subscription["id"],
            status=subscription["status"],
            started_at=subscription.get("started_at"),
            expires_at=subscription.get("expires_at"),
            plan=cls._plan_response(plan),
        )

    @staticmethod
    def _usage_response(row: dict[str, Any]) -> MonthlyUsageResponse:
        return MonthlyUsageResponse(
            period_start=row["period_start"],
            ai_requests_used=row["ai_requests_used"],
            documents_generated=row["documents_generated"],
        )

    @staticmethod
    def _activity_response(row: dict[str, Any]) -> ActivityEventResponse:
        return ActivityEventResponse(
            id=row["id"],
            event_type=row["event_type"],
            title=row["title"],
            description=row.get("description"),
            status=row.get("status"),
            resource_type=row.get("resource_type"),
            resource_id=row.get("resource_id"),
            created_at=row.get("created_at"),
        )
