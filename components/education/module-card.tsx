import Link from 'next/link';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { Pill } from '@/components/ui/pill';
import type { EducationModule } from '@/types/education-module';

const NEW_WINDOW_DAYS = 21;

function isNew(publishedAt: string): boolean {
  const days = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= NEW_WINDOW_DAYS;
}

export function EducationModuleCard({ module: mod, completed }: { module: EducationModule; completed: boolean }) {
  return (
    <Link
      href={`/dashboard/education/${mod.slug}`}
      className="ecl-fade-up ecl-lift ecl-press flex h-full flex-col gap-3 rounded-2xl p-5"
      style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <Pill tone="info">{mod.category}</Pill>
        <div className="flex items-center gap-1.5">
          {isNew(mod.publishedAt) && !completed && <Pill tone="accent">New</Pill>}
          {completed && (
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: COLOR.complete }}>
              <CheckCircle2 size={13} /> Completed
            </span>
          )}
        </div>
      </div>
      <h3 className="text-base font-medium leading-snug" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        {mod.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        {mod.summary}
      </p>
      <p className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
        <Clock3 size={12} /> {mod.estimatedMinutes} min
      </p>
    </Link>
  );
}
