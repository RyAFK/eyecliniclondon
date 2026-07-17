import type { EducationModule } from '@/types/education-module';

/**
 * Clinical Education Hub content. Static and editorial — written for
 * referring optometrists as general, non-diagnostic guidance. None of this
 * replaces local protocols, GOC/RCOphth guidance, or a referrer's own
 * clinical judgement; every module says so explicitly.
 */
export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'mod-cataract-referral',
    slug: 'when-to-refer-for-cataract-surgery',
    category: 'Cataract',
    title: 'When should I refer for cataract surgery?',
    summary: 'How to weigh functional impact alongside visual acuity, and what to include in a cataract referral.',
    estimatedMinutes: 5,
    videoUrl: null,
    overview: [
      'Cataract referral decisions in the UK are increasingly driven by functional impact rather than a fixed visual acuity threshold. A patient reporting difficulty with night driving, glare from oncoming headlights, or reduced confidence reading small print can be a reasonable referral even with a Snellen acuity that looks "borderline" on paper.',
      'Second-eye referrals are common and should not be delayed simply because the first eye has already been treated — each eye is assessed on its own functional impact.',
      'A well-structured referral shortens the pathway for the patient. Include presenting symptoms, best corrected visual acuity in each eye, any relevant lens/red reflex findings, and known systemic factors that may affect timing (e.g. diabetes, anticoagulation).',
    ],
    keyLearningPoints: [
      'Functional impact (glare, night driving, reading) often matters more than a single Snellen acuity figure.',
      'Second-eye referral is normal practice and should be considered independently of the first eye.',
      'Include BCVA, lens findings, and relevant systemic history in the referral to avoid delays.',
      'Rapid or asymmetric visual change still warrants a wider differential before assuming cataract alone.',
    ],
    caseStudy: {
      scenario:
        'A 68-year-old patient presents with gradually worsening glare at night and difficulty reading medication labels. BCVA is 6/9 right, 6/12 left. Nuclear sclerotic changes are visible bilaterally, left greater than right. The patient still drives regularly at night for work.',
      prompt: 'What would you weigh most heavily before deciding whether — and how urgently — to refer?',
      considerations: [
        {
          id: 'functional-impact',
          label: 'Functional impact on driving',
          detail:
            'Night driving glare is a strong functional indicator independent of Snellen acuity, and worth documenting explicitly in the referral rather than leaving it implied by the acuity figures alone.',
        },
        {
          id: 'asymmetry',
          label: 'Asymmetry between eyes',
          detail:
            'A meaningful difference between eyes is common with cataract but is also worth a brief check for other asymmetric causes before referral, so the referral letter can note what has (and hasn’t) been ruled out.',
        },
        {
          id: 'systemic-factors',
          label: 'Systemic factors affecting timing',
          detail: 'Diabetes control, anticoagulant use, and general fitness for day-case surgery are useful context for the surgical team and can shorten pre-assessment.',
        },
        {
          id: 'patient-priorities',
          label: 'Patient’s own priorities',
          detail: 'What matters most to the patient (driving, reading, a specific hobby) helps the clinical team frame the consultation and set realistic expectations.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'Which of the following is the most reliable trigger for a cataract referral?',
        options: [
          { id: 'a', label: 'Snellen acuity below a fixed threshold alone' },
          { id: 'b', label: 'Functional impact on daily activities, considered alongside acuity' },
          { id: 'c', label: 'Patient age over 65' },
          { id: 'd', label: 'Presence of any lens opacity, regardless of symptoms' },
        ],
        correctOptionId: 'b',
        explanation: 'Functional impact — glare, night driving, reading difficulty — considered alongside visual acuity gives a fuller picture than acuity alone.',
      },
      {
        id: 'q2',
        question: 'A patient already treated in one eye reports similar symptoms developing in the other. What is appropriate practice?',
        options: [
          { id: 'a', label: 'Wait at least 12 months before considering the second eye' },
          { id: 'b', label: 'Assess and refer the second eye independently, based on its own symptoms and findings' },
          { id: 'c', label: 'Only refer if the first surgery had complications' },
          { id: 'd', label: 'Second-eye referrals are not routinely offered on the NHS or privately' },
        ],
        correctOptionId: 'b',
        explanation: 'Second-eye referral is normal, common practice — each eye is assessed and referred on its own functional impact.',
      },
      {
        id: 'q3',
        question: 'What is most useful to include in a cataract referral letter beyond the diagnosis itself?',
        options: [
          { id: 'a', label: 'Nothing further — the diagnosis is sufficient' },
          { id: 'b', label: 'BCVA per eye, relevant lens findings, and any systemic factors affecting timing' },
          { id: 'c', label: 'A recommendation for a specific intraocular lens' },
          { id: 'd', label: 'The patient’s full medication list only' },
        ],
        correctOptionId: 'b',
        explanation: 'BCVA, lens/red reflex findings, and relevant systemic context (e.g. diabetes, anticoagulation) help the surgical team plan efficiently and can shorten pre-assessment.',
      },
    ],
    relatedTreatmentType: 'cataract',
    publishedAt: '2026-05-04T09:00:00.000Z',
  },
  {
    id: 'mod-rle-candidates',
    slug: 'identifying-suitable-rle-candidates',
    category: 'Refractive',
    title: 'Identifying suitable refractive lens exchange candidates',
    summary: 'Spotting presbyopic and early-lens-change patients who may benefit from discussing RLE.',
    estimatedMinutes: 5,
    videoUrl: null,
    overview: [
      'Refractive lens exchange (RLE) is typically discussed with presbyopic patients — usually mid-40s and older — who are troubled by their dependence on glasses for both distance and near vision, and who may already be showing early lens changes.',
      'Good candidates are less about a single number and more about a combination of factors: stable refraction, realistic expectations about near-vision trade-offs, and a genuine desire to reduce spectacle dependence rather than a family member’s suggestion.',
      'Patients with high hyperopia in particular can be under-served by laser options and may be better served by discussing RLE, since removing a thicker natural lens can meaningfully improve both refractive error and, later, cataract risk.',
    ],
    keyLearningPoints: [
      'RLE is usually discussed with presbyopic patients (typically 45+) rather than younger, purely myopic patients.',
      'High hyperopes are often better candidates for RLE discussion than for laser vision correction alone.',
      'Realistic patient expectations about near vision are as important as the refractive numbers.',
      'Early lens changes alongside refractive error can make RLE more relevant to raise than treating each separately.',
    ],
    caseStudy: {
      scenario:
        'A 52-year-old hyperopic patient (+4.50 DS both eyes) is increasingly frustrated with varifocals and asks whether "laser" could get her out of glasses completely. She has no visually significant cataract yet but reports early difficulty with night vision.',
      prompt: 'What would shape whether you raise RLE as a pathway to discuss, rather than laser vision correction?',
      considerations: [
        {
          id: 'refractive-magnitude',
          label: 'Degree of hyperopia',
          detail: 'Higher hyperopia is often better addressed by lens-based approaches than by laser alone, which is worth mentioning when framing the referral.',
        },
        {
          id: 'presbyopia',
          label: 'Presbyopic near-vision needs',
          detail: 'At this age, near-vision expectations after any procedure are a central part of the conversation the clinical team will want to have directly with the patient.',
        },
        {
          id: 'expectation-setting',
          label: 'Expectation setting before referral',
          detail: 'Flagging that RLE is a lens-based option (not "laser") in your referral note helps set accurate expectations before the consultation.',
        },
        {
          id: 'symptom-progression',
          label: 'Early symptom progression',
          detail: 'Reported early night-vision difficulty is worth noting, even without a visually significant cataract yet, as useful context for the assessing clinician.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'RLE is typically discussed with which group of patients?',
        options: [
          { id: 'a', label: 'Teenagers with stable myopia' },
          { id: 'b', label: 'Presbyopic patients, often 45 and over, troubled by spectacle dependence' },
          { id: 'c', label: 'Only patients who have already had cataract surgery in one eye' },
          { id: 'd', label: 'Patients with any degree of astigmatism regardless of age' },
        ],
        correctOptionId: 'b',
        explanation: 'RLE is generally discussed with presbyopic patients who want to reduce dependence on glasses for both distance and near vision.',
      },
      {
        id: 'q2',
        question: 'Why might a highly hyperopic patient be a more relevant RLE discussion than a laser vision correction one?',
        options: [
          { id: 'a', label: 'Laser correction cannot treat any degree of hyperopia' },
          { id: 'b', label: 'Lens-based approaches are often better suited to higher degrees of hyperopia' },
          { id: 'c', label: 'RLE is always cheaper than laser vision correction' },
          { id: 'd', label: 'There is no difference in suitability between the two' },
        ],
        correctOptionId: 'b',
        explanation: 'Higher hyperopia is often better addressed by a lens-based approach than by laser correction alone — a key reason to flag it in the referral.',
      },
      {
        id: 'q3',
        question: 'What is the most important non-refractive factor to gauge before suggesting RLE as a pathway?',
        options: [
          { id: 'a', label: 'The patient’s realistic expectations about near vision' },
          { id: 'b', label: 'The patient’s preferred spectacle frame style' },
          { id: 'c', label: 'Whether the patient has private health insurance' },
          { id: 'd', label: 'The patient’s occupation title' },
        ],
        correctOptionId: 'a',
        explanation: 'Realistic expectations about near vision after RLE are central — the clinical team will want to discuss this directly, but flagging it early helps.',
      },
    ],
    relatedTreatmentType: 'rle',
    publishedAt: '2026-05-11T09:00:00.000Z',
  },
  {
    id: 'mod-icl-vs-lvc',
    slug: 'icl-versus-laser-vision-correction',
    category: 'Refractive',
    title: 'Implantable contact lenses versus laser vision correction',
    summary: 'A comparison to help frame which refractive pathway may be worth discussing for a given patient.',
    estimatedMinutes: 6,
    videoUrl: null,
    overview: [
      'Implantable Collamer Lenses (ICL) and laser vision correction (LASIK/PRK/SMILE) both aim to reduce spectacle dependence, but they suit different profiles. Laser correction reshapes the cornea; ICL adds a lens in front of (or behind) the natural lens without removing corneal tissue.',
      'ICL is often raised for higher levels of myopia, thinner corneas, or borderline corneal topography that might make laser correction less suitable, since it preserves corneal tissue.',
      'Laser correction is generally quicker to recover from and is often the first pathway discussed for moderate, stable refractive error with a healthy, sufficiently thick cornea.',
      'Neither pathway is "better" in the abstract — the right one depends on refractive error, corneal thickness and shape, pupil size, and the patient’s own priorities, which is exactly what the clinical assessment is for.',
    ],
    keyLearningPoints: [
      'Laser correction reshapes the cornea; ICL adds a lens without removing corneal tissue.',
      'ICL is often relevant for higher myopia or thinner/borderline corneas.',
      'Corneal thickness and topography are central to which pathway a clinician will consider.',
      'When genuinely unsure which fits, "general ophthalmology / unsure" is a reasonable referral category — the clinical team can advise.',
    ],
    caseStudy: {
      scenario:
        'A 29-year-old patient with -8.00 DS myopia and relatively thin corneas on a previous check has been told by two different opticians that they may not be a laser candidate. They are keen to reduce contact lens dependence and ask what else is available.',
      prompt: 'What would you want to convey in the referral, given the uncertainty already flagged?',
      considerations: [
        {
          id: 'corneal-thickness',
          label: 'Corneal thickness already flagged',
          detail: 'Noting prior concerns about corneal suitability for laser correction in the referral saves the assessing clinician time and sets expectations.',
        },
        {
          id: 'myopia-degree',
          label: 'Degree of myopia',
          detail: 'Higher myopia is one of the more common reasons ICL is raised as an alternative to laser correction — worth mentioning explicitly.',
        },
        {
          id: 'pathway-uncertainty',
          label: 'Genuine pathway uncertainty',
          detail: 'When it genuinely isn’t clear which pathway fits, referring as "unsure / general discussion" is entirely reasonable — that is what the assessment is for.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'What is the key structural difference between ICL and laser vision correction?',
        options: [
          { id: 'a', label: 'ICL reshapes the cornea; laser adds a lens' },
          { id: 'b', label: 'Laser correction reshapes the cornea; ICL adds a lens without removing corneal tissue' },
          { id: 'c', label: 'Both remove the natural lens entirely' },
          { id: 'd', label: 'There is no structural difference' },
        ],
        correctOptionId: 'b',
        explanation: 'Laser correction reshapes corneal tissue; ICL places a lens in the eye without removing corneal tissue.',
      },
      {
        id: 'q2',
        question: 'A patient with thin or borderline corneas and higher myopia may be more relevant to refer for which discussion?',
        options: [
          { id: 'a', label: 'Laser vision correction only, regardless of corneal findings' },
          { id: 'b', label: 'ICL assessment, since it does not remove corneal tissue' },
          { id: 'c', label: 'No referral is appropriate in this scenario' },
          { id: 'd', label: 'Cataract assessment' },
        ],
        correctOptionId: 'b',
        explanation: 'Thinner or borderline corneas combined with higher myopia are a common reason ICL is raised as an alternative to laser correction.',
      },
      {
        id: 'q3',
        question: 'If you’re genuinely unsure which refractive pathway best fits a patient, what is reasonable practice?',
        options: [
          { id: 'a', label: 'Avoid referring until you are certain' },
          { id: 'b', label: 'Refer as a general discussion / unsure pathway and let the clinical assessment guide the decision' },
          { id: 'c', label: 'Always default to laser vision correction' },
          { id: 'd', label: 'Always default to ICL' },
        ],
        correctOptionId: 'b',
        explanation: 'When uncertain, referring for a general discussion is entirely reasonable — the clinical assessment is exactly where that gets resolved.',
      },
    ],
    relatedTreatmentType: null,
    publishedAt: '2026-05-18T09:00:00.000Z',
  },
  {
    id: 'mod-premium-iols',
    slug: 'understanding-premium-intraocular-lenses',
    category: 'Cataract',
    title: 'Understanding premium intraocular lenses',
    summary: 'A plain-English overview of monofocal, extended depth-of-focus, and multifocal IOL options.',
    estimatedMinutes: 5,
    videoUrl: null,
    overview: [
      'At cataract surgery, the natural lens is replaced with an intraocular lens (IOL). Standard monofocal IOLs correct vision at one distance (usually distance vision), with reading glasses typically still needed.',
      'Premium IOLs — extended depth-of-focus (EDOF) and multifocal designs — aim to reduce spectacle dependence across a wider range of distances, at the cost of some trade-offs (commonly a higher chance of glare/halos at night, or reduced contrast sensitivity compared with a monofocal).',
      'Toric IOLs correct corneal astigmatism at the same time as treating the cataract, and can be combined with EDOF or multifocal designs depending on the case.',
      'The "right" lens is a shared decision between patient and surgeon based on lifestyle, ocular health (e.g. any macular or corneal irregularity), and how the patient weighs spectacle independence against the trade-offs — not something a referral needs to pre-decide.',
    ],
    keyLearningPoints: [
      'Monofocal IOLs correct one distance well; premium IOLs aim to reduce spectacle dependence across a range.',
      'Premium lenses commonly trade off some night-vision quality (glare/halos) for spectacle independence.',
      'Toric IOLs address astigmatism and can be combined with other premium designs.',
      'Lens choice is a shared decision made at consultation — referrals don’t need to specify a lens type.',
    ],
    caseStudy: {
      scenario:
        'A 71-year-old keen photographer with visually significant cataracts asks whether they can "get rid of glasses completely" after surgery. They mention doing a lot of night driving for family visits.',
      prompt: 'What is most useful to flag in the referral, without pre-deciding a lens choice that isn’t yours to make?',
      considerations: [
        {
          id: 'lifestyle-priorities',
          label: 'Lifestyle and visual priorities',
          detail: 'Noting the patient’s interest in spectacle independence (and their hobby/driving context) gives the surgical team useful context for the lens conversation.',
        },
        {
          id: 'night-driving',
          label: 'Regular night driving',
          detail: 'Since premium lenses can involve night-vision trade-offs, flagging regular night driving helps set the stage for that specific conversation at consultation.',
        },
        {
          id: 'no-preselection',
          label: 'Not pre-selecting a lens type',
          detail: 'The referral doesn’t need to (and generally shouldn’t) specify a lens type — that’s a shared decision made with full information at consultation.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'What is the main trade-off commonly associated with premium (EDOF/multifocal) IOLs compared with monofocal?',
        options: [
          { id: 'a', label: 'Higher chance of infection' },
          { id: 'b', label: 'Some increased likelihood of glare/halos or reduced contrast sensitivity, in exchange for less spectacle dependence' },
          { id: 'c', label: 'Longer surgery time in every case' },
          { id: 'd', label: 'No difference in outcomes at all' },
        ],
        correctOptionId: 'b',
        explanation: 'Premium IOLs generally trade some night-vision quality for a wider range of unaided vision.',
      },
      {
        id: 'q2',
        question: 'What does a toric IOL specifically address?',
        options: [
          { id: 'a', label: 'Presbyopia only' },
          { id: 'b', label: 'Corneal astigmatism, alongside treating the cataract' },
          { id: 'c', label: 'Dry eye' },
          { id: 'd', label: 'Glaucoma' },
        ],
        correctOptionId: 'b',
        explanation: 'Toric IOLs correct corneal astigmatism at the same time as cataract surgery, and can be combined with other premium designs.',
      },
      {
        id: 'q3',
        question: 'Should a referral letter specify which IOL type the patient should receive?',
        options: [
          { id: 'a', label: 'Yes, always specify the exact lens model' },
          { id: 'b', label: 'No — lens choice is a shared decision made at consultation with full information' },
          { id: 'c', label: 'Only for patients over 70' },
          { id: 'd', label: 'Only if the patient specifically requests a premium lens' },
        ],
        correctOptionId: 'b',
        explanation: 'Lens selection is a shared decision between patient and surgeon at consultation — the referral is about getting the patient there, not pre-deciding the lens.',
      },
    ],
    relatedTreatmentType: 'cataract',
    publishedAt: '2026-05-25T09:00:00.000Z',
  },
  {
    id: 'mod-post-op-expectations',
    slug: 'managing-post-operative-expectations',
    category: 'Patient Care',
    title: 'Managing patient expectations after eye surgery',
    summary: 'Practical language for setting realistic expectations before and after referral.',
    estimatedMinutes: 5,
    videoUrl: null,
    overview: [
      'Most dissatisfaction after refractive or cataract surgery traces back to a mismatch between what the patient expected and what was actually promised. As the referring practitioner, you’re often the first person to shape those expectations — before the patient has even met the surgical team.',
      'Useful, honest language: "this pathway may be relevant to discuss", "most patients see a significant improvement, but outcomes vary", "recovery is usually gradual over some weeks" — rather than promising a specific outcome or timeline.',
      'Encourage patients to bring their real-world priorities (driving, screens, hobbies) to the consultation rather than a single acuity target — surgeons plan around function, not just numbers.',
      'Post-operatively, patients co-managed by their local practice benefit from clear, written guidance on what’s normal (mild grittiness, fluctuating vision in the first weeks) versus what warrants contacting the clinic (sudden vision loss, significant pain, flashes/floaters).',
    ],
    keyLearningPoints: [
      'Avoid promising specific outcomes — describe likely ranges and note that individual results vary.',
      'Encourage patients to articulate their real-world visual priorities before consultation.',
      'Recovery timelines should be described as gradual, not immediate.',
      'Give patients clear guidance on normal post-op symptoms versus red flags to report.',
    ],
    caseStudy: {
      scenario:
        'A patient tells you their neighbour "saw perfectly the next day" after cataract surgery and is expecting the same. They’re otherwise a reasonable candidate for referral.',
      prompt: 'How would you frame the conversation before referring, without overstating or understating what to expect?',
      considerations: [
        {
          id: 'individual-variation',
          label: 'Individual variation in outcomes',
          detail: 'Gently noting that recovery and outcomes vary between individuals helps set a more realistic baseline before the consultation.',
        },
        {
          id: 'gradual-recovery',
          label: 'Gradual recovery timeline',
          detail: 'Describing recovery as usually gradual over some weeks, rather than instant, reduces the chance of early disappointment.',
        },
        {
          id: 'clinical-team-conversation',
          label: 'Leave specifics to the clinical team',
          detail: 'The surgical team will give a personalised assessment at consultation — your role is to set a realistic general expectation, not a specific promise.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'What is the most appropriate way to describe likely outcomes before referral?',
        options: [
          { id: 'a', label: 'Promise the same result as a friend or relative had' },
          { id: 'b', label: 'Describe a likely range of outcomes and note that individual results vary' },
          { id: 'c', label: 'Avoid discussing outcomes at all' },
          { id: 'd', label: 'Guarantee 20/20 vision' },
        ],
        correctOptionId: 'b',
        explanation: 'Describing a general likely range, while noting individual variation, is honest and avoids setting the patient up for disappointment.',
      },
      {
        id: 'q2',
        question: 'How should recovery timelines generally be described to patients?',
        options: [
          { id: 'a', label: 'As instant, with full vision the next day for everyone' },
          { id: 'b', label: 'As usually gradual, over a period of weeks' },
          { id: 'c', label: 'As always taking at least 6 months' },
          { id: 'd', label: 'Recovery timelines should not be discussed' },
        ],
        correctOptionId: 'b',
        explanation: 'Recovery is usually gradual over some weeks — framing it this way helps manage expectations realistically.',
      },
      {
        id: 'q3',
        question: 'What should co-managing practices give patients post-operatively?',
        options: [
          { id: 'a', label: 'Nothing — the clinic handles all post-op guidance' },
          { id: 'b', label: 'Clear guidance distinguishing normal post-op symptoms from red flags to report' },
          { id: 'c', label: 'A prescription for new glasses immediately after surgery' },
          { id: 'd', label: 'A referral back for repeat surgery as standard practice' },
        ],
        correctOptionId: 'b',
        explanation: 'Clear written guidance on what’s normal versus what warrants contacting the clinic helps patients and reduces unnecessary worry or delay.',
      },
    ],
    relatedTreatmentType: null,
    publishedAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'mod-red-flags',
    slug: 'ophthalmology-referral-red-flags',
    category: 'Referral Pathways',
    title: 'Recognising red flags requiring urgent ophthalmology referral',
    summary: 'Signs that warrant urgent or emergency pathways rather than a routine referral.',
    estimatedMinutes: 5,
    videoUrl: null,
    overview: [
      'This module is about recognising when a routine referral pathway is not appropriate — not about diagnosing the underlying cause. If you identify any of the signs below, the safest action is same-day emergency eye care advice (local eye casualty / A&E / emergency optometric pathway), not a standard referral form.',
      'Sudden, painless vision loss; sudden onset of flashes and floaters (especially with a curtain/shadow in the visual field); severe eye pain with redness; and any suspected chemical injury are all signs to treat as urgent, regardless of how a routine referral pathway would normally work.',
      'This tool and the referral portal are designed for routine, non-urgent referral pathways. They are not a substitute for emergency assessment, and nothing here should delay urgent action if red flags are present.',
    ],
    keyLearningPoints: [
      'Sudden painless vision loss and sudden flashes/floaters with a visual field shadow warrant same-day emergency assessment.',
      'Severe pain with redness, or suspected chemical injury, should bypass routine referral pathways entirely.',
      'This portal is for routine pathways only — it is not designed for emergencies.',
      'When in doubt about urgency, treat it as urgent and seek same-day advice rather than submitting a routine referral.',
    ],
    caseStudy: {
      scenario:
        'A patient calls describing a sudden shower of floaters and a "curtain" coming down over the outer part of their vision in one eye, which started a few hours ago.',
      prompt: 'What is the appropriate next step?',
      considerations: [
        {
          id: 'same-day-urgent',
          label: 'Same-day emergency assessment',
          detail: 'This symptom pattern is a recognised red flag and warrants same-day emergency eye care, not a routine referral through this or any standard pathway.',
        },
        {
          id: 'not-routine-portal',
          label: 'Not appropriate for a routine referral form',
          detail: 'Submitting this as a routine, non-urgent referral would introduce unnecessary delay — direct the patient to emergency eye care instead.',
        },
        {
          id: 'clear-communication',
          label: 'Clear, calm communication with the patient',
          detail: 'Explaining clearly why same-day assessment is needed (without alarming unnecessarily) helps the patient act promptly.',
        },
      ],
    },
    knowledgeCheck: [
      {
        id: 'q1',
        question: 'A patient describes sudden flashes, floaters, and a shadow across part of their vision. What is the appropriate action?',
        options: [
          { id: 'a', label: 'Submit a routine referral through the standard pathway' },
          { id: 'b', label: 'Direct the patient to same-day emergency eye care assessment' },
          { id: 'c', label: 'Book a routine appointment for the following week' },
          { id: 'd', label: 'Advise the patient to monitor for a few days' },
        ],
        correctOptionId: 'b',
        explanation: 'This symptom pattern is a recognised red flag warranting same-day emergency assessment, not a routine referral.',
      },
      {
        id: 'q2',
        question: 'Is this referral portal designed for emergency eye presentations?',
        options: [
          { id: 'a', label: 'Yes, it is designed for both routine and emergency cases' },
          { id: 'b', label: 'No — it is for routine, non-urgent pathways; emergencies need same-day emergency care' },
          { id: 'c', label: 'Only for emergencies involving cataracts' },
          { id: 'd', label: 'Only during clinic opening hours' },
        ],
        correctOptionId: 'b',
        explanation: 'This portal and its tools (including the Referral Assistant) are built for routine pathways only — never for emergencies.',
      },
      {
        id: 'q3',
        question: 'What is the safest general approach when you’re unsure whether a presentation is urgent?',
        options: [
          { id: 'a', label: 'Assume it is routine unless proven otherwise' },
          { id: 'b', label: 'Treat it as urgent and seek same-day advice' },
          { id: 'c', label: 'Wait for the patient to decide' },
          { id: 'd', label: 'Refer routinely and note the uncertainty in the letter' },
        ],
        correctOptionId: 'b',
        explanation: 'When genuinely uncertain about urgency, the safest approach is to treat it as urgent rather than risk delay through a routine pathway.',
      },
    ],
    relatedTreatmentType: 'general',
    publishedAt: '2026-06-08T09:00:00.000Z',
  },
];

export function getEducationModuleBySlug(slug: string): EducationModule | undefined {
  return EDUCATION_MODULES.find((m) => m.slug === slug);
}
