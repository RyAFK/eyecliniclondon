'use client';

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronDown, Clock3, Crown, Lightbulb, Phone, Sparkle, Star, TrendingUp, UserX, Users2, Calendar, CheckCircle2 } from 'lucide-react';
import { COLOR, FONT_DISPLAY, toneBg, toneColor } from '@/lib/theme';
import { Pill } from '@/components/ui/pill';
import { CountUp } from '@/components/ui/count-up';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import { practiceBreakdown, journeyFunnel, conversionRates, treatmentMix } from '@/services/analytics.service';
import type { Referral } from '@/types/referral';
import type { Task } from '@/types/task';
import { formatCurrency } from '@/lib/utils';

const DONUT_COLORS = [COLOR.primary, COLOR.secondary, COLOR.accent, '#7C9CB8', COLOR.future, '#6D4AA3'];

export function PrioritiesSection({ referrals, stalePracticeNames }: { referrals: Referral[]; stalePracticeNames: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const feesOutstanding = referrals.filter((r) => r.feeStatus === 'pending' || r.feeStatus === 'invoiced').reduce((s, r) => s + r.feeAmount, 0);
  const bookedNotAttended = referrals.filter((r) => r.journeyStatus === 'consultation_booked').length;
  const awaiting = referrals.filter((r) => r.journeyStatus === 'referral_received' || r.journeyStatus === 'awaiting_consultation').length;
  const rates = conversionRates(referrals);

  const priorities: Array<{ level: string; tone: 'problem' | 'action' | 'default'; text: string }> = [
    { level: 'High priority', tone: 'problem', text: `${formatCurrency(feesOutstanding)} referral fees outstanding. Review unpaid partner fees.` },
    { level: 'Medium', tone: 'action', text: `${bookedNotAttended} patient${bookedNotAttended !== 1 ? 's' : ''} booked but not yet attended. Follow up to reduce drop-off.` },
    { level: 'Medium', tone: 'action', text: `Referral → consultation conversion is at ${rates.referralToConsult}% — worth reviewing the funnel if this dips.` },
    { level: 'Low', tone: 'default', text: `${awaiting} referral${awaiting !== 1 ? 's' : ''} awaiting first consultation booking.` },
  ];
  if (stalePracticeNames.length > 0) {
    priorities.push({
      level: 'Low',
      tone: 'default',
      text: `${stalePracticeNames.length} partner practice${stalePracticeNames.length !== 1 ? 's have' : ' has'} not referred in over 30 days — consider a check-in call (${stalePracticeNames.slice(0, 2).join(', ')}${stalePracticeNames.length > 2 ? '…' : ''}).`,
    });
  }

  const visible = showAll ? priorities : priorities.slice(0, 3);
  const borderColor: Record<string, string> = { problem: COLOR.problem, action: COLOR.accent, default: COLOR.border };

  return (
    <div className="ecl-fade-up mt-6">
      <h2 className="mb-3 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
        <span style={{ fontSize: 16 }}>◎</span> Today&rsquo;s priorities
      </h2>
      <div className="space-y-3">
        {visible.map((p, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, borderLeftWidth: 4, borderLeftColor: borderColor[p.tone] }}>
            <Pill tone={p.tone === 'problem' ? 'action' : p.tone === 'action' ? 'accent' : 'default'}>{p.level}</Pill>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.text }}>
              {p.text}
            </p>
          </div>
        ))}
      </div>
      {!showAll && priorities.length > 3 && (
        <button onClick={() => setShowAll(true)} className="ecl-btn mt-3 w-full rounded-xl py-2.5 text-sm font-medium" style={{ border: `1px dashed ${COLOR.accent}`, color: COLOR.accent, background: 'transparent' }}>
          Show all {priorities.length} priorities
        </button>
      )}
    </div>
  );
}

export function BDSummaryCard({ referrals }: { referrals: Referral[] }) {
  const [open, setOpen] = useState(true);
  const awaiting = referrals.filter((r) => r.journeyStatus === 'referral_received' || r.journeyStatus === 'awaiting_consultation').length;
  const topPractice = practiceBreakdown(referrals)[0]?.practiceName;
  const mix = treatmentMix(referrals);
  const fastestGrowing = mix[0]?.name;

  return (
    <div className="mt-6">
      <button onClick={() => setOpen((o) => !o)} className="ecl-btn ecl-press flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4" style={{ background: COLOR.primary }}>
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkle size={16} style={{ color: COLOR.accent }} /> Business development summary
        </span>
        <ChevronDown size={18} style={{ color: '#fff', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 250ms ease' }} />
      </button>

      {open && (
        <div className="ecl-fade-in mt-3 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: COLOR.text }}>
            <Lightbulb size={16} style={{ color: COLOR.accent }} /> Growth opportunities
          </p>
          <ul className="divide-y" style={{ borderColor: COLOR.border }}>
            <li className="flex items-start gap-3 py-3 first:pt-0">
              <Phone size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
              <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                {awaiting} patient{awaiting !== 1 ? 's have' : ' has'} waited without a consultation booking. Contact them this week.
              </p>
            </li>
            {fastestGrowing && (
              <li className="flex items-start gap-3 py-3">
                <TrendingUp size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
                <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                  {fastestGrowing} referrals are the most common this period — worth featuring in partner communications.
                </p>
              </li>
            )}
            <li className="flex items-start gap-3 py-3 last:pb-0">
              <Star size={16} className="mt-0.5 shrink-0" style={{ color: COLOR.accent }} />
              <p className="text-sm leading-relaxed" style={{ color: COLOR.text }}>
                {topPractice ?? 'Your top referring practice'} is actively referring — a good moment to introduce a new treatment pathway.
              </p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export function BDStatSquares({ referrals }: { referrals: Referral[] }) {
  const total = referrals.length;
  const completed = referrals.filter((r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')).length;
  const booked = referrals.filter((r) => r.journeyStatus !== 'referral_received' && r.journeyStatus !== 'awaiting_consultation').length;
  const notProceeding = referrals.filter((r) => r.journeyStatus === 'closed' && r.outcome !== 'treatment_successful' && r.outcome !== 'ongoing_care').length;

  const squares = [
    { label: 'Referrals received', value: total, Icon: Users2, tone: 'default' as const },
    { label: 'Treatments completed', value: completed, Icon: CheckCircle2, tone: 'complete' as const },
    { label: 'Consultations booked', value: booked, Icon: Calendar, tone: 'teal' as const },
    { label: 'Did not proceed', value: notProceeding, Icon: UserX, tone: 'action' as const },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {squares.map((s, i) => (
        <div key={s.label} className="ecl-fade-up rounded-2xl p-4" style={{ animationDelay: `${i * 50}ms`, background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
          <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: toneBg(s.tone), color: toneColor(s.tone) }}>
            <s.Icon size={16} />
          </span>
          <p className="text-2xl font-medium" style={{ color: COLOR.text }}>
            <CountUp value={s.value} />
          </p>
          <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ConversionBanner({ referrals }: { referrals: Referral[] }) {
  const rates = conversionRates(referrals);
  const items = [
    { value: rates.referralToConsult, label: 'Referral → Consult' },
    { value: rates.consultToTreatment, label: 'Consult → Treatment' },
    { value: rates.referralToTreatment, label: 'Referral → Treatment' },
  ];

  return (
    <div className="ecl-fade-up mt-6 flex items-stretch overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
      {items.map((it, i) => (
        <div key={it.label} className="flex flex-1 flex-col items-center justify-center px-2 py-4 text-center" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
          <p className="text-xl sm:text-2xl" style={FONT_DISPLAY}>
            <span className="text-white">{it.value}%</span>
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-white/70 sm:text-xs">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

export function PatientJourneyFunnel({ referrals }: { referrals: Referral[] }) {
  const stages = journeyFunnel(referrals);
  const maxCount = stages[0]?.count || 1;

  return (
    <div className="ecl-fade-up mt-6 overflow-hidden rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 font-medium" style={{ color: COLOR.text }}>
        Patient journey funnel
      </h2>
      <div className="space-y-3">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1]!.count : null;
          const lost = prev !== null ? prev - s.count : 0;
          const lostPct = prev ? Math.round((lost / prev) * 100) : 0;
          const widthPct = Math.max((s.count / maxCount) * 100, 14);
          return (
            <div key={s.label}>
              {i > 0 && lost > 0 && (
                <p className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: COLOR.problem }}>
                  ↓ {lost} not yet progressed ({lostPct}%)
                </p>
              )}
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: COLOR.textMuted }}>{s.label}</span>
                <span className="font-semibold" style={{ color: COLOR.text }}>
                  {s.count}
                </span>
              </div>
              <div className="mt-1 h-3 w-full overflow-hidden rounded-full" style={{ background: COLOR.recessed }}>
                <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${COLOR.primary} 0%, ${COLOR.accent} 100%)`, transition: 'width 500ms ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TreatmentDonut({ referrals }: { referrals: Referral[] }) {
  const data = treatmentMix(referrals);

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 font-medium" style={{ color: COLOR.text }}>
        Referrals by treatment type
      </h2>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {data.map((d, i) => (
                <Cell key={d.treatmentType} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip suffix=" referrals" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <span key={d.treatmentType} className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} /> {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ReferralVolumeBars({ referrals }: { referrals: Referral[] }) {
  const data = treatmentMix(referrals);
  const gridStroke = COLOR.border;
  const tickStyle = { fontSize: 12, fill: COLOR.textMuted };
  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 font-medium" style={{ color: COLOR.text }}>
        Referral volume by treatment
      </h2>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={gridStroke} vertical={false} />
            <XAxis dataKey="name" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip suffix=" referrals" />} />
            <Bar dataKey="value" fill={COLOR.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopPartnersCard({ referrals, onViewAllHref }: { referrals: Referral[]; onViewAllHref: string }) {
  const ranked = practiceBreakdown(referrals).slice(0, 3);

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium" style={{ color: COLOR.text }}>
          Top referral partners
        </h2>
        <a href={onViewAllHref} className="ecl-underline flex items-center gap-1 text-sm font-medium" style={{ color: COLOR.accent }}>
          View all
        </a>
      </div>
      <ul className="divide-y" style={{ borderColor: COLOR.border }}>
        {ranked.map((p) => (
          <li key={p.practiceId} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>
                {p.practiceName}
              </p>
              <p className="text-xs" style={{ color: COLOR.textMuted }}>
                {p.count} referrals · {p.treated} treated
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold" style={{ color: COLOR.complete }}>
              {p.share}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PartnersLeaderboard({ referrals }: { referrals: Referral[] }) {
  const ranked = practiceBreakdown(referrals);

  return (
    <div className="ecl-fade-up rounded-2xl p-5" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 flex items-center gap-2 font-medium" style={{ color: COLOR.text }}>
        <Crown size={16} style={{ color: COLOR.accent }} /> Referring partners
      </h2>
      <ul className="space-y-2.5">
        {ranked.map((p, i) => (
          <li key={p.practiceId} className="flex items-center justify-between gap-3 rounded-xl p-3" style={{ background: i === 0 ? COLOR.accentTint : COLOR.recessed }}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold" style={{ background: i === 0 ? COLOR.accent : COLOR.bg, color: i === 0 ? '#fff' : COLOR.textMuted, border: i === 0 ? 'none' : `1px solid ${COLOR.border}` }}>
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: COLOR.text }}>
                  {p.practiceName}
                </p>
                <p className="text-xs" style={{ color: COLOR.textMuted }}>
                  {p.count} referral{p.count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-medium" style={{ color: COLOR.text }}>
              {formatCurrency(p.fees)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FollowUpsCard({ tasks }: { tasks: Task[] }) {
  const dueSoon = tasks.filter((t) => t.status !== 'done').slice(0, 3);
  if (dueSoon.length === 0) return null;

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: COLOR.text }}>
        <Clock3 size={16} style={{ color: COLOR.accent }} /> Follow-ups due
      </p>
      <ul className="space-y-1.5">
        {dueSoon.map((t) => (
          <li key={t.id} className="text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            <span style={{ color: COLOR.text }}>{t.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
