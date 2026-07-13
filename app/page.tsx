import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isStaffRole } from '@/types/user';

export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  redirect(isStaffRole(user.role) ? '/staff' : '/dashboard');
}
