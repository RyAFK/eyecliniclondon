import { ClipboardList, PoundSterling, Clock3, TrendingUp } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { CountUp } from '../../components/shared/CountUp';
import { statToneColor, statToneBg } from '../../components/shared/statTone';

export function AdminOverview({ referrals }) {
  const COLOR = useColors();
  const total = referrals.length;
  const feesTotal = referrals.reduce((sum, r) => sum + r.fee, 0);
  const completed = referrals.filter((r) => r.status === 'Treatment Completed').length;
  const conversion = total ? Math.round((completed / total) * 100) : 0;
  const awaiting = referrals.filter((r) => r.status === 'Awaiting Consultation' || r.status === 'Referral Received').length;

  const stats = [
    { label: 'Total referrals', value: total, prefix: '', Icon: ClipboardList, tone: 'default' },
    { label: 'Fees payable', value: feesTotal, prefix: '£', Icon: PoundSterling, tone: 'default' },
    { label: 'Needs action', value: awaiting, prefix: '', Icon: Clock3, tone: 'action' },
    { label: 'Conversion rate', value: conversion, prefix: '', suffix: '%', Icon: TrendingUp, tone: 'complete' },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="ecl-fade-up rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: statToneBg(s.tone, COLOR), color: statToneColor(s.tone, COLOR) }}>
            <s.Icon size={16} />
          </span>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            {s.prefix || ''}<CountUp value={s.value} locale={!!s.prefix} />{s.suffix || ''}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
