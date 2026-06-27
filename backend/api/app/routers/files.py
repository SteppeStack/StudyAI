from fastapi import APIRouter, Depends, File, Response, UploadFile, status

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.files import FileAnalysisRequest, FileAnalysisResponse, SignedUrlResponse, UserFileResponse
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.files import FilesService
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/files", tags=["files"])


def get_files_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    gemini: GeminiProvider = Depends(get_gemini_provider),
) -> FilesService:
    return FilesService(supabase=supabase, gemini=gemini)


@router.post("/upload", response_model=UserFileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    user: CurrentUser = Depends(get_current_user),
    service: FilesService = Depends(get_files_service),
) -> UserFileResponse:
    return await service.upload_file(user=user, upload=file)


@router.get("", response_model=list[UserFileResponse])
async def list_files(
    user: CurrentUser = Depends(get_current_user),
    service: FilesService = Depends(get_files_service),
) -> list[UserFileResponse]:
    return await service.list_files(user=user)


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: FilesService = Depends(get_files_service),
) -> Response:
    await service.delete_file(user=user, file_id=file_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{file_id}/signed-url", response_model=SignedUrlResponse)
async def create_signed_url(
    file_id: str,
    expires_in: int = 3600,
    user: CurrentUser = Depends(get_current_user),
    service: FilesService = Depends(get_files_service),
) -> SignedUrlResponse:
    return await service.create_signed_url(
        user=user,
        file_id=file_id,
        expires_in=expires_in,
    )


@router.post("/{file_id}/analyze", response_model=FileAnalysisResponse)
async def analyze_file(
    file_id: str,
    payload: FileAnalysisRequest,
    user: CurrentUser = Depends(get_current_user),
    service: FilesService = Depends(get_files_service),
) -> FileAnalysisResponse:
    return await service.analyze_file(
        user=user,
        file_id=file_id,
        action=payload.action,
        question=payload.question,
        response_mode=payload.response_mode,
        force_refresh=payload.force_refresh,
    )
