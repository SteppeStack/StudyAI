from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import Settings, get_settings
from app.schemas.auth import CurrentUser
from app.schemas.files import SignedUrlResponse, UserFileResponse
from app.services.supabase import SupabaseGateway


ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/webp",
}

EXTENSION_TO_TYPE = {
    ".pdf": "pdf",
    ".doc": "doc",
    ".docx": "docx",
    ".txt": "txt",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".webp": "image",
}


class FilesService:
    def __init__(self, supabase: SupabaseGateway, settings: Settings | None = None) -> None:
        self.supabase = supabase
        self.settings = settings or get_settings()

    async def upload_file(self, user: CurrentUser, upload: UploadFile) -> UserFileResponse:
        original_name = Path(upload.filename or "").name
        if not original_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File name is required",
            )

        content = await upload.read()
        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty",
            )

        if len(content) > self.settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Uploaded file is too large",
            )

        content_type = upload.content_type or "application/octet-stream"
        if content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported file type",
            )

        file_type = self._detect_file_type(original_name, content_type)
        extension = Path(original_name).suffix.lower()
        storage_path = f"{user.id}/{uuid4()}{extension}"

        await self.supabase.upload_storage_object(
            bucket_id=self.settings.storage_bucket,
            storage_path=storage_path,
            content=content,
            content_type=content_type,
        )
        created = await self.supabase.insert_user_file(
            user_id=user.id,
            bucket_id=self.settings.storage_bucket,
            storage_path=storage_path,
            original_name=original_name,
            content_type=content_type,
            file_type=file_type,
            size_bytes=len(content),
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="File uploaded",
            description=original_name[:120],
            resource_id=created["id"],
        )

        return self._file_response(created)

    async def list_files(self, user: CurrentUser) -> list[UserFileResponse]:
        files = await self.supabase.list_user_files(user.id)
        return [self._file_response(item) for item in files]

    async def delete_file(self, user: CurrentUser, file_id: str) -> None:
        file_row = await self.supabase.get_user_file(user_id=user.id, file_id=file_id)
        await self.supabase.delete_storage_object(
            bucket_id=file_row["bucket_id"],
            storage_path=file_row["storage_path"],
        )
        await self.supabase.delete_user_file(user_id=user.id, file_id=file_id)

    async def create_signed_url(
        self,
        user: CurrentUser,
        file_id: str,
        expires_in: int,
    ) -> SignedUrlResponse:
        file_row = await self.supabase.get_user_file(user_id=user.id, file_id=file_id)
        signed_url = await self.supabase.create_storage_signed_url(
            bucket_id=file_row["bucket_id"],
            storage_path=file_row["storage_path"],
            expires_in=expires_in,
        )
        return SignedUrlResponse(signed_url=signed_url, expires_in=expires_in)

    @staticmethod
    def _detect_file_type(original_name: str, content_type: str) -> str:
        extension = Path(original_name).suffix.lower()
        if extension in EXTENSION_TO_TYPE:
            return EXTENSION_TO_TYPE[extension]
        if content_type.startswith("image/"):
            return "image"
        return "other"

    @staticmethod
    def _file_response(file_row: dict[str, Any]) -> UserFileResponse:
        return UserFileResponse(
            id=file_row["id"],
            user_id=file_row["user_id"],
            bucket_id=file_row["bucket_id"],
            storage_path=file_row["storage_path"],
            original_name=file_row["original_name"],
            content_type=file_row.get("content_type"),
            file_type=file_row["file_type"],
            size_bytes=file_row["size_bytes"],
            status=file_row["status"],
            created_at=file_row.get("created_at"),
            updated_at=file_row.get("updated_at"),
        )
