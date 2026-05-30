'use client';

import { useEffect } from 'react';

/**
 * Dashboard error boundary. Catches render/data errors within the dashboard
 * segment and offers a recovery action.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h2 className="font-serif text-2xl font-bold text-ink">
        Something went wrong
      </h2>
      <p className="mt-2 text-ink-muted">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
