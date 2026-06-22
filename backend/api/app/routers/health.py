from fastapi import APIRouter

from app.core.config import APP_ENV

router = APIRouter(tags=["system"])


@router.get("/health")
def health_check() -> dict[str, str]:
    """Confirm that the Python API process is running."""
    return {
        "status": "ok",
        "service": "studyai-api",
        "environment": APP_ENV,
    }
