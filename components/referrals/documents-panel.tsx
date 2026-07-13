'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import { getDocumentUrlAction } from '@/lib/actions/document-actions';
import type { ReferralDocument } from '@/types/referral';
import { formatDateTime } from '@/lib/utils';

export function DocumentsPanel({ documents }: { documents: ReferralDocument[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function open(doc: ReferralDocument) {
    setLoadingId(doc.id);
    setError('');
    const { url, error: err } = await getDocumentUrlAction(doc.id);
    setLoadingId(null);
    if (err || !url) {
      setError(err ?? 'Could not open this document.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
        Documents
      </h3>
      {documents.length === 0 ? (
        <p className="rounded-xl p-4 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
          No documents attached.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-3 rounded-lg p-3" style={{ border: `1px solid ${COLOR.border}` }}>
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText size={18} style={{ color: COLOR.secondary }} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>
                    {doc.fileName}
                  </p>
                  <p className="text-xs" style={{ color: COLOR.textMuted }}>
                    {formatDateTime(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <button onClick={() => open(doc)} disabled={loadingId === doc.id} className="ecl-btn shrink-0 text-xs font-medium" style={{ color: COLOR.secondary }}>
                {loadingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : 'View'}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="mt-2 text-xs" style={{ color: COLOR.problem }}>
          {error}
        </p>
      )}
    </div>
  );
}
