import { useState } from 'react';
import { DAY_COLORS, NIGHT_COLORS, ColorContext, FONT_BODY, useColors } from './theme/colors';
import { GLOBAL_STYLES } from './theme/globalStyles';
import { ThemeToggle } from './components/shared/ThemeToggle';
import { DashboardShell } from './components/layout/DashboardShell';
import { ReferWizard } from './components/referral-wizard/ReferWizard';
import { LoginScreen } from './pages/auth/LoginScreen';
import { Dashboard } from './pages/partner/Dashboard';
import { ReferralsPage } from './pages/partner/ReferralsPage';
import { InsightsPage } from './pages/partner/InsightsPage';
import { ClinicalEducationPage } from './pages/partner/ClinicalEducationPage';
import { ReferralAssistantPage } from './pages/partner/ReferralAssistantPage';
import { NotificationsPage } from './pages/partner/NotificationsPage';
import { AccountPage } from './pages/partner/AccountPage';
import { AdminHomePage } from './pages/clinic/AdminHomePage';
import { AdminAnalyticsPage } from './pages/clinic/AdminAnalyticsPage';
import { AdminReferralsPage } from './pages/clinic/AdminReferralsPage';
import { AdminPartnersPage } from './pages/clinic/AdminPartnersPage';
import { AdminActivityPage } from './pages/clinic/AdminActivityPage';
import { ADMIN_REFERRALS_SEED } from './data/referrals';
import {
  getPartnerNavItems, getPartnerMobileNavItems, getClinicNavItems, getClinicMobileNavItems,
} from './config/navigation';

const PARTNER_USER = { name: 'Jane', subtitle: 'Keith Holland Opticians', initials: 'JS' };
const CLINIC_USER = { name: 'Business Development', subtitle: 'Eye Clinic London Staff', initials: 'BD' };

function AppShell({ theme, onToggleTheme }) {
  const COLOR = useColors();
  const [role, setRole] = useState(null); // null | 'partner' | 'clinicTeam'
  const [page, setPage] = useState('login');
  const [referOpen, setReferOpen] = useState(false);
  const [referrals, setReferrals] = useState(ADMIN_REFERRALS_SEED);

  function addReferral(newReferral) {
    setReferrals((rs) => [newReferral, ...rs]);
  }
  function updateReferralStatus(id, status) {
    setReferrals((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function handleSignIn() {
    setRole('partner');
    setPage('dashboard');
  }
  function handleStaffSignIn() {
    setRole('clinicTeam');
    setPage('home');
  }
  function handleSignOut() {
    setRole(null);
    setPage('login');
    setReferOpen(false);
  }

  const partnerNavItems = getPartnerNavItems({ setPage, setReferOpen, onSignOut: handleSignOut });
  const partnerMobileItems = getPartnerMobileNavItems({ setPage, setReferOpen });
  const clinicNavItems = getClinicNavItems({ setPage, onSignOut: handleSignOut });
  const clinicMobileItems = getClinicMobileNavItems({ setPage });

  return (
    <div style={{ ...FONT_BODY, minHeight: '100vh', background: COLOR.recessed }}>
      {role === null && (
        <>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <LoginScreen onSignIn={handleSignIn} onStaffSignIn={handleStaffSignIn} />
        </>
      )}

      {role === 'partner' && (
        <>
          <DashboardShell
            navItems={partnerNavItems}
            mobileItems={partnerMobileItems}
            activePage={page}
            user={PARTNER_USER}
            onSignOut={handleSignOut}
            theme={theme}
            onToggleTheme={onToggleTheme}
          >
            {page === 'dashboard' && <Dashboard onRefer={() => setReferOpen(true)} />}
            {page === 'referrals' && <ReferralsPage referrals={referrals} />}
            {page === 'insights' && <InsightsPage />}
            {page === 'education' && <ClinicalEducationPage />}
            {page === 'assistant' && <ReferralAssistantPage />}
            {page === 'notifications' && <NotificationsPage referrals={referrals} />}
            {page === 'account' && <AccountPage />}
          </DashboardShell>
          {referOpen && <ReferWizard onExit={() => setReferOpen(false)} onSubmitReferral={addReferral} />}
        </>
      )}

      {role === 'clinicTeam' && (
        <DashboardShell
          navItems={clinicNavItems}
          mobileItems={clinicMobileItems}
          activePage={page}
          user={CLINIC_USER}
          onSignOut={handleSignOut}
          theme={theme}
          onToggleTheme={onToggleTheme}
        >
          {page === 'home' && <AdminHomePage referrals={referrals} onViewAllPartners={() => setPage('partners')} />}
          {page === 'analytics' && <AdminAnalyticsPage referrals={referrals} />}
          {page === 'referrals' && <AdminReferralsPage referrals={referrals} onStatusChange={updateReferralStatus} />}
          {page === 'partners' && <AdminPartnersPage referrals={referrals} />}
          {page === 'activity' && <AdminActivityPage referrals={referrals} />}
        </DashboardShell>
      )}
    </div>
  );
}

export default function EclPreview() {
  const [theme, setTheme] = useState('day');
  const colors = theme === 'day' ? DAY_COLORS : NIGHT_COLORS;

  return (
    <ColorContext.Provider value={colors}>
      <style>{GLOBAL_STYLES}</style>
      <AppShell theme={theme} onToggleTheme={() => setTheme((t) => (t === 'day' ? 'night' : 'day'))} />
    </ColorContext.Provider>
  );
}
