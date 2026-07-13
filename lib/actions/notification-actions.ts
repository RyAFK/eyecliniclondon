'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { notificationsService } from '@/services';

export async function markNotificationReadAction(notificationId: string): Promise<void> {
  const user = await requireUser();
  await notificationsService.markNotificationRead(user, notificationId);
  revalidatePath('/dashboard/notifications');
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await requireUser();
  await notificationsService.markAllNotificationsRead(user);
  revalidatePath('/dashboard/notifications');
}
