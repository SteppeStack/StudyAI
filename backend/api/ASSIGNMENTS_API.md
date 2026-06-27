# StudyAI Assignments API

This API connects Assignment Helper to Supabase and Gemini.

All endpoints require:

```http
Authorization: Bearer USER_ACCESS_TOKEN
Content-Type: application/json
```

## Create Assignment

```http
POST /api/v1/assignments
```

Body:

```json
{
  "title": "Math homework",
  "subject": "Math",
  "help_type": "solution_plan",
  "deadline": "2026-07-01",
  "priority": "medium",
  "status": "draft",
  "progress": 0,
  "description": "Solve quadratic equation tasks from chapter 4.",
  "student_answer": null
}
```

## List Assignments

```http
GET /api/v1/assignments
```

## Get Assignment

```http
GET /api/v1/assignments/{assignment_id}
```

## Update Assignment

```http
PATCH /api/v1/assignments/{assignment_id}
```

Body can include any editable fields:

```json
{
  "status": "in_progress",
  "progress": 50,
  "student_answer": "My draft answer..."
}
```

## Delete Assignment

```http
DELETE /api/v1/assignments/{assignment_id}
```

## Generate AI Help

```http
POST /api/v1/assignments/{assignment_id}/generate
```

Body:

```json
{
  "action": "solution_plan"
}
```

Supported actions:

- `solution_plan`
- `key_points`
- `answer_check`

For `answer_check`, the assignment must have `student_answer`.

The backend checks subscription usage limits before calling Gemini.

Generation responses include:

```json
{
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false
}
```

## Frontend Tasks

- Use `POST /api/v1/assignments` for creating assignments.
- Use `GET /api/v1/assignments` for assignment list/table/cards.
- Use `PATCH /api/v1/assignments/{assignment_id}` for status, progress, answer, and field edits.
- Use `POST /api/v1/assignments/{assignment_id}/generate` for AI actions.
- Render `generated_solution_plan`, `generated_key_points`, and `ai_feedback`.
- Use `DELETE /api/v1/assignments/{assignment_id}` for delete action.
