import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { DEMO_EDUCATION_RESOURCES } from '@/lib/demo/data';
import { getDemoStore } from '@/lib/demo/store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { EducationResource } from '@/types/education';
import type { EducationModuleProgress } from '@/types/education-module';
import type { UserProfile } from '@/types/user';
import type { Database } from '@/types/database';

function mapProgressRow(row: Database['public']['Tables']['education_module_progress']['Row']): EducationModuleProgress {
  return {
    moduleId: row.module_id,
    userId: row.user_id,
    knowledgeCheckScore: row.knowledge_check_score,
    knowledgeCheckTotal: row.knowledge_check_total,
    completed: row.completed,
    completedAt: row.completed_at,
  };
}

function mapRow(row: Database['public']['Tables']['education_resources']['Row']): EducationResource {
  return {
    id: row.id,
    type: row.type as EducationResource['type'],
    title: row.title,
    description: row.description,
    url: row.url,
    cpdPoints: row.cpd_points,
    eventDate: row.event_date,
    eventLocation: row.event_location,
    speakers: row.speakers,
    publishedAt: row.published_at,
  };
}

/** Any signed-in user (partner or staff) can read education resources. */
export async function listEducationResources(): Promise<EducationResource[]> {
  if (isDemoMode()) {
    return [...DEMO_EDUCATION_RESOURCES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('education_resources').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

/** Clinical Education Hub completion state for `user` — module content itself is static, see lib/education-modules.ts. */
export async function listModuleProgress(user: UserProfile): Promise<EducationModuleProgress[]> {
  if (isDemoMode()) {
    return getDemoStore().moduleProgress.filter((p) => p.userId === user.id);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('education_module_progress').select('*').eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []).map(mapProgressRow);
}

/** Records that `user` has completed a module's knowledge check (attempting it counts as completion — the score is informational). */
export async function recordModuleProgress(user: UserProfile, moduleId: string, score: number, total: number): Promise<EducationModuleProgress> {
  const now = new Date().toISOString();

  if (isDemoMode()) {
    const store = getDemoStore();
    let record = store.moduleProgress.find((p) => p.userId === user.id && p.moduleId === moduleId);
    if (!record) {
      record = { moduleId, userId: user.id, knowledgeCheckScore: null, knowledgeCheckTotal: null, completed: false, completedAt: null };
      store.moduleProgress.push(record);
    }
    record.knowledgeCheckScore = score;
    record.knowledgeCheckTotal = total;
    record.completed = true;
    record.completedAt = now;
    return record;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('education_module_progress')
    .upsert(
      { user_id: user.id, module_id: moduleId, knowledge_check_score: score, knowledge_check_total: total, completed: true, completed_at: now },
      { onConflict: 'user_id,module_id' }
    )
    .select('*')
    .single();
  if (error) throw error;
  return mapProgressRow(data);
}
