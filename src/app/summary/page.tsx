'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';
import { calculateItemizedSplit, calculateEvenSplit } from '@/lib/splitAlgorithm';
import { convertFromUSD, formatCurrency, CURRENCY_LABELS } from '@/lib/currency';
import { t, translations } from '@/lib/i18n';
import clsx from 'clsx';
import HeaderBanner from '@/components/HeaderBanner';
import HistorySheet from '@/components/HistorySheet';
import { saveBill } from '@/lib/history';
import QRCodeCanvas from '@/components/QRCodeCanvas';

export default function SummaryPage() {
  const router = useRouter();
  const {
    splitMode, participants, receiptItems,
    subtotal, taxAmount, tipAmount, totalAmount,
    guestCount, displayCurrency, exchangeRates,
    restaurantName, tipPercent, lang,
    scenario, taxRate, locationName,
  } = useAppStore();

  const [showHistory, setShowHistory] = useState(false);
  const savedRef = useRef(false);

  // Auto-save bill to LocalStorage on first mount
  useEffect(() => {
    if (savedRef.current || totalAmount <= 0) return;
    savedRef.current = true;
    saveBill({
      id: `bill_${Date.now()}`,
      date: new Date().toISOString(),
      scenario,
      location: locationName,
      restaurantName,
      subtotal,
      taxAmount,
      tipAmount,
      total: totalAmount,
      tipPercent,
      taxRate,
      guestCount,
      currency: displayCurrency,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showQRFor, setShowQRFor] = useState<string | null>(null);

  const s = translations.summary;
  const fmtUSD = (n: number) => `$${n.toFixed(2)}`;
  const fmtForeign = (n: number) => formatCurrency(convertFromUSD(n, displayCurrency, exchangeRates), displayCurrency);
  const foreignInfo = CURRENCY_LABELS[displayCurrency];

  interface SummaryRow {
    id: string; name: string; color: string;
    total: number; subtotalPart: number; taxPart: number; tipPart: number;
    items?: { name: string; price: number; shared?: boolean }[];
    isRemainder?: boolean;
  }

  let rows: SummaryRow[] = [];

  if (splitMode === 'itemized' && receiptItems.length > 0) {
    const splits = calculateItemizedSplit(receiptItems, participants, taxAmount, tipAmount);
    rows = splits.map((sp) => ({
      id: sp.participant.id, name: sp.participant.name, color: sp.participant.color,
      total: sp.total, subtotalPart: sp.subtotal, taxPart: sp.taxShare, tipPart: sp.tipShare,
      items: sp.items, isRemainder: sp.isRemainder,
    }));
  } else {
    const even = calculateEvenSplit(subtotal, taxAmount, tipAmount, guestCount);
    const taxPerPerson = Math.round((taxAmount / guestCount) * 100) / 100;
    const tipPerPerson = Math.round((tipAmount / guestCount) * 100) / 100;
    rows = Array.from({ length: guestCount }, (_, i) => ({
      id: `p${i}`,
      name: i === 0 ? 'You' : `Person ${i + 1}`,
      color: i === 0 ? '#688DA5' : '#7A9E7E',
      total: i === 0 ? even.ownerTotal : even.perPerson,
      subtotalPart: Math.round((subtotal / guestCount) * 100) / 100,
      taxPart: taxPerPerson,
      tipPart: tipPerPerson,
      isRemainder: i === 0 && even.remainder !== 0,
    }));
  }

  const buildShareText = (single?: SummaryRow) => {
    const dateStr = new Date().toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US');
    let text = `${t(s.shareMsg, lang)}\n`;
    if (restaurantName) text += `${t(s.restaurant, lang)}${restaurantName}\n`;
    text += `${t(s.date, lang)}${dateStr}\n\n`;
    const targets = single ? [single] : rows;
    targets.forEach((r) => {
      text += `${r.name} ${t(s.owes, lang)}${fmtUSD(r.total)} (≈ ${fmtForeign(r.total)})\n`;
      if (r.items && r.items.length > 0) {
        const detail = r.items.map((it) => `${it.name} ${fmtUSD(it.price)}${it.shared ? ` ${t(translations.itemized.shared, lang)}` : ''}`).join(', ');
        text += `  → ${detail}\n`;
        text += `  → ${lang === 'zh' ? '比例稅' : 'Tax share'}: ${fmtUSD(r.taxPart)}, ${lang === 'zh' ? '比例小費' : 'Tip share'}: ${fmtUSD(r.tipPart)}\n`;
      }
    });
    text += `\n📱 TipSplit USA`;
    return text;
  };

  const buildQRText = (row: SummaryRow) => {
    const lines = [
      'TipSplit USA',
      restaurantName ? restaurantName : '',
      `${row.name}: ${fmtUSD(row.total)}`,
      `approx ${fmtForeign(row.total)}`,
      new Date().toLocaleDateString(),
    ].filter(Boolean);
    return lines.join('\n');
  };

  const copy = (text: string, id?: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    else     { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); }
  };

  const handleShare = async (platform: 'native' | 'sms' | 'venmo') => {
    const text = buildShareText();
    if (platform === 'native' && navigator.share) {
      try { await navigator.share({ title: 'TipSplit USA', text }); } catch {}
    } else if (platform === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(text)}`);
    } else if (platform === 'venmo') {
      window.open('venmo://');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-bg pb-28">
      <HeaderBanner />
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-mocha-light text-xl p-1 hover:text-mocha-mid">←</button>
        <h1 className="text-xl font-bold text-mocha-dark">{t(s.title, lang)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 bg-cream-card border border-cream-border text-mocha-mid hover:border-accent-warm/50"
          >
            {lang === 'zh' ? '📋 歷史' : '📋 History'}
          </button>
          <button
            onClick={() => copy(buildShareText())}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95',
              copiedAll ? 'bg-accent-sage text-white' : 'bg-cream-card border border-cream-border text-mocha-mid'
            )}
          >
            {copiedAll ? t(s.copied, lang) : t(s.copyAll, lang)}
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Grand total hero card */}
        <div
          className="rounded-xl2 p-4"
          style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
        >
          {restaurantName && <p className="text-white/80 text-sm font-medium mb-1">{restaurantName}</p>}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs mb-0.5">{t(s.billTotal, lang)}</p>
              <p className="text-4xl font-bold text-white">{fmtUSD(totalAmount)}</p>
              <p className="text-white/80 text-sm">≈ {fmtForeign(totalAmount)} {foreignInfo.flag}</p>
            </div>
            <div className="text-right text-white/70 text-sm">
              <p>Subtotal {fmtUSD(subtotal)}</p>
              <p>Tax +{fmtUSD(taxAmount)}</p>
              <p>Tip {tipPercent}% +{fmtUSD(tipAmount)}</p>
            </div>
          </div>
        </div>

        {/* Individual cards */}
        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div
              key={row.id}
              className="rounded-xl2 overflow-hidden animate-slide-up"
              style={{
                background: '#F7EED8', border: '1px solid #D4B880',
                boxShadow: '0 2px 12px rgba(61,29,10,0.08)',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              <div className="h-1" style={{ background: row.color }} />
              <div className="p-4">
                {/* Person header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: row.color }}
                    >
                      {row.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-mocha-dark">{row.name}</p>
                      {row.isRemainder && (
                        <p className="text-xs text-mocha-light">{t(s.remainder, lang)}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-mocha-dark">{fmtUSD(row.total)}</p>
                    <p className="text-sm font-medium" style={{ color: row.color }}>≈ {fmtForeign(row.total)}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-cream-bg rounded-xl px-3 py-2.5 mb-3 text-xs text-mocha-mid space-y-1">
                  {row.items && row.items.length > 0 ? (
                    <>
                      {row.items.map((item, j) => (
                        <div key={j} className="flex justify-between">
                          <span className="truncate mr-2">
                            {item.name}{item.shared ? ` ${t(translations.itemized.shared, lang)}` : ''}
                          </span>
                          <span className="font-medium flex-shrink-0">{fmtUSD(item.price)}</span>
                        </div>
                      ))}
                      <div className="border-t border-cream-border pt-1 mt-1 space-y-0.5">
                        <div className="flex justify-between"><span>{t(s.propTax, lang)}</span><span>+{fmtUSD(row.taxPart)}</span></div>
                        <div className="flex justify-between"><span>{t(s.propTip, lang)}</span><span>+{fmtUSD(row.tipPart)}</span></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span>{t(s.evenFood, lang)}</span><span>{fmtUSD(row.subtotalPart)}</span></div>
                      <div className="flex justify-between"><span>{t(s.evenTax, lang)}</span><span>+{fmtUSD(row.taxPart)}</span></div>
                      <div className="flex justify-between"><span>{t(s.evenTip, lang)}</span><span>+{fmtUSD(row.tipPart)}</span></div>
                    </>
                  )}
                </div>

                {/* Action buttons row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(buildShareText(row), row.id)}
                    className={clsx(
                      'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95',
                      copiedId === row.id
                        ? 'bg-accent-sage text-white'
                        : 'bg-cream-deep border border-cream-border text-mocha-mid hover:border-accent-warm/50'
                    )}
                  >
                    {copiedId === row.id ? t(s.copied, lang) : t(s.copyDetail, lang)}
                  </button>
                  <button
                    onClick={() => setShowQRFor(showQRFor === row.id ? null : row.id)}
                    className={clsx(
                      'px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center gap-1',
                      showQRFor === row.id
                        ? 'bg-accent-warm text-white'
                        : 'bg-cream-deep border border-cream-border text-mocha-mid hover:border-accent-warm/50'
                    )}
                    title={lang === 'zh' || lang === 'sc' ? 'QR Code' : 'QR Code'}
                  >
                    <span className="text-base">&#x25A6;</span>
                    <span>QR</span>
                  </button>
                </div>

                {/* QR Code panel */}
                {showQRFor === row.id && (
                  <div className="mt-3 flex flex-col items-center gap-2 animate-slide-up">
                    <QRCodeCanvas text={buildQRText(row)} size={180} color={row.color} />
                    <p className="text-xs text-mocha-light text-center">
                      {lang === 'zh' || lang === 'sc'
                        ? '讓朋友掃描此 QR Code 確認金額'
                        : lang === 'ja' ? 'QRコードをスキャンして金額を確認'
                        : lang === 'ko' ? 'QR 코드를 스캔하여 금액 확인'
                        : lang === 'es' ? 'Escanea el QR para confirmar el monto'
                        : lang === 'pt' ? 'Escaneie o QR para confirmar o valor'
                        : 'Scan to confirm amount owed'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Share panel */}
        <div className="card p-4">
          <h3 className="font-bold text-mocha-dark mb-3">{t(s.share, lang)}</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleShare('native')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-warm text-white font-bold text-sm active:scale-95"
            >
              {t(s.shareBtn, lang)}
            </button>
            <button
              onClick={() => handleShare('sms')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cream-deep border border-cream-border text-mocha-dark font-bold text-sm active:scale-95"
            >
              {t(s.iMessage, lang)}
            </button>
            <button
              onClick={() => handleShare('venmo')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3D95CE] text-white font-bold text-sm active:scale-95"
            >
              {t(s.venmo, lang)}
            </button>
            <button
              onClick={() => copy(buildShareText())}
              className={clsx(
                'flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-95 border',
                copiedAll ? 'bg-accent-sage text-white border-accent-sage' : 'bg-cream-deep border-cream-border text-mocha-dark'
              )}
            >
              {copiedAll ? t(s.copied, lang) : t(s.copyText, lang)}
            </button>
          </div>

          {/* Preview */}
          <div className="mt-3 p-3 rounded-xl bg-cream-bg border border-cream-border">
            <p className="text-xs text-mocha-light mb-1 font-medium">{t(s.preview, lang)}</p>
            <p className="text-xs text-mocha-mid leading-relaxed whitespace-pre-line">
              {t(s.shareMsg, lang)}{restaurantName ? `\n${t(s.restaurant, lang)}${restaurantName}` : ''}
              {'\n'}{rows.map((r) => `${r.name}: ${fmtUSD(r.total)} ≈ ${fmtForeign(r.total)}`).join('\n')}
            </p>
          </div>
        </div>

        {/* Start over */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl border border-cream-border text-mocha-mid text-sm font-medium hover:border-accent-warm/50 active:scale-[0.99] transition-all"
        >
          {t(s.restart, lang)}
        </button>
      </div>

      {showHistory && (
        <HistorySheet onClose={() => setShowHistory(false)} />
      )}

      <BottomNav />
    </div>
  );
}
