-- Row Level Security. This is the real access-control boundary: the app
-- layer (lib/auth.ts, services/*.ts) mirrors these rules for good UX and
-- defence-in-depth, but every policy below is what actually protects the
-- data if the app layer has a bug.

alter table public.practices enable row level security;
alter table public.profiles enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_status_history enable row level security;
alter table public.referral_documents enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.education_resources enable row level security;
alter table public.audit_log enable row level security;

-- practices --------------------------------------------------------------------
create policy "staff read all practices" on public.practices
  for select using (public.is_staff());

create policy "partner reads own practice" on public.practices
  for select using (id = public.current_user_practice_id());

create policy "admin manages practices" on public.practices
  for all using (public.is_admin()) with check (public.is_admin());

-- profiles -----------------------------------------------------------------------
create policy "user reads own profile" on public.profiles
  for select using (id = auth.uid());

create policy "staff reads all profiles" on public.profiles
  for select using (public.is_staff());

create policy "partner admin reads own practice profiles" on public.profiles
  for select using (
    practice_id is not null
    and practice_id = public.current_user_practice_id()
  );

create policy "user updates own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "admin manages profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Prevent a non-admin from granting themselves a different role, practice, or
-- reactivating/deactivating their own account via the "update own profile" policy above.
create or replace function public.prevent_self_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.practice_id is distinct from old.practice_id
     or new.active is distinct from old.active then
    raise exception 'Only an ECL admin can change role, practice_id, or active status.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_self_privilege_escalation on public.profiles;
create trigger prevent_self_privilege_escalation before update on public.profiles
  for each row execute function public.prevent_self_privilege_escalation();

-- referrals ------------------------------------------------------------------------
create policy "staff read all referrals" on public.referrals
  for select using (public.is_staff());

create policy "partner reads own practice referrals" on public.referrals
  for select using (practice_id = public.current_user_practice_id());

create policy "partner creates referral for own practice" on public.referrals
  for insert with check (
    practice_id = public.current_user_practice_id()
    and created_by_user_id = auth.uid()
  );

create policy "staff creates referral" on public.referrals
  for insert with check (public.is_staff());

create policy "staff updates referrals" on public.referrals
  for update using (public.is_staff()) with check (public.is_staff());

-- No UPDATE/DELETE policy for partner roles: once submitted, a referral's
-- journey/outcome/fee fields are managed exclusively by ECL staff. Partners
-- amend details by contacting the clinic, which preserves a clean audit trail.

-- referral_status_history -----------------------------------------------------------
create policy "staff read all status history" on public.referral_status_history
  for select using (public.is_staff());

create policy "partner reads own practice status history" on public.referral_status_history
  for select using (
    exists (
      select 1 from public.referrals r
      where r.id = referral_status_history.referral_id
        and r.practice_id = public.current_user_practice_id()
    )
  );

-- No direct INSERT policy: rows are written only by the
-- record_referral_status_change() trigger (0011), which runs with the
-- migration owner's privileges and therefore bypasses RLS.

-- referral_documents ----------------------------------------------------------------
create policy "staff read all documents" on public.referral_documents
  for select using (public.is_staff());

create policy "partner reads own practice documents" on public.referral_documents
  for select using (
    exists (
      select 1 from public.referrals r
      where r.id = referral_documents.referral_id
        and r.practice_id = public.current_user_practice_id()
    )
  );

create policy "partner uploads document to own practice referral" on public.referral_documents
  for insert with check (
    uploaded_by_user_id = auth.uid()
    and exists (
      select 1 from public.referrals r
      where r.id = referral_documents.referral_id
        and r.practice_id = public.current_user_practice_id()
    )
  );

create policy "staff uploads document" on public.referral_documents
  for insert with check (public.is_staff());

-- tasks (internal ECL staff only — partners have no access) -------------------------
create policy "staff manage tasks" on public.tasks
  for all using (public.is_staff()) with check (public.is_staff());

-- notifications -----------------------------------------------------------------------
create policy "user reads own notifications" on public.notifications
  for select using (user_id = auth.uid());

create policy "user marks own notifications read" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- No direct INSERT policy for regular roles: rows are created by the
-- record_referral_status_change() trigger or by server-side/service-role code.

-- education_resources -------------------------------------------------------------------
create policy "any signed-in user reads education resources" on public.education_resources
  for select using (auth.uid() is not null);

create policy "staff manage education resources" on public.education_resources
  for all using (public.is_staff()) with check (public.is_staff());

-- audit_log ----------------------------------------------------------------------------
create policy "admin reads audit log" on public.audit_log
  for select using (public.is_admin());

-- Intentionally no INSERT/UPDATE/DELETE policy for any application role —
-- audit_log rows are written exclusively by triggers (owner-privileged) or
-- server-side code using the service-role client. This keeps the log
-- genuinely append-only and tamper-resistant from the app's perspective.
