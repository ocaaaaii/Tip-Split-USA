'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';
import AppFooter from '@/components/AppFooter';
import { calculateEvenSplit } from '@/lib/splitAlgorithm';
import { convertFromUSD, formatCurrency, CURRENCY_LABELS } from '@/lib/currency';
import { t, translations } from '@/lib/i18n';
import clsx from 'clsx';
import HeaderBanner from '@/components/HeaderBanner';

export default function SplitPage() {
  const router = useRouter();
  const {
    splitMode, setSplitMode,
    subtotal, taxAmount, tipAmount, totalAmount,
    guestCount, setGuestCount,
    displayCurrency, exchangeRates,
    lang,
  } = useAppStore();

  const s = translations.split;
  const fmtUSD = (n: number) => `$${n.toFixed(2)}`;
  const fmtForeign = (n: number) => formatCurrency(convertFromUSD(n, displayCurrency, exchangeRates), displayCurrency);
  const showForeign = displayCurrency !== 'NONE';
  const evenSplit = calculateEvenSplit(subtotal, taxAmount, tipAmount, guestCount);
  const foreignInfo = CURRENCY_LABELS[displayCurrency];

  return (
    <div className="flex flex-col min-h-screen bg-cream-bg pb-28">
      <HeaderBanner />
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-mocha-light text-xl p-1 hover:text-mocha-mid transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-mocha-dark">{t(s.title, lang)}</h1>
      </div>

      {/* Bill summary */}
      <div className="px-4 mb-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-mocha-light mb-0.5">{t(s.billTotal, lang)}</p>
              <p className="text-3xl font-bold text-mocha-dark">{fmtUSD(totalAmount)}</p>
              {showForeign && (
                <p className="text-sm text-accent-warm font-medium">
                  ≈ {fmtForeign(totalAmount)} {foreignInfo.flag}
                </p>
              )}
            </div>
            <div className="text-right text-sm text-mocha-mid space-y-0.5">
              <p>{t(s.preTax, lang)} {fmtUSD(subtotal)}</p>
              <p>Tax +{fmtUSD(taxAmount)}</p>
              <p>Tip +{fmtUSD(tipAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { mode: 'even', icon: '👥', label: t(s.evenSplit, lang), sub: t(s.evenDesc, lang) },
              { mode: 'itemized', icon: '🧾', label: t(s.itemized, lang), sub: t(s.itemDesc, lang) + (lang === 'zh' || lang === 'ja' || lang === 'ko' ? ' · 含🍷酒水分攤' : ' · incl. 🍷 alcohol split') },
            ] as const
          ).map(({ mode, icon, label, sub }) => (
            <button
              key={mode}
              onClick={() => {
                setSplitMode(mode);
                if (mode === 'itemized') router.push('/itemized');
              }}
              className={clsx(
                'flex flex-col items-center gap-2 py-5 rounded-xl2 border-2 transition-all duration-200 active:scale-[0.98]',
                splitMode === mode
                  ? 'bg-accent-warm text-white border-accent-warm shadow-card'
                  : 'bg-cream-card text-mocha-dark border-cream-border hover:border-accent-warm/40'
              )}
            >
              <span className="text-3xl">{icon}</span>
              <span className="font-bold text-base">{label}</span>
              <span className={clsx('text-xs', splitMode === mode ? 'text-white/80' : 'text-mocha-light')}>
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Even split UI */}
      {splitMode === 'even' && (
        <div className="px-4 space-y-4 animate-slide-up">
          {/* People count */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-mocha-dark">{t(s.splitCount, lang)}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-10 h-10 rounded-full bg-cream-border text-mocha-dark font-bold text-xl flex items-center justify-center active:scale-90"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-mocha-dark w-10 text-center">{guestCount}</span>
                <button
                  onClick={() => setGuestCount(Math.min(30, guestCount + 1))}
                  className="w-10 h-10 rounded-full bg-accent-warm text-white font-bold text-xl flex items-center justify-center active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Per person highlight */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
            >
              <p className="text-white/80 text-sm mb-1">{t(s.perPerson, lang)}</p>
              <p className="text-4xl font-bold text-white">{fmtUSD(evenSplit.perPerson)}</p>
              {showForeign && <p className="text-white/80 text-sm mt-1">≈ {fmtForeign(evenSplit.perPerson)}</p>}
            </div>

            {evenSplit.remainder !== 0 && (
              <p className="text-xs text-mocha-light text-center mt-2">
                ✳️ {t(s.remainder, lang)} ({fmtUSD(evenSplit.ownerTotal)})
              </p>
            )}
          </div>

          {/* Per-person cards */}
          <div className="space-y-2 stagger">
            {Array.from({ length: guestCount }, (_, i) => {
              const isOwner = i === 0;
              const amount = isOwner ? evenSplit.ownerTotal : evenSplit.perPerson;
              const name = isOwner
                ? `You ${t(s.owner, lang)}`
                : `${t(s.person, lang)} ${i + 1}`;
              return (
                <div key={i} className="card p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        background: isOwner ? '#688DA5' : '#D4B880',
                        color: isOwner ? 'white' : '#6B3A20',
                      }}
                    >
                      {isOwner ? '★' : String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-medium text-mocha-dark">{name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-mocha-dark">{fmtUSD(amount)}</p>
                    {showForeign && <p className="text-xs text-mocha-light">{fmtForeign(amount)}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push('/summary')}
            className="w-full py-4 rounded-xl2 font-bold text-white text-lg active:scale-[0.99] transition-transform"
            style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
          >
            {t(s.goSummary, lang)}
          </button>
        </div>
      )}

      {splitMode === 'itemized' && (
        <div className="px-4 animate-slide-up">
          <button
            onClick={() => router.push('/itemized')}
            className="w-full py-4 rounded-xl2 font-bold text-white text-lg active:scale-[0.99] transition-transform"
            style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
          >
            {t(s.goItemized, lang)}
          </button>
        </div>
      )}

      <AppFooter />
      <BottomNav />
    </div>
  );
}
