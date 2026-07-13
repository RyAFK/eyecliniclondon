import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { DEMO_EDUCATION_RESOURCES } from '@/lib/demo/data';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { EducationResource } from '@/types/education';
import type { Database } from '@/types/database';

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
