-- Append-only journey timeline, powering the visual patient journey timeline
-- in the UI and giving a full audit trail of who moved a referral and when.
create table if not exists public.referral_status_history (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals (id) on delete cascade,
  from_status public.journey_status,
  to_status public.journey_status not null,
  outcome public.referral_outcome,
  note text,
  changed_by_user_id uuid not null references public.profiles (id) on delete restrict,
  changed_at timestamptz not null default now()
);

comment on table public.referral_status_history is 'Append-only audit trail of journey_status transitions per referral.';

create index if not exists referral_status_history_referral_id_idx on public.referral_status_history (referral_id, changed_at);
