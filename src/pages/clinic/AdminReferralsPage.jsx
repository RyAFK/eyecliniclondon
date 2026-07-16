import { PageHeader } from '../../components/layout/PageHeader';
import { AdminOverview } from './AdminOverview';
import { ReferralsTable } from './ReferralsTable';

export function AdminReferralsPage({ referrals, onStatusChange }) {
  return (
    <div>
      <PageHeader eyebrow="Business Development" title="Referrals" description="All referrals across every referring partner, searchable and filterable." />
      <AdminOverview referrals={referrals} />
      <div className="mt-6">
        <ReferralsTable referrals={referrals} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}
