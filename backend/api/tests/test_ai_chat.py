from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.ai import get_ai_chat_service
from app.schemas.ai import AIChatResponse, AIMessageResponse, UsageResponse
from app.schemas.auth import CurrentUser


class FakeAIChatService:
    async def send_message(
        self,
        user: CurrentUser,
        message: str,
        conversation_id: str | None,
        title: str | None,
    ) -> AIChatResponse:
        return AIChatResponse(
            conversation_id=conversation_id or "conversation-1",
            user_message=AIMessageResponse(
                id="message-user-1",
                role="user",
                content=message,
            ),
            assistant_message=AIMessageResponse(
                id="message-assistant-1",
                role="assistant",
                content=f"Answer for {user.id}",
            ),
            usage=UsageResponse(
                ai_requests_used=1,
                monthly_ai_request_limit=300,
            ),
            model_used="gemini-2.5-flash-lite",
            fallback_used=False,
        )


def test_ai_chat_requires_authorization_header() -> None:
    client = TestClient(app)

    response = client.post("/api/v1/ai/chat", json={"message": "Explain limits"})

    assert response.status_code == 401


def test_ai_chat_returns_assistant_response() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_ai_chat_service] = lambda: FakeAIChatService()
    client = TestClient(app)

    response = client.post("/api/v1/ai/chat", json={"message": "Explain limits"})

    app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert body["conversation_id"] == "conversation-1"
    assert body["user_message"]["role"] == "user"
    assert body["assistant_message"]["role"] == "assistant"
    assert body["usage"]["ai_requests_used"] == 1
