import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Verbjective',
};

/** Placeholder Privacy Policy page. Full POPIA/GDPR copy to be added later. */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="font-serif text-4xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-4 text-text-secondary">
        Our full privacy policy is coming soon. Verbjective is committed to
        POPIA and GDPR compliance and to protecting your personal data.
      </p>
    </main>
  );
}
