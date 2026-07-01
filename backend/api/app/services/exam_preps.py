from typing import Any

from fastapi import HTTPException, status

from app.schemas.auth import CurrentUser
from app.schemas.exam_preps import (
    ExamPrepCreateRequest,
    ExamPrepGenerateResponse,
    ExamPrepMode,
    ExamPrepResponse,
    ExamPrepUpdateRequest,
)
from app.services.gemini import GeminiProvider
from app.services.supabase import SupabaseGateway


class ExamPrepsService:
    def __init__(self, supabase: SupabaseGateway, gemini: GeminiProvider) -> None:
        self.supabase = supabase
        self.gemini = gemini

    async def create_exam_prep(
        self,
        user: CurrentUser,
        payload: ExamPrepCreateRequest,
    ) -> ExamPrepResponse:
        created = await self.supabase.insert_exam_prep(
            user_id=user.id,
            data=self._create_payload(payload),
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="Exam prep created",
            description=payload.title[:120],
            resource_id=created["id"],
            resource_type="exam_prep",
            event_type="exam_prep_created",
        )
        return self._exam_prep_response(created)

    async def list_exam_preps(self, user: CurrentUser) -> list[ExamPrepResponse]:
        rows = await self.supabase.list_exam_preps(user.id)
        return [self._exam_prep_response(row) for row in rows]

    async def get_exam_prep(self, user: CurrentUser, exam_prep_id: str) -> ExamPrepResponse:
        row = await self.supabase.get_exam_prep(user_id=user.id, exam_prep_id=exam_prep_id)
        return self._exam_prep_response(row)

    async def update_exam_prep(
        self,
        user: CurrentUser,
        exam_prep_id: str,
        payload: ExamPrepUpdateRequest,
    ) -> ExamPrepResponse:
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No exam prep fields provided",
            )
        if update_data.get("exam_date") is not None:
            update_data["exam_date"] = update_data["exam_date"].isoformat()

        updated = await self.supabase.update_exam_prep(
            user_id=user.id,
            exam_prep_id=exam_prep_id,
            data=update_data,
        )
        return self._exam_prep_response(updated)

    async def delete_exam_prep(self, user: CurrentUser, exam_prep_id: str) -> None:
        await self.supabase.delete_exam_prep(user_id=user.id, exam_prep_id=exam_prep_id)

    async def generate_exam_prep(
        self,
        user: CurrentUser,
        exam_prep_id: str,
        mode: ExamPrepMode | None,
    ) -> ExamPrepGenerateResponse:
        exam_prep = await self.supabase.get_exam_prep(
            user_id=user.id,
            exam_prep_id=exam_prep_id,
        )
        selected_mode = mode or exam_prep["prep_mode"]
        usage_context = await self.supabase.get_usage_context(user.id)
        ai_result = await self.gemini.generate_text_result(
            self._build_prompt(exam_prep, selected_mode)
        )
        update_data = {
            "prep_mode": selected_mode,
            "generated_content": ai_result.text,
            "status": "generated",
            "progress": max(exam_prep.get("progress") or 0, 35),
            "readiness_score": max(exam_prep.get("readiness_score") or 0, 35),
        }
        updated = await self.supabase.update_exam_prep(
            user_id=user.id,
            exam_prep_id=exam_prep_id,
            data=update_data,
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
            feature="exam_preps",
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title=f"Exam prep generated: {selected_mode}",
            description=exam_prep["title"][:120],
            resource_id=exam_prep["id"],
            resource_type="exam_prep",
            event_type="exam_prep_ai_generated",
        )

        return ExamPrepGenerateResponse(
            exam_prep=self._exam_prep_response(updated),
            mode=selected_mode,
            result=ai_result.text,
            model_used=ai_result.model_used,
            fallback_used=ai_result.fallback_used,
            ai_requests_used=updated_usage["ai_requests_used"],
            monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
        )

    @staticmethod
    def _create_payload(payload: ExamPrepCreateRequest) -> dict[str, Any]:
        data = payload.model_dump()
        if data["exam_date"] is not None:
            data["exam_date"] = data["exam_date"].isoformat()
        return data

    @staticmethod
    def _build_prompt(exam_prep: dict[str, Any], mode: ExamPrepMode) -> str:
        prompts = {
            "studyPlan": "Create a practical day-by-day study plan with milestones, review blocks, and practice tasks.",
            "flashcards": "Create flashcards. Use a clear term/question and answer format.",
            "practiceQuiz": "Create a practice quiz with questions, answer key, and short explanations.",
            "weakTopics": "Identify likely weak topics and explain what to review first and how to practice.",
        }
        return (
            "You are StudyAI Exam Preparation Assistant. Help the student prepare effectively. "
            "Focus on learning, spaced repetition, practice, and realistic planning.\n\n"
            f"Exam title: {exam_prep['title']}\n"
            f"Subject: {exam_prep['subject']}\n"
            f"Exam date: {exam_prep.get('exam_date') or 'Not specified'}\n"
            f"Topics:\n{exam_prep['topics']}\n\n"
            f"Current knowledge:\n{exam_prep.get('current_knowledge') or 'Not specified'}\n\n"
            f"Task: {prompts[mode]}"
        )

    @staticmethod
    def _exam_prep_response(row: dict[str, Any]) -> ExamPrepResponse:
        return ExamPrepResponse(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            subject=row["subject"],
            exam_date=row.get("exam_date"),
            prep_mode=row["prep_mode"],
            status=row["status"],
            progress=row["progress"],
            readiness_score=row["readiness_score"],
            topics=row["topics"],
            current_knowledge=row.get("current_knowledge"),
            generated_content=row.get("generated_content"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )
