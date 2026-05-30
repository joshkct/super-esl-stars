import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Verbjective',
};

/** Placeholder Terms of Service page. Full terms to be added later. */
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="font-serif text-4xl font-bold text-ink">
        Terms of Service
      </h1>
      <p className="mt-4 text-text-secondary">
        Our full terms of service are coming soon. By using Verbjective you
        agree to our booking, cancellation, and payment policies.
      </p>
    </main>
  );
}
