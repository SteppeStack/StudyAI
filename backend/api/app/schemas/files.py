from pydantic import BaseModel


class UserFileResponse(BaseModel):
    id: str
    user_id: str
    bucket_id: str
    storage_path: str
    original_name: str
    content_type: str | None = None
    file_type: str
    size_bytes: int
    status: str
    created_at: str | None = None
    updated_at: str | None = None


class SignedUrlResponse(BaseModel):
    signed_url: str
    expires_in: int
