from io import BytesIO
from pathlib import Path
from typing import Any
from uuid import uuid4
from zipfile import BadZipFile, ZipFile
import xml.etree.ElementTree as ET

from fastapi import HTTPException, UploadFile, status

from app.core.config import Settings, get_settings
from app.schemas.auth import CurrentUser
from app.schemas.files import (
    FileAnalysisAction,
    FileAnalysisResponse,
    FileAnalysisResponseMode,
    SignedUrlResponse,
    UserFileResponse,
)
from app.services.gemini import GeminiProvider
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
    def __init__(
        self,
        supabase: SupabaseGateway,
        gemini: GeminiProvider | None = None,
        settings: Settings | None = None,
    ) -> None:
        self.supabase = supabase
        self.gemini = gemini or GeminiProvider()
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

    async def analyze_file(
        self,
        user: CurrentUser,
        file_id: str,
        action: FileAnalysisAction,
        question: str | None,
        response_mode: FileAnalysisResponseMode,
        force_refresh: bool,
    ) -> FileAnalysisResponse:
        file_row = await self.supabase.get_user_file(user_id=user.id, file_id=file_id)

        if file_row["size_bytes"] > self.settings.max_analysis_file_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File is too large for AI analysis",
            )

        if action == "ask" and not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question is required for ask action",
            )

        usage_context = await self.supabase.get_usage_context(user.id)
        cached = None
        if not force_refresh:
            cached = await self.supabase.get_file_analysis_result(
                user_id=user.id,
                file_id=file_id,
                action=action,
                question=question,
                response_mode=response_mode,
            )
        if cached:
            return FileAnalysisResponse(
                file_id=file_row["id"],
                action=action,
                response_mode=response_mode,
                result=cached["result"],
                cached=True,
                was_truncated=cached["was_truncated"],
                input_chars_used=cached.get("input_chars_used"),
                model_used=cached.get("model_used"),
                fallback_used=cached.get("fallback_used") or False,
                ai_requests_used=usage_context["usage"]["ai_requests_used"],
                monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
            )

        file_content = await self.supabase.download_storage_object(
            bucket_id=file_row["bucket_id"],
            storage_path=file_row["storage_path"],
        )
        prompt = self._analysis_prompt(
            action=action,
            file_name=file_row["original_name"],
            question=question,
            response_mode=response_mode,
        )
        result, metadata = await self._generate_analysis_result(
            prompt=prompt,
            file_row=file_row,
            file_content=file_content,
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
        )
        await self.supabase.insert_file_analysis_result(
            user_id=user.id,
            file_id=file_row["id"],
            action=action,
            question=question,
            response_mode=response_mode,
            result=result,
            source_size_bytes=file_row["size_bytes"],
            input_chars_used=metadata.get("input_chars_used"),
            was_truncated=metadata["was_truncated"],
            model_used=metadata.get("model_used"),
            fallback_used=metadata["fallback_used"],
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title=f"File analysis: {action}",
            description=file_row["original_name"][:120],
            resource_id=file_row["id"],
            resource_type="user_file",
            event_type="file_analysis",
        )

        return FileAnalysisResponse(
            file_id=file_row["id"],
            action=action,
            response_mode=response_mode,
            result=result,
            cached=False,
            was_truncated=metadata["was_truncated"],
            input_chars_used=metadata.get("input_chars_used"),
            model_used=metadata.get("model_used"),
            fallback_used=metadata["fallback_used"],
            ai_requests_used=updated_usage["ai_requests_used"],
            monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
        )

    async def _generate_analysis_result(
        self,
        prompt: str,
        file_row: dict[str, Any],
        file_content: bytes,
    ) -> tuple[str, dict[str, Any]]:
        file_type = file_row["file_type"]
        if file_type == "docx":
            text = self._extract_docx_text(file_content)
            limited_text, was_truncated = self._limit_text(text)
            result = await self.gemini.generate_text_result(
                self._text_file_prompt(prompt, limited_text, was_truncated)
            )
            return result.text, {
                "input_chars_used": len(limited_text),
                "was_truncated": was_truncated,
                "model_used": result.model_used,
                "fallback_used": result.fallback_used,
            }

        if file_type == "txt":
            text = self._decode_text_file(file_content)
            limited_text, was_truncated = self._limit_text(text)
            result = await self.gemini.generate_text_result(
                self._text_file_prompt(prompt, limited_text, was_truncated)
            )
            return result.text, {
                "input_chars_used": len(limited_text),
                "was_truncated": was_truncated,
                "model_used": result.model_used,
                "fallback_used": result.fallback_used,
            }

        if file_type == "doc":
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="DOC analysis is not supported yet. Please upload DOCX, PDF, TXT, or image files.",
            )

        result = await self.gemini.generate_text_from_file_result(
            prompt=prompt,
            content=file_content,
            mime_type=file_row.get("content_type") or "application/octet-stream",
        )
        return result.text, {
            "input_chars_used": None,
            "was_truncated": False,
            "model_used": result.model_used,
            "fallback_used": result.fallback_used,
        }

    @staticmethod
    def _text_file_prompt(prompt: str, text: str, was_truncated: bool) -> str:
        truncation_note = (
            "\n\nNote: The extracted file text was truncated to reduce AI token usage."
            if was_truncated
            else ""
        )
        return f"{prompt}{truncation_note}\n\nExtracted file text:\n{text}"

    def _limit_text(self, text: str) -> tuple[str, bool]:
        normalized = "\n".join(line.strip() for line in text.splitlines() if line.strip())
        if len(normalized) <= self.settings.max_ai_input_chars:
            return normalized, False
        return normalized[: self.settings.max_ai_input_chars], True

    @staticmethod
    def _decode_text_file(content: bytes) -> str:
        for encoding in ("utf-8", "utf-16", "cp1251", "latin-1"):
            try:
                text = content.decode(encoding).strip()
                if text:
                    return text
            except UnicodeDecodeError:
                continue

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not decode text file",
        )

    @staticmethod
    def _extract_docx_text(content: bytes) -> str:
        try:
            with ZipFile(BytesIO(content)) as docx:
                document_xml = docx.read("word/document.xml")
        except (BadZipFile, KeyError) as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not read DOCX file text",
            ) from exc

        root = ET.fromstring(document_xml)
        namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        parts = [
            node.text
            for node in root.findall(".//w:t", namespace)
            if node.text and node.text.strip()
        ]
        text = "\n".join(parts).strip()
        if not text:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="DOCX file does not contain readable text",
            )
        return text

    @staticmethod
    def _analysis_prompt(
        action: FileAnalysisAction,
        file_name: str,
        question: str | None,
        response_mode: FileAnalysisResponseMode,
    ) -> str:
        mode_instructions = {
            "short": "Keep the answer concise. Prefer short bullets and no long explanations.",
            "normal": "Use a balanced amount of detail.",
            "detailed": "Give a detailed and structured answer, but stay focused on the file.",
        }
        common = (
            "You are StudyAI, an academic assistant. Analyze the attached study file. "
            "Be clear, structured, and useful for learning. "
            f"File name: {file_name}\n"
            f"Response mode: {response_mode}. {mode_instructions[response_mode]}\n\n"
        )
        prompts = {
            "summarize": "Create a concise academic summary with the main idea and important details.",
            "key_points": "Extract the key points as a clear bullet list.",
            "flashcards": "Create useful flashcards. Use the format: Front: ... Back: ...",
            "quiz": "Create a quiz with questions, answer choices when useful, and correct answers.",
            "create_notes": "Create organized study notes with headings and bullet points.",
            "ask": f"Answer this question using only the attached file when possible: {question}",
        }
        return common + prompts[action]

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
