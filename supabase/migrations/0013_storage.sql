-- Private storage bucket for clinical referral documents. `public` is
-- explicitly false — documents are only ever reachable via short-lived
-- signed URLs generated server-side after an authorization check, never a
-- public/CDN URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'referral-documents',
  'referral-documents',
  false,
  26214400, -- 25MB
  array['application/pdf', 'image/jpeg', 'image/png', 'image/heic']
)
on conflict (id) do update set public = false;

-- Storage object paths are namespaced as `<referral_id>/<filename>`, so
-- these policies join back to public.referrals to enforce the same
-- practice-scoping used everywhere else.
create policy "staff read all referral documents in storage"
  on storage.objects for select
  using (
    bucket_id = 'referral-documents'
    and public.is_staff()
  );

create policy "partner reads own practice referral documents in storage"
  on storage.objects for select
  using (
    bucket_id = 'referral-documents'
    and exists (
      select 1 from public.referrals r
      where r.id::text = (storage.foldername(name))[1]
        and r.practice_id = public.current_user_practice_id()
    )
  );

create policy "partner uploads to own practice referral folder"
  on storage.objects for insert
  with check (
    bucket_id = 'referral-documents'
    and exists (
      select 1 from public.referrals r
      where r.id::text = (storage.foldername(name))[1]
        and r.practice_id = public.current_user_practice_id()
    )
  );

create policy "staff uploads referral documents"
  on storage.objects for insert
  with check (bucket_id = 'referral-documents' and public.is_staff());
