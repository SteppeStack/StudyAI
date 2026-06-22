# AI Tutor: Manual API Checks

Run the three `20260622000*.sql` migrations in Supabase SQL Editor before testing.

Use Thunder Client with a test user's access token from the existing login request.

Every request below needs these headers:

```text
apikey: YOUR_SUPABASE_PUBLISHABLE_KEY
Authorization: Bearer USER_ACCESS_TOKEN
```

Use the current authenticated user's UUID as `USER_ID`. It is available in the login response at `user.id`.

## Create a Conversation

```text
POST https://YOUR_PROJECT.supabase.co/rest/v1/ai_conversations
```

Add this header:

```text
Prefer: return=representation
Content-Type: application/json
```

JSON body:

```json
{
  "user_id": "USER_ID",
  "title": "Math homework"
}
```

Expected: `201 Created`. Copy the returned conversation `id` as `CONVERSATION_ID`.

## Create a User Message

```text
POST https://YOUR_PROJECT.supabase.co/rest/v1/ai_messages
```

Add this header:

```text
Prefer: return=representation
Content-Type: application/json
```

JSON body:

```json
{
  "conversation_id": "CONVERSATION_ID",
  "user_id": "USER_ID",
  "role": "user",
  "content": "Explain quadratic equations."
}
```

Expected: `201 Created`.

## Read a Conversation's Messages

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/ai_messages?conversation_id=eq.CONVERSATION_ID&select=*&order=created_at.asc
```

Expected: `200 OK` with the message created above.

## Verify Assistant Messages Are Protected

Repeat the create-message request but set the role to `assistant`:

```json
{
  "conversation_id": "CONVERSATION_ID",
  "user_id": "USER_ID",
  "role": "assistant",
  "content": "This must be rejected."
}
```

Expected: `403 Forbidden` or an RLS policy error. Only the future Python API may create assistant messages.

## Verify User Isolation

Create a second test user and log in as that user. Then request the first user's conversation:

```text
GET https://YOUR_PROJECT.supabase.co/rest/v1/ai_conversations?id=eq.CONVERSATION_ID&select=*
```

Expected: `200 OK` with an empty array. The second user must not receive the first user's conversation.
