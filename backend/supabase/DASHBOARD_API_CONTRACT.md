# Dashboard API Contract

Run migrations `202606220004` through `202606220007` before using these endpoints.

All user-specific REST requests require:

```text
apikey: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Authorization: Bearer USER_ACCESS_TOKEN
```

Supabase RLS automatically limits each result to the current user.

## Profile

```text
GET /rest/v1/profiles?select=id,email,full_name,avatar_url,account_role
```

The frontend may update only `full_name` and `avatar_url`.

## Current Subscription

```text
GET /rest/v1/subscriptions?status=in.(active,trialing)&select=id,status,started_at,expires_at,plans(id,display_name,monthly_price_cents,currency,daily_ai_request_limit,monthly_ai_request_limit)
```

The frontend cannot create, change, or cancel subscriptions directly. Payment and plan changes will be handled by a future server endpoint.

## Current Month Usage

```text
GET /rest/v1/monthly_usage?period_start=eq.CURRENT_MONTH_START&select=ai_requests_used,documents_generated,period_start
```

Use the first day of the current month for `CURRENT_MONTH_START`, for example `2026-06-01`.

The request limit comes from the joined `plans` record in the current subscription.

## Recent Activity

```text
GET /rest/v1/activity_events?select=id,event_type,title,description,status,resource_type,resource_id,created_at&order=created_at.desc&limit=5
```

The dashboard shows an empty state until future server-side features create activity events.

## Public Pricing Plans

```text
GET /rest/v1/plans?select=id,display_name,audience,monthly_price_cents,currency,daily_ai_request_limit,monthly_ai_request_limit&order=monthly_price_cents.asc
```

This endpoint is public and can be used on the landing page without a user session.
