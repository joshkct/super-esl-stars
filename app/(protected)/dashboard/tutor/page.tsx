import { requireTutor } from '@/lib/auth';

/**
 * Tutor dashboard (placeholder).
 * Will host overview, availability manager, booking manager, student roster,
 * progress notes, pricing manager, subscription manager, invoice manager,
 * files, contact submissions and feedback. Role-gated to the tutor.
 */
export default async function TutorDashboardPage() {
  const profile = await requireTutor();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-brand-700">
        Tutor dashboard
      </h1>
      <p className="mt-2 text-ink-muted">Welcome, {profile.full_name}.</p>
    </main>
  );
}
