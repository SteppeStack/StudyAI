from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.assignments import get_assignments_service
from app.schemas.assignments import AssignmentGenerateResponse, AssignmentResponse
from app.schemas.auth import CurrentUser


def _assignment(user_id: str = "user-1") -> AssignmentResponse:
    return AssignmentResponse(
        id="assignment-1",
        user_id=user_id,
        title="Math homework",
        subject="Math",
        help_type="solution_plan",
        deadline="2026-07-01",
        priority="medium",
        status="draft",
        progress=0,
        description="Solve quadratic equations.",
    )


class FakeAssignmentsService:
    async def create_assignment(self, user: CurrentUser, payload) -> AssignmentResponse:
        return _assignment(user.id)

    async def list_assignments(self, user: CurrentUser) -> list[AssignmentResponse]:
        return [_assignment(user.id)]

    async def get_assignment(self, user: CurrentUser, assignment_id: str) -> AssignmentResponse:
        return _assignment(user.id)

    async def update_assignment(self, user: CurrentUser, assignment_id: str, payload) -> AssignmentResponse:
        item = _assignment(user.id)
        item.status = payload.status or item.status
        return item

    async def delete_assignment(self, user: CurrentUser, assignment_id: str) -> None:
        return None

    async def generate_assignment_help(
        self,
        user: CurrentUser,
        assignment_id: str,
        action: str,
    ) -> AssignmentGenerateResponse:
        item = _assignment(user.id)
        item.generated_solution_plan = "AI plan"
        return AssignmentGenerateResponse(
            assignment=item,
            action=action,
            result="AI plan",
            ai_requests_used=1,
            monthly_ai_request_limit=300,
        )


def _override_dependencies() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_assignments_service] = lambda: FakeAssignmentsService()


def test_create_assignment_returns_assignment() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/assignments",
        json={
            "title": "Math homework",
            "subject": "Math",
            "description": "Solve quadratic equations.",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["title"] == "Math homework"


def test_list_assignments_returns_items() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/assignments")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "assignment-1"


def test_generate_assignment_help_returns_result() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/assignments/assignment-1/generate",
        json={"action": "solution_plan"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["result"] == "AI plan"
