create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_conversations_title_not_blank check (char_length(btrim(title)) > 0),
  constraint ai_conversations_title_length check (char_length(title) <= 200)
);

create index if not exists ai_conversations_user_id_created_at_idx
on public.ai_conversations (user_id, created_at desc);

drop trigger if exists set_ai_conversations_updated_at on public.ai_conversations;

create trigger set_ai_conversations_updated_at
before update on public.ai_conversations
for each row
execute function public.set_updated_at();

comment on table public.ai_conversations is 'AI Tutor conversations owned by a single user.';
