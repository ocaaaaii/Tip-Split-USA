'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';
import HeaderBanner from '@/components/HeaderBanner';
import { PARTICIPANT_COLORS, type ReceiptItem, type Participant } from '@/lib/splitAlgorithm';
import { calculateItemizedSplit } from '@/lib/splitAlgorithm';
import { t, tpl, translations } from '@/lib/i18n';
import clsx from 'clsx';

function genId() { return Math.random().toString(36).slice(2, 10); }

const SERVICE_CHARGE_KEYWORDS = [
  'service charge', 'auto-gratuity', 'auto gratuity', 'auto grat',
  'gratuity', 'svc charge', 'service fee', 'auto tip', 'mandatory tip',
];

export default function ItemizedPage() {
  const router = useRouter();
  const {
    participants, addParticipant, removeParticipant,
    receiptItems, addReceiptItem, updateReceiptItem, removeReceiptItem,
    taxAmount, tipAmount, setReceiptItems, lang,
  } = useAppStore();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [newItemName, setNewItemName]   = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newParticipantName, setNewParticipantName] = useState('');
  const [ocr, setOcr] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
  const [restaurantName, setRestaurantName] = useState('');
  const [serviceChargeDetected, setServiceChargeDetected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const i = translations.itemized;

  // ── OCR ──────────────────────────────────────────────────────────────────
  const handleImageUpload = useCallback(async (file: File) => {
    setOcr({ loading: true, error: null });
    setServiceChargeDetected(false);
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const result = await Tesseract.recognize(file, 'eng', { logger: () => {} });
      const lines = result.data.text.split('\n').map((l) => l.trim()).filter(Boolean);

      // ── Service charge detection (before line filtering) ──────────────────
      const detected = lines.some((line) =>
        SERVICE_CHARGE_KEYWORDS.some((kw) => line.toLowerCase().includes(kw))
      );
      setServiceChargeDetected(detected);

      const parsedItems: ReceiptItem[] = [];
      const priceRegex = /\$?([\d,]+\.?\d{0,2})$/;
      const skipWords = ['subtotal','tax','tip','total','gratuity','balance','change','cash',
        'credit','table','server','guests','receipt','thank','visa','mastercard',
        'service charge','service fee','auto grat'];

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (skipWords.some((w) => lower.includes(w))) continue;
        const match = line.match(priceRegex);
        if (!match) continue;
        const price = parseFloat(match[1].replace(',', ''));
        if (isNaN(price) || price <= 0 || price > 999) continue;
        const name = line.replace(match[0], '').replace(/\d/g, '').replace(/[.,\-–\s]+$/, '').trim();
        if (name.length < 2) continue;
        parsedItems.push({ id: genId(), name: name || `Item ${parsedItems.length + 1}`, price, assignedTo: [] });
      }

      if (parsedItems.length > 0) {
        setReceiptItems(parsedItems);
        setOcr({ loading: false, error: null });
      } else {
        setOcr({ loading: false, error: t(i.ocrFailed, lang) });
      }
    } catch (e) {
      setOcr({ loading: false, error: `OCR: ${(e as Error).message}` });
    }
  }, [setReceiptItems, lang, i]);

  // ── Add item ──────────────────────────────────────────────────────────────
  const handleAddItem = () => {
    const price = parseFloat(newItemPrice);
    if (!newItemName.trim() || isNaN(price) || price <= 0) return;
    addReceiptItem({ id: genId(), name: newItemName.trim(), price, assignedTo: [] });
    setNewItemName(''); setNewItemPrice('');
  };

  // ── Add participant ───────────────────────────────────────────────────────
  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) return;
    const colorIdx = participants.length % PARTICIPANT_COLORS.length;
    addParticipant({ id: genId(), name: newParticipantName.trim(), color: PARTICIPANT_COLORS[colorIdx], isDrinker: true });
    setNewParticipantName('');
  };

  // ── Toggle participant drinker status ─────────────────────────────────────
  const toggleDrinker = (id: string) => {
    const p = participants.find((pp) => pp.id === id);
    if (!p) return;
    const { setParticipants } = useAppStore.getState();
    setParticipants(participants.map((pp) => pp.id === id ? { ...pp, isDrinker: pp.isDrinker === false ? true : false } : pp));
  };

  // ── Assign item ───────────────────────────────────────────────────────────
  const handleAssign = (itemId: string, participantId: string) => {
    const item = receiptItems.find((it) => it.id === itemId);
    if (!item) return;
    const already = item.assignedTo.includes(participantId);
    updateReceiptItem(itemId, {
      assignedTo: already
        ? item.assignedTo.filter((id) => id !== participantId)
        : [...item.assignedTo, participantId],
    });
  };

  // ── Toggle alcohol flag ───────────────────────────────────────────────────
  const toggleAlcohol = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = receiptItems.find((it) => it.id === itemId);
    if (!item) return;
    updateReceiptItem(itemId, { isAlcohol: !item.isAlcohol });
  };

  // ── Go to summary ─────────────────────────────────────────────────────────
  const handleGoSummary = () => {
    const unassigned = receiptItems.filter((it) => it.assignedTo.length === 0).length;
    if (unassigned > 0) { alert(tpl(i.unassignedAlert, lang, { n: unassigned })); return; }
    router.push('/summary');
  };

  const splits = calculateItemizedSplit(receiptItems, participants, taxAmount, tipAmount);
  const totalAssigned = receiptItems.reduce((s, it) => s + it.price, 0);
  const allAssigned   = receiptItems.every((it) => it.assignedTo.length > 0) && receiptItems.length > 0;
  const unassignedCount = receiptItems.filter((it) => it.assignedTo.length === 0).length;
  const hasAlcohol = receiptItems.some((it) => it.isAlcohol);

  return (
    <div className="flex flex-col min-h-screen bg-cream-bg pb-28">
      <HeaderBanner />
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-mocha-light text-xl p-1 hover:text-mocha-mid">←</button>
        <h1 className="text-xl font-bold text-mocha-dark">{t(i.title, lang)}</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Restaurant name */}
        <input
          type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)}
          placeholder={t(i.restaurantName, lang)}
          className="w-full px-4 py-3 rounded-xl border border-cream-border bg-cream-card text-mocha-dark placeholder-mocha-pale focus:outline-none focus:border-accent-warm"
        />

        {/* OCR */}
        <div className="card p-4">
          <h2 className="font-bold text-mocha-dark mb-3 flex items-center gap-2">
            <span>📷</span> {t(i.scanReceipt, lang)}
          </h2>
          <input
            ref={fileInputRef} type="file" accept="image/*" capture="environment"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
          />
          <button
            onClick={() => fileInputRef.current?.click()} disabled={ocr.loading}
            className={clsx(
              'w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]',
              ocr.loading
                ? 'bg-cream-border text-mocha-light cursor-not-allowed'
                : 'bg-accent-warm/10 border-2 border-dashed border-accent-warm text-accent-warm hover:bg-accent-warm/20'
            )}
          >
            {ocr.loading ? t(i.recognizing, lang) : t(i.takePhoto, lang)}
          </button>
          {ocr.error && <p className="text-xs text-accent-orange mt-2">{ocr.error}</p>}
          <p className="text-xs text-mocha-light mt-2 text-center">{t(i.manualEntry, lang)}</p>
        </div>

        {/* ── Service Charge Warning ── */}
        {serviceChargeDetected && (
          <div
            className="animate-pop-in rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(196,88,26,0.10)', border: '1.5px solid #C4581A' }}
          >
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-sm" style={{ color: '#C4581A' }}>
                {lang === 'zh' ? '偵測到服務費！' : 'Service Charge Detected!'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B3A20' }}>
                {lang === 'zh'
                  ? '帳單已含 Service Charge / Gratuity，建議將小費設為 0% 避免重複給小費！'
                  : 'Your bill already includes a Service Charge or Gratuity. Set tip to 0% to avoid double-tipping!'}
              </p>
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="card p-4">
          <h2 className="font-bold text-mocha-dark mb-3">{t(i.participants, lang)}</h2>
          {/* Alcohol hint — always visible so users discover the feature */}
          <div className="mb-2 px-2 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: 'rgba(104,141,165,0.10)' }}>
            <span className="text-xs">🍷</span>
            <p className="text-xs" style={{ color: '#688DA5' }}>
              {lang === 'zh'
                ? '品項旁點 🍷 標記酒水；🍺 設定不喝酒成員，自動排除'
                : lang === 'ja'
                  ? '品目の🍷でお酒をマーク；🍺で飲まないメンバーを除外'
                  : lang === 'ko'
                    ? '품목 옆 🍷로 주류 표시；🍺로 음주 안 하는 멤버 제외'
                    : lang === 'es' || lang === 'pt'
                      ? 'Toca 🍷 en un ítem para marcar alcohol；🍺 excluye a quien no bebe'
                      : 'Tap 🍷 on an item to mark alcohol; 🍺 to exclude non-drinkers'}
            </p>
          </div>
          {hasAlcohol && (
            <p className="text-xs mb-2" style={{ color: '#688DA5' }}>
              🍷 {lang === 'zh' ? '點擊 🍺 切換「不喝酒」，酒水品項將自動排除該成員' : 'Tap 🍺 to mark as non-drinker — alcohol items exclude them automatically'}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {participants.map((p: Participant) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: p.color + '20', border: `1.5px solid ${p.color}`, color: p.color }}
              >
                <span style={{ opacity: p.isDrinker === false ? 0.5 : 1 }}>{p.name}</span>
                {hasAlcohol && (
                  <button
                    onClick={() => toggleDrinker(p.id)}
                    className="text-xs"
                    title={lang === 'zh' ? '切換飲酒狀態' : 'Toggle drinker'}
                    style={{ opacity: p.isDrinker === false ? 0.4 : 1 }}
                  >
                    🍺
                  </button>
                )}
                {participants.length > 1 && (
                  <button onClick={() => removeParticipant(p.id)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text" value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
              placeholder={t(i.addPerson, lang)}
              className="flex-1 px-3 py-2 rounded-xl border border-cream-border bg-cream-bg text-mocha-dark text-sm focus:outline-none focus:border-accent-warm"
            />
            <button onClick={handleAddParticipant} className="px-4 py-2 bg-accent-warm text-white rounded-xl text-sm font-bold active:scale-95">+</button>
          </div>
        </div>

        {/* Items */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-mocha-dark">{t(i.items, lang)}</h2>
            {hasAlcohol && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(104,141,165,0.15)', color: '#688DA5' }}>
                🍷 {lang === 'zh' ? '酒水標記中' : 'Alcohol mode on'}
              </span>
            )}
          </div>

          {receiptItems.length === 0 ? (
            <p className="text-sm text-mocha-light text-center py-4">{t(i.noItems, lang)}</p>
          ) : (
            <div className="space-y-2 mb-3">
              {receiptItems.map((item: ReceiptItem) => {
                const isSelected = selectedItem === item.id;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setSelectedItem(isSelected ? null : item.id)}
                      className={clsx(
                        'w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left',
                        item.isAlcohol ? 'bg-blue-50 border-[#688DA5]/40' :
                        isSelected ? 'bg-accent-warm/5 border-accent-warm' : 'bg-cream-bg border-cream-border hover:border-accent-warm/30'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex gap-0.5 flex-shrink-0">
                          {item.assignedTo.length === 0 ? (
                            <span className="w-3 h-3 rounded-full bg-cream-border" />
                          ) : (
                            item.assignedTo.map((pid: string) => {
                              const pp = participants.find((p: Participant) => p.id === pid);
                              return <span key={pid} className="w-3 h-3 rounded-full" style={{ background: pp?.color ?? '#ccc' }} />;
                            })
                          )}
                        </div>
                        <span className="text-sm font-medium text-mocha-dark truncate">{item.name}</span>
                        {item.isAlcohol && <span className="text-xs flex-shrink-0">🍷</span>}
                        {item.assignedTo.length > 1 && (
                          <span className="text-xs text-mocha-light flex-shrink-0">÷{item.assignedTo.length}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-bold text-mocha-dark">${item.price.toFixed(2)}</span>
                        <button
                          onClick={(e) => toggleAlcohol(item.id, e)}
                          className="text-sm px-1.5 py-0.5 rounded-lg transition-all"
                          style={{
                            background: item.isAlcohol ? '#688DA520' : 'transparent',
                            border: item.isAlcohol ? '1px solid #688DA5' : '1px solid transparent',
                          }}
                          title={lang === 'zh' ? '標記為酒精飲料' : 'Mark as alcohol'}
                        >
                          🍷
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeReceiptItem(item.id); }}
                          className="text-xs text-mocha-light hover:text-accent-orange px-1"
                        >✕</button>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="mt-1.5 pl-2 animate-slide-up">
                        <p className="text-xs text-mocha-light mb-1.5">{t(i.assignTo, lang)}</p>
                        {item.isAlcohol && (
                          <p className="text-xs mb-1.5" style={{ color: '#688DA5' }}>
                            🍷 {lang === 'zh' ? '酒水品項：非飲酒者自動排除' : 'Alcohol item: non-drinkers excluded automatically'}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {participants.map((p: Participant) => {
                            const assigned = item.assignedTo.includes(p.id);
                            const excluded = item.isAlcohol && p.isDrinker === false;
                            return (
                              <button
                                key={p.id}
                                onClick={() => !excluded && handleAssign(item.id, p.id)}
                                disabled={excluded}
                                className={clsx(
                                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all border active:scale-95',
                                  excluded ? 'opacity-30 cursor-not-allowed border-cream-border text-mocha-light' :
                                  assigned ? 'text-white border-transparent' : 'bg-transparent border-cream-border text-mocha-mid'
                                )}
                                style={assigned && !excluded ? { background: p.color, borderColor: p.color } : {}}
                              >
                                {excluded ? '🚫 ' : ''}{p.name}
                              </button>
                            );
                          })}
                        </div>
                        {item.assignedTo.length > 1 && (
                          <p className="text-xs text-mocha-light mt-1">
                            {t(i.eachPays, lang)} ${(item.price / item.assignedTo.length).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add item form */}
          <div className="flex gap-2">
            <input
              type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('price-input')?.focus()}
              placeholder={t(i.itemName, lang)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-cream-border bg-cream-bg text-sm text-mocha-dark focus:outline-none focus:border-accent-warm"
            />
            <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-cream-border bg-cream-bg">
              <span className="text-mocha-light text-sm">$</span>
              <input
                id="price-input" type="number" value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="0.00" min="0" step="0.01"
                className="w-16 bg-transparent text-sm text-mocha-dark font-bold focus:outline-none"
              />
            </div>
            <button onClick={handleAddItem} className="px-4 py-2.5 bg-accent-warm text-white rounded-xl text-sm font-bold active:scale-95">+</button>
          </div>

          {receiptItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-cream-border flex justify-between text-sm">
              <span className="text-mocha-mid">{t(i.itemsSubtotal, lang)}</span>
              <span className="font-bold text-mocha-dark">${totalAssigned.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Per-person preview */}
        {splits.length > 0 && (
          <div className="card p-4">
            <h2 className="font-bold text-mocha-dark mb-3">{t(i.preview, lang)}</h2>
            <div className="space-y-2">
              {splits.map((sp) => (
                <div
                  key={sp.participant.id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: sp.participant.color + '10', border: `1px solid ${sp.participant.color}30` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: sp.participant.color }}
                    >
                      {sp.participant.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-mocha-dark text-sm">
                        {sp.participant.name}
                        {sp.participant.isDrinker === false && <span className="ml-1 text-xs text-mocha-light">🚫🍺</span>}
                      </p>
                      <p className="text-xs text-mocha-light truncate">
                        {t(i.food, lang)} ${sp.subtotal.toFixed(2)} · {t(i.tax, lang)} ${sp.taxShare.toFixed(2)} · {t(i.tip, lang)} ${sp.tipShare.toFixed(2)}
                        {sp.isRemainder && ' (+$0.01)'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-mocha-dark flex-shrink-0 ml-2">${sp.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm */}
        <button
          onClick={handleGoSummary} disabled={!allAssigned}
          className={clsx('w-full py-4 rounded-xl2 font-bold text-white text-lg transition-all active:scale-[0.99]', !allAssigned && 'opacity-40 cursor-not-allowed')}
          style={{ background: allAssigned ? 'linear-gradient(135deg, #688DA5 0%, #5A7A92 100%)' : '#A07858' }}
        >
          {allAssigned ? t(i.confirmSummary, lang) : `${unassignedCount} ${t(i.items_unit, lang)} ${t(i.unassigned, lang)}`}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
