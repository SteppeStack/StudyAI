# StudyAI API Error Responses

The Python API uses standard HTTP status codes and FastAPI JSON error bodies.

Frontend should always be ready for:

```json
{
  "detail": "Error message"
}
```

Sometimes `detail` can be an object in development mode:

```json
{
  "detail": {
    "message": "Provider request failed",
    "status_code": 400,
    "provider_response": "..."
  }
}
```

## Common Status Codes

### 400 Bad Request

The request is valid JSON, but the action cannot be completed.

Examples:

- empty update payload;
- `source_text` is required for document summarize/improve;
- `student_answer` is required for assignment answer check.

Frontend behavior:

- show the message from `detail`;
- keep the form data.

### 401 Unauthorized

Missing or invalid Supabase access token.

Examples:

```json
{
  "detail": "Missing Authorization header"
}
```

```json
{
  "detail": "Invalid Supabase access token"
}
```

Frontend behavior:

- refresh session if possible;
- otherwise redirect to login.

### 402 Payment Required

The user's plan limit was reached.

Examples:

```json
{
  "detail": "Daily AI request limit reached"
}
```

```json
{
  "detail": "Monthly AI request limit reached"
}
```

Frontend behavior:

- show upgrade/limit message;
- do not retry automatically.

### 404 Not Found

The resource does not exist or does not belong to the current user.

Examples:

- assignment not found;
- file not found;
- document not found;
- exam prep not found;
- diploma project not found.

Frontend behavior:

- show not found state;
- return to list page if needed.

### 422 Validation Error

FastAPI/Pydantic validation failed.

Example:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "title"],
      "msg": "Field required"
    }
  ]
}
```

Frontend behavior:

- map validation errors to form fields when possible;
- otherwise show a generic validation message.

### 500 Internal Server Error

Backend configuration or unexpected server error.

Examples:

- missing `GEMINI_API_KEY`;
- missing Supabase service role key.

Frontend behavior:

- show generic error;
- ask user to try again later.

### 502 Bad Gateway

External provider failed or was unreachable.

Examples:

- Supabase Auth timeout;
- Supabase Storage failure;
- Gemini API failure.

Frontend behavior:

- show temporary provider error;
- allow retry.

## Recommended Frontend Error Parser

Pseudo-code:

```ts
function getApiErrorMessage(errorBody: unknown) {
  if (
    errorBody &&
    typeof errorBody === "object" &&
    "detail" in errorBody
  ) {
    const detail = errorBody.detail;
    if (typeof detail === "string") return detail;
    if (detail && typeof detail === "object" && "message" in detail) {
      return String(detail.message);
    }
    if (Array.isArray(detail)) return "Please check the form fields.";
  }

  return "Something went wrong. Please try again.";
}
```
