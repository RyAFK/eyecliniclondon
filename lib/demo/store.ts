import 'server-only';
import {
  DEMO_REFERRALS,
  DEMO_STATUS_HISTORY,
  DEMO_TASKS,
  DEMO_NOTIFICATIONS,
  DEMO_AUDIT_LOG,
  DEMO_USERS,
} from '@/lib/demo/data';
import type { Referral, ReferralStatusHistoryEntry } from '@/types/referral';
import type { Task } from '@/types/task';
import type { Notification } from '@/types/notification';
import type { AuditLogEntry } from '@/types/audit';
import type { UserProfile } from '@/types/user';

interface DemoStore {
  referrals: Referral[];
  statusHistory: ReferralStatusHistoryEntry[];
  tasks: Task[];
  notifications: Notification[];
  auditLog: AuditLogEntry[];
  /** Mutable so profile edits (name, notification preferences) persist for the session. */
  users: UserProfile[];
  referenceSeq: number;
}

/**
 * Demo mode has no real database, so this module-level store stands in for
 * one. It is deliberately the ONLY place demo data is mutated — every
 * service function reads/writes through here, which is what keeps every
 * dashboard rendering from the same canonical in-memory dataset instead of
 * each screen holding its own copy.
 *
 * Kept on `globalThis` so Next.js dev-server hot reloads don't reset it
 * mid-session. Resets on server restart — acceptable for a demo.
 */
const globalStore = globalThis as unknown as { __eclDemoStore?: DemoStore };

function createStore(): DemoStore {
  return {
    referrals: DEMO_REFERRALS.map((r) => ({ ...r })),
    statusHistory: DEMO_STATUS_HISTORY.map((h) => ({ ...h })),
    tasks: DEMO_TASKS.map((t) => ({ ...t })),
    notifications: DEMO_NOTIFICATIONS.map((n) => ({ ...n })),
    auditLog: DEMO_AUDIT_LOG.map((a) => ({ ...a })),
    users: DEMO_USERS.map((u) => ({ ...u, notificationPreferences: { ...u.notificationPreferences } })),
    referenceSeq: DEMO_REFERRALS.length + 1,
  };
}

export function getDemoStore(): DemoStore {
  if (!globalStore.__eclDemoStore) {
    globalStore.__eclDemoStore = createStore();
  }
  return globalStore.__eclDemoStore;
}

export function nextDemoReference(): string {
  const store = getDemoStore();
  const n = store.referenceSeq++;
  return `ECL-2026-${String(100000 + n).padStart(6, '0')}`;
}
