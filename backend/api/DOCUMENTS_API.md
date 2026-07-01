# StudyAI Documents API

This API connects the Documents page to Supabase and Gemini.

Base path:

```text
/api/v1/documents
```

All endpoints require:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

## Create Document

```http
POST /api/v1/documents
```

```json
{
  "title": "AI Ethics Essay",
  "course": "Academic Writing",
  "document_type": "essay",
  "language": "en",
  "tone": "academic",
  "instructions": "Write an essay about ethical AI in education.",
  "source_text": null
}
```

Allowed `document_type` values:

- `essay`
- `summary`
- `research`
- `report`
- `outline`
- `notes`
- `custom`

Allowed `language` values:

- `en`
- `ru`
- `kz`

Allowed `tone` values:

- `academic`
- `simple`
- `formal`
- `concise`
- `persuasive`

## List Documents

```http
GET /api/v1/documents
```

Returns only the current user's documents, newest first.

## Get Document

```http
GET /api/v1/documents/{document_id}
```

## Update Document

```http
PATCH /api/v1/documents/{document_id}
```

```json
{
  "title": "Updated title",
  "status": "reviewed",
  "generated_content": "Updated draft text"
}
```

Allowed `status` values:

- `draft`
- `generated`
- `reviewed`
- `archived`

## Delete Document

```http
DELETE /api/v1/documents/{document_id}
```

Returns `204 No Content`.

## Generate AI Content

```http
POST /api/v1/documents/{document_id}/generate
```

```json
{
  "action": "draft"
}
```

Allowed `action` values:

- `outline`
- `draft`
- `summarize`
- `improve`

For `summarize` and `improve`, the document must have `source_text` or `generated_content`.

The response includes:

```json
{
  "document": {
    "id": "document-id",
    "title": "AI Ethics Essay",
    "status": "generated",
    "generated_content": "AI result...",
    "word_count": 500
  },
  "action": "draft",
  "result": "AI result...",
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false,
  "ai_requests_used": 10,
  "monthly_ai_request_limit": 300
}
```

## Frontend Tasks

- Add API helpers for documents.
- Replace mock document list with `GET /api/v1/documents`.
- Connect create document form to `POST /api/v1/documents`.
- Add document detail/edit view using `GET` and `PATCH`.
- Connect AI actions to `POST /api/v1/documents/{document_id}/generate`.
- Show loading, empty, and error states.
