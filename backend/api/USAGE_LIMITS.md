# StudyAI AI Usage Limits

AI usage is controlled through Supabase tables:

- `plans.daily_ai_request_limit`
- `plans.monthly_ai_request_limit`
- `monthly_usage.ai_requests_used`
- `ai_request_events`

Before each Gemini request, the Python API checks:

1. The user's active subscription.
2. The monthly AI request limit.
3. The daily AI request limit.

If a limit is reached, the API returns:

```http
402 Payment Required
```

```json
{
  "detail": "Daily AI request limit reached"
}
```

or:

```json
{
  "detail": "Monthly AI request limit reached"
}
```

After a successful AI request, the API:

1. Increments `monthly_usage.ai_requests_used`.
2. Inserts a row into `ai_request_events`.
3. Stores the feature name, for example:
   - `ai_tutor`
   - `files`
   - `assignments`
   - `documents`
   - `exam_preps`
   - `diploma`

The response from AI endpoints includes usage values:

```json
{
  "ai_requests_used": 12,
  "monthly_ai_request_limit": 300
}
```

Frontend should show a clear upgrade/limit message when it receives `402`.
