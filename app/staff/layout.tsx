import { requireStaff } from '@/lib/auth';
import { StaffHeader } from '@/components/layout/staff-header';
import { COLOR } from '@/lib/theme';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  return (
    <div style={{ minHeight: '100vh', background: COLOR.recessed }}>
      <StaffHeader role={user.role} />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</div>
    </div>
  );
}
