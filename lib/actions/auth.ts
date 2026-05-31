'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  completeProfileSchema,
  onboardingSchema,
  type CompleteProfileInput,
  type OnboardingInput,
} from '@/lib/validations';
import type { EnglishLevel } from '@/types';

/**
 * Authentication server actions.
 *
 * Profile writes go through the service-role (admin) client so they are never
 * performed directly from the browser, and only after the caller's session has
 * been verified server-side. The service-role key stays on the server.
 */

/** Typed error codes returned to the client, which maps them to i18n strings. */
export type AuthActionError =
  | 'unauthenticated'
  | 'validation'
  | 'database';

export type AuthActionResult =
  | { ok: true }
  | { ok: false; error: AuthActionError };

/**
 * Upsert the authenticated user's profile (sign-up step 3).
 *
 * First/last name are combined into the single `full_name` column. Consent is
 * recorded server-side using the timestamp captured at OTP verification.
 */
export async function completeProfile(
  input: CompleteProfileInput,
): Promise<AuthActionResult> {
  const parsed = completeProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'validation' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: 'unauthenticated' };

  const { firstName, lastName, englishLevel, languagePreference, consentAt } =
    parsed.data;

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').upsert(
    {
      id: user.id,
      email: user.email,
      full_name: `${firstName} ${lastName}`.trim(),
      english_level: englishLevel as EnglishLevel,
      language_preference: languagePreference,
      consent_given: true,
      consent_at: consentAt,
      role: 'student',
    },
    { onConflict: 'id' },
  );

  if (error) return { ok: false, error: 'database' };
  return { ok: true };
}

/**
 * Update English level + language preference from the onboarding flow without
 * touching the user's name or consent record.
 */
export async function updateOnboarding(
  input: OnboardingInput,
): Promise<AuthActionResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'validation' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'unauthenticated' };

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({
      english_level: parsed.data.englishLevel as EnglishLevel,
      language_preference: parsed.data.languagePreference,
    })
    .eq('id', user.id);

  if (error) return { ok: false, error: 'database' };
  return { ok: true };
}

/**
 * Permanently delete the authenticated user and all of their data.
 *
 * Verifies the session first, then removes rows from every dependent table in
 * foreign-key-safe order (children before parents) before deleting the auth
 * user. Wired to UI later (profile settings → danger zone).
 */
export async function deleteAccount(): Promise<AuthActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'unauthenticated' };

  const uid = user.id;
  const admin = createAdminClient();

  try {
    // 1. Rows referencing bookings/profiles via the user, children first.
    await admin
      .from('session_feedback')
      .delete()
      .or(`author_id.eq.${uid},recipient_id.eq.${uid}`);
    await admin
      .from('files')
      .delete()
      .or(`uploader_id.eq.${uid},recipient_id.eq.${uid}`);
    await admin.from('invoices').delete().eq('student_id', uid);
    await admin
      .from('progress_notes')
      .delete()
      .or(`student_id.eq.${uid},tutor_id.eq.${uid}`);
    await admin.from('subscriptions').delete().eq('student_id', uid);
    // 2. Bookings reference profiles, so remove them before the profile.
    await admin.from('bookings').delete().eq('student_id', uid);
    // 3. The profile row itself.
    await admin.from('profiles').delete().eq('id', uid);
    // 4. Finally the auth user.
    const { error: deleteUserError } = await admin.auth.admin.deleteUser(uid);
    if (deleteUserError) return { ok: false, error: 'database' };
  } catch {
    return { ok: false, error: 'database' };
  }

  return { ok: true };
}

/** Sign the user out, clearing the session cookie, and return them home. */
export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
