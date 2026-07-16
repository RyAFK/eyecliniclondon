import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useColors } from '../../theme/colors';
import { ChartTooltip } from '../../components/shared/ChartHelpers';

export function TreatmentDonut({ referrals }) {
  const COLOR = useColors();
  const buckets = { Cataract: 0, 'Dry Eye': 0, ICL: 0, LVC: 0, Other: 0 };
  referrals.forEach((r) => {
    if (r.treatment.includes('Cataract')) buckets.Cataract += 1;
    else if (r.treatment.includes('Dry Eye')) buckets['Dry Eye'] += 1;
    else if (r.treatment.includes('ICL')) buckets.ICL += 1;
    else if (r.treatment.includes('LVC') || r.treatment.includes('Laser')) buckets.LVC += 1;
    else buckets.Other += 1;
  });
  const data = Object.entries(buckets).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0);
  const colors = { Cataract: COLOR.primary, 'Dry Eye': COLOR.secondary, ICL: COLOR.accent, LVC: '#7C9CB8', Other: COLOR.future };

  return (
    <div className="ecl-fade-up mt-6 rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <h2 className="mb-4 font-medium" style={{ color: COLOR.text }}>Referrals by treatment type</h2>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {data.map((d) => <Cell key={d.name} fill={colors[d.name]} stroke="none" />)}
            </Pie>
            <Tooltip content={<ChartTooltip suffix=" referrals" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[d.name] }} /> {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
