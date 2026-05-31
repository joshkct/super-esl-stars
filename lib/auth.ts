import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

/**
 * Server-side authentication and authorisation helpers.
 * Use these in Server Components / Server Actions to guard data access.
 */

/**
 * Ensures an authenticated session exists (but not necessarily a profile).
 * Use for routes a brand-new user can reach before completing profile setup,
 * such as /welcome and /onboarding.
 */
export async function requireSession(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  return user;
}

/** Returns the authenticated profile, or null if not signed in. */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile ?? null;
}

/** Redirects to sign-in unless authenticated. Returns the profile otherwise. */
export async function requireUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/sign-in');
  return profile;
}

/** Redirects non-tutors away from tutor-only areas. */
export async function requireTutor(): Promise<Profile> {
  const profile = await requireUser();
  if (profile.role !== 'tutor') redirect('/dashboard/student');
  return profile;
}

/** Redirects tutors to their own dashboard from student-only areas. */
export async function requireStudent(): Promise<Profile> {
  const profile = await requireUser();
  if (profile.role !== 'student') redirect('/dashboard/tutor');
  return profile;
}
