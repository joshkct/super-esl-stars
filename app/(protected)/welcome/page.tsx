import type { Metadata } from 'next';
import { getCurrentProfile } from '@/lib/auth';
import { WelcomeScreen } from '@/components/auth/WelcomeScreen';

export const metadata: Metadata = {
  title: 'Welcome — Verbjective',
};

/**
 * Post-signup welcome screen (protected). Derives the user's first name from
 * `full_name`; a missing name means the user skipped profile setup, which the
 * client screen uses to surface the "Complete your profile" CTA.
 */
export default async function WelcomePage() {
  const profile = await getCurrentProfile();
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] ?? null;

  return <WelcomeScreen firstName={firstName} />;
}
