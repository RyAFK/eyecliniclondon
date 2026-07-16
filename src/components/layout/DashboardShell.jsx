import { useColors } from '../../theme/colors';
import { EclWordmark } from '../shared/EclWordmark';
import { ThemeToggle } from '../shared/ThemeToggle';
import { AppSidebar } from './AppSidebar';
import { MobileNavigation } from './MobileNavigation';

export function DashboardShell({ navItems, mobileItems, activePage, user, onSignOut, theme, onToggleTheme, children }) {
  const COLOR = useColors();

  return (
    <div style={{ minHeight: '100vh', background: COLOR.recessed }}>
      <AppSidebar
        items={navItems}
        activeId={activePage}
        user={user}
        onSignOut={onSignOut}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="lg:pl-64">
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 lg:justify-end"
          style={{ background: `${COLOR.bg}F2`, borderBottom: `1px solid ${COLOR.border}`, backdropFilter: 'blur(6px)' }}
        >
          <span className="lg:hidden">
            <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" />
          </span>
          <span className="hidden text-sm font-medium lg:inline" style={{ color: COLOR.textMuted }}>{user.subtitle}</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} inline />
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
          <div key={activePage} className="ecl-fade-in">
            {children}
          </div>
        </main>

        <footer className="mx-auto max-w-6xl px-4 pb-6 sm:px-6" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex flex-col items-center gap-2 border-t pt-6 text-center lg:pb-0" style={{ borderColor: COLOR.border }}>
            <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" className="opacity-70" />
            <p className="text-xs" style={{ color: COLOR.textMuted }}>
              7 Devonshire Street, Marylebone, London W1W 5DY · 0203 974 4454 · info@eyecliniclondon.com
            </p>
            <p className="text-xs" style={{ color: COLOR.textMuted }}>
              Standalone visual preview — no backend, nothing is saved.
            </p>
          </div>
        </footer>
      </div>

      <MobileNavigation items={mobileItems} activeId={activePage} className="lg:hidden" />
    </div>
  );
}
