import type { TreatmentTypeId } from '@/types/referral';

/**
 * Non-diagnostic pathway guidance for the RefertoRyan Referral Assistant.
 * This module NEVER diagnoses, never states a patient is "suitable" for
 * surgery, and never promises an outcome — see suggestPathway()'s output,
 * which is always framed as "may be relevant to discuss".
 */

export const AGE_RANGES = ['under_40', '40_to_54', '55_to_69', '70_plus'] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  under_40: 'Under 40',
  '40_to_54': '40–54',
  '55_to_69': '55–69',
  '70_plus': '70 or over',
};

export const VISUAL_CONCERNS = ['blurred_distance', 'blurred_near', 'glare_or_halos', 'dryness_irritation', 'gradual_deterioration', 'not_sure'] as const;
export type VisualConcern = (typeof VISUAL_CONCERNS)[number];

export const VISUAL_CONCERN_LABELS: Record<VisualConcern, string> = {
  blurred_distance: 'Blurred distance vision',
  blurred_near: 'Blurred near/reading vision',
  glare_or_halos: 'Glare, halos or light sensitivity',
  dryness_irritation: 'Dryness, grittiness or irritation',
  gradual_deterioration: 'Gradual overall deterioration',
  not_sure: 'Not sure / mixed symptoms',
};

export const CURRENT_CORRECTIONS = ['glasses', 'contact_lenses', 'none'] as const;
export type CurrentCorrection = (typeof CURRENT_CORRECTIONS)[number];

export const CURRENT_CORRECTION_LABELS: Record<CurrentCorrection, string> = {
  glasses: 'Glasses',
  contact_lenses: 'Contact lenses',
  none: 'No current correction',
};

export const NEAR_VISION_EXPECTATIONS = ['wants_glasses_free', 'happy_with_reading_glasses', 'not_sure'] as const;
export type NearVisionExpectation = (typeof NEAR_VISION_EXPECTATIONS)[number];

export const NEAR_VISION_EXPECTATION_LABELS: Record<NearVisionExpectation, string> = {
  wants_glasses_free: 'Wants to be glasses-free for near vision',
  happy_with_reading_glasses: 'Happy to wear reading glasses',
  not_sure: 'Not sure yet',
};

export interface ReferralAssistantAnswers {
  ageRange: AgeRange | null;
  mainConcern: VisualConcern | null;
  currentCorrection: CurrentCorrection | null;
  cataractSymptoms: boolean | null;
  hasRefractiveError: boolean | null;
  nearVisionExpectation: NearVisionExpectation | null;
  previousEyeSurgery: boolean | null;
  knownConditions: string;
  uncertainAboutPathway: boolean;
}

export const EMPTY_ASSISTANT_ANSWERS: ReferralAssistantAnswers = {
  ageRange: null,
  mainConcern: null,
  currentCorrection: null,
  cataractSymptoms: null,
  hasRefractiveError: null,
  nearVisionExpectation: null,
  previousEyeSurgery: null,
  knownConditions: '',
  uncertainAboutPathway: false,
};

export type SuggestedPathway = TreatmentTypeId | 'discuss';

export interface AssistantResult {
  pathway: SuggestedPathway;
  headline: string;
  explanation: string;
  limitations: string[];
}

const STANDARD_LIMITATIONS = [
  'This tool does not diagnose any condition and cannot confirm that a patient is suitable for any treatment.',
  'It is not a substitute for clinical judgement, examination, or emergency advice.',
  'No outcome, timescale, or result can be promised from the information selected here.',
];

function known(conditions: string, keyword: string): boolean {
  return conditions.toLowerCase().includes(keyword);
}

/**
 * Rule-based, non-diagnostic pathway suggestion. Deliberately conservative:
 * any sign of genuine uncertainty routes to "discuss with the clinical team"
 * rather than guessing at a treatment pathway.
 */
export function suggestPathway(answers: ReferralAssistantAnswers): AssistantResult {
  const dryEyeMentioned = known(answers.knownConditions, 'dry eye') || answers.mainConcern === 'dryness_irritation';
  const corneaMentioned = known(answers.knownConditions, 'keratoconus') || known(answers.knownConditions, 'cornea');
  const glaucomaMentioned = known(answers.knownConditions, 'glaucoma');

  if (answers.uncertainAboutPathway) {
    return {
      pathway: 'discuss',
      headline: 'Discuss this case with Ryan or the clinical team',
      explanation:
        'Based on the information selected, this case may benefit from a direct conversation with Eye Clinic London before choosing a referral pathway.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  if (glaucomaMentioned) {
    return {
      pathway: 'general',
      headline: 'General ophthalmology assessment may be relevant to discuss',
      explanation:
        'Based on the information selected, a general ophthalmology assessment may be relevant to discuss, given the known eye condition described.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  if (corneaMentioned) {
    return {
      pathway: 'cornea',
      headline: 'A corneal specialist opinion may be relevant to discuss',
      explanation: 'Based on the information selected, a corneal / anterior-segment specialist opinion may be relevant to discuss.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  if (answers.cataractSymptoms || ((answers.ageRange === '55_to_69' || answers.ageRange === '70_plus') && (answers.mainConcern === 'blurred_distance' || answers.mainConcern === 'glare_or_halos' || answers.mainConcern === 'gradual_deterioration'))) {
    return {
      pathway: 'cataract',
      headline: 'A cataract assessment may be relevant to discuss',
      explanation: 'Based on the information selected, this Eye Clinic London pathway (cataract assessment) may be relevant to discuss.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  if (dryEyeMentioned) {
    return {
      pathway: 'dry_eye',
      headline: 'A dry eye assessment may be relevant to discuss',
      explanation: 'Based on the information selected, this Eye Clinic London pathway (dry eye assessment) may be relevant to discuss.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  if (answers.hasRefractiveError) {
    const olderPatient = answers.ageRange === '55_to_69' || answers.ageRange === '70_plus';
    const midAgePatient = answers.ageRange === '40_to_54';
    const wantsGlassesFreeNear = answers.nearVisionExpectation === 'wants_glasses_free';

    if (olderPatient || (midAgePatient && wantsGlassesFreeNear)) {
      return {
        pathway: 'rle',
        headline: 'Refractive lens exchange may be relevant to discuss',
        explanation: 'Based on the information selected, this Eye Clinic London pathway (refractive lens exchange) may be relevant to discuss.',
        limitations: STANDARD_LIMITATIONS,
      };
    }

    if (answers.currentCorrection === 'contact_lenses' && wantsGlassesFreeNear === false) {
      return {
        pathway: 'icl',
        headline: 'An implantable contact lens assessment may be relevant to discuss',
        explanation:
          'Based on the information selected, this Eye Clinic London pathway (implantable contact lens assessment) may be relevant to discuss.',
        limitations: STANDARD_LIMITATIONS,
      };
    }

    return {
      pathway: 'lvc',
      headline: 'A laser vision correction assessment may be relevant to discuss',
      explanation: 'Based on the information selected, this Eye Clinic London pathway (laser vision correction assessment) may be relevant to discuss.',
      limitations: STANDARD_LIMITATIONS,
    };
  }

  return {
    pathway: 'general',
    headline: 'A general ophthalmology discussion may be relevant',
    explanation:
      'Based on the information selected, a general ophthalmology discussion with Eye Clinic London may be the most relevant next step.',
    limitations: STANDARD_LIMITATIONS,
  };
}
