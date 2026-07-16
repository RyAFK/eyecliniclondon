import { Clock3 } from 'lucide-react';
import { useColors, FONT_MONO } from '../../theme/colors';

export function FollowUpsCard() {
  const COLOR = useColors();
  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: COLOR.text }}>
        <Clock3 size={16} style={{ color: COLOR.accent }} /> Follow-ups due this week
      </p>
      <p className="text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        <span style={{ ...FONT_MONO, color: COLOR.text }}>10/07</span> · ClearSight Chelsea — chased two stalled cataract referrals.
      </p>
    </div>
  );
}
