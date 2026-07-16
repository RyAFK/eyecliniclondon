import { PageHeader } from '../../components/layout/PageHeader';
import { PartnersLeaderboard } from './PartnersLeaderboard';

export function AdminPartnersPage({ referrals }) {
  return (
    <div>
      <PageHeader eyebrow="Business Development" title="Partners" description="Referring practices ranked by fees earned." />
      <div className="mt-6">
        <PartnersLeaderboard referrals={referrals} />
      </div>
    </div>
  );
}
