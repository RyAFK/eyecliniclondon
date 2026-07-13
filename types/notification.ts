export const NOTIFICATION_TYPES = [
  'referral_status_change',
  'referral_received',
  'task_assigned',
  'fee_paid',
  'cpd_event',
  'system',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  referralId: string | null;
  read: boolean;
  createdAt: string;
}
