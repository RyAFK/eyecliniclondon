import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { getDemoStore } from '@/lib/demo/store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/user';
import type { AuditLogEntry } from '@/types/audit';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['audit_log']['Row'], actorName: string): AuditLogEntry {
  return {
    id: row.id,
    actorUserId: row.actor_user_id,
    actorName,
    action: row.action as AuditLogEntry['action'],
    entityType: row.entity_type,
    entityId: row.entity_id,
    practiceId: row.practice_id,
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

/** ecl_admin only — audit_log has no RLS SELECT policy for any other role (see 0012_rls_policies.sql). */
export async function listAuditLog(user: UserProfile): Promise<AuditLogEntry[]> {
  if (user.role !== 'ecl_admin') return [];

  if (isDemoMode()) {
    return [...getDemoStore().auditLog].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('audit_log')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []).map((row: any) => mapRow(row, row.profiles?.full_name ?? 'System'));
}
