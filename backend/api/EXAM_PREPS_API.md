# StudyAI Exam Prep API

This API connects the Exam Preparation page to Supabase and Gemini.

Base path:

```text
/api/v1/exam-preps
```

All endpoints require:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

## Create Exam Prep

```http
POST /api/v1/exam-preps
```

```json
{
  "title": "Database Systems Final",
  "subject": "Database Systems",
  "exam_date": "2026-07-15",
  "prep_mode": "studyPlan",
  "topics": "Normalization, indexes, transactions",
  "current_knowledge": "Joins are clear, transactions are weak."
}
```

Allowed `prep_mode` values:

- `studyPlan`
- `flashcards`
- `practiceQuiz`
- `weakTopics`

## List Exam Preps

```http
GET /api/v1/exam-preps
```

Returns only the current user's exam prep plans, newest first.

## Get Exam Prep

```http
GET /api/v1/exam-preps/{exam_prep_id}
```

## Update Exam Prep

```http
PATCH /api/v1/exam-preps/{exam_prep_id}
```

```json
{
  "progress": 45,
  "readiness_score": 50,
  "status": "in_progress"
}
```

Allowed `status` values:

- `draft`
- `generated`
- `in_progress`
- `completed`
- `archived`

## Delete Exam Prep

```http
DELETE /api/v1/exam-preps/{exam_prep_id}
```

Returns `204 No Content`.

## Generate AI Prep

```http
POST /api/v1/exam-preps/{exam_prep_id}/generate
```

```json
{
  "mode": "practiceQuiz"
}
```

If `mode` is omitted, the API uses the saved `prep_mode`.

The response includes:

```json
{
  "exam_prep": {
    "id": "exam-prep-id",
    "title": "Database Systems Final",
    "prep_mode": "practiceQuiz",
    "status": "generated",
    "generated_content": "AI result..."
  },
  "mode": "practiceQuiz",
  "result": "AI result...",
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false,
  "ai_requests_used": 10,
  "monthly_ai_request_limit": 300
}
```

## Frontend Tasks

- Add API helpers for exam prep.
- Replace local saved exams with `GET /api/v1/exam-preps`.
- Connect save form to `POST /api/v1/exam-preps`.
- Connect progress/readiness updates to `PATCH /api/v1/exam-preps/{id}`.
- Connect AI preview/generation to `POST /api/v1/exam-preps/{id}/generate`.
- Show loading, empty, and error states.
