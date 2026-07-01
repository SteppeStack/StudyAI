from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.auth import CurrentUser
from app.schemas.dashboard import DashboardResponse, PlanResponse
from app.services.dashboard import DashboardService
from app.services.supabase import SupabaseGateway, get_supabase_gateway

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


def get_dashboard_service(
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
) -> DashboardService:
    return DashboardService(supabase=supabase)


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    user: CurrentUser = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service),
) -> DashboardResponse:
    return await service.get_dashboard(user=user)


@router.get("/plans", response_model=list[PlanResponse])
async def list_plans(
    service: DashboardService = Depends(get_dashboard_service),
) -> list[PlanResponse]:
    return await service.list_plans()
