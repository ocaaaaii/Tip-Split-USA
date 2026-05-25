'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';
import AppFooter from '@/components/AppFooter';
import { calculateItemizedSplit, calculateEvenSplit } from '@/lib/splitAlgorithm';
import { convertFromUSD, formatCurrency, CURRENCY_LABELS } from '@/lib/currency';
import { t, translations } from '@/lib/i18n';
import clsx from 'clsx';
import HeaderBanner from '@/components/HeaderBanner';
import HistorySheet from '@/components/HistorySheet';
import { saveBill } from '@/lib/history';
import QRCodeCanvas from '@/components/QRCodeCanvas';
import { toBlob } from 'html-to-image';

function r2(n: number) { return Math.round(n * 100) / 100; }

export default function SummaryPage() {
  const router = useRouter();
  const {
    splitMode, participants, receiptItems,
    billAmount, isTaxInclusive,
    guestCount, displayCurrency, exchangeRates,
    restaurantName, tipPercent, lang,
    scenario, taxRate, locationName,
  } = useAppStore();

  // Compute amounts directly from source values — never stale regardless of navigation timing
  let subtotal: number;
  if (splitMode === 'itemized' && receiptItems.length > 0) {
    subtotal = r2(receiptItems.reduce((s, item) => s + item.price, 0));
  } else {
    const raw = parseFloat(billAmount) || 0;
    subtotal = isTaxInclusive ? r2(raw / (1 + taxRate / 100)) : r2(raw);
  }
  const taxAmount   = r2(subtotal * taxRate / 100);
  const tipAmount   = r2(subtotal * tipPercent / 100);
  const totalAmount = r2(subtotal + taxAmount + tipAmount);

  const [showHistory, setShowHistory] = useState(false);
  const savedRef = useRef(false);

  // Auto-save bill to LocalStorage on first mount (runs once, uses locally-computed values above)
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
  const [showPayQR, setShowPayQR] = useState(false);
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [capturingFull, setCapturingFull] = useState(false);
  const [venmoToast, setVenmoToast] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({}); // points to capturable content only
  const fullSummaryRef = useRef<HTMLDivElement | null>(null);
  const receiptRef = useRef<HTMLDivElement | null>(null); // grand total + all person cards only

  const s = translations.summary;
  const fmtUSD = (n: number) => `$${n.toFixed(2)}`;
  const fmtForeign = (n: number) => formatCurrency(convertFromUSD(n, displayCurrency, exchangeRates), displayCurrency);
  const showForeign = displayCurrency !== 'NONE';
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

  const handleShare = async (platform: 'native' | 'sms' | 'venmo' | 'zelle', amount?: number) => {
    const text = buildShareText();
    if (platform === 'native' && navigator.share) {
      try { await navigator.share({ title: 'TipSplit USA', text }); } catch {}
    } else if (platform === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(text)}`);
    } else if (platform === 'venmo') {
      const amt = (amount ?? totalAmount).toFixed(2);
      const note = encodeURIComponent(`TipSplit USA${restaurantName ? ` – ${restaurantName}` : ''}`);
      const venmoUrl = `venmo://paycharge?txn=pay&amount=${amt}&note=${note}`;
      const opened = window.open(venmoUrl);
      // Show helpful hint after short delay in case app not installed
      setTimeout(() => {
        navigator.clipboard.writeText(amt).catch(() => {});
        setVenmoToast(amt);
        setTimeout(() => setVenmoToast(null), 4000);
      }, 800);
      if (!opened) {
        navigator.clipboard.writeText(amt).catch(() => {});
        setVenmoToast(amt);
        setTimeout(() => setVenmoToast(null), 4000);
      }
    } else if (platform === 'zelle') {
      const amt = (amount ?? totalAmount).toFixed(2);
      navigator.clipboard.writeText(amt).catch(() => {});
      alert(`$${amt} copied! Now open your bank app → Zelle, and paste the amount.`);
    }
  };


  const captureAndShare = useCallback(async (el: HTMLElement | null, filename: string, onStart: () => void, onEnd: () => void) => {
    if (!el) return;
    onStart();
    try {
      // Resolve all CSS custom properties to inline values before capture
      // so html-to-image can see the real colours (it handles vars natively but
      // a forced-style pass makes Safari/WebKit more reliable too).
      const style = getComputedStyle(document.documentElement);
      const varMap: Record<string, string> = {};
      for (const key of Array.from(style)) {
        if (key.startsWith('--')) varMap[key] = style.getPropertyValue(key).trim();
      }
      const blob = await toBlob(el, {
        backgroundColor: varMap['--cream-bg'] || '#EDE0C0',
        pixelRatio: 2,
        // Provide CSS variable values so any platform that doesn't resolve them gets the right colours
        style: Object.fromEntries(Object.entries(varMap)) as Record<string, string>,
        cacheBust: true,
      });
      if (!blob) return;
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'TipSplit USA' }); } catch {}
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('captureAndShare error:', e);
    } finally {
      onEnd();
    }
  }, []);

  const shareCardImage = useCallback((row: SummaryRow) => {
    captureAndShare(
      cardRefs.current[row.id],
      `tipsplit-${row.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      () => setCapturingId(row.id),
      () => setCapturingId(null),
    );
  }, [captureAndShare]);

  const shareFullPage = useCallback(() => {
    captureAndShare(
      receiptRef.current,
      'tipsplit-summary.png',
      () => setCapturingFull(true),
      () => setCapturingFull(false),
    );
  }, [captureAndShare]);

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

      {/* ── Capturable full-summary region ── */}
      <div ref={fullSummaryRef} className="px-4 space-y-4" style={{ paddingBottom: 4 }}>
        {/* ── Capturable receipt region: total + all person cards ── */}
        <div ref={receiptRef} className="space-y-4" style={{ background: 'var(--cream-bg)', padding: '0 0 4px' }}>
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
              {showForeign && <p className="text-white/80 text-sm">≈ {fmtForeign(totalAmount)} {foreignInfo.flag}</p>}
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
                background: 'var(--cream-card)', border: '1px solid var(--cream-border)',
                boxShadow: '0 2px 12px rgba(61,29,10,0.08)',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              {/* ── Capturable receipt card (no action buttons) ── */}
              <div ref={(el) => { cardRefs.current[row.id] = el; }} style={{ background: 'var(--cream-card)' }}>
                <div className="h-1.5" style={{ background: row.color }} />
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
                    {showForeign && <p className="text-sm font-medium" style={{ color: row.color }}>≈ {fmtForeign(row.total)}</p>}
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

                  {/* Branding footer inside capturable area */}
                  <div className="mt-3 pt-2 border-t border-cream-border flex items-center justify-between">
                    <span className="text-[10px] text-mocha-light opacity-50">TipSplit USA</span>
                    {restaurantName ? <span className="text-[10px] text-mocha-light opacity-50 truncate max-w-[60%]">{restaurantName}</span> : null}
                    <span className="text-[10px] text-mocha-light opacity-50">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>{/* end p-4 */}
              </div>{/* end capturable */}

              {/* Action buttons — NOT included in screenshot */}
              <div className="px-4 pb-4 flex gap-2">
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
              </div>{/* end action buttons row */}

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
          ))}
        </div>
        </div>{/* end receiptRef */}

        {/* Share panel */}
        <div className="card p-4">
          <h3 className="font-bold text-mocha-dark mb-3">{t(s.share, lang)}</h3>

          {/* Full-page screenshot — most prominent */}
          <button
            onClick={shareFullPage}
            disabled={capturingFull}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm active:scale-[0.98] mb-3 transition-all"
            style={{ background: 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' }}
          >
            {capturingFull
              ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> {lang === 'zh' || lang === 'sc' ? '截圖中...' : 'Capturing...'}</>
              : <>{t(translations.calc.shareFullPage, lang)}</>
            }
          </button>

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
              onClick={() => handleShare('venmo', rows.length > 0 ? rows[0].total : totalAmount)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3D95CE] text-white font-bold text-sm active:scale-95"
            >
              {t(s.venmo, lang)}
            </button>
            <button
              onClick={() => handleShare('zelle', rows.length > 0 ? rows[0].total : totalAmount)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-95"
              style={{ background: '#6D1ED4', color: '#fff' }}
            >
              💛 Zelle
            </button>
            <button
              onClick={() => copy(buildShareText())}
              className={clsx(
                'col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm active:scale-95 border',
                copiedAll ? 'bg-accent-sage text-white border-accent-sage' : 'bg-cream-deep border-cream-border text-mocha-dark'
              )}
            >
              {copiedAll ? t(s.copied, lang) : t(s.copyText, lang)}
            </button>
          </div>

          {/* Venmo toast */}
          {venmoToast && (
            <div className="mt-3 p-3 rounded-xl text-xs animate-slide-up" style={{ background: 'rgba(61,149,206,0.1)', border: '1px solid #3D95CE', color: '#3D95CE' }}>
              💡 <strong>${venmoToast}</strong> {lang === 'zh' || lang === 'sc' ? '已複製！若 Venmo 未開啟，請手動貼入金額欄位。' : lang === 'ja' ? 'をコピーしました！Venmoが開かない場合は手動で貼り付けてください。' : lang === 'ko' ? '복사됨! Venmo가 열리지 않으면 수동으로 붙여넣으세요.' : lang === 'es' ? 'copiado. Si Venmo no abrió, pégalo manualmente.' : lang === 'pt' ? 'copiado. Se o Venmo não abriu, cole manualmente.' : 'copied! If Venmo didn\'t open, paste the amount manually.'}
            </div>
          )}
          {/* Preview */}
          <div className="mt-3 p-3 rounded-xl bg-cream-bg border border-cream-border">
            <p className="text-xs text-mocha-light mb-1 font-medium">{t(s.preview, lang)}</p>
            <p className="text-xs text-mocha-mid leading-relaxed whitespace-pre-line">
              {t(s.shareMsg, lang)}{restaurantName ? `\n${t(s.restaurant, lang)}${restaurantName}` : ''}
              {'\n'}{rows.map((r) => `${r.name}: ${fmtUSD(r.total)} ≈ ${fmtForeign(r.total)}`).join('\n')}
            </p>
          </div>
        </div>


        {/* ☕ Ko-fi + Bank QR support card */}
        <div className="card p-4 text-center" style={{ borderStyle: 'dashed' }}>
          <p className="text-2xl mb-1">☕</p>
          <p className="font-semibold text-mocha-dark text-sm mb-0.5">
            {lang === 'zh' || lang === 'sc' ? 'TipSplit 幫你省了尷尬？' : 'Did TipSplit save the awkward math?'}
          </p>
          <p className="text-xs text-mocha-light mb-3">
            {lang === 'zh' || lang === 'sc'
              ? '如果覺得有幫助，請我們喝杯咖啡 ☺'
              : 'If it helped, buy us a coffee — it keeps the app going!'}
          </p>

          {/* Buttons row */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a
              href="https://ko-fi.com/tipsplit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF5E5B 0%, #FF8C42 100%)' }}
            >
              ☕ {lang === 'zh' || lang === 'sc' ? '請我們喝咖啡' : 'Buy us a coffee'}
            </a>
            <button
              onClick={() => setShowPayQR(!showPayQR)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-all"
              style={{
                background: showPayQR ? 'var(--accent-sage)' : 'var(--cream-bg)',
                color: showPayQR ? '#fff' : 'var(--mocha-mid)',
                border: '1px solid var(--cream-border)',
              }}
            >
              <span>🏦</span>
              <span>{lang === 'zh' || lang === 'sc' ? '銀行轉帳' : 'Bank Transfer'}</span>
            </button>
          </div>

          {/* Bank QR expandable */}
          {showPayQR && (
            <div className="mt-4 animate-slide-up">
              <div
                className="rounded-xl p-4 flex flex-col items-center gap-2"
                style={{ background: 'var(--cream-bg)', border: '1px solid var(--cream-border)' }}
              >
                <p className="text-xs font-semibold text-mocha-mid">
                  {lang === 'zh' || lang === 'sc' ? '掃描 QR Code 轉帳支持我們 🙏' : 'Scan to support us via bank transfer 🙏'}
                </p>
                <img
                  src="/pay-qr.png"
                  alt="Bank payment QR code"
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    background: '#fff',
                    padding: '8px',
                  }}
                />
                <p className="text-[10px] text-mocha-light opacity-60">
                  {lang === 'zh' || lang === 'sc' ? '任意金額，感謝你的支持 ♡' : 'Any amount — thank you so much ♡'}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--accent-orange)', opacity: 0.85 }}>
                  {lang === 'zh' || lang === 'sc' ? '⚠️ 中國信託銀行帳戶，僅限台灣用戶使用' : '⚠️ CTBC Bank (Taiwan) · TW users only'}
                </p>
              </div>
            </div>
          )}

          <p className="text-[10px] text-mocha-light mt-3 opacity-60">ko-fi.com/tipsplitusa</p>
        </div>

                {/* Start over */}
        <button
          onClick={() => {
            useAppStore.getState().setBillAmount('');
            useAppStore.getState().setReceiptItems([]);
            router.push('/');
          }}
          className="w-full py-3 rounded-xl border border-cream-border text-mocha-mid text-sm font-medium hover:border-accent-warm/50 active:scale-[0.99] transition-all"
        >
          {t(s.restart, lang)}
        </button>
      </div>

      {showHistory && (
        <HistorySheet onClose={() => setShowHistory(false)} />
      )}

      <AppFooter />
      <BottomNav />
    </div>
  );
}
