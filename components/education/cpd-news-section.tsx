'use client';

import { Award, Calendar, Newspaper, ArrowUpRight } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Pill } from '@/components/ui/pill';
import type { EducationResource } from '@/types/education';

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function CpdNewsSection({ resources }: { resources: EducationResource[] }) {
  const events = resources.filter((r) => r.type === 'cpd_event');
  const news = resources.filter((r) => r.type !== 'cpd_event');

  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '160ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="relative flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            For our referring partners
          </p>
          <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            CPD Events &amp; Clinic News
          </h2>
        </div>
        <Award size={28} style={{ color: COLOR.accent }} className="hidden shrink-0 sm:block" />
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: COLOR.textMuted }}>
            <Calendar size={15} /> Upcoming CPD events
          </p>
          <div className="space-y-3">
            {events.length === 0 && (
              <p className="rounded-xl p-4 text-sm" style={{ background: COLOR.recessed, color: COLOR.textMuted }}>
                No upcoming events at the moment.
              </p>
            )}
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => openExternal(e.url)}
                className="ecl-btn flex w-full items-center justify-between gap-4 rounded-xl p-4 text-left"
                style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                    {e.title}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
                    {e.eventDate ? new Date(e.eventDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }) : ''} · {e.eventLocation}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: COLOR.textMuted }}>
                    {e.speakers}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {e.cpdPoints && <Pill tone="accent">{e.cpdPoints} CPD points</Pill>}
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
            {news.map((n) => (
              <button
                key={n.id}
                onClick={() => openExternal(n.url)}
                className="ecl-btn block w-full rounded-xl p-4 text-left"
                style={{ background: COLOR.recessed, border: `1px solid ${COLOR.border}` }}
              >
                <p className="text-sm font-medium" style={{ color: COLOR.text }}>
                  {n.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: COLOR.textMuted }}>
                  {n.description} <ArrowUpRight size={11} />
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
