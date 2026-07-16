export const STATUS_OPTIONS = [
  'Referral Received',
  'Awaiting Consultation',
  'Consultation Booked',
  'Treatment Recommended',
  'Treatment Booked',
  'Treatment Completed',
  'Closed',
];

export const STATUS_TONE = {
  'Referral Received': 'info',
  'Awaiting Consultation': 'action',
  'Consultation Booked': 'purple',
  'Treatment Recommended': 'action',
  'Treatment Booked': 'teal',
  'Treatment Completed': 'complete',
  'Closed': 'closed',
};

export const STATUS_RANK = {
  'Referral Received': 0,
  'Awaiting Consultation': 0,
  'Consultation Booked': 1,
  'Treatment Recommended': 1,
  'Treatment Booked': 2,
  'Treatment Completed': 3,
  'Closed': 3,
};

export const ADMIN_REFERRALS_SEED = [
  { id: 1, patient: 'Sarah J.', practice: 'Keith Holland Opticians', treatment: 'Cataract', status: 'Consultation Booked', date: '8 Jul 2026', fee: 150 },
  { id: 2, patient: 'Michael T.', practice: 'Keith Holland Opticians', treatment: 'ICL', status: 'Treatment Recommended', date: '5 Jul 2026', fee: 200 },
  { id: 3, patient: 'Priya K.', practice: 'Keith Holland Opticians', treatment: 'Dry Eye', status: 'Referral Received', date: '2 Jul 2026', fee: 80 },
  { id: 4, patient: 'David O.', practice: 'Keith Holland Opticians', treatment: 'Laser Vision', status: 'Treatment Completed', date: '28 Jun 2026', fee: 220 },
  { id: 5, patient: 'Aisha R.', practice: 'Vision Plus Opticians', treatment: 'General Ophthalmology', status: 'Awaiting Consultation', date: '6 Jul 2026', fee: 90 },
  { id: 6, patient: 'Tom W.', practice: 'Marylebone Eyecare', treatment: 'Cornea', status: 'Awaiting Consultation', date: '7 Jul 2026', fee: 110 },
  { id: 7, patient: 'Grace L.', practice: 'City Optical', treatment: 'LVC', status: 'Consultation Booked', date: '17 Jul 2026', fee: 200 },
  { id: 8, patient: 'Omar F.', practice: 'Vision Plus Opticians', treatment: 'RLE', status: 'Consultation Booked', date: '22 Jul 2026', fee: 200 },
  { id: 9, patient: 'Helen S.', practice: 'Marylebone Eyecare', treatment: 'Cataract', status: 'Treatment Booked', date: '2 Aug 2026', fee: 150 },
  { id: 10, patient: 'Ruth A.', practice: 'City Optical', treatment: 'Cataract', status: 'Closed', date: '20 Jun 2026', fee: 150 },
  { id: 11, patient: 'Daniel P.', practice: 'Marylebone Eyecare', treatment: 'LVC', status: 'Treatment Booked', date: '6 Aug 2026', fee: 200 },
  { id: 12, patient: 'Nadia H.', practice: 'Vision Plus Opticians', treatment: 'Dry Eye', status: 'Closed', date: '19 Jun 2026', fee: 80 },
];

export function practiceBreakdown(referrals) {
  const byPractice = {};
  referrals.forEach((r) => {
    if (!byPractice[r.practice]) byPractice[r.practice] = { count: 0, fees: 0, treated: 0 };
    byPractice[r.practice].count += 1;
    byPractice[r.practice].fees += r.fee;
    if (r.status === 'Treatment Completed') byPractice[r.practice].treated += 1;
  });
  const total = referrals.length || 1;
  return Object.entries(byPractice)
    .map(([practice, v]) => ({ practice, ...v, share: Math.round((v.count / total) * 100) }))
    .sort((a, b) => b.fees - a.fees);
}
