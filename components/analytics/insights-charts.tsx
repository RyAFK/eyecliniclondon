'use client';

import { PieChart as PieChartIcon, Percent, PoundSterling } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { COLOR } from '@/lib/theme';
import { Reveal } from '@/components/ui/reveal';
import { CountUp } from '@/components/ui/count-up';
import { ChartTooltip } from '@/components/ui/chart-tooltip';
import { monthlyActivity, treatmentMix, feeSummary } from '@/services/analytics.service';
import type { Referral } from '@/types/referral';
import { formatCurrency } from '@/lib/utils';

const DONUT_COLORS = [COLOR.accent, COLOR.secondary, COLOR.complete, '#7C9CB8', COLOR.future, '#6D4AA3'];

export function PartnerInsights({ referrals, practiceName }: { referrals: Referral[]; practiceName: string }) {
  const monthly = monthlyActivity(referrals, 6);
  const mix = treatmentMix(referrals);
  const fees = feeSummary(referrals);
  const total = referrals.length || 1;
  const completed = referrals.filter((r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')).length;
  const conversion = Math.round((completed / total) * 100);

  const gridStroke = COLOR.border;
  const tickStyle = { fontSize: 12, fill: COLOR.textMuted };

  const stats = [
    { label: 'Referral fees earned', value: fees.totalEarned, prefix: '£', Icon: PoundSterling },
    { label: 'Consultation conversion', value: conversion, suffix: '%', Icon: Percent },
  ];

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 130}>
            <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: COLOR.accentTint, color: COLOR.accent }}>
                  <s.Icon size={15} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-medium" style={{ color: COLOR.text }}>
                {s.prefix ?? ''}
                <CountUp value={s.value} locale={!!s.prefix} />
                {s.suffix ?? ''}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal delay={90}>
            {(visible: boolean) => (
              <>
                <p className="mb-2 text-sm font-medium" style={{ color: COLOR.text }}>
                  Referral fee revenue
                </p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 190 }}>
                    {visible && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke={gridStroke} vertical={false} />
                          <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
                          <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v / 1000}k`} />
                          <Tooltip content={<ChartTooltip prefix="£" />} />
                          <Line type="monotone" dataKey="revenue" stroke={COLOR.accent} strokeWidth={2.5} dot={{ r: 3, fill: COLOR.accent }} activeDot={{ r: 5 }} isAnimationActive animationDuration={1400} animationEasing="ease-out" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </>
            )}
          </Reveal>

          <Reveal delay={170} className="mt-4 block">
            {(visible: boolean) => (
              <>
                <p className="mb-2 text-sm font-medium" style={{ color: COLOR.text }}>
                  Referral volume
                </p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 150 }}>
                    {visible && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke={gridStroke} vertical={false} />
                          <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
                          <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip content={<ChartTooltip suffix=" referrals" />} />
                          <Bar dataKey="referrals" fill={COLOR.secondary} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={450} animationEasing="ease-out" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </>
            )}
          </Reveal>
        </div>

        <div className="lg:col-span-2">
          <Reveal delay={230}>
            {(visible: boolean) => (
              <>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.text }}>
                  <PieChartIcon size={14} /> Referrals by treatment type
                </p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 190 }}>
                    {visible && mix.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={mix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                            {mix.map((t, i) => (
                              <Cell key={t.treatmentType} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip suffix=" cases" />} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <ul className="mt-1 space-y-1.5 px-1 pb-1">
                    {mix.map((t, i) => (
                      <li key={t.treatmentType} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2" style={{ color: COLOR.textMuted }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} /> {t.name}
                        </span>
                        <span className="font-medium" style={{ color: COLOR.text }}>
                          {t.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </Reveal>
        </div>
      </div>

      <Reveal delay={100} className="block">
        <p className="mt-6 border-t pt-4 text-xs leading-relaxed" style={{ color: COLOR.textMuted, borderColor: COLOR.border }}>
          Figures reflect referrals sent from {practiceName} and associated referral fees earned to date ({formatCurrency(fees.paid)} paid, {formatCurrency(fees.invoiced)} invoiced, {formatCurrency(fees.pending)} pending).
        </p>
      </Reveal>
    </>
  );
}
