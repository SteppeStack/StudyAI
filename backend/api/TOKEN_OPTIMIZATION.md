# StudyAI Token Optimization

This sprint reduces Gemini token usage before adding more AI-heavy tools.

## Environment Variables

```env
MAX_AI_INPUT_CHARS=30000
AI_TUTOR_HISTORY_LIMIT=8
```

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
