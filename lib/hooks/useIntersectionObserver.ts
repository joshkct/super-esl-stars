'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  /** How much of the element must be visible before triggering (0–1). */
  threshold?: number;
  /** Margin around the root, e.g. to trigger slightly before entry. */
  rootMargin?: string;
  /** When true, stop observing after the first intersection. */
  once?: boolean;
}

/**
 * Observe when an element enters the viewport.
 *
 * Returns a ref to attach to the target element and a boolean indicating
 * whether it is currently (or has been) intersecting. Used to drive scroll
 * reveal animations without any third-party animation library.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseIntersectionObserverOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Graceful fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
