create table if not exists public.plans (
  id text primary key,
  display_name text not null,
  audience text not null default 'all',
  monthly_price_cents integer not null default 0,
  currency text not null default 'USD',
  daily_ai_request_limit integer,
  monthly_ai_request_limit integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint plans_audience_check check (audience in ('all', 'student', 'teacher')),
  constraint plans_price_check check (monthly_price_cents >= 0),
  constraint plans_currency_check check (char_length(currency) = 3),
  constraint plans_daily_limit_check check (daily_ai_request_limit is null or daily_ai_request_limit >= 0),
  constraint plans_monthly_limit_check check (monthly_ai_request_limit is null or monthly_ai_request_limit >= 0)
);

insert into public.plans (
  id,
  display_name,
  audience,
  monthly_price_cents,
  daily_ai_request_limit,
  monthly_ai_request_limit
)
values
  ('free', 'Free', 'all', 0, 10, 300),
  ('student_premium', 'Student Premium', 'student', 499, null, 1000),
  ('teacher', 'Teacher Plan', 'teacher', 799, null, 2500)
on conflict (id) do update
set
  display_name = excluded.display_name,
  audience = excluded.audience,
  monthly_price_cents = excluded.monthly_price_cents,
  daily_ai_request_limit = excluded.daily_ai_request_limit,
  monthly_ai_request_limit = excluded.monthly_ai_request_limit;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.plans(id) on delete restrict,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  canceled_at timestamptz,
  provider text not null default 'manual',
  external_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_status_check check (status in ('active', 'trialing', 'canceled', 'past_due', 'expired'))
);

create unique index if not exists subscriptions_one_current_plan_per_user_idx
on public.subscriptions (user_id)
where status in ('active', 'trialing');

create index if not exists subscriptions_user_id_started_at_idx
on public.subscriptions (user_id, started_at desc);

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

insert into public.subscriptions (user_id, plan_id, status)
select
  p.id,
  case when p.subscription_plan = 'premium' then 'student_premium' else 'free' end,
  'active'
from public.profiles p
where not exists (
  select 1
  from public.subscriptions s
  where s.user_id = p.id
    and s.status in ('active', 'trialing')
);

comment on table public.plans is 'Subscription plan catalog visible to the frontend.';
comment on table public.subscriptions is 'Subscription history. Current plan is active or trialing.';
