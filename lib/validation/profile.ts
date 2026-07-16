import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
  referralUpdates: z.boolean(),
  cpdInvitations: z.boolean(),
  clinicNews: z.boolean(),
});

export const updateOwnProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Name is required').max(200).optional(),
  notificationPreferences: notificationPreferencesSchema.optional(),
});

export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;
