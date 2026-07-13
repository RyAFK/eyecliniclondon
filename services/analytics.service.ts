/**
 * Pure aggregation functions over a `Referral[]` — no data fetching here.
 * Every analytics view (partner insights, staff analytics, BD dashboard)
 * calls listReferrals() once and derives its numbers from these functions,
 * so there is exactly one source of truth for every metric on screen.
 */
import { JOURNEY_STATUS_RANK, POSITIVE_OUTCOMES, treatmentName, type Referral } from '@/types/referral';

export interface PracticeBreakdownRow {
  practiceId: string;
  practiceName: string;
  count: number;
  fees: number;
  treated: number;
  share: number;
}

export function practiceBreakdown(referrals: Referral[]): PracticeBreakdownRow[] {
  const byPractice = new Map<string, PracticeBreakdownRow>();
  for (const r of referrals) {
    const existing = byPractice.get(r.practiceId) ?? {
      practiceId: r.practiceId,
      practiceName: r.practiceName,
      count: 0,
      fees: 0,
      treated: 0,
      share: 0,
    };
    existing.count += 1;
    existing.fees += r.feeAmount;
    if (r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')) {
      existing.treated += 1;
    }
    byPractice.set(r.practiceId, existing);
  }
  const total = referrals.length || 1;
  return [...byPractice.values()]
    .map((row) => ({ ...row, share: Math.round((row.count / total) * 100) }))
    .sort((a, b) => b.fees - a.fees);
}

export interface FunnelStage {
  label: string;
  count: number;
}

export function journeyFunnel(referrals: Referral[]): FunnelStage[] {
  return [
    { label: 'Referrals received', count: referrals.length },
    { label: 'Consultations booked', count: referrals.filter((r) => JOURNEY_STATUS_RANK[r.journeyStatus] >= 1).length },
    { label: 'Treatments booked', count: referrals.filter((r) => JOURNEY_STATUS_RANK[r.journeyStatus] >= 2).length },
    {
      label: 'Treatments completed',
      count: referrals.filter(
        (r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')
      ).length,
    },
  ];
}

export interface ConversionRates {
  referralToConsult: number;
  consultToTreatment: number;
  referralToTreatment: number;
}

export function conversionRates(referrals: Referral[]): ConversionRates {
  const total = referrals.length || 1;
  const booked = referrals.filter((r) => JOURNEY_STATUS_RANK[r.journeyStatus] >= 1).length;
  const treated = referrals.filter(
    (r) => r.journeyStatus === 'treatment_completed' || (r.journeyStatus === 'closed' && r.outcome === 'treatment_successful')
  ).length;
  return {
    referralToConsult: Math.round((booked / total) * 100),
    consultToTreatment: booked ? Math.round((treated / booked) * 100) : 0,
    referralToTreatment: Math.round((treated / total) * 100),
  };
}

export interface TreatmentMixRow {
  treatmentType: string;
  name: string;
  value: number;
}

export function treatmentMix(referrals: Referral[]): TreatmentMixRow[] {
  const buckets = new Map<string, number>();
  for (const r of referrals) {
    buckets.set(r.treatmentType, (buckets.get(r.treatmentType) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .map(([treatmentType, value]) => ({ treatmentType, name: treatmentName(treatmentType), value }))
    .sort((a, b) => b.value - a.value);
}

export interface MonthlyActivityRow {
  month: string;
  referrals: number;
  revenue: number;
}

/** Groups referrals by calendar month (oldest to newest) for the last `months` months. */
export function monthlyActivity(referrals: Referral[], months = 6): MonthlyActivityRow[] {
  const now = new Date();
  const buckets: MonthlyActivityRow[] = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: d.toLocaleDateString('en-GB', { month: 'short' }), referrals: 0, revenue: 0 });
  }
  for (const r of referrals) {
    const created = new Date(r.createdAt);
    const monthsAgo =
      (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    const idx = months - 1 - monthsAgo;
    if (idx >= 0 && idx < buckets.length) {
      buckets[idx]!.referrals += 1;
      if (r.feeStatus === 'paid' || r.feeStatus === 'invoiced') buckets[idx]!.revenue += r.feeAmount;
    }
  }
  return buckets;
}

export interface OutcomeBreakdownRow {
  outcome: string;
  count: number;
  positive: boolean;
}

/** Splits closed referrals by outcome — deliberately does NOT treat every closed referral as "lost". */
export function outcomeBreakdown(referrals: Referral[]): OutcomeBreakdownRow[] {
  const closed = referrals.filter((r) => r.journeyStatus === 'closed' && r.outcome);
  const buckets = new Map<string, number>();
  for (const r of closed) {
    buckets.set(r.outcome as string, (buckets.get(r.outcome as string) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([outcome, count]) => ({
    outcome,
    count,
    positive: POSITIVE_OUTCOMES.includes(outcome as (typeof POSITIVE_OUTCOMES)[number]),
  }));
}

export interface FeeSummary {
  totalEarned: number;
  paid: number;
  invoiced: number;
  pending: number;
}

export function feeSummary(referrals: Referral[]): FeeSummary {
  return referrals.reduce<FeeSummary>(
    (acc, r) => {
      if (r.feeStatus === 'paid') acc.paid += r.feeAmount;
      if (r.feeStatus === 'invoiced') acc.invoiced += r.feeAmount;
      if (r.feeStatus === 'pending') acc.pending += r.feeAmount;
      if (r.feeStatus !== 'not_eligible') acc.totalEarned += r.feeAmount;
      return acc;
    },
    { totalEarned: 0, paid: 0, invoiced: 0, pending: 0 }
  );
}
