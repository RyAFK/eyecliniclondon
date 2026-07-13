-- Append-only audit log. No update/delete grants are given to any role
-- (see RLS in 0012) — rows are written exclusively by triggers or
-- server-side code using the service-role client.
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  practice_id uuid references public.practices (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_log is 'Append-only audit trail. No UPDATE/DELETE policy is ever granted on this table.';

create index if not exists audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index if not exists audit_log_practice_idx on public.audit_log (practice_id, created_at desc);
