import { cn } from '@/lib/utils';

/**
 * Loading skeleton primitive. Compose to build per-component loading states
 * across data-fetching dashboard sections.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200', className)}
      {...props}
    />
  );
}
