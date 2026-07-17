# Eye Clinic London — Referral Portal

A referral management platform for Eye Clinic London (ECL): referring practices (opticians) submit and track patient referrals, and ECL staff manage the referral pipeline, partner relationships, referral fees, and clinic analytics from a single canonical dataset.

Built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Zod, Supabase (Postgres + Auth + Storage + Row Level Security), and Recharts.

## Contents

- [Quick start (demo mode)](#quick-start-demo-mode)
- [Running against real Supabase](#running-against-real-supabase)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Access control](#access-control)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Security notes](#security-notes)

## Quick start (demo mode)

Demo mode serves fictional in-memory data and a simplified sign-in flow — no Supabase project required. It's the fastest way to click through every feature.

```bash
npm install
cp .env.example .env.local
# .env.local already defaults to NEXT_PUBLIC_DEMO_MODE=true — edit
# NEXT_PUBLIC_DEMO_STAFF_CODE to a value of your choosing.
npm run dev
```

Open http://localhost:3000. From the sign-in screen:

- **Referring partner** → enter any email → "Continue to dashboard" (demo mode skips real email delivery and signs you in as a sample referring practice).
- **Clinic team** → enter the value you set for `NEXT_PUBLIC_DEMO_STAFF_CODE`.

Demo mode data lives in [`lib/demo/data.ts`](lib/demo/data.ts) (fictional practices, referrals, tasks, notifications) and is mutated in-memory via [`lib/demo/store.ts`](lib/demo/store.ts) — refresh-safe within a single dev server process, reset on restart.

## Running against real Supabase

1. **Create a Supabase project** and note its URL, anon key, and service role key (Project Settings → API).
2. **Apply the migrations** in `supabase/migrations/` in order, either via the Supabase CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   or by running each `.sql` file in the Supabase SQL editor in numeric order.
3. **Seed baseline data** (safe for any environment — practices + CPD/news content, no auth users):
   ```bash
   supabase db execute --file supabase/seed.sql
   ```
4. **(Local dev only)** create fictional auth users + referrals so you have real logins to test with:
   ```bash
   supabase db execute --file supabase/seed_dev_users.sql
   ```
   Do **not** run `seed_dev_users.sql` against a staging or production project — see the warning at the top of that file.
5. **Create real staff/partner accounts** for production via Supabase Auth (invite by email), then have an `ecl_admin` set each partner's `practice_id` and `role` in the `profiles` table (or build an internal admin tool on top of `services/users.service.ts` — not included in this build) and set `active = true`.
6. Copy `.env.example` → `.env.local`, set `NEXT_PUBLIC_DEMO_MODE=false`, and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
7. `npm run dev`.

## Project structure

```
/app                     Next.js App Router routes
  /login                 Public sign-in
  /dashboard             Partner-facing area (requires practice_id)
    /refer                 5-step referral wizard
    /referrals              "My referrals" + stat drilldowns
    /insights                Practice-level analytics
    /education               CPD events & clinic news
    /referral-assistant        Non-diagnostic pathway guidance -> pre-fills /refer
    /notifications            Notification inbox
    /account                   Profile + notification preferences
  /staff                  ECL staff area (requires ecl_staff/ecl_admin)
    /analytics /referrals /referrals/[id] /partners /partners/[id]
    /tasks /fees /audit (ecl_admin only)
  /api/upload             Clinical document upload → private storage
/components
  /auth /dashboard /referrals /partners(via staff) /analytics
  /education /notifications /ui /staff /layout
/lib
  auth.ts                 getCurrentUser/requireUser/requireRole/canAccessPractice
  theme.ts                 Design-system colour tokens (day/night via CSS vars)
  /supabase                 browser / server / middleware Supabase clients
  /validation                Zod schemas
  /demo                       Demo-mode config, fictional data, in-memory store
  /actions                     Server Actions (referrals, tasks, notifications, auth)
/services                  Data-access layer: one function set per domain,
                            Supabase-backed with a demo-mode fallback, always
                            scoped through lib/auth.ts's access-control checks
/types                      Canonical TypeScript data model + hand-mirrored
                            Supabase Database type
/supabase
  /migrations               Numbered SQL migrations (schema, triggers, RLS, storage)
  seed.sql                    Environment-safe baseline seed
  seed_dev_users.sql           LOCAL DEV ONLY fictional auth users + referrals
```

## Data model

Every dashboard — partner insights, the ECL staff BD summary, the analytics tab, the fee ledger — reads from **one** function, `referralsService.listReferrals()`, and derives every number from the pure aggregation functions in `services/analytics.service.ts`. There are no parallel hard-coded copies of referral counts or revenue figures anywhere in the UI.

The central design decision is that **journey status and outcome are separate fields**:

- `journeyStatus` (`referral_received` → … → `closed`) answers *"where is this referral in the clinic pipeline right now?"*
- `outcome` (`treatment_successful`, `ongoing_care`, `patient_declined`, `did_not_attend`, `clinically_unsuitable`, `referred_elsewhere`, `other`) answers *"why did a closed referral end the way it did?"* and is only ever set once `journeyStatus = 'closed'` (enforced by a Postgres check constraint).

This means a closed referral is not automatically reported as "lost" — see `services/analytics.service.ts#outcomeBreakdown` and the "Closed referral outcomes" panel on `/staff/analytics`.

Referral references (`ECL-2026-000123`) are always generated server-side — by a Postgres trigger in live mode (`supabase/migrations/0011_functions_triggers.sql`), or by `lib/demo/store.ts` in demo mode — never accepted from client input.

## Access control

- **Practice scoping uses immutable practice `id` (UUID), never practice `name`.** `lib/auth.ts#canAccessPractice` is the single app-side check; it's mirrored — not replaced — by Postgres Row Level Security policies in `supabase/migrations/0012_rls_policies.sql`, so a bug in one layer doesn't expose another practice's data.
- Roles: `partner_user`, `partner_admin`, `ecl_staff`, `ecl_admin` (`types/user.ts`). Partners can create referrals for their own practice and read their own practice's data; they cannot change a referral's journey status, outcome, or fee status. Only ECL staff/admin can. Only `ecl_admin` can read the audit log.
- A Postgres trigger (`prevent_self_privilege_escalation`) blocks a user from changing their own `role`, `practice_id`, or `active` flag even though they're allowed to update their own profile row for other fields.
- Clinical documents live in a **private** Supabase Storage bucket (`referral-documents`, `public = false`). They are only ever fetched via a short-lived signed URL generated server-side after an authorization check (`services/documents.service.ts#getSignedDownloadUrl`) — never a public URL.
- `audit_log` has no client-facing INSERT/UPDATE/DELETE policy at all; rows are written exclusively by database triggers or server-side code, making it genuinely append-only.

## Environment variables

See [`.env.example`](.env.example) for the full list and inline documentation. Highlights:

- `NEXT_PUBLIC_DEMO_MODE` — see [`lib/demo/config.ts`](lib/demo/config.ts). Hard-gated off in production builds unless `NEXT_PUBLIC_ALLOW_DEMO_IN_PRODUCTION=true` is also explicitly set, so a stray `true` left in a `.env` file cannot accidentally enable a fake-auth demo build in production.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — it is never read from client code and is not prefixed `NEXT_PUBLIC_`.
- No password, API key, or secret in this repository has a real value; every credential-shaped field in `.env.example` is a placeholder.

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start          # run the production build
npm run lint             # eslint
npm run typecheck          # tsc --noEmit
npm run test                 # vitest
npm run db:migrate             # supabase db push (requires supabase CLI + linked project)
npm run db:seed                  # supabase db execute --file supabase/seed.sql
```

## Security notes

- No hard-coded production passwords or secrets anywhere in this codebase.
- The former prototype's "Bypass sign-in (preview)" button and hard-coded `ecl1234` staff code have been removed entirely. The only comparable affordance — the demo-mode team code — is read from an environment variable, is not shown in the login UI unless `NEXT_PUBLIC_DEMO_MODE` is true, and demo mode itself cannot activate in a production build without an explicit second opt-in flag (see above).
- Patient consent defaults to **false** everywhere (wizard state, Zod schema, and a Postgres check constraint `consent_required check (patient_consent = true)`) — a referral cannot be created without it.
- No patient data is pre-filled in the referral wizard; every field starts empty.
- UUIDs are used for every database record's primary key.

## What requires external credentials to go live

- A real Supabase project (URL, anon key, service role key) — see [Running against real Supabase](#running-against-real-supabase).
- Supabase Auth email provider configuration (or a transactional email provider wired into Supabase) to actually deliver one-time sign-in codes to partners in live mode.
- DNS/hosting for `NEXT_PUBLIC_SITE_URL` if deployed beyond `localhost`.
