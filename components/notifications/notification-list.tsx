'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, CheckCircle2, ClipboardList, PoundSterling } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { markAllNotificationsReadAction, markNotificationReadAction } from '@/lib/actions/notification-actions';
import type { Notification, NotificationType } from '@/types/notification';
import { formatDateTime } from '@/lib/utils';

const ICON: Record<NotificationType, typeof Bell> = {
  referral_status_change: CheckCircle2,
  referral_received: ClipboardList,
  task_assigned: ClipboardList,
  fee_paid: PoundSterling,
  cpd_event: Calendar,
  system: Bell,
};

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    startTransition(async () => {
      await markNotificationReadAction(id);
      router.refresh();
    });
  }

  function markAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium" style={{ color: COLOR.text }}>
          Notifications {unreadCount > 0 && <span style={{ color: COLOR.accent }}>({unreadCount} unread)</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} disabled={isPending} className="ecl-underline text-xs font-medium" style={{ color: COLOR.secondary }}>
            Mark all as read
          </button>
        )}
      </div>
      <ul className="divide-y" style={{ borderColor: COLOR.border }}>
        {notifications.length === 0 && <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>You&rsquo;re all caught up.</li>}
        {notifications.map((n) => {
          const Icon = ICON[n.type] ?? Bell;
          return (
            <li key={n.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: n.read ? COLOR.recessed : COLOR.accentTint, color: n.read ? COLOR.textMuted : COLOR.accent }}>
                <Icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-sm" style={{ color: COLOR.textMuted }}>
                  {n.body}
                </p>
                <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
                  {formatDateTime(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} disabled={isPending} className="ecl-underline shrink-0 text-xs font-medium" style={{ color: COLOR.secondary }}>
                  Mark read
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
