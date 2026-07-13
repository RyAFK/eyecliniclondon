export const AUDIT_ACTIONS = [
  'referral.created',
  'referral.status_changed',
  'referral.outcome_recorded',
  'referral.document_uploaded',
  'referral.document_viewed',
  'fee.status_changed',
  'task.created',
  'task.completed',
  'user.signed_in',
  'user.role_changed',
  'practice.created',
  'practice.updated',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Append-only record. Written server-side only — never client-writable. */
export interface AuditLogEntry {
  id: string;
  actorUserId: string | null;
  actorName: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  practiceId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
