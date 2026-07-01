from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.diploma import (
    DiplomaCreateRequest,
    DiplomaGenerateRequest,
    DiplomaGenerateResponse,
    DiplomaResponse,
    DiplomaUpdateRequest,
)
from app.services.diploma import DiplomaService
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/diplomas", tags=["diplomas"])


def get_diploma_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    gemini: GeminiProvider = Depends(get_gemini_provider),
) -> DiplomaService:
    return DiplomaService(supabase=supabase, gemini=gemini)


@router.post("", response_model=DiplomaResponse, status_code=status.HTTP_201_CREATED)
async def create_diploma(
    payload: DiplomaCreateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> DiplomaResponse:
    return await service.create_diploma(user=user, payload=payload)


@router.get("", response_model=list[DiplomaResponse])
async def list_diplomas(
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> list[DiplomaResponse]:
    return await service.list_diplomas(user=user)


@router.get("/{diploma_id}", response_model=DiplomaResponse)
async def get_diploma(
    diploma_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> DiplomaResponse:
    return await service.get_diploma(user=user, diploma_id=diploma_id)


@router.patch("/{diploma_id}", response_model=DiplomaResponse)
async def update_diploma(
    diploma_id: str,
    payload: DiplomaUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> DiplomaResponse:
    return await service.update_diploma(user=user, diploma_id=diploma_id, payload=payload)


@router.delete("/{diploma_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diploma(
    diploma_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> Response:
    await service.delete_diploma(user=user, diploma_id=diploma_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{diploma_id}/generate", response_model=DiplomaGenerateResponse)
async def generate_diploma(
    diploma_id: str,
    payload: DiplomaGenerateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DiplomaService = Depends(get_diploma_service),
) -> DiplomaGenerateResponse:
    return await service.generate_diploma(
        user=user,
        diploma_id=diploma_id,
        action=payload.action,
    )
