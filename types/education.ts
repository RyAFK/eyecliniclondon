export const EDUCATION_RESOURCE_TYPES = ['cpd_event', 'article', 'clinic_news'] as const;
export type EducationResourceType = (typeof EDUCATION_RESOURCE_TYPES)[number];

export interface EducationResource {
  id: string;
  type: EducationResourceType;
  title: string;
  description: string | null;
  url: string;
  cpdPoints: number | null;
  eventDate: string | null;
  eventLocation: string | null;
  speakers: string | null;
  publishedAt: string;
}
