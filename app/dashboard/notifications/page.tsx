import { requirePartner } from '@/lib/auth';
import { notificationsService } from '@/services';
import { NotificationList } from '@/components/notifications/notification-list';

export default async function NotificationsPage() {
  const user = await requirePartner();
  const notifications = await notificationsService.listNotifications(user);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <NotificationList notifications={notifications} />
    </div>
  );
}
