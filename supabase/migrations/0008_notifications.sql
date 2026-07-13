create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  referral_id uuid references public.referrals (id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'Per-user notification feed (status changes, tasks, CPD events, system messages).';

create index if not exists notifications_user_id_idx on public.notifications (user_id, read, created_at desc);
