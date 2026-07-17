'use client';

import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import type { EducationModuleCaseStudy } from '@/types/education-module';

export function CaseStudy({ caseStudy }: { caseStudy: EducationModuleCaseStudy }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h3 className="flex items-center gap-2 text-lg" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        <ClipboardList size={18} style={{ color: COLOR.secondary }} /> Interactive case study
      </h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: COLOR.text }}>
        {caseStudy.scenario}
      </p>
      <p className="mt-3 text-sm font-medium" style={{ color: COLOR.text }}>
        {caseStudy.prompt}
      </p>
      <p className="mt-1 text-xs" style={{ color: COLOR.textMuted }}>
        Select each consideration below to see why it matters.
      </p>

      <div className="mt-4 space-y-2">
        {caseStudy.considerations.map((c) => {
          const expanded = open === c.id;
          return (
            <div key={c.id} className="overflow-hidden rounded-xl" style={{ border: `1px solid ${COLOR.border}` }}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : c.id)}
                aria-expanded={expanded}
                className="ecl-btn flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium"
                style={{ background: expanded ? COLOR.recessed : COLOR.bg, color: COLOR.text }}
              >
                {c.label}
                <ChevronDown size={16} style={{ color: COLOR.textMuted, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }} />
              </button>
              {expanded && (
                <p className="ecl-fade-in px-4 pb-3.5 text-sm leading-relaxed" style={{ color: COLOR.textMuted, background: COLOR.recessed }}>
                  {c.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
