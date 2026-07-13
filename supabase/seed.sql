-- ---------------------------------------------------------------------------
-- Baseline seed data — safe to run against ANY environment (local, staging,
-- or a fresh production project). Contains no patient data and no auth
-- users. For synthetic patients/referrals/staff logins to exercise the full
-- app locally, run supabase/seed_dev_users.sql afterwards (local dev only —
-- see the warning at the top of that file).
-- ---------------------------------------------------------------------------

insert into public.practices (id, name, address_line1, city, postcode, phone, email, active) values
  ('a0000000-0000-4000-8000-000000000001', 'Keith Holland Opticians', '142 High Street', 'London', 'NW3 1AA', '020 7946 0100', 'referrals@keithhollandopticians.co.uk', true),
  ('a0000000-0000-4000-8000-000000000002', 'Vision Plus Opticians', '58 Kensington Church Street', 'London', 'W8 4DP', '020 7946 0200', 'admin@visionplusopticians.co.uk', true),
  ('a0000000-0000-4000-8000-000000000003', 'Marylebone Eyecare', '21 Marylebone Lane', 'London', 'W1U 2NT', '020 7946 0300', 'hello@maryleboneeyecare.co.uk', true),
  ('a0000000-0000-4000-8000-000000000004', 'City Optical', '9 Moorgate', 'London', 'EC2R 6DA', '020 7946 0400', 'referrals@cityoptical.co.uk', true),
  ('a0000000-0000-4000-8000-000000000005', 'ClearSight Chelsea', '77 Kings Road', 'London', 'SW3 4NX', '020 7946 0500', 'team@clearsightchelsea.co.uk', true)
on conflict (id) do nothing;

insert into public.education_resources (type, title, description, url, cpd_points, event_date, event_location, speakers) values
  ('cpd_event', 'Understanding the Evolution & Clinical Impact of Modern Dry Eye Guidelines', '4 CPD points', 'https://www.eventbrite.com/e/understanding-the-evolution-clinical-impact-of-modern-dry-eye-guidelines-tickets-1993458759813?aff=oddtdtcreator', 4, '2026-07-21 18:30:00+01', '7 Devonshire St', 'Mr Samer Hamada · Louise Veenhuis'),
  ('clinic_news', 'Mr Samer Hamada attended CroOphthaCon 2026 in Solin, Croatia', 'Connecting with the Croatian ophthalmology community.', 'https://www.linkedin.com/in/samer-hamada-b980621b', null, null, null, null),
  ('clinic_news', 'Back from the 5th International Dry Eye Congress in Naples', 'Continuing work on ocular surface disease.', 'https://www.linkedin.com/in/samer-hamada-b980621b', null, null, null, null),
  ('article', 'Launch of the Ocular Surface Academy (OSA)', 'A new platform for international ophthalmology education.', 'https://www.linkedin.com/in/samer-hamada-b980621b', null, null, null, null)
on conflict do nothing;
