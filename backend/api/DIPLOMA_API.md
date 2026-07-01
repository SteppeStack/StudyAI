# StudyAI Diploma API

This API connects the Diploma workspace to Supabase and Gemini.

Base path:

```text
/api/v1/diplomas
```

All endpoints require:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

## Create Diploma Project

```http
POST /api/v1/diplomas
```

```json
{
  "topic": "The impact of AI on university education",
  "faculty": "Computer Science",
  "research_area": "Artificial Intelligence in Education",
  "supervisor": "Dr. Smith",
  "deadline": "2026-08-15",
  "research_type": "mixed",
  "research_goal": "Study how AI tools affect student learning.",
  "objectives": "Review literature\nSurvey students\nAnalyze results"
}
```

Allowed `research_type` values:

- `mixed`
- `quantitative`
- `qualitative`
- `theoretical`

## List Diploma Projects

```http
GET /api/v1/diplomas
```

Returns only the current user's diploma projects, newest first.

## Get Diploma Project

```http
GET /api/v1/diplomas/{diploma_id}
```

## Update Diploma Project

```http
PATCH /api/v1/diplomas/{diploma_id}
```

```json
{
  "chapter_statuses": {
    "introduction": "reviewed",
    "literature": "inProgress",
    "methodology": "notStarted",
    "results": "notStarted",
    "discussion": "notStarted",
    "conclusion": "notStarted"
  }
}
```

Allowed chapter status values:

- `notStarted`
- `inProgress`
- `draftReady`
- `reviewed`

## Delete Diploma Project

```http
DELETE /api/v1/diplomas/{diploma_id}
```

Returns `204 No Content`.

## Generate AI Help

```http
POST /api/v1/diplomas/{diploma_id}/generate
```

```json
{
  "action": "structure"
}
```

Allowed `action` values:

- `structure`
- `researchQuestions`
- `chapterPlan`
- `feedback`

The response includes:

```json
{
  "diploma": {
    "id": "diploma-id",
    "topic": "The impact of AI on university education",
    "status": "structured",
    "generated_structure": "AI result..."
  },
  "action": "structure",
  "result": "AI result...",
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false,
  "ai_requests_used": 10,
  "monthly_ai_request_limit": 300
}
```

## Frontend Tasks

- Add API helpers for diploma projects.
- Replace local form/chapter storage with `GET /api/v1/diplomas`.
- Connect save draft to `POST /api/v1/diplomas`.
- Connect chapter status changes to `PATCH /api/v1/diplomas/{id}`.
- Connect structure generation to `POST /api/v1/diplomas/{id}/generate`.
- Show loading, empty, and error states.
