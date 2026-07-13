-- Profiles: one row per Supabase Auth user (auth.users.id = profiles.id).
-- Role and practice_id drive every authorization decision in the app and
-- in RLS policies (see 0012_rls_policies.sql).
create type public.user_role as enum ('partner_user', 'partner_admin', 'ecl_staff', 'ecl_admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.user_role not null,
  -- Immutable in practice: only ever set at creation for partner roles.
  -- Null for ecl_staff / ecl_admin, who are not scoped to a single practice.
  practice_id uuid references public.practices (id) on delete restrict,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Active partner accounts must be scoped to a practice; a newly-created
  -- partner profile is inactive until an ECL admin assigns practice_id.
  constraint partner_requires_practice check (
    role not in ('partner_user', 'partner_admin') or practice_id is not null or active = false
  )
);

comment on table public.profiles is 'App-level identity for each Supabase Auth user: role + immutable practice scope.';

create index if not exists profiles_practice_id_idx on public.profiles (practice_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- Convenience function used throughout RLS policies.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_practice_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select practice_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('ecl_staff', 'ecl_admin'), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'ecl_admin', false);
$$;

-- Auto-create a profile row when a new Supabase Auth user is confirmed.
-- Role/practice defaults to partner_user with no practice; an ECL admin
-- must assign the correct practice_id and role before the account is usable
-- (enforced by the partner_requires_practice check above, and by app-side
-- onboarding which blocks partner sign-in until practice_id is set).
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, practice_id, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'partner_user'),
    nullif(new.raw_user_meta_data ->> 'practice_id', '')::uuid,
    false -- inactive until an admin assigns a practice / confirms the role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
