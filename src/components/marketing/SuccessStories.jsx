import { Play, Eye, ArrowUpRight } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';

export function SuccessStories() {
  const COLOR = useColors();
  const videoUrl = 'https://youtu.be/_i11QIhGnG4';
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '160ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>Success stories</p>
      <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>A referring partner's own experience</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        Khansa M. is an optometrist and a long-standing referring partner of ECL. Over the years, she has trusted Mr Samer Hamada with her own ICL surgery and, more recently, referred her mother to us for cataract surgery.
      </p>
      <button
        onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
        className="ecl-lift ecl-press mt-5 block w-full text-left"
        style={{
          borderRadius: '1.25rem',
          padding: 3,
          overflow: 'hidden',
          backgroundImage: `linear-gradient(45deg, ${COLOR.primary} 0%, ${COLOR.secondary} 45%, ${COLOR.accent} 100%)`,
        }}
      >
        <div
          className="flex items-center justify-center gap-3 px-6 py-5"
          style={{ background: COLOR.bg, borderRadius: 'calc(1.25rem - 3px)', overflow: 'hidden' }}
        >
          <span className="ecl-breathe flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: COLOR.primary }}>
            <Play size={18} fill="#fff" style={{ color: '#fff', marginLeft: 2 }} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLOR.text }}>Watch on YouTube</p>
            <p className="flex items-center gap-1 text-xs" style={{ color: COLOR.textMuted }}>
              <Eye size={11} /> Optometrist verified · video link
            </p>
          </div>
          <ArrowUpRight size={16} className="ml-auto shrink-0" style={{ color: COLOR.accent }} />
        </div>
      </button>
    </div>
  );
}
