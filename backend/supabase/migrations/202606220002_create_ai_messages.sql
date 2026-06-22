create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_messages_role_check check (role in ('user', 'assistant', 'system')),
  constraint ai_messages_content_not_blank check (char_length(btrim(content)) > 0)
);

create index if not exists ai_messages_conversation_id_created_at_idx
on public.ai_messages (conversation_id, created_at asc);

create index if not exists ai_messages_user_id_created_at_idx
on public.ai_messages (user_id, created_at desc);

create or replace function public.ensure_ai_message_owner()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  conversation_owner_id uuid;
begin
  select user_id
  into conversation_owner_id
  from public.ai_conversations
  where id = new.conversation_id;

  if conversation_owner_id is null then
    raise exception 'AI conversation % does not exist', new.conversation_id;
  end if;

  if new.user_id <> conversation_owner_id then
    raise exception 'AI message owner must match the conversation owner';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_ai_message_owner on public.ai_messages;

create trigger validate_ai_message_owner
before insert or update of conversation_id, user_id on public.ai_messages
for each row
execute function public.ensure_ai_message_owner();

comment on table public.ai_messages is 'Immutable messages belonging to AI Tutor conversations.';
