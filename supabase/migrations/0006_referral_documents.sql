-- Metadata for clinical documents. The files themselves live in the private
-- `referral-documents` storage bucket (see 0013_storage.sql) — never a
-- public bucket, and never referenced by a public URL. Access is via signed
-- URLs generated server-side after an RLS/authorization check.
create table if not exists public.referral_documents (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals (id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400), -- 25MB
  uploaded_by_user_id uuid not null references public.profiles (id) on delete restrict,
  uploaded_at timestamptz not null default now()
);

comment on table public.referral_documents is 'Metadata for private clinical documents stored in Supabase Storage (private bucket only).';

create index if not exists referral_documents_referral_id_idx on public.referral_documents (referral_id);
