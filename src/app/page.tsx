'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TopBar from '@/components/TopBar';
import ScenarioSelector, { getScenarioQuickTips, getScenarioAlert } from '@/components/ScenarioSelector';
import NumberPad from '@/components/NumberPad';
import LiveDisplay from '@/components/LiveDisplay';
import AlertBanner from '@/components/AlertBanner';
import BottomNav from '@/components/BottomNav';
import { TAX_DATA } from '@/data/taxRates';
import { t, translations, type Lang } from '@/lib/i18n';
import clsx from 'clsx';
import HeaderBanner from '@/components/HeaderBanner';
import TipCultureModal from '@/components/TipCultureModal';
import OnboardingModal from '@/components/OnboardingModal';

export default function HomePage() {
  const {
    billAmount, isTaxInclusive, setIsTaxInclusive,
    tipPercent, setTipPercent, scenario, guestCount, setGuestCount,
    taxRate, setTaxRate, setLocationName,
    subtotal, lang,
  } = useAppStore();

  const [showTaxPicker, setShowTaxPicker] = useState(false);
  const [customTip, setCustomTip] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [showTipCulture, setShowTipCulture] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('tipsplit_onboarded_v1');
  });

  const handleOnboardingDone = () => {
    localStorage.setItem('tipsplit_onboarded_v1', '1');
    setShowOnboarding(false);
  };

  const c = translations.calc;
  const quickTips = getScenarioQuickTips(scenario);

  // Auto-Gratuity warning for 6+ guests at restaurant
  useEffect(() => {
    setShowGuestWarning(guestCount >= 6 && scenario === 'restaurant');
  }, [guestCount, scenario]);

  const handleTipSelect = (pct: number) => {
    setTipPercent(pct);
    setIsCustomMode(false);
    setCustomTip('');
  };

  const handleCustomTipSubmit = () => {
    const v = parseFloat(customTip);
    if (!isNaN(v) && v >= 0 && v <= 100) {
      setTipPercent(v);
      setIsCustomMode(false);
    }
  };

  const scenarioAlert = getScenarioAlert(scenario, guestCount, lang);
  const cashWarning = (parseFloat(billAmount) || 0) > 0 && (parseFloat(billAmount) || 0) < 20;

  return (
    <div className="flex flex-col min-h-screen bg-cream-bg pb-28">
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
      <HeaderBanner />
      <TopBar />

      <div className="px-4 space-y-4">

        {/* ── Bill Amount Card ── */}
        <div className="card p-4">
          {/* Tax toggle */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-mocha-mid">
              {t(c.billAmount, lang)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mocha-light">
                {isTaxInclusive ? t(c.taxInclusive, lang) : t(c.preTax, lang)}
              </span>
              <button
                onClick={() => setIsTaxInclusive(!isTaxInclusive)}
                className={clsx(
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  isTaxInclusive ? 'bg-accent-warm' : 'bg-cream-border'
                )}
                aria-label="Toggle tax inclusive"
              >
                <span
                  className={clsx(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                    isTaxInclusive ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Amount display */}
          <div className="text-center py-3 mb-1">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-light text-mocha-light">$</span>
              <span
                key={billAmount}
                className="font-bold text-mocha-dark leading-none digit-pop"
                style={{ fontSize: billAmount ? '3rem' : '2.5rem' }}
              >
                {billAmount || '0.00'}
              </span>
            </div>
            {isTaxInclusive && billAmount && (
              <p className="text-xs text-mocha-light mt-1">
                {t(c.preTaxNote, lang)} ${subtotal.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* ── Number Pad ── */}
        <NumberPad />

        {/* ── Scenario Selector ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <h2 className="text-xs font-semibold text-mocha-light uppercase tracking-wider">
              {t(translations.calc.billAmount, lang) === 'Bill Amount'
                ? 'Scenario'
                : t(translations.calc.billAmount, lang) === '帳單金額'
                  ? '消費場景'
                  : t(translations.scenarios.restaurant, lang) === 'Dine-in' ? 'Scenario' : '消費場景'}
            </h2>
            <button
              onClick={() => setShowTipCulture(true)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-90 hover:bg-accent-warm/10"
              style={{ color: '#688DA5', border: '1.5px solid #688DA5' }}
              title={lang === 'zh' ? '小費文化說明' : 'Tip Culture Guide'}
            >
              i
            </button>
          </div>
          <ScenarioSelector />
        </div>

        {/* ── Scenario / Auto-Gratuity Alert ── */}
        {showGuestWarning
          ? <AlertBanner message={t(translations.alerts.autoGratuity, lang)} type="warning" />
          : scenarioAlert && <AlertBanner message={scenarioAlert} type="info" />
        }

        {/* ── Guest Count ── */}
        <div className="card p-3 flex items-center justify-between">
          <span className="text-sm text-mocha-mid font-semibold">
            👥 {t(translations.calc.billAmount, lang) === 'Bill Amount' ? 'Guests' : '用餐人數'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-9 h-9 rounded-full bg-cream-border text-mocha-dark font-bold flex items-center justify-center text-xl active:scale-90"
            >
              −
            </button>
            <span className="text-xl font-bold text-mocha-dark w-8 text-center">
              {guestCount}
            </span>
            <button
              onClick={() => setGuestCount(Math.min(30, guestCount + 1))}
              className="w-9 h-9 rounded-full bg-accent-warm text-white font-bold flex items-center justify-center text-xl active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* ── Tip Buttons ── */}
        <div>
          <h2 className="text-xs font-semibold text-mocha-light uppercase tracking-wider mb-2 px-0.5">
            {lang === 'en' ? 'Tip Rate' : '小費比率'}
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {quickTips.map((pct) => (
              <button
                key={pct}
                onClick={() => handleTipSelect(pct)}
                className={clsx(
                  'py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95',
                  tipPercent === pct && !isCustomMode
                    ? 'bg-accent-warm text-white shadow-md'
                    : 'bg-cream-card border border-cream-border text-mocha-dark hover:border-accent-warm/50'
                )}
              >
                {pct === 0 ? 'Skip' : `${pct}%`}
              </button>
            ))}
            <button
              onClick={() => setIsCustomMode(true)}
              className={clsx(
                'py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 col-span-5',
                isCustomMode
                  ? 'bg-accent-warm text-white shadow-md'
                  : 'bg-cream-card border border-cream-border text-mocha-mid hover:border-accent-warm/50'
              )}
            >
              {t(c.customTip, lang)}
            </button>
          </div>

          {isCustomMode && (
            <div className="mt-2 flex gap-2 animate-slide-up">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder={t(c.customPlaceholder, lang)}
                className="flex-1 px-4 py-3 rounded-xl border border-cream-border bg-cream-card text-mocha-dark text-center font-bold text-lg focus:outline-none focus:border-accent-warm"
                autoFocus
              />
              <button
                onClick={handleCustomTipSubmit}
                className="px-5 py-3 bg-accent-warm text-white rounded-xl font-bold active:scale-95"
              >
                {t(c.confirm, lang)}
              </button>
            </div>
          )}
        </div>

        {/* ── Cash Warning ── */}
        {cashWarning && (
          <AlertBanner message={t(c.cashWarning, lang)} type="info" dismissible />
        )}

        {/* ── Live Display ── */}
        <LiveDisplay />

        {/* ── Tax picker trigger ── */}
        <button
          onClick={() => setShowTaxPicker(true)}
          className="w-full text-center text-xs text-mocha-light underline py-1 hover:text-mocha-mid transition-colors"
        >
          {t(c.adjustTax, lang)}
        </button>

        {/* ── Coinstar tip ── */}
        <div
          className="rounded-xl p-3 flex items-start gap-2"
          style={{ background: '#F0EDE3', border: '1px solid #D8CFC0' }}
        >
          <span className="flex-shrink-0">🪙</span>
          <p className="text-xs text-mocha-mid leading-relaxed">
            {t(c.coinstarTip, lang)}
          </p>
        </div>
      </div>

      {/* ── Tip Culture Modal ── */}
      {showTipCulture && (
        <TipCultureModal scenario={scenario} onClose={() => setShowTipCulture(false)} />
      )}

      {/* ── Tax Rate Picker Modal ── */}
      {showTaxPicker && (
        <TaxPickerModal
          lang={lang}
          onClose={() => setShowTaxPicker(false)}
          currentRate={taxRate}
          onSelect={(rate, loc) => {
            setTaxRate(rate);
            setLocationName(`${loc} (Tax: ${rate}%)`);
            setShowTaxPicker(false);
            useAppStore.getState().computeAmounts();
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}

// ── Tax Picker Modal ──
function TaxPickerModal({
  onClose, currentRate, onSelect, lang,
}: {
  onClose: () => void;
  currentRate: number;
  onSelect: (rate: number, loc: string) => void;
  lang: Lang;
}) {
  const [customRate, setCustomRate] = useState(currentRate.toString());
  const c = translations.calc;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(61,29,10,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] rounded-t-2xl p-5 max-h-[75vh] overflow-y-auto"
        style={{ background: '#F7EED8' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-mocha-dark text-lg">{t(c.selectTax, lang)}</h3>
          <button onClick={onClose} className="text-mocha-light text-xl px-2 hover:text-mocha-mid">✕</button>
        </div>

        {/* Custom rate */}
        <div className="flex gap-2 mb-5">
          <div className="flex-1 flex items-center px-4 rounded-xl border border-cream-border bg-cream-bg">
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder={t(c.customRate, lang)}
              className="flex-1 bg-transparent py-2.5 text-mocha-dark font-bold text-center focus:outline-none"
            />
            <span className="text-mocha-mid font-bold">%</span>
          </div>
          <button
            onClick={() => {
              const r = parseFloat(customRate);
              if (!isNaN(r) && r >= 0 && r <= 20) onSelect(r, 'Custom');
            }}
            className="px-5 py-2.5 bg-accent-warm text-white rounded-xl font-bold active:scale-95"
          >
            {t(c.apply, lang)}
          </button>
        </div>

        {/* State + City list */}
        <div className="space-y-3">
          {TAX_DATA.map((stateData) => (
            <div key={stateData.stateCode}>
              <p className="text-xs font-bold text-mocha-light uppercase tracking-wider mb-1.5 px-1">
                {stateData.state} ({stateData.stateCode})
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {stateData.cities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => onSelect(city.totalTax, `${city.name}, ${stateData.stateCode}`)}
                    className={clsx(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-colors active:scale-95',
                      city.totalTax === currentRate
                        ? 'bg-accent-warm/10 border-accent-warm text-accent-warm font-bold'
                        : 'bg-cream-bg border-cream-border text-mocha-dark hover:border-accent-warm/50'
                    )}
                  >
                    <span className="truncate">{city.name}</span>
                    <span className="font-bold text-xs ml-1 flex-shrink-0">{city.totalTax}%</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
            </div>
    </div>
  );
}
