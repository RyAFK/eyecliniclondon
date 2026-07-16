import {
  Eye, Sparkles, ScanEye, Zap, CircleDot, Droplets, Stethoscope, MoreHorizontal,
  PoundSterling, Percent, ListChecks, Clock3, Calendar, CheckCircle2, FileText,
} from 'lucide-react';

export const TREATMENT_TYPES = [
  { id: 'cataract', name: 'Cataract', description: 'Lens replacement for cataracts', Icon: Eye },
  { id: 'rle', name: 'Refractive Lens Exchange', description: 'Lens exchange for refractive correction', Icon: Sparkles },
  { id: 'icl', name: 'Implantable Contact Lens / ICL', description: 'Phakic lens implantation', Icon: ScanEye },
  { id: 'lvc', name: 'Laser Vision Correction', description: 'LASIK / PRK / SMILE', Icon: Zap },
  { id: 'cornea', name: 'Cornea', description: 'Corneal conditions and transplant', Icon: CircleDot },
  { id: 'dry_eye', name: 'Dry Eye', description: 'Dry eye assessment and management', Icon: Droplets },
  { id: 'general', name: 'General Ophthalmology', description: 'General ophthalmic assessment', Icon: Stethoscope },
  { id: 'other', name: 'Other', description: 'Any other treatment enquiry', Icon: MoreHorizontal },
];

export const TREATMENT_FEE_MAP = { cataract: 150, rle: 180, icl: 200, lvc: 200, cornea: 120, dry_eye: 80, general: 90, other: 100 };

export const STEPS = ['Patient details', 'Referral type', 'Clinical information', 'Documents', 'Review & submit'];

export const CONSENT_TEXT =
  'I confirm that the patient is aware of this referral and that I am authorised to securely provide the information contained in this referral to Eye Clinic London.';

export const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/eyecliniclondon.com';
export const TRUSTPILOT_SUMMARY = { score: 5.0, count: 304, fiveStarPct: 98 };

export const TRUSTPILOT_REVIEWS = [
  { name: 'Betty', text: 'The whole team went beyond medical treatment — professional, emotionally supportive, clear and quick to respond at every step.', treatment: 'Verified patient' },
  { name: 'A patient of Mr Hamada', text: 'Reassured throughout cataract removal and YAG laser treatment — a calming manner that put nerves completely at ease.', treatment: 'Cataract surgery' },
  { name: 'A long-term patient', text: 'Years of care from Mr Hamada, described as endlessly patient with clear, honest and genuinely supportive communication.', treatment: 'Ongoing care' },
  { name: 'A dry eye patient', text: 'Years of gritty, uncomfortable eyes finally eased after a short course of IPL treatment recommended by Mr Hamada.', treatment: 'IPL / Dry eye' },
  { name: 'Newman', text: 'Worsening cataracts had stopped night driving and reading — surgery with Mr Hamada brought colour and clarity back.', treatment: 'Cataract surgery' },
  { name: 'Catherine Hogan', text: 'A pain-free PRK experience with Joanna guiding every step — felt safe, informed and well looked after throughout.', treatment: 'PRK laser surgery' },
];

export const CPD_EVENTS = [
  {
    title: 'Understanding the Evolution & Clinical Impact of Modern Dry Eye Guidelines',
    points: '4 CPD points',
    date: 'Tue 21 July 2026',
    time: '6:30–9:00pm · 7 Devonshire St',
    speakers: 'Mr Samer Hamada · Louise Veenhuis',
    url: 'https://www.eventbrite.com/e/understanding-the-evolution-clinical-impact-of-modern-dry-eye-guidelines-tickets-1993458759813?aff=oddtdtcreator',
  },
];

export const CLINIC_NEWS = [
  { title: 'Mr Samer Hamada attended CroOphthaCon 2026 in Solin, Croatia, connecting with the Croatian ophthalmology community', date: 'via LinkedIn', url: 'https://www.linkedin.com/in/samer-hamada-b980621b' },
  { title: 'Back from the 5th International Dry Eye Congress in Naples, continuing his work on ocular surface disease', date: 'via LinkedIn', url: 'https://www.linkedin.com/in/samer-hamada-b980621b' },
  { title: 'Launched the Ocular Surface Academy (OSA), a new platform for international ophthalmology education', date: 'via LinkedIn', url: 'https://www.linkedin.com/in/samer-hamada-b980621b' },
];

export const STAT_CARDS = [
  { id: 'active', label: 'Active Referrals', value: 18, tone: 'default', Icon: ListChecks },
  { id: 'awaiting', label: 'Awaiting Consultation', value: 4, tone: 'action', Icon: Clock3 },
  { id: 'booked', label: 'Consultation Booked', value: 6, tone: 'default', Icon: Calendar },
  { id: 'treatment_booked', label: 'Treatment Booked', value: 3, tone: 'default', Icon: Stethoscope },
  { id: 'completed', label: 'Treatment Completed', value: 21, tone: 'complete', Icon: CheckCircle2 },
  { id: 'closed', label: 'Closed Referrals', value: 32, tone: 'default', Icon: FileText },
];

export const STAT_EXAMPLES = {
  active: { description: 'All referrals currently open and being progressed through the clinic.', moreCount: 10, rows: [
    { patient: 'Sarah J.', treatment: 'Cataract', detail: 'Consultation booked for 15 July' },
    { patient: 'Priya K.', treatment: 'Dry Eye', detail: 'Referral received, awaiting triage' },
    { patient: 'Michael T.', treatment: 'ICL', detail: 'Treatment recommended after consultation' },
    { patient: 'Aisha R.', treatment: 'General Ophthalmology', detail: 'Referred 6 July · booking in progress' },
    { patient: 'Tom W.', treatment: 'Cornea', detail: 'Referred 7 July · awaiting patient availability' },
    { patient: 'Grace L.', treatment: 'LVC', detail: 'Consultation on 17 July · Devonshire St' },
    { patient: 'Omar F.', treatment: 'RLE', detail: 'Consultation on 22 July with Mr Hamada' },
    { patient: 'Helen S.', treatment: 'Cataract', detail: 'Treatment booked for 2 August' },
  ]},
  awaiting: { description: 'Referrals received and triaged, waiting to be scheduled for a first consultation.', moreCount: 0, rows: [
    { patient: 'Priya K.', treatment: 'Dry Eye', detail: 'Referred 2 July · patient contacted' },
    { patient: 'Aisha R.', treatment: 'General Ophthalmology', detail: 'Referred 6 July · booking in progress' },
    { patient: 'Tom W.', treatment: 'Cornea', detail: 'Referred 7 July · awaiting patient availability' },
    { patient: 'Nadia F.', treatment: 'Dry Eye', detail: 'Referred 9 July · awaiting patient availability' },
  ]},
  booked: { description: 'Patients with a confirmed consultation date on the calendar.', moreCount: 0, rows: [
    { patient: 'Sarah J.', treatment: 'Cataract', detail: 'Consultation on 15 July with Mr Hamada' },
    { patient: 'Grace L.', treatment: 'LVC', detail: 'Consultation on 17 July · Devonshire St' },
    { patient: 'Omar F.', treatment: 'RLE', detail: 'Consultation on 22 July with Mr Hamada' },
    { patient: 'Ben C.', treatment: 'General Ophthalmology', detail: 'Consultation on 24 July · Devonshire St' },
    { patient: 'Ruth A.', treatment: 'Cataract', detail: 'Consultation on 28 July with Mr Hamada' },
    { patient: 'James K.', treatment: 'Dry Eye', detail: 'Consultation on 30 July · Devonshire St' },
  ]},
  treatment_booked: { description: 'Patients who have had a consultation and booked in for treatment.', moreCount: 0, rows: [
    { patient: 'Michael T.', treatment: 'ICL', detail: 'Treatment booked for 29 July' },
    { patient: 'Helen S.', treatment: 'Cataract', detail: 'Treatment booked for 2 August' },
    { patient: 'Daniel P.', treatment: 'LVC', detail: 'Treatment booked for 6 August' },
  ]},
  completed: { description: 'Patients who have completed treatment and are in recovery or follow-up.', moreCount: 13, rows: [
    { patient: 'David O.', treatment: 'Laser Vision', detail: 'Completed 28 June · follow-up in 4 weeks' },
    { patient: 'Linda M.', treatment: 'Cataract', detail: 'Completed 24 June · vision 6/6 both eyes' },
    { patient: 'James K.', treatment: 'Dry Eye · IPL', detail: 'Completed course of 4 sessions on 20 June' },
    { patient: 'Ruth A.', treatment: 'Cataract', detail: 'Completed 18 June · vision 6/6 both eyes' },
    { patient: 'Ben C.', treatment: 'ICL', detail: 'Completed 12 June · follow-up scheduled' },
    { patient: 'Grace L.', treatment: 'LVC', detail: 'Completed 8 June · vision 6/5 both eyes' },
    { patient: 'Omar F.', treatment: 'RLE', detail: 'Completed 2 June · follow-up in 6 weeks' },
    { patient: 'Priya K.', treatment: 'Dry Eye · IPL', detail: 'Completed course of 4 sessions on 28 May' },
  ]},
  closed: { description: 'Referrals closed — treatment completed and discharged, or patient did not proceed.', moreCount: 24, rows: [
    { patient: 'Ruth A.', treatment: 'Cataract', detail: 'Discharged after successful outcome' },
    { patient: 'Ben C.', treatment: 'General Ophthalmology', detail: 'Patient chose to proceed elsewhere' },
    { patient: 'Nadia H.', treatment: 'Dry Eye', detail: 'Discharged, symptoms resolved' },
    { patient: 'Tom W.', treatment: 'Cornea', detail: 'Discharged after successful outcome' },
    { patient: 'Sarah J.', treatment: 'ICL', detail: 'Discharged, vision stable' },
    { patient: 'Michael T.', treatment: 'LVC', detail: 'Discharged after successful outcome' },
    { patient: 'Helen S.', treatment: 'Cataract', detail: 'Patient chose to proceed elsewhere' },
    { patient: 'Daniel P.', treatment: 'General Ophthalmology', detail: 'Discharged, no further action needed' },
  ]},
};

export const MONTHLY_ACTIVITY = [
  { month: 'Feb', referrals: 9, revenue: 1350 },
  { month: 'Mar', referrals: 12, revenue: 2100 },
  { month: 'Apr', referrals: 11, revenue: 1890 },
  { month: 'May', referrals: 15, revenue: 2760 },
  { month: 'Jun', referrals: 14, revenue: 2520 },
  { month: 'Jul', referrals: 18, revenue: 3240 },
];

export const TREATMENT_MIX = [
  { name: 'Cataract', value: 8 },
  { name: 'Dry Eye', value: 6 },
  { name: 'ICL', value: 4 },
  { name: 'LVC', value: 3 },
  { name: 'Other', value: 2 },
];

export const INSIGHT_STATS = [
  { label: 'Referral fees YTD', value: 13860, prefix: '£', delta: '+18% vs last year', Icon: PoundSterling },
  { label: 'Consultation conversion', value: 86, suffix: '%', delta: '+4pts vs last quarter', Icon: Percent },
];
