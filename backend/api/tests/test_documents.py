from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.documents import get_documents_service
from app.schemas.auth import CurrentUser
from app.schemas.documents import DocumentGenerateResponse, DocumentResponse


def _document(user_id: str = "user-1") -> DocumentResponse:
    return DocumentResponse(
        id="document-1",
        user_id=user_id,
        title="AI ethics essay",
        course="Academic Writing",
        document_type="essay",
        status="draft",
        language="en",
        tone="academic",
        progress=0,
        instructions="Write about ethical AI in education.",
        source_text=None,
        generated_content=None,
        word_count=0,
    )


class FakeDocumentsService:
    async def create_document(self, user: CurrentUser, payload) -> DocumentResponse:
        return _document(user.id)

    async def list_documents(self, user: CurrentUser) -> list[DocumentResponse]:
        return [_document(user.id)]

    async def get_document(self, user: CurrentUser, document_id: str) -> DocumentResponse:
        return _document(user.id)

    async def update_document(self, user: CurrentUser, document_id: str, payload) -> DocumentResponse:
        item = _document(user.id)
        item.status = payload.status or item.status
        return item

    async def delete_document(self, user: CurrentUser, document_id: str) -> None:
        return None

    async def generate_document(
        self,
        user: CurrentUser,
        document_id: str,
        action: str,
    ) -> DocumentGenerateResponse:
        item = _document(user.id)
        item.generated_content = "Generated draft"
        item.status = "generated"
        item.word_count = 2
        return DocumentGenerateResponse(
            document=item,
            action=action,
            result="Generated draft",
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
    app.dependency_overrides[get_documents_service] = lambda: FakeDocumentsService()


def test_create_document_returns_document() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/documents",
        json={
            "title": "AI ethics essay",
            "course": "Academic Writing",
            "document_type": "essay",
            "instructions": "Write about ethical AI in education.",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json()["title"] == "AI ethics essay"


def test_list_documents_returns_items() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/documents")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "document-1"


def test_generate_document_returns_result() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/documents/document-1/generate",
        json={"action": "draft"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["result"] == "Generated draft"
