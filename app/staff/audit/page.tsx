import { ShieldCheck } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { auditService } from '@/services';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { formatDateTime } from '@/lib/utils';

const ACTION_LABELS: Record<string, string> = {
  'referral.created': 'Referral created',
  'referral.status_changed': 'Referral status changed',
  'referral.outcome_recorded': 'Referral outcome recorded',
  'referral.document_uploaded': 'Document uploaded',
  'referral.document_viewed': 'Document viewed',
  'fee.status_changed': 'Fee status changed',
  'task.created': 'Task created',
  'task.completed': 'Task completed',
  'user.signed_in': 'User signed in',
  'user.role_changed': 'User role changed',
  'practice.created': 'Practice created',
  'practice.updated': 'Practice updated',
};

export default async function StaffAuditPage() {
  const user = await requireRole(['ecl_admin']);
  const entries = await auditService.listAuditLog(user);

  return (
    <>
      <h1 className="ecl-fade-up flex items-center gap-2 text-xl font-medium" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        <ShieldCheck size={20} style={{ color: COLOR.accent }} /> Audit log
      </h1>
      <p className="mt-1 text-sm" style={{ color: COLOR.textMuted }}>
        Append-only record of every referral, fee, and task change. Visible to ECL admins only.
      </p>

      <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <ul className="divide-y" style={{ borderColor: COLOR.border }}>
          {entries.length === 0 && <li className="py-6 text-center text-sm" style={{ color: COLOR.textMuted }}>No audit events yet.</li>}
          {entries.map((e) => (
            <li key={e.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                {ACTION_LABELS[e.action] ?? e.action}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                {formatDateTime(e.createdAt)} · {e.actorName} · {e.entityType} {e.entityId.slice(0, 8)}
              </p>
              {Object.keys(e.metadata).length > 0 && (
                <p className="mt-1 truncate font-mono text-[11px]" style={{ color: COLOR.textMuted }}>
                  {JSON.stringify(e.metadata)}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
