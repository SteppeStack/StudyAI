from fastapi import APIRouter, Depends, Response, status

from app.dependencies.auth import get_current_user
from app.schemas.assignments import (
    AssignmentCreateRequest,
    AssignmentGenerateRequest,
    AssignmentGenerateResponse,
    AssignmentResponse,
    AssignmentUpdateRequest,
)
from app.schemas.auth import CurrentUser
from app.services.assignments import AssignmentsService
from app.services.gemini import GeminiProvider, get_gemini_provider
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/assignments", tags=["assignments"])


def get_assignments_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
    gemini: GeminiProvider = Depends(get_gemini_provider),
) -> AssignmentsService:
    return AssignmentsService(supabase=supabase, gemini=gemini)


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    payload: AssignmentCreateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> AssignmentResponse:
    return await service.create_assignment(user=user, payload=payload)


@router.get("", response_model=list[AssignmentResponse])
async def list_assignments(
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> list[AssignmentResponse]:
    return await service.list_assignments(user=user)


@router.get("/{assignment_id}", response_model=AssignmentResponse)
async def get_assignment(
    assignment_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> AssignmentResponse:
    return await service.get_assignment(user=user, assignment_id=assignment_id)


@router.patch("/{assignment_id}", response_model=AssignmentResponse)
async def update_assignment(
    assignment_id: str,
    payload: AssignmentUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> AssignmentResponse:
    return await service.update_assignment(
        user=user,
        assignment_id=assignment_id,
        payload=payload,
    )


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: str,
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> Response:
    await service.delete_assignment(user=user, assignment_id=assignment_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{assignment_id}/generate", response_model=AssignmentGenerateResponse)
async def generate_assignment_help(
    assignment_id: str,
    payload: AssignmentGenerateRequest,
    user: CurrentUser = Depends(get_current_user),
    service: AssignmentsService = Depends(get_assignments_service),
) -> AssignmentGenerateResponse:
    return await service.generate_assignment_help(
        user=user,
        assignment_id=assignment_id,
        action=payload.action,
    )
