'use client';

import { useTranslations } from 'next-intl';
import { Sprout, MessagesSquare, Sparkles, type LucideIcon } from 'lucide-react';
import { ENGLISH_LEVELS, type EnglishLevel } from '@/types';
import { cn } from '@/lib/utils';

const ICONS: Record<EnglishLevel, LucideIcon> = {
  beginner: Sprout,
  intermediate: MessagesSquare,
  advanced: Sparkles,
};

/**
 * Accessible radio-card group for choosing an English level. Renders three
 * cards side by side (stacked on small screens). The selected card gets a gold
 * border and a subtle ink background tint.
 */
export function LevelSelector({
  value,
  onChange,
  name = 'englishLevel',
}: {
  value: EnglishLevel | null;
  onChange: (level: EnglishLevel) => void;
  name?: string;
}) {
  const t = useTranslations('auth.levels');

  return (
    <div
      role="radiogroup"
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {ENGLISH_LEVELS.map((level) => {
        const Icon = ICONS[level];
        const selected = value === level;
        return (
          <label
            key={level}
            className={cn(
              'flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors',
              selected
                ? 'border-gold bg-ink/5'
                : 'border-ink/15 hover:border-ink/30',
            )}
          >
            <input
              type="radio"
              name={name}
              value={level}
              checked={selected}
              onChange={() => onChange(level)}
              className="sr-only"
            />
            <Icon
              className={cn('h-6 w-6', selected ? 'text-gold' : 'text-ink')}
              aria-hidden="true"
            />
            <span className="font-serif text-lg font-bold text-ink">
              {t(`${level}.name`)}
            </span>
            <span className="text-sm text-text-secondary">
              {t(`${level}.description`)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
