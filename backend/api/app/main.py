from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import cors_origins
from app.routers.ai import router as ai_router
from app.routers.assignments import router as assignments_router
from app.routers.dashboard import router as dashboard_router
from app.routers.diploma import router as diploma_router
from app.routers.documents import router as documents_router
from app.routers.exam_preps import router as exam_preps_router
from app.routers.files import router as files_router
from app.routers.health import router as health_router

app = FastAPI(
    title="StudyAI API",
    version="0.1.0",
    description="Server-side API for StudyAI features that must not run in the browser.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(ai_router)
app.include_router(files_router)
app.include_router(assignments_router)
app.include_router(documents_router)
app.include_router(exam_preps_router)
app.include_router(diploma_router)
app.include_router(dashboard_router)
