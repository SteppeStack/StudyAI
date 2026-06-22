# Dashboard Data: Manual API Checks

Run migrations `202606220004` through `202606220007` in Supabase SQL Editor before testing.

For authenticated requests, use the same access token as in the Auth checks.

```text
apikey: YOUR_SUPABASE_PUBLISHABLE_KEY
Authorization: Bearer USER_ACCESS_TOKEN
```

## Read Public Plans

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/plans?select=*&order=monthly_price_cents.asc
```

Only the `apikey` header is required.

Expected: `200 OK` and three plans: `free`, `student_premium`, and `teacher`.

## Read Current Subscription

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/subscriptions?status=in.(active,trialing)&select=*,plans(*)
```

Expected: `200 OK` and one active Free subscription for an existing test user.

## Read Current Month Usage

Replace `CURRENT_MONTH_START` with the first day of the current month, for example `2026-06-01`.

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/monthly_usage?period_start=eq.CURRENT_MONTH_START&select=*
```

Expected: `200 OK` with one row and both counters set to `0`.

## Read Recent Activity

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/activity_events?select=*&order=created_at.desc&limit=5
```

Expected: `200 OK` and an empty array. Activity records will appear when future server-side features create them.

## Verify Protected Fields

Try to change the current user's account role:

```text
PATCH https://YOUR_PROJECT.supabase.co/rest/v1/profiles?id=eq.USER_ID
```

```json
{
  "account_role": "teacher"
}
```

Expected: `403 Forbidden` or a column permission error.

Try to create a subscription:

```text
POST https://YOUR_PROJECT.supabase.co/rest/v1/subscriptions
```

Expected: `403 Forbidden` or an RLS policy error. Subscription changes must come from trusted server-side code.
