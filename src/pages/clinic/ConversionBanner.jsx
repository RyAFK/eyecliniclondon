import { useColors, FONT_DISPLAY } from '../../theme/colors';
import { STATUS_RANK } from '../../data/referrals';

export function ConversionBanner({ referrals }) {
  const COLOR = useColors();
  const total = referrals.length || 1;
  const booked = referrals.filter((r) => STATUS_RANK[r.status] >= 1).length;
  const treated = referrals.filter((r) => r.status === 'Treatment Completed').length;
  const referralToConsult = Math.round((booked / total) * 100);
  const consultToTreatment = booked ? Math.round((treated / booked) * 100) : 0;
  const referralToTreatment = Math.round((treated / total) * 100);

  const items = [
    { value: referralToConsult, label: 'Referral → Consult' },
    { value: consultToTreatment, label: 'Consult → Treatment' },
    { value: referralToTreatment, label: 'Referral → Treatment' },
  ];

  return (
    <div className="ecl-fade-up mt-6 flex items-stretch overflow-hidden rounded-2xl" style={{ background: COLOR.primary }}>
      {items.map((it, i) => (
        <div
          key={it.label}
          className="flex flex-1 flex-col items-center justify-center px-2 py-4 text-center"
          style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}
        >
          <p className="text-xl sm:text-2xl" style={FONT_DISPLAY}>
            <span className="text-white">{it.value}%</span>
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-white/70 sm:text-xs">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
