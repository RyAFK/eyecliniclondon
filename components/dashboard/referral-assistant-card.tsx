import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';

export function ReferralAssistantCard() {
  return (
    <div
      className="ecl-fade-up ecl-lift mt-6 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      style={{ animationDelay: '80ms', background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.bg, color: COLOR.accent }}>
          <Sparkles size={22} />
        </span>
        <div>
          <h2 className="text-xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            Not sure which pathway fits?
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            The Referral Assistant asks a few quick questions and suggests an Eye Clinic London pathway to discuss — non-diagnostic guidance only,
            never a replacement for your own clinical judgement.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/referral-assistant"
        className="ecl-btn ecl-press flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
        style={{ background: COLOR.primary }}
      >
        Open Referral Assistant <ArrowRight size={16} />
      </Link>
    </div>
  );
}
