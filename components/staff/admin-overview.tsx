import { ClipboardList, Clock3, PoundSterling, TrendingUp } from 'lucide-react';
import { COLOR, toneBg, toneColor } from '@/lib/theme';
import { CountUp } from '@/components/ui/count-up';
import { feeSummary } from '@/services/analytics.service';
import type { Referral } from '@/types/referral';

export function AdminOverview({ referrals }: { referrals: Referral[] }) {
  const total = referrals.length;
  const fees = feeSummary(referrals);
  const completed = referrals.filter((r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')).length;
  const conversion = total ? Math.round((completed / total) * 100) : 0;
  const awaiting = referrals.filter((r) => r.journeyStatus === 'referral_received' || r.journeyStatus === 'awaiting_consultation').length;

  const stats = [
    { label: 'Total referrals', value: total, prefix: '', Icon: ClipboardList, tone: 'default' as const },
    { label: 'Fees payable', value: Math.round(fees.pending + fees.invoiced), prefix: '£', Icon: PoundSterling, tone: 'default' as const },
    { label: 'Needs action', value: awaiting, prefix: '', Icon: Clock3, tone: 'action' as const },
    { label: 'Conversion rate', value: conversion, prefix: '', suffix: '%', Icon: TrendingUp, tone: 'complete' as const },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="ecl-fade-up rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: toneBg(s.tone), color: toneColor(s.tone) }}>
            <s.Icon size={16} />
          </span>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {s.prefix}
            <CountUp value={s.value} locale={!!s.prefix} />
            {s.suffix ?? ''}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
