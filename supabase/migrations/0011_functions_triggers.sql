-- Generic updated_at maintenance -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.practices;
create trigger set_updated_at before update on public.practices
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.referrals;
create trigger set_updated_at before update on public.referrals
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.tasks;
create trigger set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- Server-side reference generation -----------------------------------------------
-- Referral references are NEVER accepted from the client. This function is
-- the only place a reference is produced, guaranteeing uniqueness and format.
create sequence if not exists public.referral_reference_seq start 100001;

create or replace function public.generate_referral_reference()
returns text
language sql
as $$
  select 'ECL-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.referral_reference_seq')::text, 6, '0');
$$;

create or replace function public.set_referral_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := public.generate_referral_reference();
  end if;
  if new.patient_consent then
    new.consent_confirmed_at := coalesce(new.consent_confirmed_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists set_referral_reference on public.referrals;
create trigger set_referral_reference before insert on public.referrals
  for each row execute function public.set_referral_reference();

-- Status history + notifications on journey_status change -----------------------
create or replace function public.record_referral_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.referral_status_history (referral_id, from_status, to_status, outcome, changed_by_user_id)
    values (new.id, null, new.journey_status, new.outcome, new.created_by_user_id);

    insert into public.audit_log (actor_user_id, action, entity_type, entity_id, practice_id, metadata)
    values (new.created_by_user_id, 'referral.created', 'referral', new.id, new.practice_id,
      jsonb_build_object('reference', new.reference, 'treatment_type', new.treatment_type));

  elsif tg_op = 'UPDATE' and (new.journey_status is distinct from old.journey_status or new.outcome is distinct from old.outcome) then
    insert into public.referral_status_history (referral_id, from_status, to_status, outcome, changed_by_user_id)
    values (new.id, old.journey_status, new.journey_status, new.outcome, coalesce(auth.uid(), new.created_by_user_id));

    insert into public.audit_log (actor_user_id, action, entity_type, entity_id, practice_id, metadata)
    values (coalesce(auth.uid(), new.created_by_user_id), 'referral.status_changed', 'referral', new.id, new.practice_id,
      jsonb_build_object('from_status', old.journey_status, 'to_status', new.journey_status, 'outcome', new.outcome));

    -- Notify the referring practice's users of the change.
    insert into public.notifications (user_id, type, title, body, referral_id)
    select p.id, 'referral_status_change',
      case when new.journey_status = 'closed' then 'Referral closed' else 'Referral status updated' end,
      new.patient_first_name || ' ' || left(new.patient_last_name, 1) || '. — now ' || replace(new.journey_status::text, '_', ' '),
      new.id
    from public.profiles p
    where p.practice_id = new.practice_id and p.active;
  end if;

  return new;
end;
$$;

drop trigger if exists record_referral_status_change on public.referrals;
create trigger record_referral_status_change after insert or update on public.referrals
  for each row execute function public.record_referral_status_change();

-- Audit fee status changes -------------------------------------------------------
create or replace function public.record_fee_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.fee_status is distinct from old.fee_status then
    insert into public.audit_log (actor_user_id, action, entity_type, entity_id, practice_id, metadata)
    values (auth.uid(), 'fee.status_changed', 'referral', new.id, new.practice_id,
      jsonb_build_object('from_status', old.fee_status, 'to_status', new.fee_status, 'fee_amount', new.fee_amount));
  end if;
  return new;
end;
$$;

drop trigger if exists record_fee_status_change on public.referrals;
create trigger record_fee_status_change after update on public.referrals
  for each row execute function public.record_fee_status_change();
