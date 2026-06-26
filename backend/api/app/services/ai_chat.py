from typing import Any

from app.schemas.ai import AIChatResponse, AIMessageResponse, UsageResponse
from app.schemas.auth import CurrentUser
from app.services.gemini import GeminiProvider
from app.services.supabase import SupabaseGateway


class AIChatService:
    def __init__(self, supabase: SupabaseGateway, provider: GeminiProvider) -> None:
        self.supabase = supabase
        self.provider = provider

    async def send_message(
        self,
        user: CurrentUser,
        message: str,
        conversation_id: str | None,
        title: str | None,
    ) -> AIChatResponse:
        clean_message = message.strip()
        conversation_title = title or clean_message[:60] or "New AI Tutor chat"

        conversation = await self.supabase.get_or_create_conversation(
            user_id=user.id,
            conversation_id=conversation_id,
            title=conversation_title,
        )

        usage_context = await self.supabase.get_usage_context(user.id)
        recent_messages = await self.supabase.get_recent_messages(conversation["id"])
        user_message = await self.supabase.insert_ai_message(
            conversation_id=conversation["id"],
            user_id=user.id,
            role="user",
            content=clean_message,
        )

        prompt = self._build_prompt(clean_message, list(reversed(recent_messages)))
        assistant_text = await self.provider.generate_text(prompt)

        assistant_message = await self.supabase.insert_ai_message(
            conversation_id=conversation["id"],
            user_id=user.id,
            role="assistant",
            content=assistant_text,
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="AI Tutor response",
            description=clean_message[:120],
            resource_id=conversation["id"],
        )

        return AIChatResponse(
            conversation_id=conversation["id"],
            user_message=self._message_response(user_message),
            assistant_message=self._message_response(assistant_message),
            usage=UsageResponse(
                ai_requests_used=updated_usage["ai_requests_used"],
                monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
            ),
        )

    @staticmethod
    def _build_prompt(message: str, recent_messages: list[dict[str, Any]]) -> str:
        history = "\n".join(
            f"{item['role']}: {item['content']}" for item in recent_messages[-12:]
        )
        return (
            "You are StudyAI, an academic AI tutor. "
            "Explain clearly, help step by step, and avoid doing harmful or dishonest academic work.\n\n"
            f"Recent conversation:\n{history or 'No previous messages.'}\n\n"
            f"Student question:\n{message}"
        )

    @staticmethod
    def _message_response(message: dict[str, Any]) -> AIMessageResponse:
        return AIMessageResponse(
            id=message["id"],
            role=message["role"],
            content=message["content"],
            created_at=message.get("created_at"),
        )
