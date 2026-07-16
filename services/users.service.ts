import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { DEMO_USERS } from '@/lib/demo/data';
import { getDemoStore } from '@/lib/demo/store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NotificationPreferences, UserProfile } from '@/types/user';
import { DEFAULT_NOTIFICATION_PREFERENCES, isStaffRole } from '@/types/user';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['profiles']['Row']): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    practiceId: row.practice_id,
    active: row.active,
    notificationPreferences: row.notification_preferences ?? DEFAULT_NOTIFICATION_PREFERENCES,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Staff see everyone; a partner user sees only colleagues at their own practice. */
export async function listUsers(user: UserProfile, opts: { practiceId?: string } = {}): Promise<UserProfile[]> {
  if (isDemoMode()) {
    let rows = DEMO_USERS;
    if (!isStaffRole(user.role)) rows = rows.filter((u) => u.practiceId === user.practiceId);
    if (opts.practiceId) rows = rows.filter((u) => u.practiceId === opts.practiceId);
    return rows;
  }

  const supabase = createServerSupabaseClient();
  let query = supabase.from('profiles').select('*').order('full_name');
  if (!isStaffRole(user.role)) query = query.eq('practice_id', user.practiceId ?? '');
  if (opts.practiceId) query = query.eq('practice_id', opts.practiceId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function listStaffUsers(user: UserProfile): Promise<UserProfile[]> {
  if (!isStaffRole(user.role)) return [];
  if (isDemoMode()) return DEMO_USERS.filter((u) => isStaffRole(u.role));

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('profiles').select('*').in('role', ['ecl_staff', 'ecl_admin']).order('full_name');
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export interface OwnProfileUpdate {
  fullName?: string;
  notificationPreferences?: NotificationPreferences;
}

/**
 * Lets a signed-in user edit their own display name and notification
 * preferences. Deliberately narrow: role, practiceId, and active are NOT
 * accepted here — those stay admin-only (see the RLS trigger
 * prevent_self_privilege_escalation in 0012_rls_policies.sql, which this
 * mirrors on the demo-mode side too).
 */
export async function updateOwnProfile(user: UserProfile, update: OwnProfileUpdate): Promise<UserProfile> {
  if (isDemoMode()) {
    const store = getDemoStore();
    const record = store.users.find((u) => u.id === user.id);
    if (!record) throw new Error('User not found.');
    if (update.fullName !== undefined) record.fullName = update.fullName;
    if (update.notificationPreferences !== undefined) record.notificationPreferences = update.notificationPreferences;
    record.updatedAt = new Date().toISOString();
    return record;
  }

  const supabase = createServerSupabaseClient();
  const patch: Database['public']['Tables']['profiles']['Update'] = {};
  if (update.fullName !== undefined) patch.full_name = update.fullName;
  if (update.notificationPreferences !== undefined) patch.notification_preferences = update.notificationPreferences;

  const { data, error } = await supabase.from('profiles').update(patch).eq('id', user.id).select('*').single();
  if (error) throw error;
  return mapRow(data);
}
