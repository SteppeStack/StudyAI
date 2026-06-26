from typing import Any

from fastapi import HTTPException, status

from app.schemas.assignments import (
    AssignmentCreateRequest,
    AssignmentGenerateResponse,
    AssignmentHelpType,
    AssignmentResponse,
    AssignmentUpdateRequest,
)
from app.schemas.auth import CurrentUser
from app.services.gemini import GeminiProvider
from app.services.supabase import SupabaseGateway


class AssignmentsService:
    def __init__(self, supabase: SupabaseGateway, gemini: GeminiProvider) -> None:
        self.supabase = supabase
        self.gemini = gemini

    async def create_assignment(
        self,
        user: CurrentUser,
        payload: AssignmentCreateRequest,
    ) -> AssignmentResponse:
        created = await self.supabase.insert_assignment(
            user_id=user.id,
            data=self._create_payload(payload),
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title="Assignment created",
            description=payload.title[:120],
            resource_id=created["id"],
            resource_type="assignment",
            event_type="assignment_created",
        )
        return self._assignment_response(created)

    async def list_assignments(self, user: CurrentUser) -> list[AssignmentResponse]:
        rows = await self.supabase.list_assignments(user.id)
        return [self._assignment_response(row) for row in rows]

    async def get_assignment(self, user: CurrentUser, assignment_id: str) -> AssignmentResponse:
        row = await self.supabase.get_assignment(user_id=user.id, assignment_id=assignment_id)
        return self._assignment_response(row)

    async def update_assignment(
        self,
        user: CurrentUser,
        assignment_id: str,
        payload: AssignmentUpdateRequest,
    ) -> AssignmentResponse:
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No assignment fields provided",
            )
        if update_data.get("deadline") is not None:
            update_data["deadline"] = update_data["deadline"].isoformat()

        updated = await self.supabase.update_assignment(
            user_id=user.id,
            assignment_id=assignment_id,
            data=update_data,
        )
        return self._assignment_response(updated)

    async def delete_assignment(self, user: CurrentUser, assignment_id: str) -> None:
        await self.supabase.delete_assignment(user_id=user.id, assignment_id=assignment_id)

    async def generate_assignment_help(
        self,
        user: CurrentUser,
        assignment_id: str,
        action: AssignmentHelpType,
    ) -> AssignmentGenerateResponse:
        assignment = await self.supabase.get_assignment(
            user_id=user.id,
            assignment_id=assignment_id,
        )
        if action == "answer_check" and not assignment.get("student_answer"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="student_answer is required for answer_check",
            )

        usage_context = await self.supabase.get_usage_context(user.id)
        result = await self.gemini.generate_text(self._build_prompt(assignment, action))
        update_data = self._ai_result_update(action, result)
        updated = await self.supabase.update_assignment(
            user_id=user.id,
            assignment_id=assignment_id,
            data=update_data,
        )
        updated_usage = await self.supabase.increment_ai_usage(
            usage_id=usage_context["usage"]["id"],
            current_value=usage_context["usage"]["ai_requests_used"],
        )
        await self.supabase.create_activity_event(
            user_id=user.id,
            title=f"Assignment AI help: {action}",
            description=assignment["title"][:120],
            resource_id=assignment["id"],
            resource_type="assignment",
            event_type="assignment_ai_help",
        )

        return AssignmentGenerateResponse(
            assignment=self._assignment_response(updated),
            action=action,
            result=result,
            ai_requests_used=updated_usage["ai_requests_used"],
            monthly_ai_request_limit=usage_context["plan"].get("monthly_ai_request_limit"),
        )

    @staticmethod
    def _create_payload(payload: AssignmentCreateRequest) -> dict[str, Any]:
        data = payload.model_dump()
        if data["deadline"] is not None:
            data["deadline"] = data["deadline"].isoformat()
        return data

    @staticmethod
    def _ai_result_update(action: AssignmentHelpType, result: str) -> dict[str, Any]:
        if action == "solution_plan":
            return {
                "generated_solution_plan": result,
                "status": "in_progress",
                "progress": 35,
            }
        if action == "key_points":
            return {
                "generated_key_points": result,
                "status": "in_progress",
                "progress": 35,
            }
        return {
            "ai_feedback": result,
            "status": "checked",
            "progress": 75,
        }

    @staticmethod
    def _build_prompt(assignment: dict[str, Any], action: AssignmentHelpType) -> str:
        base = (
            "You are StudyAI Assignment Helper. Help the student learn and complete the task honestly. "
            "Do not write a dishonest final submission; provide guidance, structure, reasoning, and feedback.\n\n"
            f"Title: {assignment['title']}\n"
            f"Subject: {assignment.get('subject') or 'Not specified'}\n"
            f"Deadline: {assignment.get('deadline') or 'Not specified'}\n"
            f"Priority: {assignment['priority']}\n"
            f"Assignment description:\n{assignment['description']}\n\n"
        )
        if assignment.get("student_answer"):
            base += f"Student answer:\n{assignment['student_answer']}\n\n"

        prompts = {
            "solution_plan": "Generate a step-by-step solution plan with milestones and what the student should do next.",
            "key_points": "Extract the key points, concepts, requirements, and possible risks for this assignment.",
            "answer_check": "Check the student's answer. Explain what is correct, what is missing, and how to improve it.",
        }
        return base + prompts[action]

    @staticmethod
    def _assignment_response(row: dict[str, Any]) -> AssignmentResponse:
        return AssignmentResponse(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            subject=row.get("subject"),
            help_type=row["help_type"],
            deadline=row.get("deadline"),
            priority=row["priority"],
            status=row["status"],
            progress=row["progress"],
            description=row["description"],
            student_answer=row.get("student_answer"),
            generated_solution_plan=row.get("generated_solution_plan"),
            generated_key_points=row.get("generated_key_points"),
            ai_feedback=row.get("ai_feedback"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )
