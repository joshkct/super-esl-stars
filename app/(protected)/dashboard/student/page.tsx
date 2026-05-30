import { requireStudent } from '@/lib/auth';

/**
 * Student dashboard (placeholder).
 * Will host upcoming sessions, booking form, history, subscription, invoices,
 * files, feedback and profile settings. Role-gated to students.
 */
export default async function StudentDashboardPage() {
  const profile = await requireStudent();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-brand-700">
        Student dashboard
      </h1>
      <p className="mt-2 text-ink-muted">Welcome, {profile.full_name}.</p>
    </main>
  );
}
