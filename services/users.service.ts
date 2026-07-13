import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { DEMO_USERS } from '@/lib/demo/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/user';
import { isStaffRole } from '@/types/user';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['profiles']['Row']): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    practiceId: row.practice_id,
    active: row.active,
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
