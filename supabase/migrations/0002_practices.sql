-- Practices: the immutable security boundary for partner data.
-- `id` (uuid) is what every other table references and what RLS checks
-- against — never `name`, which staff can rename freely.
create table if not exists public.practices (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  phone text,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.practices is 'Referring practices (opticians). id is the immutable access-control boundary.';

create index if not exists practices_active_idx on public.practices (active);
