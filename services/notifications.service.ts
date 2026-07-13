import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { getDemoStore } from '@/lib/demo/store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/user';
import type { Notification } from '@/types/notification';
import type { Database } from '@/types/database';

function mapRow(row: Database['public']['Tables']['notifications']['Row']): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as Notification['type'],
    title: row.title,
    body: row.body,
    referralId: row.referral_id,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function listNotifications(user: UserProfile): Promise<Notification[]> {
  if (isDemoMode()) {
    return getDemoStore()
      .notifications.filter((n) => n.userId === user.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function markNotificationRead(user: UserProfile, notificationId: string): Promise<void> {
  if (isDemoMode()) {
    const notification = getDemoStore().notifications.find((n) => n.id === notificationId && n.userId === user.id);
    if (notification) notification.read = true;
    return;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId).eq('user_id', user.id);
  if (error) throw error;
}

export async function markAllNotificationsRead(user: UserProfile): Promise<void> {
  if (isDemoMode()) {
    getDemoStore().notifications.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
    return;
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
  if (error) throw error;
}
