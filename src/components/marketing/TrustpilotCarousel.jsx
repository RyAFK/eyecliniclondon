import { useState, useRef, useEffect } from 'react';
import { Star, ArrowUpRight, Quote, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useColors } from '../../theme/colors';
import { TRUSTPILOT_URL, TRUSTPILOT_SUMMARY, TRUSTPILOT_REVIEWS } from '../../data/content';

export function TrustpilotCarousel() {
  const COLOR = useColors();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [entered, setEntered] = useState(true);
  const review = TRUSTPILOT_REVIEWS[index];
  const dragX = useRef(null);
  const dragging = useRef(false);

  function go(delta) {
    setDir(delta);
    setEntered(false);
    setIndex((i) => (i + delta + TRUSTPILOT_REVIEWS.length) % TRUSTPILOT_REVIEWS.length);
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [index]);

  function onPointerDown(e) {
    dragX.current = e.clientX;
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerUp(e) {
    if (!dragging.current || dragX.current === null) return;
    const diff = e.clientX - dragX.current;
    if (Math.abs(diff) > 40) go(diff < 0 ? 1 : -1);
    dragging.current = false;
    dragX.current = null;
  }

  return (
    <div className="ecl-fade-up ecl-lift mt-6 rounded-2xl p-3 sm:w-1/2" style={{ animationDelay: '80ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="ecl-breathe flex h-7 w-7 items-center justify-center rounded-full" style={{ background: '#00B67A1A' }}>
            <Star size={14} fill="#00B67A" style={{ color: '#00B67A' }} />
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: COLOR.text }}>
              Trustpilot <span style={{ color: '#00B67A' }}>{TRUSTPILOT_SUMMARY.score.toFixed(1)}</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} fill="#00B67A" style={{ color: '#00B67A' }} />)}
              </span>
            </p>
            <p className="text-[11px]" style={{ color: COLOR.textMuted }}>
              {TRUSTPILOT_SUMMARY.count}+ reviews · {TRUSTPILOT_SUMMARY.fiveStarPct}% rated 5 stars
            </p>
          </div>
        </div>
        <button
          onClick={() => window.open(TRUSTPILOT_URL, '_blank', 'noopener,noreferrer')}
          className="ecl-underline flex items-center gap-1 text-[11px] font-medium"
          style={{ color: COLOR.secondary }}
        >
          Read all reviews <ArrowUpRight size={11} />
        </button>
      </div>

      <div
        className="relative mt-3 touch-pan-y select-none overflow-hidden rounded-xl p-3"
        style={{ background: COLOR.recessed, minHeight: 108, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { dragging.current = false; dragX.current = null; }}
      >
        <div
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateX(0)' : `translateX(${dir >= 0 ? 22 : -22}px)`,
            transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Quote size={18} style={{ color: COLOR.accent, opacity: 0.35 }} />
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: COLOR.text }}>{review.text}</p>
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: COLOR.text }}>
                {review.name} <BadgeCheck size={12} style={{ color: '#00B67A' }} />
              </p>
              <p className="text-[11px]" style={{ color: COLOR.textMuted }}>{review.treatment}</p>
            </div>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill="#00B67A" style={{ color: '#00B67A' }} />)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {TRUSTPILOT_REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setEntered(false); setIndex(i); }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === index ? 18 : 6, background: i === index ? COLOR.primary : COLOR.border }}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => go(-1)} className="ecl-btn ecl-press flex h-7 w-7 items-center justify-center rounded-full" style={{ border: `1px solid ${COLOR.border}`, color: COLOR.textMuted }}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => go(1)} className="ecl-btn ecl-press flex h-7 w-7 items-center justify-center rounded-full" style={{ border: `1px solid ${COLOR.border}`, color: COLOR.textMuted }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
