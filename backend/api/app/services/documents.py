from typing import Any

from fastapi import HTTPException, status

from app.schemas.auth import CurrentUser
from app.schemas.documents import (
    DocumentCreateRequest,
    DocumentGenerateAction,
    DocumentGenerateResponse,
    DocumentResponse,
    DocumentUpdateRequest,
)
from app.services.gemini import GeminiProvider
from app.services.supabase import SupabaseGateway


class DocumentsService:
    def __init__(self, supabase: SupabaseGateway, gemini: GeminiProvider) -> None:
        self.supabase = supabase
        self.gemini = gemini

    async def create_document(
        self,
        user: CurrentUser,
        payload: DocumentCreateRequest,
    ) -> DocumentResponse:
        created = await self.supabase.insert_document(
            user_id=user.id,
            data=self._create_payload(payload),
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="Document created",
            description=payload.title[:120],
            resource_id=created["id"],
            resource_type="document",
            event_type="document_created",
        )
        return self._document_response(created)

    async def list_documents(self, user: CurrentUser) -> list[DocumentResponse]:
        rows = await self.supabase.list_documents(user.id)
        return [self._document_response(row) for row in rows]

    async def get_document(self, user: CurrentUser, document_id: str) -> DocumentResponse:
        row = await self.supabase.get_document(user_id=user.id, document_id=document_id)
        return self._document_response(row)

    async def update_document(
        self,
        user: CurrentUser,
        document_id: str,
        payload: DocumentUpdateRequest,
    ) -> DocumentResponse:
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No document fields provided",
            )
        if "generated_content" in update_data:
            update_data["word_count"] = self._count_words(update_data.get("generated_content"))

        updated = await self.supabase.update_document(
            user_id=user.id,
            document_id=document_id,
            data=update_data,
        )
        return self._document_response(updated)

    async def delete_document(self, user: CurrentUser, document_id: str) -> None:
        await self.supabase.delete_document(user_id=user.id, document_id=document_id)

    async def generate_document(
        self,
        user: CurrentUser,
        document_id: str,
        action: DocumentGenerateAction,
    ) -> DocumentGenerateResponse:
        document = await self.supabase.get_document(user_id=user.id, document_id=document_id)
        if action in {"summarize", "improve"} and not (
            document.get("source_text") or document.get("generated_content")
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="source_text or generated_content is required for this action",
            )

        usage_context = await self.supabase.get_usage_context(user.id)
        ai_result = await self.gemini.generate_text_result(self._build_prompt(document, action))
        update_data = {
            "generated_content": ai_result.text,
            "word_count": self._count_words(ai_result.text),
            "status": "reviewed" if action == "improve" else "generated",
            "progress": 85 if action == "improve" else 75,
        }
        updated = await self.supabase.update_document(
            user_id=user.id,
            document_id=document_id,
            data=update_data,
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
            feature="documents",
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title=f"Document AI action: {action}",
            description=document["title"][:120],
            resource_id=document["id"],
            resource_type="document",
            event_type="document_ai_generated",
        )

        return DocumentGenerateResponse(
            document=self._document_response(updated),
            action=action,
            result=ai_result.text,
            model_used=ai_result.model_used,
            fallback_used=ai_result.fallback_used,
            ai_requests_used=updated_usage["ai_requests_used"],
            monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
        )

    @staticmethod
    def _create_payload(payload: DocumentCreateRequest) -> dict[str, Any]:
        data = payload.model_dump()
        data["word_count"] = 0
        return data

    @staticmethod
    def _build_prompt(document: dict[str, Any], action: DocumentGenerateAction) -> str:
        source = document.get("source_text") or document.get("generated_content") or ""
        prompts = {
            "outline": "Create a clear academic outline with sections, key arguments, and suggested evidence.",
            "draft": "Generate a structured academic draft. Keep it original, useful for learning, and avoid fake citations.",
            "summarize": "Summarize the source text into concise study notes with headings and key takeaways.",
            "improve": "Improve the draft for clarity, structure, academic tone, and coherence. Explain major improvements briefly.",
        }
        return (
            "You are StudyAI Document Assistant. Help students write honestly and learn better. "
            "Do not invent sources, references, or facts. If citations are needed, suggest placeholders.\n\n"
            f"Title: {document['title']}\n"
            f"Course: {document.get('course') or 'Not specified'}\n"
            f"Document type: {document['document_type']}\n"
            f"Language: {document['language']}\n"
            f"Tone: {document['tone']}\n"
            f"Instructions:\n{document['instructions']}\n\n"
            f"Source or current draft:\n{source or 'No source text provided.'}\n\n"
            f"Task: {prompts[action]}"
        )

    @staticmethod
    def _count_words(text: str | None) -> int:
        if not text:
            return 0
        return len(text.split())

    @staticmethod
    def _document_response(row: dict[str, Any]) -> DocumentResponse:
        return DocumentResponse(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            course=row.get("course"),
            document_type=row["document_type"],
            status=row["status"],
            language=row["language"],
            tone=row["tone"],
            progress=row["progress"],
            instructions=row["instructions"],
            source_text=row.get("source_text"),
            generated_content=row.get("generated_content"),
            word_count=row["word_count"],
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )
