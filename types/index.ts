/**
 * Shared application types and enums.
 *
 * Re-exports the generated database types and adds domain-level constants and
 * helper types used across the app. Keep this as the single source of truth
 * for enums so UI and server code stay in sync with the database.
 */

export type {
  Database,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
  UserRole,
  EnglishLevel,
  SessionDuration,
  BookingStatus,
  SubscriptionStatus,
  InvoiceStatus,
} from './database';

import type {
  Tables,
  EnglishLevel,
  SessionDuration,
  BookingStatus,
  SubscriptionStatus,
  InvoiceStatus,
  UserRole,
} from './database';

/* -------------------------------------------------------------------------- */
/*                              Enum value arrays                             */
/* -------------------------------------------------------------------------- */

export const USER_ROLES: readonly UserRole[] = ['student', 'tutor'] as const;

export const ENGLISH_LEVELS: readonly EnglishLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export const SESSION_DURATIONS: readonly SessionDuration[] = [30, 60, 90] as const;

export const BOOKING_STATUSES: readonly BookingStatus[] = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
] as const;

export const SUBSCRIPTION_STATUSES: readonly SubscriptionStatus[] = [
  'active',
  'cancelled',
  'expired',
] as const;

export const INVOICE_STATUSES: readonly InvoiceStatus[] = [
  'draft',
  'sent',
  'paid',
] as const;

/** Minimum notice (in hours) required before a session may be cancelled. */
export const CANCELLATION_NOTICE_HOURS = 24;

/* -------------------------------------------------------------------------- */
/*                              Row type aliases                              */
/* -------------------------------------------------------------------------- */

export type Profile = Tables<'profiles'>;
export type Availability = Tables<'availability'>;
export type Booking = Tables<'bookings'>;
export type Subscription = Tables<'subscriptions'>;
export type Invoice = Tables<'invoices'>;
export type SessionFeedback = Tables<'session_feedback'>;
export type ProgressNote = Tables<'progress_notes'>;
export type FileRecord = Tables<'files'>;
export type ContactSubmission = Tables<'contact_submissions'>;
export type PricingConfig = Tables<'pricing_config'>;
export type AppSettings = Tables<'app_settings'>;

/* -------------------------------------------------------------------------- */
/*                              Composite types                               */
/* -------------------------------------------------------------------------- */

/** A booking joined with its associated availability slot. */
export type BookingWithSlot = Booking & {
  availability: Availability | null;
};

/** A booking enriched with the student's profile (tutor views). */
export type BookingWithStudent = Booking & {
  student: Pick<Profile, 'id' | 'full_name' | 'email' | 'english_level'>;
};
