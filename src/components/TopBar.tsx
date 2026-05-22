'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { fetchExchangeRates, CURRENCY_LABELS, type CurrencyCode } from '@/lib/currency';
import { getTaxByZip } from '@/data/taxRates';
import { t, translations, type Lang } from '@/lib/i18n';
import clsx from 'clsx';

const CURRENCIES: CurrencyCode[] = ['NONE', 'TWD', 'KRW', 'JPY', 'CNY', 'HKD', 'BRL', 'MXN', 'SGD', 'EUR'];

const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English',   short: 'EN'   },
  { code: 'zh', label: '繁體中文',  short: '中文' },
  { code: 'sc', label: '简体中文',  short: '简中' },
  { code: 'ja', label: '日本語',    short: '日本語' },
  { code: 'ko', label: '한국어',    short: '한국어' },
  { code: 'es', label: 'Español',   short: 'ES'   },
  { code: 'pt', label: 'Português', short: 'PT'   },
];

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export default function TopBar({ onEditTax }: { onEditTax?: () => void }) {
  const {
    locationName, taxRate, isOffline,
    displayCurrency, setDisplayCurrency,
    setLocationName, setTaxRate, setIsOffline, setExchangeRates,
    lang, setLang, theme, setTheme,
  } = useAppStore();

  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLangPicker,     setShowLangPicker]     = useState(false);
  const [ratesIsLive,        setRatesIsLive]        = useState(false);
  const [ratesFetchedAt,     setRatesFetchedAt]     = useState<number | null>(null);
  const i = translations.topbar;

  useEffect(() => {
    fetchExchangeRates().then(({ rates, isLive, fetchedAt }) => {
      setExchangeRates(rates);
      setRatesIsLive(isLive);
      setRatesFetchedAt(fetchedAt);
    });
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

  const currInfo   = CURRENCY_LABELS[displayCurrency];
  const activeLang = LANGUAGES.find(l => l.code === lang)!;

  const rateBadge = ratesFetchedAt
    ? ratesIsLive
      ? (lang === 'zh' || lang === 'sc' ? `匯率 ${formatTime(ratesFetchedAt)}` : `Rates ${formatTime(ratesFetchedAt)}`)
      : (lang === 'zh' || lang === 'sc' ? '預設匯率' : lang === 'ja' ? 'デフォルトレート' : lang === 'ko' ? '기본환율' : lang === 'es' ? 'Tasa est.' : lang === 'pt' ? 'Taxa est.' : 'Est. Rate')
    : null;

  return (
    <div className="px-3 pt-3 pb-2 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-1.5">

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

        {/* Tax badge — clickable button */}
        <button
          onClick={onEditTax}
          disabled={!onEditTax}
          className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
          style={{
            background: 'var(--accent-warm)',
            color: '#fff',
            border: 'none',
            cursor: onEditTax ? 'pointer' : 'default',
            opacity: onEditTax ? 1 : 0.8,
          }}
          title="Change tax rate"
        >
          <span className="text-xs font-bold">{t(i.tax, lang)} {taxRate}%</span>
          {onEditTax && <span style={{ fontSize: '10px' }}>✏️</span>}
        </button>

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
                style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)', boxShadow: '0 8px 24px rgba(61,29,10,0.16)' }}
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

        {/* Theme toggle */}
        <button
          onClick={() => {
            const next = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
            setTheme(next);
          }}
          className="flex-shrink-0 w-8 h-8 rounded-lg border border-cream-border bg-cream-card flex items-center justify-center text-base transition-all active:scale-90 hover:border-accent-warm/60"
          title={theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Auto'}
        >
          {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
        </button>

        {/* Currency picker */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => { setShowCurrencyPicker(!showCurrencyPicker); setShowLangPicker(false); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-warm text-white text-xs font-bold"
          >
            {displayCurrency === 'NONE' ? (
              <span className="tracking-widest opacity-80">—</span>
            ) : (
              <>
                <span>{currInfo.flag}</span>
                <span>{displayCurrency}</span>
              </>
            )}
            <span className="text-white/70 text-[9px]">{showCurrencyPicker ? '▲' : '▼'}</span>
          </button>

          {showCurrencyPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyPicker(false)} />
              <div
                className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden z-50 w-44"
                style={{ background: 'var(--cream-card)', border: '1px solid var(--cream-border)', boxShadow: '0 8px 24px rgba(61,29,10,0.16)' }}
              >
                {rateBadge && (
                  <div className={clsx(
                    'flex items-center gap-1.5 px-3 py-2 border-b text-xs',
                    ratesIsLive
                      ? 'border-cream-border text-accent-sage'
                      : 'border-cream-border text-accent-orange'
                  )}>
                    <span>{ratesIsLive ? '🟢' : '🟡'}</span>
                    <span className="font-medium">{rateBadge}</span>
                  </div>
                )}
                {CURRENCIES.map((cur) => {
                  const info = CURRENCY_LABELS[cur];
                  const isNone = cur === 'NONE';
                  return (
                    <button
                      key={cur}
                      onClick={() => { setDisplayCurrency(cur); setShowCurrencyPicker(false); }}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2.5 w-full text-left text-sm hover:bg-cream-deep transition-colors',
                        cur === displayCurrency ? 'text-accent-warm font-bold' : 'text-mocha-dark',
                        isNone && 'border-b border-cream-border'
                      )}
                    >
                      {isNone ? (
                        <>
                          <span className="text-mocha-light text-base">✕</span>
                          <span className="font-medium">No conversion</span>
                        </>
                      ) : (
                        <>
                          <span>{info.flag}</span>
                          <span className="font-medium">{info.symbol}</span>
                          <span className="text-mocha-mid text-xs">{cur}</span>
                        </>
                      )}
                      {cur === displayCurrency && <span className="ml-auto text-accent-warm text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Rate freshness strip */}
      {rateBadge && !ratesIsLive && (
        <div className="flex items-center gap-1.5 px-1 animate-fade-in">
          <span className="text-[10px]">🟡</span>
          <p className="text-[10px] text-accent-orange font-medium">{rateBadge}</p>
        </div>
      )}
    </div>
  );
}
