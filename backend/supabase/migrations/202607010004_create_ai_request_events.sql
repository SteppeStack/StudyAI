create table if not exists public.ai_request_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_id uuid references public.monthly_usage(id) on delete set null,
  feature text not null default 'ai',
  created_at timestamptz not null default now(),
  constraint ai_request_events_feature_not_blank check (char_length(btrim(feature)) > 0)
);

create index if not exists ai_request_events_user_id_created_at_idx
on public.ai_request_events (user_id, created_at desc);

create index if not exists ai_request_events_usage_id_idx
on public.ai_request_events (usage_id);

alter table public.ai_request_events enable row level security;

drop policy if exists "ai_request_events_select_own" on public.ai_request_events;

create policy "ai_request_events_select_own"
on public.ai_request_events
for select
to authenticated
using (auth.uid() = user_id);

revoke all on public.ai_request_events from anon;
revoke all on public.ai_request_events from authenticated;
grant select on public.ai_request_events to authenticated;

comment on table public.ai_request_events is 'Per-request AI usage audit log used for daily limits and analytics.';
