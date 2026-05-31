'use client';

import { cn } from '@/lib/utils';

/**
 * Row of step dots — filled gold for completed/current steps, outlined for
 * upcoming ones. Purely decorative; the surrounding flow announces step
 * changes via focus management.
 */
export function StepProgress({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            index <= current
              ? 'w-8 bg-gold'
              : 'w-2 border border-ink/30 bg-transparent',
          )}
        />
      ))}
    </div>
  );
}
