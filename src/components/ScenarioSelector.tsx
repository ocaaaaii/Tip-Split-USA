'use client';

import { useAppStore, type Scenario } from '@/store/useAppStore';
import { t, translations, type Lang } from '@/lib/i18n';
import clsx from 'clsx';

const SCENARIO_ICONS: Record<Scenario, string> = {
  restaurant: '🍽️',
  takeout:    '🥡',
  bar:        '🍺',
  taxi:       '🚕',
  hotel:      '🏨',
  salon:      '✂️',
  delivery:   '🛵',
};

const SCENARIO_QUICK_TIPS: Record<Scenario, number[]> = {
  restaurant: [0, 15, 18, 20, 22],
  takeout:    [0, 5, 10],
  bar:        [0, 15, 18, 20],
  taxi:       [0, 15, 18, 20],
  hotel:      [0],
  salon:      [0, 15, 18, 20],
  delivery:   [0, 5, 10, 15],
};

const ALL_SCENARIOS: Scenario[] = ['restaurant', 'takeout', 'bar', 'taxi', 'hotel', 'salon', 'delivery'];

export default function ScenarioSelector() {
  const { scenario, setScenario, lang } = useAppStore();
  const s = translations.scenarios;
  const r = translations.tipRanges;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {ALL_SCENARIOS.map((id) => (
        <button
          key={id}
          onClick={() => setScenario(id)}
          className={clsx(
            'flex-shrink-0 flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border transition-all duration-200',
            scenario === id
              ? 'bg-accent-warm border-accent-warm text-white shadow-md scale-105'
              : 'bg-cream-card border-cream-border text-mocha-mid hover:border-accent-warm/50'
          )}
        >
          <span className="text-2xl leading-none">{SCENARIO_ICONS[id]}</span>
          <span className="text-xs font-medium whitespace-nowrap leading-tight">
            {t(s[id], lang)}
          </span>
          <span className={clsx('text-xs leading-tight', scenario === id ? 'text-white/80' : 'text-mocha-light')}>
            {t(r[id], lang)}
          </span>
        </button>
      ))}
    </div>
  );
}

export function getScenarioQuickTips(scenario: Scenario): number[] {
  return SCENARIO_QUICK_TIPS[scenario] ?? [0, 15, 18, 20];
}

export function getScenarioAlert(scenario: Scenario, guestCount: number, lang: Lang): string | null {
  const a = translations.alerts;
  if (scenario === 'restaurant' && guestCount >= 6) {
    return t(a.autoGratuity, lang);
  }
  return t(a[scenario], lang);
}
