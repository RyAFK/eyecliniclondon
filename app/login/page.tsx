import { getCurrentUser } from '@/lib/auth';
import { isDemoMode } from '@/lib/demo/config';
import { isStaffRole } from '@/types/user';
import { redirect } from 'next/navigation';
import { LoginScreen } from '@/components/auth/login-screen';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(isStaffRole(user.role) ? '/staff' : '/dashboard');

  return (
    <>
      <ThemeToggle />
      <LoginScreen demoMode={isDemoMode()} />
    </>
  );
}
