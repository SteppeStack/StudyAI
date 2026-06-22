create table if not exists public.monthly_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period_start date not null,
  ai_requests_used integer not null default 0,
  documents_generated integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monthly_usage_period_start_check check (period_start = date_trunc('month', period_start)::date),
  constraint monthly_usage_ai_requests_check check (ai_requests_used >= 0),
  constraint monthly_usage_documents_check check (documents_generated >= 0),
  constraint monthly_usage_one_row_per_period unique (user_id, period_start)
);

create index if not exists monthly_usage_user_id_period_start_idx
on public.monthly_usage (user_id, period_start desc);

drop trigger if exists set_monthly_usage_updated_at on public.monthly_usage;

create trigger set_monthly_usage_updated_at
before update on public.monthly_usage
for each row
execute function public.set_updated_at();

insert into public.monthly_usage (user_id, period_start)
select p.id, date_trunc('month', current_date)::date
from public.profiles p
on conflict (user_id, period_start) do nothing;

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  status text not null default 'completed',
  resource_type text,
  resource_id uuid,
  created_at timestamptz not null default now(),
  constraint activity_events_event_type_not_blank check (char_length(btrim(event_type)) > 0),
  constraint activity_events_title_not_blank check (char_length(btrim(title)) > 0),
  constraint activity_events_status_check check (status in ('completed', 'in_progress', 'failed'))
);

create index if not exists activity_events_user_id_created_at_idx
on public.activity_events (user_id, created_at desc);

comment on table public.monthly_usage is 'Per-user monthly counters. Updated only by trusted server-side code.';
comment on table public.activity_events is 'Dashboard activity feed written by trusted server-side code.';
