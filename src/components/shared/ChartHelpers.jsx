import { useState, useEffect, useRef } from 'react';

export function ChartTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="ecl-fade-in rounded-lg px-3 py-2 text-xs shadow-sm" style={{ background: '#0B2545', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: '#B08A4E' }}>{prefix}{p.value.toLocaleString()}{suffix}</p>
      ))}
    </div>
  );
}

export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(entry.target); }
      });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView(0.15);
  const content = typeof children === 'function' ? children(visible) : children;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.98)',
        transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {content}
    </div>
  );
}
