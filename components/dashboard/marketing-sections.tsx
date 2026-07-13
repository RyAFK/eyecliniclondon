'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BadgeCheck, ChevronLeft, ChevronRight, Instagram, Mail, Phone, Play, Quote, Star, Users2, Eye } from 'lucide-react';
import { COLOR, FONT_DISPLAY } from '@/lib/theme';

const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/eyecliniclondon.com';
const TRUSTPILOT_SUMMARY = { score: 5.0, count: 304, fiveStarPct: 98 };

const TRUSTPILOT_REVIEWS = [
  { name: 'Betty', text: 'The whole team went beyond medical treatment — professional, emotionally supportive, clear and quick to respond at every step.', treatment: 'Verified patient' },
  { name: 'A patient of Mr Hamada', text: 'Reassured throughout cataract removal and YAG laser treatment — a calming manner that put nerves completely at ease.', treatment: 'Cataract surgery' },
  { name: 'A long-term patient', text: 'Years of care from Mr Hamada, described as endlessly patient with clear, honest and genuinely supportive communication.', treatment: 'Ongoing care' },
  { name: 'A dry eye patient', text: 'Years of gritty, uncomfortable eyes finally eased after a short course of IPL treatment recommended by Mr Hamada.', treatment: 'IPL / Dry eye' },
  { name: 'Newman', text: 'Worsening cataracts had stopped night driving and reading — surgery with Mr Hamada brought colour and clarity back.', treatment: 'Cataract surgery' },
  { name: 'Catherine Hogan', text: 'A pain-free PRK experience with Joanna guiding every step — felt safe, informed and well looked after throughout.', treatment: 'PRK laser surgery' },
];

export function TrustpilotCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [entered, setEntered] = useState(true);
  const review = TRUSTPILOT_REVIEWS[index]!;
  const dragX = useRef<number | null>(null);
  const dragging = useRef(false);

  function go(delta: number) {
    setDir(delta);
    setEntered(false);
    setIndex((i) => (i + delta + TRUSTPILOT_REVIEWS.length) % TRUSTPILOT_REVIEWS.length);
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [index]);

  function onPointerDown(e: React.PointerEvent) {
    dragX.current = e.clientX;
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerUp(e: React.PointerEvent) {
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} fill="#00B67A" style={{ color: '#00B67A' }} />
                ))}
              </span>
            </p>
            <p className="text-[11px]" style={{ color: COLOR.textMuted }}>
              {TRUSTPILOT_SUMMARY.count}+ reviews · {TRUSTPILOT_SUMMARY.fiveStarPct}% rated 5 stars
            </p>
          </div>
        </div>
        <button onClick={() => window.open(TRUSTPILOT_URL, '_blank', 'noopener,noreferrer')} className="ecl-underline flex items-center gap-1 text-[11px] font-medium" style={{ color: COLOR.secondary }}>
          Read all reviews <ArrowUpRight size={11} />
        </button>
      </div>

      <div
        className="relative mt-3 touch-pan-y select-none overflow-hidden rounded-xl p-3"
        style={{ background: COLOR.recessed, minHeight: 108, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          dragging.current = false;
          dragX.current = null;
        }}
      >
        <div
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateX(0)' : `translateX(${dir >= 0 ? 22 : -22}px)`,
            transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Quote size={18} style={{ color: COLOR.accent, opacity: 0.35 }} />
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: COLOR.text }}>
            {review.text}
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: COLOR.text }}>
                {review.name} <BadgeCheck size={12} style={{ color: '#00B67A' }} />
              </p>
              <p className="text-[11px]" style={{ color: COLOR.textMuted }}>
                {review.treatment}
              </p>
            </div>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} fill="#00B67A" style={{ color: '#00B67A' }} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {TRUSTPILOT_REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setEntered(false);
                setIndex(i);
              }}
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

export function SuccessStories() {
  const [imgError, setImgError] = useState(false);
  const videoUrl = 'https://youtu.be/_i11QIhGnG4';
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '160ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
        Success stories
      </p>
      <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        A referring partner&rsquo;s own experience
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        Khansa M. is an optometrist and a long-standing referring partner of ECL. Over the years, she has trusted Mr Samer Hamada with her own ICL surgery and, more recently, referred her mother to us for cataract surgery.
      </p>
      <button
        onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
        className="ecl-lift ecl-press relative mt-5 block text-left"
        style={{ width: '100%', aspectRatio: '16/9', borderRadius: '1.25rem', padding: 3, backgroundImage: `linear-gradient(45deg, ${COLOR.primary} 0%, ${COLOR.secondary} 45%, ${COLOR.accent} 100%)` }}
      >
        {!imgError && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://img.youtube.com/vi/_i11QIhGnG4/maxresdefault.jpg"
            alt="Success story video thumbnail — Optometrist Khansa M."
            onError={() => setImgError(true)}
            style={{ position: 'absolute', inset: 3, width: 'calc(100% - 6px)', height: 'calc(100% - 6px)', objectFit: 'cover', borderRadius: '1.05rem' }}
          />
        )}
        <span className="absolute inset-[3px] rounded-[1.05rem]" style={{ background: 'linear-gradient(180deg, rgba(11,37,69,0.15) 0%, rgba(11,37,69,0.55) 100%)' }} />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <Play size={24} fill={COLOR.primary} style={{ color: COLOR.primary, marginLeft: 3 }} />
        </span>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: 'rgba(11,37,69,0.55)' }}>
          Watch on YouTube
        </span>
        <span className="ecl-breathe absolute -right-2 -top-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium text-white shadow-md" style={{ backgroundImage: `linear-gradient(45deg, ${COLOR.primary} 0%, ${COLOR.secondary} 50%, ${COLOR.accent} 100%)` }}>
          <Eye size={12} /> Optometrist verified
        </span>
      </button>
    </div>
  );
}

export function JimRosenthalStory() {
  const url = 'https://www.instagram.com/reel/DZkLzd0KGy6/?igsh=MnZ0aTZnOHN2a3c=';
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '200ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>
        Patient story
      </p>
      <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
        Caring for Jim Rosenthal
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        It was a real privilege to care for legendary sports broadcaster Jim Rosenthal, who recently underwent bilateral cataract surgery with Mr Samer Hamada.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        We&rsquo;re incredibly grateful to Jim for sharing such kind words about his experience with us.
      </p>

      <button
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        className="ecl-lift ecl-press relative mt-5 block text-left"
        style={{ width: '100%', aspectRatio: '16/9', borderRadius: '1.25rem', padding: 3, backgroundImage: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%)' }}
      >
        <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: '1.05rem', background: `linear-gradient(160deg, ${COLOR.primary} 0%, ${COLOR.secondary} 100%)` }}>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.95)' }}>
              <Play size={24} fill={COLOR.primary} style={{ color: COLOR.primary, marginLeft: 3 }} />
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: 'rgba(0,0,0,0.35)' }}>
              Watch the reel
            </span>
          </span>
        </div>
        <span className="ecl-breathe absolute -right-2 -top-2 flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium text-white shadow-md" style={{ backgroundImage: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%)' }}>
          <Instagram size={12} /> Follow us
        </span>
      </button>
    </div>
  );
}

export function HereToHelp() {
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '240ms', background: COLOR.accentTint, border: `1px solid ${COLOR.border}` }}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.bg, color: COLOR.accent }}>
          <Users2 size={22} />
        </span>
        <div>
          <h2 className="text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            We&rsquo;re here to help
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            Have a question about our treatments? Need patient leaflets for your practice or access to priority appointments?
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
            Our Business Development Manager, Ryan, is here to help.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="mailto:ryan@eyecliniclondon.com" className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white" style={{ background: COLOR.primary }}>
              <Mail size={15} /> ryan@eyecliniclondon.com
            </a>
            <a href="tel:+447340890623" className="ecl-btn ecl-press flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, color: COLOR.text }}>
              <Phone size={15} /> 07340 890 623
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
