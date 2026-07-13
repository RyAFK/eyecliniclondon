create table if not exists public.education_resources (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('cpd_event', 'article', 'clinic_news')),
  title text not null,
  description text,
  url text not null,
  cpd_points integer,
  event_date timestamptz,
  event_location text,
  speakers text,
  published_at timestamptz not null default now()
);

comment on table public.education_resources is 'CPD events, clinic news, and educational articles shown to referring partners.';

create index if not exists education_resources_type_idx on public.education_resources (type, published_at desc);
