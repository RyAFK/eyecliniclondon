import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, GraduationCap } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import type { EducationModule } from '@/types/education-module';

/**
 * Direct, one-tap entry point into the Clinical Education Hub from Home.
 * Without this, modules are only reachable via Education nav -> hub grid ->
 * module card, which on mobile sits well below the fold — this surfaces the
 * next module to complete right on the dashboard.
 */
export function EducationSpotlightCard({
  module: mod,
  completedCount,
  totalCount,
  allCompleted,
}: {
  module: EducationModule;
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
}) {
  return (
    <div
      className="ecl-fade-up ecl-lift mt-6 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      style={{ animationDelay: '100ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.primaryTint, color: COLOR.primary }}>
          <GraduationCap size={22} />
        </span>
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.textMuted }}>
            Clinical Education · {completedCount} of {totalCount} completed
          </p>
          <h2 className="mt-1 text-xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            {allCompleted ? 'Revisit a module' : 'Continue learning'}: {mod.title}
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            {mod.summary}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
            <Clock3 size={12} /> {mod.estimatedMinutes} min
            {allCompleted && (
              <span className="flex items-center gap-1" style={{ color: COLOR.complete }}>
                <CheckCircle2 size={12} /> All modules completed
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <Link
          href={`/dashboard/education/${mod.slug}`}
          className="ecl-btn ecl-press flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
          style={{ background: COLOR.primary }}
        >
          {allCompleted ? 'Open module' : 'Start module'} <ArrowRight size={16} />
        </Link>
        <Link href="/dashboard/education" className="ecl-underline text-center text-xs font-medium" style={{ color: COLOR.textMuted }}>
          View all modules
        </Link>
      </div>
    </div>
  );
}
