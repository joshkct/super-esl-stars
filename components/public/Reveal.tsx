'use client';

import { type ElementType, type ReactNode } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Optional stagger delay in milliseconds. */
  delay?: number;
  /** Element/tag to render as. Defaults to a div. */
  as?: ElementType;
}

/**
 * Wraps content in a scroll-reveal container that fades and slides up as it
 * enters the viewport. Animation is CSS-only (see globals.css) and fully
 * respects `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn('reveal', isVisible && 'reveal-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
