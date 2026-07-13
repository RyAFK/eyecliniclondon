'use client';

import { useRef } from 'react';

export function ConfettiBurst({ active }: { active: boolean }) {
  const CONFETTI_COLORS = ['#B08A4E', '#2F7D5A', '#1D4E75', '#0B2545', '#D98BA0'];
  const pieces = useRef(
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 250,
      duration: 1700 + Math.random() * 1300,
      rotate: Math.random() * 360,
      width: 5 + Math.random() * 5,
      height: 8 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      round: Math.random() > 0.5,
    }))
  ).current;

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: -24,
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `eclConfettiFall ${p.duration}ms ease-in ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
