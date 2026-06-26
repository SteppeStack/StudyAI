from fastapi.testclient import TestClient

from app.dependencies.auth import get_current_user
from app.main import app
from app.routers.files import get_files_service
from app.schemas.auth import CurrentUser
from app.schemas.files import FileAnalysisResponse, SignedUrlResponse, UserFileResponse


class FakeFilesService:
    async def upload_file(self, user: CurrentUser, upload) -> UserFileResponse:
        return UserFileResponse(
            id="file-1",
            user_id=user.id,
            bucket_id="study-files",
            storage_path=f"{user.id}/file-1.txt",
            original_name=upload.filename,
            content_type=upload.content_type,
            file_type="txt",
            size_bytes=12,
            status="uploaded",
        )

    async def list_files(self, user: CurrentUser) -> list[UserFileResponse]:
        return [
            UserFileResponse(
                id="file-1",
                user_id=user.id,
                bucket_id="study-files",
                storage_path=f"{user.id}/file-1.txt",
                original_name="notes.txt",
                content_type="text/plain",
                file_type="txt",
                size_bytes=12,
                status="uploaded",
            )
        ]

    async def delete_file(self, user: CurrentUser, file_id: str) -> None:
        return None

    async def create_signed_url(
        self,
        user: CurrentUser,
        file_id: str,
        expires_in: int,
    ) -> SignedUrlResponse:
        return SignedUrlResponse(
            signed_url="https://example.com/signed",
            expires_in=expires_in,
        )

    async def analyze_file(
        self,
        user: CurrentUser,
        file_id: str,
        action: str,
        question: str | None,
    ) -> FileAnalysisResponse:
        return FileAnalysisResponse(
            file_id=file_id,
            action=action,
            result="Summary result",
            ai_requests_used=2,
            monthly_ai_request_limit=300,
        )


def _override_dependencies() -> None:
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(
        id="user-1",
        email="student@example.com",
    )
    app.dependency_overrides[get_files_service] = lambda: FakeFilesService()


def test_upload_file_returns_metadata() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/files/upload",
        files={"file": ("notes.txt", b"hello world!", "text/plain")},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    body = response.json()
    assert body["original_name"] == "notes.txt"
    assert body["file_type"] == "txt"


def test_list_files_returns_current_user_files() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.get("/api/v1/files")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()[0]["id"] == "file-1"


def test_signed_url_returns_url() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post("/api/v1/files/file-1/signed-url")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["signed_url"] == "https://example.com/signed"


def test_analyze_file_returns_ai_result() -> None:
    _override_dependencies()
    client = TestClient(app)

    response = client.post(
        "/api/v1/files/file-1/analyze",
        json={"action": "summarize", "question": None},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["result"] == "Summary result"
