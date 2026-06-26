# Files Storage Testing

Apply this migration in Supabase SQL Editor:

```text
backend/supabase/migrations/202606260001_create_user_files_storage.sql
```

It creates:

- private Storage bucket: `study-files`;
- metadata table: `public.user_files`;
- RLS policies for per-user metadata access;
- Storage policies for per-user folders.

## API Checks

After the Python API is running, open:

```text
http://127.0.0.1:8000/docs
```

Authorize with a Supabase access token, then check:

```http
POST /api/v1/files/upload
GET /api/v1/files
POST /api/v1/files/{file_id}/signed-url
DELETE /api/v1/files/{file_id}
POST /api/v1/files/{file_id}/analyze
```

Expected behavior:

- uploaded file appears in Supabase Storage bucket `study-files`;
- metadata appears in `public.user_files`;
- `GET /api/v1/files` returns only the current user's files;
- signed URL opens the private file temporarily;
- delete removes both the storage object and metadata row.
- analyze returns a Gemini-generated result and increments monthly usage.
- DOCX analysis should work through backend text extraction.
- Legacy DOC analysis should return `415` and ask for DOCX, PDF, TXT, or image files.
