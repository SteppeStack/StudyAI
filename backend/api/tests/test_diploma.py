from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.diploma import get_diploma_service
from app.schemas.auth import CurrentUser
from app.schemas.diploma import DiplomaGenerateResponse, DiplomaResponse


CHAPTERS = {
    "introduction": "notStarted",
    "literature": "notStarted",
    "methodology": "notStarted",
    "results": "notStarted",
    "discussion": "notStarted",
    "conclusion": "notStarted",
}


def _diploma(user_id: str = "user-1") -> DiplomaResponse:
    return DiplomaResponse(
        id="diploma-1",
        user_id=user_id,
        topic="AI in university education",
        faculty="Computer Science",
        research_area="AI in Education",
        supervisor="Dr. Smith",
        deadline="2026-08-15",
        research_type="mixed",
        status="draft",
        progress=0,
        research_goal="Study the impact of AI tools.",
        objectives="Review literature\nSurvey students",
        chapter_statuses=CHAPTERS,
    )


class FakeDiplomaService:
    async def create_diploma(self, user: CurrentUser, payload) -> DiplomaResponse:
        return _diploma(user.id)

    async def list_diplomas(self, user: CurrentUser) -> list[DiplomaResponse]:
        return [_diploma(user.id)]

    async def get_diploma(self, user: CurrentUser, diploma_id: str) -> DiplomaResponse:
        return _diploma(user.id)

    async def update_diploma(self, user: CurrentUser, diploma_id: str, payload) -> DiplomaResponse:
        item = _diploma(user.id)
        item.status = payload.status or item.status
        return item

    async def delete_diploma(self, user: CurrentUser, diploma_id: str) -> None:
        return None

    async def generate_diploma(
        self,
        user: CurrentUser,
        diploma_id: str,
        action: str,
    ) -> DiplomaGenerateResponse:
        item = _diploma(user.id)
        item.generated_structure = "Generated structure"
        item.status = "structured"
        return DiplomaGenerateResponse(
            diploma=item,
            action=action,
            result="Generated structure",
            model_used="gemini-2.5-flash-lite",
            fallback_used=False,
            ai_requests_used=1,
            monthly_ai_request_limit=300,
        )


def _override_dependencies() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_diploma_service] = lambda: FakeDiplomaService()


def test_create_diploma_returns_diploma() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/diplomas",
        json={
            "topic": "AI in university education",
            "faculty": "Computer Science",
            "research_area": "AI in Education",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["topic"] == "AI in university education"


def test_list_diplomas_returns_items() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/diplomas")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "diploma-1"


def test_generate_diploma_returns_result() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/diplomas/diploma-1/generate",
        json={"action": "structure"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["result"] == "Generated structure"
