import 'server-only';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isDemoMode } from '@/lib/demo/config';
import { getDemoSessionUser } from '@/lib/demo/session';
import type { UserProfile, UserRole } from '@/types/user';
import { isStaffRole } from '@/types/user';

/**
 * Single entry point for "who is signed in" — every server component, route
 * handler, and server action should go through this rather than touching
 * Supabase Auth or the demo cookie directly. Authorization decisions (role,
 * practice access) are made here and re-checked by RLS at the database
 * layer, so a bug in either place alone cannot expose another practice's data.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isDemoMode()) {
    return getDemoSessionUser();
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || !profile.active) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role,
    practiceId: profile.practice_id,
    active: profile.active,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export async function requireUser(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<UserProfile> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(isStaffRole(user.role) ? '/staff' : '/dashboard');
  return user;
}

export async function requireStaff(): Promise<UserProfile> {
  const user = await requireUser();
  if (!isStaffRole(user.role)) redirect('/dashboard');
  return user;
}

export async function requirePartner(): Promise<UserProfile> {
  const user = await requireUser();
  if (isStaffRole(user.role)) redirect('/staff');
  if (!user.practiceId) redirect('/login');
  return user;
}

/**
 * The one place that decides whether `user` may read/write data belonging
 * to `practiceId`. Staff can access every practice; partner users are
 * bound to their own immutable `practiceId` — never to a practice *name*.
 * Mirrored by the RLS policies in supabase/migrations/0012_rls_policies.sql
 * so this check is defence-in-depth, not the only line of defence.
 */
export function canAccessPractice(user: UserProfile, practiceId: string): boolean {
  if (isStaffRole(user.role)) return true;
  return user.practiceId === practiceId;
}
