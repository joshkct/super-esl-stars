import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { applySubscriberDiscount, getPriceCents } from '@/lib/pricing';
import { ENGLISH_LEVELS, SESSION_DURATIONS } from '@/types';
import type { AppSettings, PricingConfig } from '@/types';
import { PricingClient, type PricingLevelData } from './PricingClient';
import { Reveal } from './Reveal';

/**
 * Build the pricing view-model from the database. Reads `pricing_config` and
 * the `app_settings` singleton via the anon server client. Any failure (or
 * missing rows) degrades gracefully to placeholder zeros — the public page
 * must never surface an error.
 */
async function loadPricing(): Promise<PricingLevelData[]> {
  let pricing: PricingConfig[] = [];
  let discountPct = 0;
  let sessionsPerMonth: number | null = null;

  try {
    const supabase = await createClient();

    const { data: pricingRows } = await supabase
      .from('pricing_config')
      .select('*');
    const { data: settings } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1)
      .maybeSingle<AppSettings>();

    if (pricingRows) pricing = pricingRows;
    if (settings) {
      discountPct = settings.subscriber_discount_pct ?? 0;
      sessionsPerMonth = settings.default_sessions_per_month;
    }
  } catch {
    // Swallow — fall through to zero placeholders below.
  }

  return ENGLISH_LEVELS.map((level) => {
    const durations = SESSION_DURATIONS.map((minutes) => ({
      minutes,
      priceCents: getPriceCents(pricing, level, minutes) ?? 0,
    }));

    // Use the 60-minute rate as the per-session base for the monthly estimate.
    const baseCents =
      durations.find((d) => d.minutes === 60)?.priceCents ?? 0;
    const perSessionDiscounted = applySubscriberDiscount(baseCents, discountPct);
    const monthlyFromCents = sessionsPerMonth
      ? perSessionDiscounted * sessionsPerMonth
      : perSessionDiscounted;

    return {
      level,
      durations,
      monthlyFromCents,
      sessionsPerMonth,
      savePct: discountPct,
    };
  });
}

export async function Pricing() {
  const t = await getTranslations('pricing');
  const levels = await loadPricing();

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-cream py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-heading"
            className="font-serif text-4xl font-bold text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{t('subtitle')}</p>
        </Reveal>

        <PricingClient levels={levels} />
      </div>
    </section>
  );
}
