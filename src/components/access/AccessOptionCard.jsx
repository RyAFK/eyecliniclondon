import { useColors } from '../../theme/colors';

export function AccessOptionCard({ title, description, Icon, buttonLabel, onClick }) {
  const COLOR = useColors();
  return (
    <div
      className="ecl-fade-up ecl-lift flex h-full flex-col rounded-2xl p-6 text-left"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'rgba(176,138,78,0.18)', color: COLOR.accent }}
      >
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {description}
      </p>
      <button
        onClick={onClick}
        className="ecl-btn ecl-press mt-5 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: COLOR.accent, color: COLOR.primary }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
