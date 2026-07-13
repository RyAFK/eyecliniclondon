-- ---------------------------------------------------------------------------
-- LOCAL DEVELOPMENT ONLY. Do not run this against a staging or production
-- Supabase project — it inserts directly into auth.users with a well-known
-- placeholder password ("Passw0rd!demo") purely so `supabase start` +
-- `npm run dev` gives you working logins to click through the app.
--
-- Run with the Supabase CLI against your local stack only:
--   supabase db execute --file supabase/seed.sql
--   supabase db execute --file supabase/seed_dev_users.sql
--
-- Every patient/referral row below is entirely fictional.
-- ---------------------------------------------------------------------------

do $$
declare
  -- Supabase's local auth schema no longer guarantees an auth.instances
  -- table across versions, so this uses gotrue's well-known default
  -- instance id directly rather than querying for it.
  v_instance_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token
  ) values
    (v_instance_id, 'b0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated',
     'jane.whitfield@keithhollandopticians.co.uk', crypt('Passw0rd!demo', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Jane Whitfield","role":"partner_admin","practice_id":"a0000000-0000-4000-8000-000000000001"}',
     now(), now(), '', ''),
    (v_instance_id, 'b0000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated',
     'admin@visionplusopticians.co.uk', crypt('Passw0rd!demo', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Anand","role":"partner_user","practice_id":"a0000000-0000-4000-8000-000000000002"}',
     now(), now(), '', ''),
    (v_instance_id, 'b0000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated',
     'ryan@eyecliniclondon.com', crypt('Passw0rd!demo', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Ryan (Business Development)","role":"ecl_admin"}',
     now(), now(), '', ''),
    (v_instance_id, 'b0000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated',
     'clinic.coordinator@eyecliniclondon.com', crypt('Passw0rd!demo', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', '{"full_name":"Sophie Marchetti","role":"ecl_staff"}',
     now(), now(), '', '')
  on conflict (id) do nothing;
end $$;

-- The handle_new_auth_user() trigger (0003) creates a matching profiles row
-- for each user above but leaves partner accounts inactive by default;
-- activate the demo accounts so they can sign in immediately.
update public.profiles set active = true
where id in (
  'b0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003',
  'b0000000-0000-4000-8000-000000000004'
);

-- Fictional referrals across the full journey/outcome matrix, so every
-- dashboard view (funnel, fees, partner leaderboard, closed-outcome mix)
-- has something to render.
insert into public.referrals (
  id, practice_id, created_by_user_id, patient_first_name, patient_last_name, patient_dob,
  patient_phone, preferred_contact_method, patient_consent, treatment_type,
  journey_status, outcome, fee_amount, fee_status, created_at
) values
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Sarah', 'Jennings', '1975-04-02', '020 7946 0958', 'either', true, 'cataract', 'consultation_booked', null, 150, 'pending', now() - interval '5 days'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Michael', 'Torres', '1968-11-19', '020 7946 0958', 'either', true, 'icl', 'treatment_recommended', null, 200, 'pending', now() - interval '8 days'),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Priya', 'Khatri', '1990-01-30', '020 7946 0958', 'either', true, 'dry_eye', 'referral_received', null, 80, 'not_eligible', now() - interval '11 days'),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'David', 'Okafor', '1982-07-08', '020 7946 0958', 'either', true, 'lvc', 'treatment_completed', null, 200, 'invoiced', now() - interval '15 days'),
  ('c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'Aisha', 'Rahman', '1985-09-14', '020 7946 0958', 'either', true, 'general', 'awaiting_consultation', null, 90, 'not_eligible', now() - interval '7 days'),
  ('c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Tom', 'Wu', '1979-03-25', '020 7946 0958', 'either', true, 'cornea', 'awaiting_consultation', null, 120, 'not_eligible', now() - interval '6 days'),
  ('c0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'Grace', 'Lindqvist', '1993-02-11', '020 7946 0958', 'either', true, 'lvc', 'consultation_booked', null, 200, 'pending', now() - interval '3 days'),
  ('c0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'Omar', 'Farouk', '1988-06-17', '020 7946 0958', 'either', true, 'rle', 'consultation_booked', null, 180, 'pending', now() - interval '2 days'),
  ('c0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Helen', 'Sorensen', '1971-12-05', '020 7946 0958', 'either', true, 'cataract', 'treatment_booked', null, 150, 'pending', now() - interval '20 days'),
  ('c0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'Ruth', 'Abara', '1965-05-22', '020 7946 0958', 'either', true, 'cataract', 'closed', 'treatment_successful', 150, 'paid', now() - interval '40 days'),
  ('c0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'Nadia', 'Haddad', '1980-08-09', '020 7946 0958', 'either', true, 'dry_eye', 'closed', 'treatment_successful', 80, 'paid', now() - interval '38 days'),
  ('c0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'Ben', 'Coleman', '1977-10-30', '020 7946 0958', 'either', true, 'general', 'closed', 'referred_elsewhere', 0, 'not_eligible', now() - interval '33 days'),
  ('c0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'James', 'Kowalski', '1986-04-18', '020 7946 0958', 'either', true, 'dry_eye', 'treatment_completed', null, 80, 'invoiced', now() - interval '23 days'),
  ('c0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Linda', 'Marsh', '1969-01-27', '020 7946 0958', 'either', true, 'cataract', 'closed', 'treatment_successful', 150, 'paid', now() - interval '27 days'),
  ('c0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Fatima', 'Siddiqui', '1991-11-02', '020 7946 0958', 'either', true, 'dry_eye', 'closed', 'did_not_attend', 0, 'not_eligible', now() - interval '30 days'),
  ('c0000000-0000-4000-8000-000000000016', 'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'Peter', 'Vance', '1974-06-13', '020 7946 0958', 'either', true, 'icl', 'closed', 'patient_declined', 0, 'not_eligible', now() - interval '29 days'),
  ('c0000000-0000-4000-8000-000000000017', 'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'Olivia', 'Bright', '1983-09-21', '020 7946 0958', 'either', true, 'cornea', 'closed', 'clinically_unsuitable', 0, 'not_eligible', now() - interval '35 days'),
  ('c0000000-0000-4000-8000-000000000018', 'a0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000001', 'Chidi', 'Eze', '1987-02-14', '020 7946 0958', 'either', true, 'rle', 'awaiting_consultation', null, 180, 'not_eligible', now() - interval '4 days'),
  ('c0000000-0000-4000-8000-000000000019', 'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Isabelle', 'Farrow', '1995-03-08', '020 7946 0958', 'either', true, 'general', 'referral_received', null, 90, 'not_eligible', now() - interval '1 days'),
  ('c0000000-0000-4000-8000-000000000020', 'a0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Marcus', 'Lindberg', '1972-07-19', '020 7946 0958', 'either', true, 'lvc', 'treatment_recommended', null, 200, 'pending', now() - interval '9 days')
on conflict (id) do nothing;

insert into public.tasks (title, description, priority, status, practice_id, referral_id, assigned_to_user_id, created_by_user_id, due_date) values
  ('Chase two stalled cataract referrals', 'Follow up with ClearSight Chelsea on referrals booked but not yet attended.', 'high', 'open', 'a0000000-0000-4000-8000-000000000005', null, 'b0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', now() + interval '2 days'),
  ('Send priority appointment leaflets to Vision Plus Opticians', null, 'medium', 'in_progress', 'a0000000-0000-4000-8000-000000000002', null, 'b0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', now() + interval '5 days'),
  ('Confirm invoice for David Okafor referral fee', null, 'medium', 'open', 'a0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000003', now() + interval '1 days')
on conflict do nothing;
