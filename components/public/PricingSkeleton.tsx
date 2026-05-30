import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Loading placeholder shown while pricing data is fetched on the server.
 * Mirrors the three-card pricing layout to avoid layout shift.
 */
export function PricingSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="bg-cream py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="mx-auto h-10 w-72" />
          <Skeleton className="mx-auto mt-4 h-5 w-96 max-w-full" />
        </div>

        <div className="mt-10 flex justify-center">
          <Skeleton className="h-12 w-72 rounded-full" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-ink/10 bg-surface p-7"
            >
              <Skeleton className="h-7 w-32" />
              <Skeleton className="mt-3 h-4 w-full" />
              <div className="mt-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="mt-7 h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
