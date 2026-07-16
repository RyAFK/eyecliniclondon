import { useColors } from '../../theme/colors';
import { EclWordmark } from '../shared/EclWordmark';
import { ThemeToggle } from '../shared/ThemeToggle';
import { UserProfileSummary } from './UserProfileSummary';
import { NavigationItem } from './NavigationItem';

export function AppSidebar({ items, activeId, user, onSignOut, theme, onToggleTheme }) {
  const COLOR = useColors();
  const mainItems = items.filter((i) => i.id !== 'signout');

  return (
    <aside
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col"
      style={{ background: COLOR.sidebarBg, borderRight: `1px solid ${COLOR.border}` }}
    >
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <EclWordmark tone={theme === 'night' ? 'white' : 'dark'} size="sm" />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} inline />
      </div>

      <div className="px-3">
        <UserProfileSummary name={user.name} subtitle={user.subtitle} initials={user.initials} />
      </div>

      <nav aria-label="Primary" className="mt-4 flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {mainItems.map((item) => (
            <NavigationItem
              key={item.id}
              icon={item.Icon}
              label={item.label}
              isActive={item.id === activeId}
              variant={item.variant}
              onClick={item.onClick}
            />
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4" style={{ borderTop: `1px solid ${COLOR.border}` }}>
        <ul>
          <NavigationItem icon={items.find((i) => i.id === 'signout')?.Icon} label="Sign Out" onClick={onSignOut} />
        </ul>
      </div>
    </aside>
  );
}
