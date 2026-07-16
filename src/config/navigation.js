import {
  Home, ListChecks, TrendingUp, UserPlus, GraduationCap, MessageCircle, Bell, User, LogOut,
  ClipboardList, FileText, Users2, Activity,
} from 'lucide-react';

export function getPartnerNavItems({ setPage, setReferOpen, onSignOut }) {
  return [
    { id: 'dashboard', label: 'Dashboard', Icon: Home, onClick: () => setPage('dashboard') },
    { id: 'referrals', label: 'Referrals', Icon: ListChecks, onClick: () => setPage('referrals') },
    { id: 'insights', label: 'Insights', Icon: TrendingUp, onClick: () => setPage('insights') },
    { id: 'refer', label: 'Refer a Patient', Icon: UserPlus, onClick: () => setReferOpen(true), variant: 'primary' },
    { id: 'education', label: 'Clinical Education', Icon: GraduationCap, onClick: () => setPage('education') },
    { id: 'assistant', label: 'Referral Assistant', Icon: MessageCircle, onClick: () => setPage('assistant') },
    { id: 'notifications', label: 'Notifications', Icon: Bell, onClick: () => setPage('notifications') },
    { id: 'account', label: 'Account', Icon: User, onClick: () => setPage('account') },
    { id: 'signout', label: 'Sign Out', Icon: LogOut, onClick: onSignOut },
  ];
}

export function getPartnerMobileNavItems({ setPage, setReferOpen }) {
  return [
    { id: 'dashboard', label: 'Home', Icon: Home, onClick: () => setPage('dashboard') },
    { id: 'insights', label: 'Insights', Icon: TrendingUp, onClick: () => setPage('insights') },
    { id: 'referrals', label: 'My Referrals', Icon: ListChecks, onClick: () => setPage('referrals') },
    { id: 'refer', label: 'Refer a Patient', Icon: UserPlus, onClick: () => setReferOpen(true), variant: 'fab' },
  ];
}

export function getClinicNavItems({ setPage, onSignOut }) {
  return [
    { id: 'home', label: 'Dashboard', Icon: ClipboardList, onClick: () => setPage('home') },
    { id: 'analytics', label: 'Analytics', Icon: TrendingUp, onClick: () => setPage('analytics') },
    { id: 'referrals', label: 'Referrals', Icon: FileText, onClick: () => setPage('referrals') },
    { id: 'partners', label: 'Partners', Icon: Users2, onClick: () => setPage('partners') },
    { id: 'activity', label: 'Activity', Icon: Activity, onClick: () => setPage('activity') },
    { id: 'signout', label: 'Sign Out', Icon: LogOut, onClick: onSignOut },
  ];
}

export function getClinicMobileNavItems({ setPage }) {
  return [
    { id: 'home', label: 'Home', Icon: ClipboardList, onClick: () => setPage('home') },
    { id: 'analytics', label: 'Analytics', Icon: TrendingUp, onClick: () => setPage('analytics') },
    { id: 'referrals', label: 'Referrals', Icon: FileText, onClick: () => setPage('referrals') },
    { id: 'partners', label: 'Partners', Icon: Users2, onClick: () => setPage('partners') },
    { id: 'activity', label: 'Activity', Icon: Activity, onClick: () => setPage('activity') },
  ];
}
