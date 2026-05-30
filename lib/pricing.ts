import type { EnglishLevel, PricingConfig, SessionDuration } from '@/types';

/**
 * Pricing utilities.
 *
 * All monetary amounts are handled as INTEGER cents (ZAR cents). The price for
 * a session is determined by the (level, duration) pair stored in the
 * `pricing_config` table. Subscribers receive a configurable percentage
 * discount that the tutor sets from their dashboard.
 */

/** Find the configured price (in ZAR cents) for a given level + duration. */
export function getPriceCents(
  config: PricingConfig[],
  level: EnglishLevel,
  duration: SessionDuration,
): number | null {
  const match = config.find(
    (row) => row.level === level && row.duration_minutes === duration,
  );
  return match ? match.price_zar : null;
}

/**
 * Apply a subscriber discount to a base price.
 * @param baseCents   Base price in ZAR cents.
 * @param discountPct Whole-number percentage (e.g. 15 for 15% off).
 */
export function applySubscriberDiscount(
  baseCents: number,
  discountPct: number,
): number {
  const safePct = Math.min(Math.max(discountPct, 0), 100);
  return Math.round(baseCents * (1 - safePct / 100));
}

/** Format ZAR cents as a localised currency string, e.g. "R 350,00". */
export function formatZar(
  cents: number,
  locale: string = 'en-ZA',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZAR',
  }).format(cents / 100);
}
