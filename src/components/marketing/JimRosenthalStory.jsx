import { Play, Instagram, ArrowUpRight } from 'lucide-react';
import { useColors, FONT_DISPLAY } from '../../theme/colors';

export function JimRosenthalStory() {
  const COLOR = useColors();
  const url = 'https://www.instagram.com/reel/DZkLzd0KGy6/?igsh=MnZ0aTZnOHN2a3c=';
  return (
    <div className="ecl-fade-up mt-10 rounded-2xl p-6 sm:p-8" style={{ animationDelay: '200ms', background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: COLOR.accent }}>Patient story</p>
      <h2 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>Caring for Jim Rosenthal</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        It was a real privilege to care for legendary sports broadcaster Jim Rosenthal, who recently underwent bilateral cataract surgery with Mr Samer Hamada.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: COLOR.textMuted }}>
        We're incredibly grateful to Jim for sharing such kind words about his experience with us.
      </p>

      <button
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        className="ecl-lift ecl-press mt-5 block w-full text-left"
        style={{
          borderRadius: '1.25rem',
          padding: 3,
          backgroundImage: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%)',
        }}
      >
        <div className="flex items-center justify-center gap-3 rounded-[1.05rem] px-6 py-5" style={{ background: COLOR.bg }}>
          <span className="ecl-breathe flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundImage: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 45%, #6228d7 100%)' }}>
            <Play size={18} fill="#fff" style={{ color: '#fff', marginLeft: 2 }} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: COLOR.text }}>Watch the reel</p>
            <p className="flex items-center gap-1 text-xs" style={{ color: COLOR.textMuted }}>
              <Instagram size={11} /> Follow us · video link
            </p>
          </div>
          <ArrowUpRight size={16} className="ml-auto shrink-0" style={{ color: COLOR.accent }} />
        </div>
      </button>
    </div>
  );
}
