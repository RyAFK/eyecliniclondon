import { z } from 'zod';

export const practiceSchema = z.object({
  name: z.string().trim().min(2).max(200),
  addressLine1: z.string().trim().max(200).nullable(),
  addressLine2: z.string().trim().max(200).nullable(),
  city: z.string().trim().max(100).nullable(),
  postcode: z.string().trim().max(20).nullable(),
  phone: z.string().trim().max(30).nullable(),
  email: z.string().trim().email().nullable(),
  active: z.boolean().default(true),
});

export type PracticeInput = z.infer<typeof practiceSchema>;
