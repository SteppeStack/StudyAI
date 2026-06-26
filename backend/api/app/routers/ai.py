from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.schemas.auth import CurrentUser
from app.services.ai_chat import AIChatService
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


def get_ai_chat_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    provider: GeminiProvider = Depends(get_gemini_provider),
) -> AIChatService:
    return AIChatService(supabase=supabase, provider=provider)


@router.post("/chat", response_model=AIChatResponse)
async def send_ai_tutor_message(
    payload: AIChatRequest,
    user: CurrentUser = Depends(get_current_user),
    service: AIChatService = Depends(get_ai_chat_service),
) -> AIChatResponse:
    return await service.send_message(
        user=user,
        message=payload.message,
        conversation_id=payload.conversation_id,
        title=payload.title,
    )
