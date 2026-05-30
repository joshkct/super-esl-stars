'use client';

import { useEffect, useState } from 'react';

/**
 * Track whether the page has been scrolled past a given threshold (in px).
 *
 * Used by the navbar to transition from a transparent bar to a solid white
 * bar with a shadow once the user scrolls. Uses a passive scroll listener and
 * requestAnimationFrame to stay smooth.
 */
export function useScrollPosition(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrolled;
}
