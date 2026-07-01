from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.documents import (
    DocumentCreateRequest,
    DocumentGenerateRequest,
    DocumentGenerateResponse,
    DocumentResponse,
    DocumentUpdateRequest,
)
from app.services.documents import DocumentsService
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


def get_documents_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    gemini: GeminiProvider = Depends(get_gemini_provider),
) -> DocumentsService:
    return DocumentsService(supabase=supabase, gemini=gemini)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    payload: DocumentCreateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> DocumentResponse:
    return await service.create_document(user=user, payload=payload)


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> list[DocumentResponse]:
    return await service.list_documents(user=user)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> DocumentResponse:
    return await service.get_document(user=user, document_id=document_id)


@router.patch("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: str,
    payload: DocumentUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> DocumentResponse:
    return await service.update_document(user=user, document_id=document_id, payload=payload)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> Response:
    await service.delete_document(user=user, document_id=document_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{document_id}/generate", response_model=DocumentGenerateResponse)
async def generate_document(
    document_id: str,
    payload: DocumentGenerateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: DocumentsService = Depends(get_documents_service),
) -> DocumentGenerateResponse:
    return await service.generate_document(
        user=user,
        document_id=document_id,
        action=payload.action,
    )
