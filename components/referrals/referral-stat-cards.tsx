'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, Clock3, FileText, ListChecks, Stethoscope } from 'lucide-react';
import { COLOR, FONT_DISPLAY, toneBg, toneColor, type Tone } from '@/lib/theme';
import { CountUp } from '@/components/ui/count-up';
import { Modal } from '@/components/ui/modal';
import { treatmentName, type Referral } from '@/types/referral';
import { formatDate } from '@/lib/utils';

interface StatDef {
  id: string;
  label: string;
  tone: Tone;
  icon: typeof ListChecks;
  filter: (r: Referral) => boolean;
}

const STAT_DEFS: StatDef[] = [
  { id: 'active', label: 'Active Referrals', tone: 'default', icon: ListChecks, filter: (r) => r.journeyStatus !== 'closed' },
  { id: 'awaiting', label: 'Awaiting Consultation', tone: 'action', icon: Clock3, filter: (r) => r.journeyStatus === 'referral_received' || r.journeyStatus === 'awaiting_consultation' },
  { id: 'booked', label: 'Consultation Booked', tone: 'default', icon: Calendar, filter: (r) => r.journeyStatus === 'consultation_booked' },
  { id: 'treatment_booked', label: 'Treatment Booked', tone: 'default', icon: Stethoscope, filter: (r) => r.journeyStatus === 'treatment_booked' },
  { id: 'completed', label: 'Treatment Completed', tone: 'complete', icon: CheckCircle2, filter: (r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful') },
  { id: 'closed', label: 'Closed Referrals', tone: 'default', icon: FileText, filter: (r) => r.journeyStatus === 'closed' },
];

export function ReferralStatCards({ referrals }: { referrals: Referral[] }) {
  const [activeStat, setActiveStat] = useState<StatDef | null>(null);
  const matching = activeStat ? referrals.filter(activeStat.filter) : [];

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_DEFS.map((s, i) => {
          const count = referrals.filter(s.filter).length;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStat(s)}
              className="ecl-fade-up ecl-lift ecl-press rounded-2xl p-4 text-left"
              style={{ animationDelay: `${i * 60}ms`, background: COLOR.bg, border: `1px solid ${COLOR.border}` }}
            >
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: toneBg(s.tone), color: toneColor(s.tone) }}>
                <Icon size={16} />
              </span>
              <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
                <CountUp value={count} />
              </p>
              <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
                {s.label}
              </p>
            </button>
          );
        })}
      </div>

      <Modal open={!!activeStat} onClose={() => setActiveStat(null)}>
        {activeStat && (
          <>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: toneBg(activeStat.tone), color: toneColor(activeStat.tone) }}>
                <activeStat.icon size={18} />
              </span>
              <div>
                <h3 style={{ ...FONT_DISPLAY, fontSize: '1.1rem', color: COLOR.text }}>{activeStat.label}</h3>
                <p className="text-xs" style={{ color: COLOR.textMuted }}>
                  {matching.length} referral{matching.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <ul className="mt-4 max-h-96 space-y-2.5 overflow-y-auto">
              {matching.length === 0 && (
                <li className="rounded-xl p-4 text-center text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
                  No referrals in this category yet.
                </li>
              )}
              {matching.map((r, i) => (
                <li key={r.id} className="ecl-fade-up rounded-xl p-3.5" style={{ animationDelay: `${i * 40}ms`, background: COLOR.recessed }}>
                  <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                    {r.patientFirstName} {r.patientLastName.charAt(0)}. · {treatmentName(r.treatmentType)}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                    {r.reference} · {formatDate(r.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
}
