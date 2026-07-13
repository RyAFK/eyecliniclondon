create type public.task_priority as enum ('low', 'medium', 'high');
create type public.task_status as enum ('open', 'in_progress', 'done');

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  description text,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'open',
  referral_id uuid references public.referrals (id) on delete set null,
  practice_id uuid references public.practices (id) on delete set null,
  assigned_to_user_id uuid not null references public.profiles (id) on delete restrict,
  created_by_user_id uuid not null references public.profiles (id) on delete restrict,
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tasks is 'Internal ECL staff task/follow-up tracking, optionally linked to a referral or practice.';

create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to_user_id, status);
create index if not exists tasks_referral_id_idx on public.tasks (referral_id);
