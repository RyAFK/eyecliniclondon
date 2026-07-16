import { Calendar, Newspaper, Award, ArrowUpRight } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { Pill } from '../shared/Pill';
import { CPD_EVENTS, CLINIC_NEWS } from '../../data/content';

export function CpdNewsSection() {
  const COLOR = useColors();
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '160ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="relative">
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>For our referring partners</p>
            <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>CPD Events &amp; Clinic News</h2>
          </div>
          <Award size={28} style={{ color: COLOR.accent }} className="hidden shrink-0 sm:block" />
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: COLOR.textMuted }}>
              <Calendar size={15} /> Upcoming CPD events
            </p>
            <div className="space-y-3">
              {CPD_EVENTS.map((e) => (
                <button
                  key={e.title}
                  onClick={() => window.open(e.url, '_blank', 'noopener,noreferrer')}
                  className="ecl-btn flex w-full items-center justify-between gap-4 rounded-xl p-4 text-left"
                  style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: COLOR.text }}>{e.title}</p>
                    <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>{e.date} · {e.time}</p>
                    <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>{e.speakers}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Pill tone="accent">{e.points}</Pill>
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: COLOR.secondary }}>
                      Get tickets <ArrowUpRight size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: COLOR.textMuted }}>
              <Newspaper size={15} /> Latest from Mr Samer Hamada
            </p>
            <div className="space-y-3">
              {CLINIC_NEWS.map((n) => (
                <button
                  key={n.title}
                  onClick={() => window.open(n.url, '_blank', 'noopener,noreferrer')}
                  className="ecl-btn block w-full rounded-xl p-4 text-left"
                  style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}
                >
                  <p className="text-sm font-medium" style={{ color: COLOR.text }}>{n.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: COLOR.textMuted }}>{n.date} <ArrowUpRight size={11} /></p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
