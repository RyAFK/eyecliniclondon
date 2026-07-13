import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';
import { requireStaff } from '@/lib/auth';
import { referralsService, documentsService } from '@/services';
import { COLOR, FONT_DISPLAY, FONT_MONO } from '@/lib/theme';
import { JourneyStatusBadge, OutcomeBadge } from '@/components/referrals/status-badge';
import { JourneyTimeline } from '@/components/referrals/journey-timeline';
import { ReferralDetailControls } from '@/components/referrals/referral-detail-controls';
import { DocumentsPanel } from '@/components/referrals/documents-panel';
import { treatmentName } from '@/types/referral';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function StaffReferralDetailPage({ params }: { params: { id: string } }) {
  const user = await requireStaff();
  const referral = await referralsService.getReferral(user, params.id);
  if (!referral) notFound();

  const [history, documents] = await Promise.all([
    referralsService.getStatusHistory(user, referral.id),
    documentsService.listDocuments(user, referral.id),
  ]);

  return (
    <>
      <Link href="/staff/referrals" className="ecl-underline mb-4 flex items-center gap-1.5 text-sm font-medium" style={{ color: COLOR.textMuted }}>
        <ArrowLeft size={15} /> Back to referrals
      </Link>

      <div className="ecl-fade-up flex flex-wrap items-start justify-between gap-4 rounded-2xl p-6" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
        <div>
          <p className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.textMuted }}>
            <Building2 size={12} /> {referral.practiceName} · <span style={FONT_MONO}>{referral.reference}</span>
          </p>
          <h1 className="mt-1 text-2xl" style={{ ...FONT_DISPLAY, color: COLOR.text }}>
            {referral.patientFirstName} {referral.patientLastName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLOR.textMuted }}>
            {treatmentName(referral.treatmentType)} · Referred {formatDate(referral.createdAt)} · {formatCurrency(referral.feeAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <JourneyStatusBadge status={referral.journeyStatus} />
          {referral.outcome && <OutcomeBadge outcome={referral.outcome} />}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
            <h3 className="mb-3 font-medium" style={{ color: COLOR.text }}>
              Patient &amp; clinical details
            </h3>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Date of birth
                </dt>
                <dd style={{ color: COLOR.text }}>{formatDate(referral.patientDob)}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Phone
                </dt>
                <dd style={{ color: COLOR.text }}>{referral.patientPhone}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Email
                </dt>
                <dd style={{ color: COLOR.text }}>{referral.patientEmail ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Preferred contact
                </dt>
                <dd className="capitalize" style={{ color: COLOR.text }}>
                  {referral.preferredContactMethod}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Reason for referral
                </dt>
                <dd style={{ color: COLOR.text }}>{referral.referralReason || '—'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Presenting symptoms
                </dt>
                <dd style={{ color: COLOR.text }}>{referral.presentingSymptoms || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Unaided VA
                </dt>
                <dd style={FONT_MONO}>{referral.unaidedVisualAcuity || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs" style={{ color: COLOR.textMuted }}>
                  Best corrected VA
                </dt>
                <dd style={FONT_MONO}>{referral.bestCorrectedVisualAcuity || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="ecl-fade-up rounded-2xl p-5" style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}` }}>
            <h3 className="mb-4 font-medium" style={{ color: COLOR.text }}>
              Patient journey
            </h3>
            <JourneyTimeline history={history} />
          </div>
        </div>

        <div className="space-y-6">
          <ReferralDetailControls referral={referral} />
          <DocumentsPanel documents={documents} />
        </div>
      </div>
    </>
  );
}
