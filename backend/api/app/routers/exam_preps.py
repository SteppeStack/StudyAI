from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.exam_preps import (
    ExamPrepCreateRequest,
    ExamPrepGenerateRequest,
    ExamPrepGenerateResponse,
    ExamPrepResponse,
    ExamPrepUpdateRequest,
)
from app.services.exam_preps import ExamPrepsService
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/exam-preps", tags=["exam-preps"])


def get_exam_preps_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    gemini: GeminiProvider = Depends(get_gemini_provider),
) -> ExamPrepsService:
    return ExamPrepsService(supabase=supabase, gemini=gemini)


@router.post("", response_model=ExamPrepResponse, status_code=status.HTTP_201_CREATED)
async def create_exam_prep(
    payload: ExamPrepCreateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> ExamPrepResponse:
    return await service.create_exam_prep(user=user, payload=payload)


@router.get("", response_model=list[ExamPrepResponse])
async def list_exam_preps(
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> list[ExamPrepResponse]:
    return await service.list_exam_preps(user=user)


@router.get("/{exam_prep_id}", response_model=ExamPrepResponse)
async def get_exam_prep(
    exam_prep_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> ExamPrepResponse:
    return await service.get_exam_prep(user=user, exam_prep_id=exam_prep_id)


@router.patch("/{exam_prep_id}", response_model=ExamPrepResponse)
async def update_exam_prep(
    exam_prep_id: str,
    payload: ExamPrepUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> ExamPrepResponse:
    return await service.update_exam_prep(
        user=user,
        exam_prep_id=exam_prep_id,
        payload=payload,
    )


@router.delete("/{exam_prep_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exam_prep(
    exam_prep_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> Response:
    await service.delete_exam_prep(user=user, exam_prep_id=exam_prep_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{exam_prep_id}/generate", response_model=ExamPrepGenerateResponse)
async def generate_exam_prep(
    exam_prep_id: str,
    payload: ExamPrepGenerateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: ExamPrepsService = Depends(get_exam_preps_service),
) -> ExamPrepGenerateResponse:
    return await service.generate_exam_prep(
        user=user,
        exam_prep_id=exam_prep_id,
        mode=payload.mode,
    )
