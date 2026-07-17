import { Sparkles } from 'lucide-react';
import { requirePartner } from '@/lib/auth';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';
import { LensRings } from '@/components/ui/motifs';
import { ReferralAssistant } from '@/components/referrals/referral-assistant';

export default async function ReferralAssistantPage() {
  await requirePartner();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="ecl-fade-up relative overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
        <LensRings className="ecl-breathe pointer-events-none absolute -right-8 -top-10 opacity-40" size={200} />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
            <Sparkles size={14} /> Referral Assistant
          </p>
          <h1 className="mt-2 text-2xl text-white sm:text-3xl" style={FONT_DISPLAY}>
            Not sure which pathway fits?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Answer a few quick questions for non-diagnostic guidance on which Eye Clinic London service may be worth discussing. This tool does not
            diagnose and does not replace your own clinical judgement.
          </p>
        </div>
      </div>

      <div className="ecl-fade-up mt-6 rounded-2xl p-5 sm:p-8" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <ReferralAssistant />
      </div>
    </div>
  );
}
