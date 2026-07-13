import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

export const otpVerifySchema = z.object({
  email: z.string().trim().email(),
  token: z.string().trim().length(6, 'Enter the 6-digit code from your email'),
});
