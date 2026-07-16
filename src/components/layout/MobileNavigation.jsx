import { useColors } from '../../theme/colors';

export function MobileNavigation({ items, activeId, className = '' }) {
  const COLOR = useColors();
  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 bottom-0 z-40 ${className}`}
      style={{ background: `${COLOR.bg}F5`, backdropFilter: 'blur(10px)', borderTop: `1px solid ${COLOR.border}`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-5xl items-end justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          if (item.variant === 'fab') {
            return (
              <button key={item.id} onClick={item.onClick} className="ecl-btn ecl-press -mt-6 flex flex-col items-center gap-1" aria-label={item.label}>
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                  style={{ background: COLOR.accent, color: COLOR.primary, border: `4px solid ${COLOR.bg}` }}
                >
                  <item.Icon size={22} />
                </span>
                <span className="whitespace-nowrap text-[10px] font-medium" style={{ color: isActive ? COLOR.text : COLOR.textMuted }}>{item.label}</span>
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className="ecl-btn flex flex-col items-center gap-1 rounded-lg px-3 py-1.5"
              style={{ color: isActive ? COLOR.text : COLOR.textMuted }}
            >
              <item.Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
