import { useState, useEffect } from 'react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { LensRings } from '../../components/shared/EyeMotif';
import { CountUp } from '../../components/shared/CountUp';
import { ChartTooltip, Reveal } from '../../components/shared/ChartHelpers';
import { MONTHLY_ACTIVITY, TREATMENT_MIX, INSIGHT_STATS } from '../../data/content';

function ReferralVolumeChart({ visible, gridStroke, tickStyle, color }) {
  const [count, setCount] = useState(0);
  const maxVal = Math.max(...MONTHLY_ACTIVITY.map((d) => d.referrals));

  useEffect(() => {
    if (!visible) return;
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= MONTHLY_ACTIVITY.length) clearInterval(id);
    }, 160);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={MONTHLY_ACTIVITY.slice(0, count)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={gridStroke} vertical={false} />
        <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, maxVal + 2]} />
        <Tooltip content={<ChartTooltip suffix=" referrals" />} />
        <Bar dataKey="referrals" fill={color} radius={[6, 6, 0, 0]} isAnimationActive animationDuration={450} animationEasing="ease-out" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TreatmentPieChart({ visible, donutColors }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setRevealed(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= TREATMENT_MIX.length) clearInterval(id);
    }, 220);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={TREATMENT_MIX} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3} isAnimationActive={false}>
          {TREATMENT_MIX.map((t, i) => (
            <Cell key={t.name} fill={donutColors[i % donutColors.length]} stroke="none" style={{ opacity: i < revealed ? 1 : 0, transition: 'opacity 380ms ease' }} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip suffix=" cases" />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InsightsPage() {
  const COLOR = useColors();
  const donutColors = [COLOR.accent, COLOR.secondary, COLOR.complete, '#7C9CB8', COLOR.future];
  const gridStroke = COLOR.border;
  const tickStyle = { fontSize: 12, fill: COLOR.textMuted };

  return (
    <div>
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <TrendingUp size={14} /> For Keith Holland Opticians
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>Practice insights</h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">A look at how your referrals to Eye Clinic London have grown over the last six months.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INSIGHT_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 130}>
            <div className="rounded-2xl p-4" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: COLOR.accentTint, color: COLOR.accent }}>
                  <s.Icon size={15} />
                </span>
                <span className="text-xs font-medium" style={{ color: COLOR.complete }}>{s.delta}</span>
              </div>
              <p className="mt-3 text-2xl font-medium" style={{ color: COLOR.text }}>
                {s.prefix || ''}<CountUp value={s.value} locale={!!s.prefix} />{s.suffix || ''}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal delay={90}>
            {(visible) => (
              <>
                <p className="mb-2 text-sm font-medium" style={{ color: COLOR.text }}>Referral fee revenue</p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 190 }}>
                    {visible && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MONTHLY_ACTIVITY} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
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
            {(visible) => (
              <>
                <p className="mb-2 text-sm font-medium" style={{ color: COLOR.text }}>Referral volume</p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 150 }}>
                    {visible && <ReferralVolumeChart visible={visible} gridStroke={gridStroke} tickStyle={tickStyle} color={COLOR.secondary} />}
                  </div>
                </div>
              </>
            )}
          </Reveal>
        </div>

        <div className="lg:col-span-2">
          <Reveal delay={230}>
            {(visible) => (
              <>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.text }}>
                  <PieChartIcon size={14} /> Referrals by treatment type
                </p>
                <div className="rounded-2xl p-3" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
                  <div style={{ height: 190 }}>
                    {visible && <TreatmentPieChart visible={visible} donutColors={donutColors} />}
                  </div>
                  <ul className="mt-1 space-y-1.5 px-1 pb-1">
                    {TREATMENT_MIX.map((t, i) => (
                      <li key={t.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2" style={{ color: COLOR.textMuted }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: donutColors[i % donutColors.length] }} /> {t.name}
                        </span>
                        <span className="font-medium" style={{ color: COLOR.text }}>{t.value}</span>
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
          Figures reflect referrals sent from Keith Holland Opticians and associated referral fees earned to date.
        </p>
      </Reveal>
    </div>
  );
}
