from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.dashboard import get_dashboard_service
from app.schemas.auth import CurrentUser
from app.schemas.dashboard import (
    DashboardProfileResponse,
    DashboardResponse,
    MonthlyUsageResponse,
    PlanResponse,
    SubscriptionResponse,
)


class FakeDashboardService:
    async def get_dashboard(self, user: CurrentUser) -> DashboardResponse:
        plan = PlanResponse(
            id="free",
            display_name="Free",
            audience="all",
            monthly_price_cents=0,
            currency="USD",
            daily_ai_request_limit=10,
            monthly_ai_request_limit=300,
        )
        return DashboardResponse(
            profile=DashboardProfileResponse(
                id=user.id,
                email=user.email,
                full_name="Student",
            ),
            subscription=SubscriptionResponse(
                id="subscription-1",
                status="active",
                plan=plan,
            ),
            usage=MonthlyUsageResponse(
                period_start="2026-07-01",
                ai_requests_used=3,
                documents_generated=1,
            ),
            recent_activity=[],
        )

    async def list_plans(self) -> list[PlanResponse]:
        return [
            PlanResponse(
                id="free",
                display_name="Free",
                audience="all",
                monthly_price_cents=0,
                currency="USD",
            )
        ]


def _override_dependencies() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_dashboard_service] = lambda: FakeDashboardService()


def test_get_dashboard_returns_summary() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/dashboard")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["subscription"]["plan"]["id"] == "free"


def test_list_plans_returns_public_plans() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/dashboard/plans")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "free"
