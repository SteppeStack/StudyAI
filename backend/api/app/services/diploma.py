from typing import Any

from fastapi import HTTPException, status

from app.schemas.auth import CurrentUser
from app.schemas.diploma import (
    DiplomaCreateRequest,
    DiplomaGenerateAction,
    DiplomaGenerateResponse,
    DiplomaResponse,
    DiplomaUpdateRequest,
)
from app.services.gemini import GeminiProvider
from app.services.supabase import SupabaseGateway


class DiplomaService:
    def __init__(self, supabase: SupabaseGateway, gemini: GeminiProvider) -> None:
        self.supabase = supabase
        self.gemini = gemini

    async def create_diploma(
        self,
        user: CurrentUser,
        payload: DiplomaCreateRequest,
    ) -> DiplomaResponse:
        created = await self.supabase.insert_diploma_project(
            user_id=user.id,
            data=self._create_payload(payload),
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="Diploma project created",
            description=payload.topic[:120],
            resource_id=created["id"],
            resource_type="diploma_project",
            event_type="diploma_created",
        )
        return self._diploma_response(created)

    async def list_diplomas(self, user: CurrentUser) -> list[DiplomaResponse]:
        rows = await self.supabase.list_diploma_projects(user.id)
        return [self._diploma_response(row) for row in rows]

    async def get_diploma(self, user: CurrentUser, diploma_id: str) -> DiplomaResponse:
        row = await self.supabase.get_diploma_project(user_id=user.id, diploma_id=diploma_id)
        return self._diploma_response(row)

    async def update_diploma(
        self,
        user: CurrentUser,
        diploma_id: str,
        payload: DiplomaUpdateRequest,
    ) -> DiplomaResponse:
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No diploma fields provided",
            )
        if update_data.get("deadline") is not None:
            update_data["deadline"] = update_data["deadline"].isoformat()
        if "chapter_statuses" in update_data and update_data["chapter_statuses"]:
            update_data["progress"] = self._progress_from_chapters(update_data["chapter_statuses"])

        updated = await self.supabase.update_diploma_project(
            user_id=user.id,
            diploma_id=diploma_id,
            data=update_data,
        )
        return self._diploma_response(updated)

    async def delete_diploma(self, user: CurrentUser, diploma_id: str) -> None:
        await self.supabase.delete_diploma_project(user_id=user.id, diploma_id=diploma_id)

    async def generate_diploma(
        self,
        user: CurrentUser,
        diploma_id: str,
        action: DiplomaGenerateAction,
    ) -> DiplomaGenerateResponse:
        diploma = await self.supabase.get_diploma_project(user_id=user.id, diploma_id=diploma_id)
        usage_context = await self.supabase.get_usage_context(user.id)
        ai_result = await self.gemini.generate_text_result(self._build_prompt(diploma, action))
        updated = await self.supabase.update_diploma_project(
            user_id=user.id,
            diploma_id=diploma_id,
            data={
                "generated_structure": ai_result.text,
                "status": "structured" if action == "structure" else "in_progress",
                "progress": max(diploma.get("progress") or 0, 20),
            },
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
            feature="diploma",
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title=f"Diploma AI action: {action}",
            description=diploma["topic"][:120],
            resource_id=diploma["id"],
            resource_type="diploma_project",
            event_type="diploma_ai_generated",
        )

        return DiplomaGenerateResponse(
            diploma=self._diploma_response(updated),
            action=action,
            result=ai_result.text,
            model_used=ai_result.model_used,
            fallback_used=ai_result.fallback_used,
            ai_requests_used=updated_usage["ai_requests_used"],
            monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
        )

    @staticmethod
    def _create_payload(payload: DiplomaCreateRequest) -> dict[str, Any]:
        data = payload.model_dump(exclude_none=True)
        if data.get("deadline") is not None:
            data["deadline"] = data["deadline"].isoformat()
        if "chapter_statuses" in data:
            data["progress"] = DiplomaService._progress_from_chapters(data["chapter_statuses"])
        return data

    @staticmethod
    def _build_prompt(diploma: dict[str, Any], action: DiplomaGenerateAction) -> str:
        prompts = {
            "structure": "Generate a complete diploma/thesis structure with chapters, subsections, and what each section should contain.",
            "researchQuestions": "Generate a focused main research question and supporting sub-questions.",
            "chapterPlan": "Generate a chapter-by-chapter writing plan with milestones and supervisor checkpoints.",
            "feedback": "Review the topic, goal, and objectives. Point out risks, unclear scope, and concrete improvements.",
        }
        return (
            "You are StudyAI Diploma Assistant. Help the student plan a serious academic thesis. "
            "Do not invent sources or fake results. Keep recommendations practical and academically honest.\n\n"
            f"Topic: {diploma['topic']}\n"
            f"Faculty/program: {diploma.get('faculty') or 'Not specified'}\n"
            f"Research area: {diploma.get('research_area') or 'Not specified'}\n"
            f"Supervisor: {diploma.get('supervisor') or 'Not specified'}\n"
            f"Deadline: {diploma.get('deadline') or 'Not specified'}\n"
            f"Research type: {diploma['research_type']}\n"
            f"Research goal:\n{diploma.get('research_goal') or 'Not specified'}\n\n"
            f"Objectives:\n{diploma.get('objectives') or 'Not specified'}\n\n"
            f"Chapter statuses: {diploma.get('chapter_statuses')}\n\n"
            f"Task: {prompts[action]}"
        )

    @staticmethod
    def _progress_from_chapters(chapters: dict[str, str]) -> int:
        if not chapters:
            return 0
        reviewed = sum(1 for status in chapters.values() if status == "reviewed")
        return round(reviewed / len(chapters) * 100)

    @staticmethod
    def _diploma_response(row: dict[str, Any]) -> DiplomaResponse:
        return DiplomaResponse(
            id=row["id"],
            user_id=row["user_id"],
            topic=row["topic"],
            faculty=row.get("faculty"),
            research_area=row.get("research_area"),
            supervisor=row.get("supervisor"),
            deadline=row.get("deadline"),
            research_type=row["research_type"],
            status=row["status"],
            progress=row["progress"],
            research_goal=row.get("research_goal"),
            objectives=row.get("objectives"),
            chapter_statuses=row["chapter_statuses"],
            generated_structure=row.get("generated_structure"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )
