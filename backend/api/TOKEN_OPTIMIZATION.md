# StudyAI Token Optimization

This sprint reduces Gemini token usage before adding more AI-heavy tools.

## Environment Variables

```env
GEMINI_MODEL_CHAIN=gemini-2.5-flash-lite,gemini-2.0-flash,gemini-2.5-flash
MAX_AI_INPUT_CHARS=30000
AI_TUTOR_HISTORY_LIMIT=8
```

`GEMINI_MODEL_CHAIN` tries cheaper/lighter Gemini models first and falls back to the next model only on quota or rate-limit errors.

`MAX_AI_INPUT_CHARS` limits extracted text from TXT/DOCX before sending it to Gemini.

`AI_TUTOR_HISTORY_LIMIT` controls how many recent chat messages are included in AI Tutor prompts.

## File Analysis Cache

File analysis results are stored in:

```text
public.file_analysis_results
```

The backend reuses cached results for the same:

```text
user_id + file_id + action + question + response_mode
```

Cached responses do not call Gemini again and do not increment monthly usage.

## Response Modes

File analysis accepts:

```json
{
  "action": "summarize",
  "question": null,
  "response_mode": "short"
}
```

Supported values:

- `short`
- `normal`
- `detailed`

Use `short` by default in the frontend when a compact preview is enough.

## Gemini Model Fallback

Default order:

```text
gemini-2.5-flash-lite
gemini-2.0-flash
gemini-2.5-flash
```

Fallback is used only for quota/rate-limit style errors, such as `429` or `RESOURCE_EXHAUSTED`.

It is not used for invalid request errors, invalid API keys, unsupported MIME types, or permission problems.
