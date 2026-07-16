-- Referral source tracking (RefertoRyan Referral Assistant, section 9) and
-- partner notification preferences (section 13).

create type public.referral_source as enum ('direct', 'referral_assistant');

alter table public.referrals
  add column if not exists source public.referral_source not null default 'direct';

comment on column public.referrals.source is
  'How the referral was initiated. "referral_assistant" means the referrer used the non-diagnostic pathway guidance tool before submitting.';

-- Partner-controlled notification preferences. Keys are intentionally the
-- same camelCase shape as the app-level NotificationPreferences type
-- (types/user.ts) — this column is an opaque per-user settings blob, not a
-- relational structure, so there is no snake_case mapping layer for it.
alter table public.profiles
  add column if not exists notification_preferences jsonb not null default
    '{"referralUpdates": true, "cpdInvitations": true, "clinicNews": true}'::jsonb;

comment on column public.profiles.notification_preferences is
  'Partner-controlled notification opt-in/out flags. Read/written only through the "user updates own profile" RLS policy.';

-- Re-create the status-change trigger function so referral status update
-- notifications respect the recipient's `referralUpdates` preference. Every
-- other clause is unchanged from 0011_functions_triggers.sql.
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
      jsonb_build_object('reference', new.reference, 'treatment_type', new.treatment_type, 'source', new.source));

  elsif tg_op = 'UPDATE' and (new.journey_status is distinct from old.journey_status or new.outcome is distinct from old.outcome) then
    insert into public.referral_status_history (referral_id, from_status, to_status, outcome, changed_by_user_id)
    values (new.id, old.journey_status, new.journey_status, new.outcome, coalesce(auth.uid(), new.created_by_user_id));

    insert into public.audit_log (actor_user_id, action, entity_type, entity_id, practice_id, metadata)
    values (coalesce(auth.uid(), new.created_by_user_id), 'referral.status_changed', 'referral', new.id, new.practice_id,
      jsonb_build_object('from_status', old.journey_status, 'to_status', new.journey_status, 'outcome', new.outcome));

    -- Notify the referring practice's users of the change, unless a given
    -- user has switched off referral-update notifications in their profile.
    insert into public.notifications (user_id, type, title, body, referral_id)
    select p.id, 'referral_status_change',
      case when new.journey_status = 'closed' then 'Referral closed' else 'Referral status updated' end,
      new.patient_first_name || ' ' || left(new.patient_last_name, 1) || '. — now ' || replace(new.journey_status::text, '_', ' '),
      new.id
    from public.profiles p
    where p.practice_id = new.practice_id
      and p.active
      and coalesce((p.notification_preferences ->> 'referralUpdates')::boolean, true);
  end if;

  return new;
end;
$$;
