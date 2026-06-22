alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

drop policy if exists "ai_conversations_select_own" on public.ai_conversations;
drop policy if exists "ai_conversations_insert_own" on public.ai_conversations;
drop policy if exists "ai_conversations_update_own" on public.ai_conversations;
drop policy if exists "ai_conversations_delete_own" on public.ai_conversations;
drop policy if exists "ai_messages_select_own" on public.ai_messages;
drop policy if exists "ai_messages_insert_user_messages" on public.ai_messages;

create policy "ai_conversations_select_own"
on public.ai_conversations
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_conversations_insert_own"
on public.ai_conversations
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ai_conversations_update_own"
on public.ai_conversations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ai_conversations_delete_own"
on public.ai_conversations
for delete
to authenticated
using (auth.uid() = user_id);

create policy "ai_messages_select_own"
on public.ai_messages
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_messages_insert_user_messages"
on public.ai_messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and role = 'user'
  and exists (
    select 1
    from public.ai_conversations
    where id = conversation_id
      and user_id = auth.uid()
  )
);

revoke all on public.ai_conversations from anon;
revoke all on public.ai_conversations from authenticated;
revoke all on public.ai_messages from anon;
revoke all on public.ai_messages from authenticated;

grant select, insert (user_id, title), update (title), delete
on public.ai_conversations
to authenticated;

grant select, insert (conversation_id, user_id, role, content)
on public.ai_messages
to authenticated;
