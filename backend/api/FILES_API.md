# StudyAI Files API

This API connects the Files Workspace to Supabase Storage and per-user file metadata.

All endpoints require:

```http
Authorization: Bearer USER_ACCESS_TOKEN
```

## Upload File

```http
POST /api/v1/files/upload
Content-Type: multipart/form-data
```

Form field:

```text
file
```

Supported file types:

- PDF
- DOC
- DOCX
- TXT
- PNG
- JPG/JPEG
- WEBP

Default max size: `25 MB`.

Response:

```json
{
  "id": "file-id",
  "user_id": "user-id",
  "bucket_id": "study-files",
  "storage_path": "user-id/random-id.pdf",
  "original_name": "lecture.pdf",
  "content_type": "application/pdf",
  "file_type": "pdf",
  "size_bytes": 12345,
  "status": "uploaded",
  "created_at": "2026-06-26T00:00:00Z",
  "updated_at": "2026-06-26T00:00:00Z"
}
```

## List Files

```http
GET /api/v1/files
```

Returns files for the current user ordered by newest first.

## Create Signed URL

```http
POST /api/v1/files/{file_id}/signed-url?expires_in=3600
```

Response:

```json
{
  "signed_url": "https://...",
  "expires_in": 3600
}
```

Use this when the frontend needs to preview or download a private file.

## Delete File

```http
DELETE /api/v1/files/{file_id}
```

Deletes the object from Supabase Storage and removes the metadata row.

## Analyze File

```http
POST /api/v1/files/{file_id}/analyze
Content-Type: application/json
```

Body:

```json
{
  "action": "summarize",
  "question": null,
  "response_mode": "normal"
}
```

Supported actions:

- `summarize`
- `key_points`
- `flashcards`
- `quiz`
- `ask`
- `create_notes`

For `ask`, send a question:

```json
{
  "action": "ask",
  "question": "What are the main arguments in this file?",
  "response_mode": "short"
}
```

Response modes:

- `short`
- `normal`
- `detailed`

Response:

```json
{
  "file_id": "file-id",
  "action": "summarize",
  "response_mode": "normal",
  "result": "AI generated result",
  "cached": false,
  "was_truncated": false,
  "input_chars_used": 12000,
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false,
  "ai_requests_used": 3,
  "monthly_ai_request_limit": 300
}
```

The backend checks subscription usage limits before calling Gemini.
Repeated requests with the same `file_id`, `action`, `question`, and `response_mode`
return the cached result without calling Gemini again.

Set `force_refresh` to `true` to bypass the cache:

```json
{
  "action": "summarize",
  "question": null,
  "response_mode": "short",
  "force_refresh": true
}
```

Analysis support:

- `PDF` and images are sent to Gemini as file input.
- `DOCX` and `TXT` are converted to text on the backend before calling Gemini.
- legacy `DOC` files can be uploaded, listed, downloaded, and deleted, but AI analysis is not supported yet.

## Frontend Tasks

- Use `POST /api/v1/files/upload` for the Files page upload.
- Use `GET /api/v1/files` to render file cards.
- Show `original_name`, `file_type`, `size_bytes`, `created_at`, and `status`.
- Use `POST /api/v1/files/{file_id}/signed-url` for preview/download.
- Use `DELETE /api/v1/files/{file_id}` for delete action.
- Use `POST /api/v1/files/{file_id}/analyze` for file AI actions.
- Use `response_mode` to control token usage and result length.
- Do not upload files directly from frontend to Supabase Storage unless backend signs the upload later.
