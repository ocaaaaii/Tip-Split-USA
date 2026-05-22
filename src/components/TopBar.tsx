'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { fetchExchangeRates, CURRENCY_LABELS, type CurrencyCode } from '@/lib/currency';
import { getTaxByZip } from '@/data/taxRates';
import { t, translations, type Lang } from '@/lib/i18n';
import clsx from 'clsx';

const CURRENCIES: CurrencyCode[] = ['TWD', 'KRW', 'JPY', 'CNY', 'HKD', 'BRL', 'MXN', 'SGD', 'EUR'];

const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: 'zh', label: '繁體中文', short: '中文' },
  { code: 'en', label: 'English',  short: 'EN'   },
  { code: 'ja', label: '日本語',   short: '日本語' },
  { code: 'ko', label: '한국어',   short: '한국어' },
  { code: 'es', label: 'Español',  short: 'ES'   },
  { code: 'pt', label: 'Português',short: 'PT'   },
];

export default function TopBar() {
  const {
    locationName, taxRate, isOffline,
    displayCurrency, setDisplayCurrency,
    setLocationName, setTaxRate, setIsOffline, setExchangeRates,
    lang, setLang,
  } = useAppStore();

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLangPicker,     setShowLangPicker]     = useState(false);
  const i = translations.topbar;

  useEffect(() => {
    fetchExchangeRates().then(setExchangeRates);
  }, [setExchangeRates]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName(t(i.locationUnavailable, lang));
      setIsOffline(true);
      return;
    }
    setLocationName(t(i.detectingLocation, lang));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&countrycodes=us`,
            { signal: AbortSignal.timeout(5000) }
          );
          const data = await res.json();
          const zip = data.address?.postcode?.slice(0, 5) ?? '';
          const { rate, location } = getTaxByZip(zip);
          setTaxRate(rate);
          setLocationName(`${location} (${t(i.tax, lang)}: ${rate}%)`);
          setIsOffline(false);
        } catch {
          setLocationName(t(i.locationOffline, lang));
          setIsOffline(true);
        }
      },
      () => { setLocationName(t(i.tapToSet, lang)); setIsOffline(true); },
      { timeout: 8000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currInfo  = CURRENCY_LABELS[displayCurrency];
  const activeLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-1.5">
      {/* Location */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-sm flex-shrink-0">{isOffline ? '📍' : '🌐'}</span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-mocha-dark truncate leading-tight">{locationName}</p>
          {isOffline && (
            <p className="text-xs text-accent-orange leading-tight">{t(i.offlineMode, lang)}</p>
          )}
        </div>
      </div>

      {/* Tax badge */}
      <div className="flex-shrink-0 px-2 py-1 rounded-lg bg-cream-deep border border-cream-border">
        <span className="text-xs font-bold text-mocha-mid">{t(i.tax, lang)} {taxRate}%</span>
      </div>

      {/* Language picker */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => { setShowLangPicker(!showLangPicker); setShowCurrencyPicker(false); }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-cream-border bg-cream-card text-xs font-bold text-mocha-mid hover:border-accent-warm/60 transition-colors"
        >
          <span>{activeLang.short}</span>
          <span className="text-mocha-light text-[9px]">{showLangPicker ? '▲' : '▼'}</span>
        </button>

        {showLangPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowLangPicker(false)} />
            <div
              className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden z-50 w-36"
              style={{ background: '#F7EED8', border: '1px solid #D4B880', boxShadow: '0 8px 24px rgba(61,29,10,0.16)' }}
            >
              {LANGUAGES.map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => { setLang(lng.code); setShowLangPicker(false); }}
                  className={clsx(
                    'flex items-center justify-between px-3 py-2.5 w-full text-left text-sm hover:bg-cream-deep transition-colors',
                    lng.code === lang ? 'text-accent-warm font-bold' : 'text-mocha-dark'
                  )}
                >
                  <span>{lng.label}</span>
                  {lng.code === lang && <span className="text-xs text-accent-warm">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Currency picker */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => { setShowCurrencyPicker(!showCurrencyPicker); setShowLangPicker(false); }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-warm text-white text-xs font-bold"
        >
          <span>{currInfo.flag}</span>
          <span>{displayCurrency}</span>
          <span className="text-white/70 text-[9px]">{showCurrencyPicker ? '▲' : '▼'}</span>
        </button>

        {showCurrencyPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyPicker(false)} />
            <div
              className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden z-50 w-44"
              style={{ background: '#F7EED8', border: '1px solid #D4B880', boxShadow: '0 8px 24px rgba(61,29,10,0.16)' }}
            >
              {CURRENCIES.map((cur) => {
                const info = CURRENCY_LABELS[cur];
                return (
                  <button
                    key={cur}
                    onClick={() => { setDisplayCurrency(cur); setShowCurrencyPicker(false); }}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2.5 w-full text-left text-sm hover:bg-cream-deep transition-colors',
                      cur === displayCurrency ? 'text-accent-warm font-bold' : 'text-mocha-dark'
                    )}
                  >
                    <span>{info.flag}</span>
                    <span className="font-medium">{info.symbol}</span>
                    <span className="text-mocha-mid text-xs">{cur}</span>
                    {cur === displayCurrency && <span className="ml-auto text-accent-warm text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
