# StudyAI Dashboard API

This API can replace multiple direct Supabase reads on the dashboard.

## Dashboard Summary

```http
GET /api/v1/dashboard
```

Requires:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

Response:

```json
{
  "profile": {
    "id": "user-id",
    "email": "student@example.com",
    "full_name": "Student",
    "avatar_url": null,
    "account_role": "student",
    "subscription_plan": "free"
  },
  "subscription": {
    "id": "subscription-id",
    "status": "active",
    "started_at": "2026-07-01T00:00:00Z",
    "expires_at": null,
    "plan": {
      "id": "free",
      "display_name": "Free",
      "audience": "all",
      "monthly_price_cents": 0,
      "currency": "USD",
      "daily_ai_request_limit": 10,
      "monthly_ai_request_limit": 300
    }
  },
  "usage": {
    "period_start": "2026-07-01",
    "ai_requests_used": 3,
    "documents_generated": 1
  },
  "recent_activity": []
}
```

## Public Plans

```http
GET /api/v1/dashboard/plans
```

Does not require user auth.

## Frontend Tasks

- Use `GET /api/v1/dashboard` for dashboard user summary.
- Use `GET /api/v1/dashboard/plans` for pricing cards.
- Keep direct Supabase Auth for login/register/session.
- Show empty state when `recent_activity` is empty.
- Show upgrade CTA when plan usage is close to the limit.
