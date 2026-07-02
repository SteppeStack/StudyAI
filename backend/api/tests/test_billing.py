from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.billing import get_billing_service
from app.schemas.auth import CurrentUser
from app.schemas.billing import CheckoutRequest, CheckoutResponse


class FakeBillingService:
    async def create_checkout_session(
        self,
        user: CurrentUser,
        payload: CheckoutRequest,
    ) -> CheckoutResponse:
        return CheckoutResponse(checkout_url=f"https://checkout.example/{payload.plan_id}")

    async def handle_webhook(self, payload: bytes, signature: str | None) -> str:
        return "checkout.session.completed"


def _override_dependencies() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_billing_service] = lambda: FakeBillingService()


def test_create_checkout_session_returns_url() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/billing/checkout",
        json={
            "plan_id": "student_premium",
            "success_url": "https://frontend.example/subscription?success=1",
            "cancel_url": "https://frontend.example/subscription?canceled=1",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["checkout_url"] == "https://checkout.example/student_premium"


def test_billing_webhook_returns_event_type() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/billing/webhook",
        content=b"{}",
        headers={"stripe-signature": "test-signature"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["received"] is True
    assert response.json()["event_type"] == "checkout.session.completed"
