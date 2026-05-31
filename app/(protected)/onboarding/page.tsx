import type { Metadata } from 'next';
import { getCurrentProfile } from '@/lib/auth';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Set up your profile — Verbjective',
};

/**
 * Onboarding (protected). Pre-fills the English level and language preference
 * from the user's existing profile, if any, so the flow confirms rather than
 * re-asks.
 */
export default async function OnboardingPage() {
  const profile = await getCurrentProfile();

  return (
    <OnboardingFlow
      initialLevel={profile?.english_level ?? null}
      initialLanguage={profile?.language_preference ?? 'en'}
    />
  );
}
