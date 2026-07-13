/**
 * Roles map 1:1 to Postgres RLS checks (see supabase/migrations/0003_profiles.sql
 * and 0012_rls_policies.sql) — they are enforced server-side, not just in the UI.
 *
 * - partner_user:  can create/view referrals for their own practice only
 * - partner_admin: partner_user + manage other users at their practice
 * - ecl_staff:     can view/manage all referrals, tasks, and partners
 * - ecl_admin:     ecl_staff + fee management, audit log, user administration
 */
export type UserRole = 'partner_user' | 'partner_admin' | 'ecl_staff' | 'ecl_admin';

export const STAFF_ROLES: UserRole[] = ['ecl_staff', 'ecl_admin'];
export const PARTNER_ROLES: UserRole[] = ['partner_user', 'partner_admin'];

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function isPartnerRole(role: UserRole): boolean {
  return PARTNER_ROLES.includes(role);
}

/** Mirrors the `profiles` table — one row per Supabase Auth user. */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** Immutable FK to practices.id. Null for ECL staff/admin accounts. */
  practiceId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
