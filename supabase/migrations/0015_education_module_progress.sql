-- Per-user completion tracking for the Clinical Education Hub (module
-- content itself is static/editorial — see lib/education-modules.ts — so
-- only progress needs a table; module_id is a stable string id from that
-- file, not a foreign key into education_resources).
create table if not exists public.education_module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_id text not null,
  knowledge_check_score integer,
  knowledge_check_total integer,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);

comment on table public.education_module_progress is 'Per-user completion state for static Clinical Education Hub modules.';

create index if not exists education_module_progress_user_id_idx on public.education_module_progress (user_id);

alter table public.education_module_progress enable row level security;

create policy "user reads own module progress" on public.education_module_progress
  for select using (user_id = auth.uid());

create policy "user manages own module progress" on public.education_module_progress
  for insert with check (user_id = auth.uid());

create policy "user updates own module progress" on public.education_module_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "staff read all module progress" on public.education_module_progress
  for select using (public.is_staff());

drop trigger if exists set_updated_at on public.education_module_progress;
create trigger set_updated_at before update on public.education_module_progress
  for each row execute function public.set_updated_at();
