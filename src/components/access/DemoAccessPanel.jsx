import { Sparkles, Users2, ClipboardList } from 'lucide-react';
import { useColors } from '../../theme/colors';

export function DemoAccessPanel({ onViewPartnerDemo, onViewClinicDemo }) {
  const COLOR = useColors();
  return (
    <div
      className="ecl-fade-up ecl-lift flex h-full flex-col rounded-2xl p-6 text-left"
      style={{ background: 'rgba(255,255,255,0.06)', border: `1px dashed ${COLOR.accent}` }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'rgba(176,138,78,0.18)', color: COLOR.accent }}
      >
        <Sparkles size={22} strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-white">Explore the demo</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Preview the platform with sample data — no account needed. Clearly marked as demonstration data throughout.
      </p>
      <div className="mt-5 space-y-2.5">
        <button
          onClick={onViewPartnerDemo}
          className="ecl-btn ecl-press flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          <Users2 size={15} /> View Partner Demo
        </button>
        <button
          onClick={onViewClinicDemo}
          className="ecl-btn ecl-press flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          <ClipboardList size={15} /> View Clinic Team Demo
        </button>
      </div>
    </div>
  );
}
