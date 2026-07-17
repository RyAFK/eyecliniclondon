'use client';

import { Download } from 'lucide-react';
import { COLOR } from '@/lib/theme';
import type { EducationModule } from '@/types/education-module';

/** Builds a plain-text referral guide from the module's own content — no fabricated external PDF asset, just what's genuinely on the page. */
function buildGuideText(mod: EducationModule): string {
  const lines = [
    `EYE CLINIC LONDON — CLINICAL EDUCATION`,
    `Referral guide: ${mod.title}`,
    '',
    mod.summary,
    '',
    'KEY LEARNING POINTS',
    ...mod.keyLearningPoints.map((p) => `- ${p}`),
    '',
    'OVERVIEW',
    ...mod.overview,
    '',
    'This guide is general, non-diagnostic educational content for referring',
    'practitioners. It does not replace clinical judgement, local protocols,',
    'or emergency assessment where indicated.',
    '',
    'Questions about a specific case? Contact Ryan, Business Development',
    'Manager: ryan@eyecliniclondon.com · 07340 890 623',
  ];
  return lines.join('\n');
}

export function DownloadGuideButton({ module: mod }: { module: EducationModule }) {
  function download() {
    const blob = new Blob([buildGuideText(mod)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mod.slug}-referral-guide.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
      style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}
    >
      <Download size={16} /> Download referral guide
    </button>
  );
}
