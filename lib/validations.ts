import { z } from 'zod';
import { ENGLISH_LEVELS, SESSION_DURATIONS } from '@/types';

/**
 * Shared Zod schemas for form and server-action validation. Strings are
 * trimmed and length-bounded; HTML angle brackets are stripped to reduce XSS
 * risk before values reach the database.
 */

const safeString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v.replace(/[<>]/g, ''));

export const emailSchema = z.string().trim().email().max(255);

export const signUpSchema = z.object({
  fullName: safeString(120).pipe(z.string().min(2, 'Please enter your name')),
  email: emailSchema,
  languagePreference: z.string().trim().min(2).max(10).default('en'),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Consent is required to continue.' }),
  }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
});
export type SignInInput = z.infer<typeof signInSchema>;

export const otpVerifySchema = z.object({
  email: emailSchema,
  token: z.string().trim().length(6, 'Enter the 6-digit code'),
});
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

/** Person-name field: letters (incl. accented), spaces, hyphens, apostrophes. */
const nameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter at least 2 characters')
  .max(60)
  .regex(/^[\p{L}][\p{L} '-]*$/u, 'Please use letters only');

export const englishLevelSchema = z.enum(
  ENGLISH_LEVELS as unknown as [string, ...string[]],
);

/**
 * Profile completion (sign-up step 3 and onboarding). First/last name are
 * collected separately in the UI and combined into `full_name` server-side,
 * since the `profiles` table stores a single name column.
 */
export const completeProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  englishLevel: englishLevelSchema,
  languagePreference: z.string().trim().min(2).max(10).default('en'),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Consent is required to continue.' }),
  }),
  consentAt: z.string().datetime(),
});
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

/** Onboarding update — no consent re-capture; name optional (already set). */
export const onboardingSchema = z.object({
  englishLevel: englishLevelSchema,
  languagePreference: z.string().trim().min(2).max(10).default('en'),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const contactSchema = z.object({
  name: safeString(120).pipe(z.string().min(2)),
  email: emailSchema,
  message: safeString(2000).pipe(z.string().min(10, 'Message is too short')),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingRequestSchema = z.object({
  availabilityId: z.string().uuid(),
  level: z.enum(ENGLISH_LEVELS as unknown as [string, ...string[]]),
  sessionLengthMinutes: z.coerce
    .number()
    .refine((n) => (SESSION_DURATIONS as readonly number[]).includes(n), {
      message: 'Invalid session length',
    }),
});
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const profileUpdateSchema = z.object({
  fullName: safeString(120).pipe(z.string().min(2)),
  languagePreference: z.string().trim().min(2).max(10),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
