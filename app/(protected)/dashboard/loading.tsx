import { Skeleton } from '@/components/ui/Skeleton';

/** Dashboard loading skeleton, shown while server components stream in. */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-48" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
