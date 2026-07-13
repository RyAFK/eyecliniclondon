'use client';

import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode | ((visible: boolean) => React.ReactNode);
  delay?: number;
  className?: string;
}) {
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
