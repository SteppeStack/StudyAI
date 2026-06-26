from datetime import UTC, date, datetime
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas.auth import CurrentUser


class SupabaseGateway:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def _require_public_config(self) -> None:
        if not self.settings.supabase_url or not self.settings.supabase_publishable_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase public config is not configured",
            )

    def _require_service_config(self) -> None:
        if not self.settings.supabase_url or not self.settings.supabase_service_role_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase service config is not configured",
            )

    def _service_headers(self, extra: dict[str, str] | None = None) -> dict[str, str]:
        self._require_service_config()
        headers = {
            "apikey": self.settings.supabase_service_role_key,
            "Authorization": f"Bearer {self.settings.supabase_service_role_key}",
            "Content-Type": "application/json",
        }
        if extra:
            headers.update(extra)
        return headers

    async def get_user_from_access_token(self, access_token: str) -> CurrentUser:
        self._require_public_config()
        headers = {
            "apikey": self.settings.supabase_publishable_key,
            "Authorization": f"Bearer {access_token}",
        }

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                f"{self.settings.supabase_url}/auth/v1/user",
                headers=headers,
            )

        if response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Supabase access token",
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Supabase Auth request failed",
            )

        data = response.json()
        return CurrentUser(id=data["id"], email=data.get("email"))

    async def get_or_create_conversation(
        self,
        user_id: str,
        conversation_id: str | None,
        title: str,
    ) -> dict[str, Any]:
        if conversation_id:
            conversations = await self._rest_get(
                "ai_conversations",
                {
                    "id": f"eq.{conversation_id}",
                    "user_id": f"eq.{user_id}",
                    "select": "*",
                    "limit": "1",
                },
            )
            if not conversations:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="AI conversation not found",
                )
            return conversations[0]

        created = await self._rest_post(
            "ai_conversations",
            {"user_id": user_id, "title": title},
        )
        return created[0]

    async def get_recent_messages(self, conversation_id: str, limit: int = 12) -> list[dict[str, Any]]:
        return await self._rest_get(
            "ai_messages",
            {
                "conversation_id": f"eq.{conversation_id}",
                "select": "role,content,created_at",
                "order": "created_at.desc",
                "limit": str(limit),
            },
        )

    async def insert_ai_message(
        self,
        conversation_id: str,
        user_id: str,
        role: str,
        content: str,
    ) -> dict[str, Any]:
        created = await self._rest_post(
            "ai_messages",
            {
                "conversation_id": conversation_id,
                "user_id": user_id,
                "role": role,
                "content": content,
            },
        )
        return created[0]

    async def get_usage_context(self, user_id: str) -> dict[str, Any]:
        subscription = await self._get_current_subscription(user_id)
        plan = await self._get_plan(subscription["plan_id"])
        usage = await self._get_or_create_monthly_usage(user_id)

        limit = plan.get("monthly_ai_request_limit")
        if limit is not None and usage["ai_requests_used"] >= limit:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Monthly AI request limit reached",
            )

        return {"plan": plan, "usage": usage}

    async def increment_ai_usage(self, usage_id: str, current_value: int) -> dict[str, Any]:
        updated = await self._rest_patch(
            "monthly_usage",
            {"id": f"eq.{usage_id}"},
            {"ai_requests_used": current_value + 1},
        )
        return updated[0]

    async def create_activity_event(
        self,
        user_id: str,
        title: str,
        description: str,
        resource_id: str,
    ) -> None:
        await self._rest_post(
            "activity_events",
            {
                "user_id": user_id,
                "event_type": "ai_tutor_message",
                "title": title,
                "description": description,
                "status": "completed",
                "resource_type": "ai_conversation",
                "resource_id": resource_id,
            },
        )

    async def _get_current_subscription(self, user_id: str) -> dict[str, Any]:
        rows = await self._rest_get(
            "subscriptions",
            {
                "user_id": f"eq.{user_id}",
                "status": "in.(active,trialing)",
                "select": "*",
                "order": "started_at.desc",
                "limit": "1",
            },
        )
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Active subscription not found",
            )
        return rows[0]

    async def _get_plan(self, plan_id: str) -> dict[str, Any]:
        rows = await self._rest_get(
            "plans",
            {"id": f"eq.{plan_id}", "select": "*", "limit": "1"},
        )
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Subscription plan not found",
            )
        return rows[0]

    async def _get_or_create_monthly_usage(self, user_id: str) -> dict[str, Any]:
        period_start = date.today().replace(day=1).isoformat()
        rows = await self._rest_get(
            "monthly_usage",
            {
                "user_id": f"eq.{user_id}",
                "period_start": f"eq.{period_start}",
                "select": "*",
                "limit": "1",
            },
        )
        if rows:
            return rows[0]

        created = await self._rest_post(
            "monthly_usage",
            {"user_id": user_id, "period_start": period_start},
        )
        return created[0]

    async def _rest_get(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(
                f"{self.settings.supabase_url}/rest/v1/{table}",
                headers=self._service_headers(),
                params=params,
            )
        return self._parse_rest_response(response)

    async def _rest_post(self, table: str, body: dict[str, Any]) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.settings.supabase_url}/rest/v1/{table}",
                headers=self._service_headers({"Prefer": "return=representation"}),
                json=body,
            )
        return self._parse_rest_response(response)

    async def _rest_patch(
        self,
        table: str,
        params: dict[str, str],
        body: dict[str, Any],
    ) -> list[dict[str, Any]]:
        body["updated_at"] = datetime.now(UTC).isoformat()
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.patch(
                f"{self.settings.supabase_url}/rest/v1/{table}",
                headers=self._service_headers({"Prefer": "return=representation"}),
                params=params,
                json=body,
            )
        return self._parse_rest_response(response)

    @staticmethod
    def _parse_rest_response(response: httpx.Response) -> list[dict[str, Any]]:
        if response.status_code >= 400:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Supabase database request failed",
            )
        return response.json()


def get_supabase_gateway() -> SupabaseGateway:
    return SupabaseGateway()
