import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { DEMO_PRACTICES } from '@/lib/demo/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/user';
import { isStaffRole } from '@/types/user';
import type { Practice } from '@/types/practice';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['practices']['Row']): Practice {
  return {
    id: row.id,
    name: row.name,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    postcode: row.postcode,
    phone: row.phone,
    email: row.email,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPractices(user: UserProfile): Promise<Practice[]> {
  if (isDemoMode()) {
    if (isStaffRole(user.role)) return DEMO_PRACTICES;
    return DEMO_PRACTICES.filter((p) => p.id === user.practiceId);
  }

  const supabase = createServerSupabaseClient();
  let query = supabase.from('practices').select('*').order('name');
  if (!isStaffRole(user.role)) query = query.eq('id', user.practiceId ?? '');
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getPractice(user: UserProfile, id: string): Promise<Practice | null> {
  if (isDemoMode()) {
    const practice = DEMO_PRACTICES.find((p) => p.id === id);
    if (!practice) return null;
    if (!isStaffRole(user.role) && user.practiceId !== id) return null;
    return practice;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('practices').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapRow(data);
}
