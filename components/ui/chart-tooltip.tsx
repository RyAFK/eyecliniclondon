export function ChartTooltip({
  active,
  payload,
  label,
  prefix = '',
  suffix = '',
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="ecl-fade-in rounded-lg px-3 py-2 text-xs shadow-sm" style={{ background: '#0B2545', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: '#B08A4E' }}>
          {prefix}
          {p.value.toLocaleString()}
          {suffix}
        </p>
      ))}
    </div>
  );
}
