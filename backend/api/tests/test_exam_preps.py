from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.exam_preps import get_exam_preps_service
from app.schemas.auth import CurrentUser
from app.schemas.exam_preps import ExamPrepGenerateResponse, ExamPrepResponse


def _exam_prep(user_id: str = "user-1") -> ExamPrepResponse:
    return ExamPrepResponse(
        id="exam-prep-1",
        user_id=user_id,
        title="Database Systems Final",
        subject="Database Systems",
        exam_date="2026-07-15",
        prep_mode="studyPlan",
        status="draft",
        progress=0,
        readiness_score=0,
        topics="Normalization, indexes, transactions",
        current_knowledge="Joins are clear, transactions are weak.",
    )


class FakeExamPrepsService:
    async def create_exam_prep(self, user: CurrentUser, payload) -> ExamPrepResponse:
        return _exam_prep(user.id)

    async def list_exam_preps(self, user: CurrentUser) -> list[ExamPrepResponse]:
        return [_exam_prep(user.id)]

    async def get_exam_prep(self, user: CurrentUser, exam_prep_id: str) -> ExamPrepResponse:
        return _exam_prep(user.id)

    async def update_exam_prep(self, user: CurrentUser, exam_prep_id: str, payload) -> ExamPrepResponse:
        item = _exam_prep(user.id)
        item.status = payload.status or item.status
        return item

    async def delete_exam_prep(self, user: CurrentUser, exam_prep_id: str) -> None:
        return None

    async def generate_exam_prep(
        self,
        user: CurrentUser,
        exam_prep_id: str,
        mode: str | None,
    ) -> ExamPrepGenerateResponse:
        item = _exam_prep(user.id)
        item.generated_content = "Generated study plan"
        item.status = "generated"
        return ExamPrepGenerateResponse(
            exam_prep=item,
            mode=mode or "studyPlan",
            result="Generated study plan",
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
    app.dependency_overrides[get_exam_preps_service] = lambda: FakeExamPrepsService()


def test_create_exam_prep_returns_exam_prep() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/exam-preps",
        json={
            "title": "Database Systems Final",
            "subject": "Database Systems",
            "exam_date": "2026-07-15",
            "topics": "Normalization, indexes, transactions",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["title"] == "Database Systems Final"


def test_list_exam_preps_returns_items() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/exam-preps")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "exam-prep-1"


def test_generate_exam_prep_returns_result() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/exam-preps/exam-prep-1/generate",
        json={"mode": "practiceQuiz"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["result"] == "Generated study plan"
