'use client';

import { useAppStore } from '@/store/useAppStore';
import { convertFromUSD, formatCurrency, CURRENCY_LABELS } from '@/lib/currency';
import { t, translations } from '@/lib/i18n';
import { useEffect, useRef, useState } from 'react';

export default function LiveDisplay() {
  const {
    subtotal, taxAmount, tipAmount, totalAmount, tipPercent,
    isTaxInclusive, displayCurrency, exchangeRates,
    guestCount, taxRate, lang,
  } = useAppStore();

  const d = translations.display;
  const fmtUSD     = (n: number) => `$${n.toFixed(2)}`;
  const fmtForeign = (n: number) => {
    const converted = convertFromUSD(n, displayCurrency, exchangeRates);
    return formatCurrency(converted, displayCurrency);
  };

  const [popKey, setPopKey] = useState(0);
  const [rowKey, setRowKey] = useState(0);
  const prevTotal = useRef(totalAmount);

  useEffect(() => {
    if (prevTotal.current !== totalAmount) {
      setPopKey(k => k + 1);
      setRowKey(k => k + 1);
      prevTotal.current = totalAmount;
    }
  }, [totalAmount]);

  const perPerson   = guestCount > 1 ? totalAmount / guestCount : null;
  const showForeign = displayCurrency !== 'NONE';
  const foreignInfo = CURRENCY_LABELS[displayCurrency];

  const rows = [
    {
      label: isTaxInclusive ? t(d.subtotal, lang) : t(d.billAmount, lang),
      usd: fmtUSD(subtotal), foreign: fmtForeign(subtotal),
    },
    {
      label: `Tax (${taxRate}%)`,
      usd: `+${fmtUSD(taxAmount)}`, foreign: `+${fmtForeign(taxAmount)}`,
    },
    {
      label: `Tip (${tipPercent}%)`,
      usd: `+${fmtUSD(tipAmount)}`, foreign: `+${fmtForeign(tipAmount)}`,
    },
  ];

  return (
    <div
      className="rounded-2xl p-4 card-lift"
      style={{
        background: 'var(--cream-card)',
        border: '1px solid var(--cream-border)',
        boxShadow: '0 2px 12px rgba(61,29,10,0.08)',
      }}
    >
      {/* breakdown rows */}
      <div className="space-y-1.5 mb-3">
        {rows.map((row) => (
          <div key={`${row.label}-${rowKey}`} className="flex items-center justify-between count-slide">
            <span className="text-sm text-mocha-mid">{row.label}</span>
            <div className="text-right">
              <span className="text-sm font-semibold text-mocha-dark">{row.usd}</span>
              <span className="text-xs text-mocha-light ml-2">{row.foreign}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--cream-border), transparent)', margin: '10px 0' }} />

      {/* total */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-mocha-mid mb-0.5">{t(d.total, lang)}</p>
          {guestCount > 1 && (
            <p className="text-xs text-mocha-light">
              {'/'} {guestCount} {t(d.divPeople, lang)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p
            key={popKey}
            className="text-3xl font-bold leading-none amount-pop"
            style={{ color: 'var(--mocha-dark)' }}
          >
            {fmtUSD(totalAmount)}
          </p>
          {showForeign && (
            <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--accent-warm)' }}>
              approx {fmtForeign(totalAmount)} {foreignInfo.flag}
            </p>
          )}
          {perPerson !== null && (
            <p className="text-sm text-mocha-mid mt-1">
              {t(d.perPerson, lang)}{' '}
              <span className="font-bold text-mocha-dark">{fmtUSD(perPerson)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
