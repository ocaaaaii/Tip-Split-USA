import { create } from 'zustand';
import type { CurrencyCode } from '@/lib/currency';
import { FALLBACK_RATES } from '@/lib/currency';
import type { ReceiptItem, Participant } from '@/lib/splitAlgorithm';
import { DEFAULT_TAX_RATE } from '@/data/taxRates';
import type { Lang } from '@/lib/i18n';

export type Scenario = 'restaurant' | 'takeout' | 'bar' | 'taxi' | 'hotel' | 'salon' | 'delivery';
export type Theme = 'system' | 'light' | 'dark';

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
function ss(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function ssSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(key, value); } catch { /* quota / private mode */ }
}
function ssJSON<T>(key: string, fallback: T): T {
  const raw = ss(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}
function ls(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

function round2(n: number): number { return Math.round(n * 100) / 100; }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  locationName: string;
  taxRate: number;
  isOffline: boolean;
  billAmount: string;
  isTaxInclusive: boolean;
  tipPercent: number;
  tipAmount: number;
  customTipMode: boolean;
  scenario: Scenario;
  guestCount: number;
  displayCurrency: CurrencyCode;
  exchangeRates: Record<CurrencyCode, number>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  splitMode: 'even' | 'itemized';
  participants: Participant[];
  receiptItems: ReceiptItem[];
  restaurantName: string;
  setLocationName: (name: string) => void;
  setTaxRate: (rate: number) => void;
  setIsOffline: (v: boolean) => void;
  setBillAmount: (v: string) => void;
  setIsTaxInclusive: (v: boolean) => void;
  setTipPercent: (v: number) => void;
  setCustomTipMode: (v: boolean) => void;
  setScenario: (s: Scenario) => void;
  setGuestCount: (n: number) => void;
  setDisplayCurrency: (c: CurrencyCode) => void;
  setExchangeRates: (r: Record<CurrencyCode, number>) => void;
  setSplitMode: (m: 'even' | 'itemized') => void;
  setParticipants: (p: Participant[]) => void;
  setReceiptItems: (items: ReceiptItem[]) => void;
  setRestaurantName: (name: string) => void;
  addParticipant: (p: Participant) => void;
  removeParticipant: (id: string) => void;
  addReceiptItem: (item: ReceiptItem) => void;
  updateReceiptItem: (id: string, updates: Partial<ReceiptItem>) => void;
  removeReceiptItem: (id: string) => void;
  computeAmounts: () => void;
}

// ---------------------------------------------------------------------------
// Initial values — read once at module load (client only)
// ---------------------------------------------------------------------------
const DEFAULT_PARTICIPANTS: Participant[] = [{ id: 'p1', name: 'You', color: '#688DA5' }];

const initBillAmount   = ss('tipsplit_bill')      ?? '';
const initTaxRate      = parseFloat(ss('tipsplit_taxrate')  ?? '') || DEFAULT_TAX_RATE;
const initTipPercent   = parseFloat(ss('tipsplit_tip')      ?? '') || 18;
const initTaxInclusive = ss('tipsplit_taxincl') === 'true';
const initGuestCount   = parseInt(ss('tipsplit_guests')     ?? '', 10) || 2;
const initSplitMode    = (ss('tipsplit_mode') ?? 'even') as 'even' | 'itemized';
const initReceiptItems = ssJSON<ReceiptItem[]>('tipsplit_items', []);
const initParticipants = ssJSON<Participant[]>('tipsplit_parts', DEFAULT_PARTICIPANTS);

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAppStore = create<AppState>((set, get) => ({
  lang: (ls('tipsplit_lang') as Lang | null) ?? 'en',
  setLang: (l) => { lsSet('tipsplit_lang', l); set({ lang: l }); },

  theme: (ls('tipsplit_theme') as Theme | null) ?? 'system',
  setTheme: (t) => {
    lsSet('tipsplit_theme', t);
    const html = document.documentElement;
    if (t === 'dark')       html.setAttribute('data-theme', 'dark');
    else if (t === 'light') html.setAttribute('data-theme', 'light');
    else                    html.removeAttribute('data-theme');
    set({ theme: t });
  },

  locationName: 'Detecting location...',
  taxRate: initTaxRate,
  isOffline: false,
  billAmount: initBillAmount,
  isTaxInclusive: initTaxInclusive,
  tipPercent: initTipPercent,
  tipAmount: 0,
  customTipMode: false,
  scenario: 'restaurant',
  guestCount: initGuestCount,
  displayCurrency: (ls('tipsplit_currency') as CurrencyCode | null) ?? 'NONE',
  exchangeRates: FALLBACK_RATES,
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
  splitMode: initSplitMode,
  participants: initParticipants.length > 0 ? initParticipants : DEFAULT_PARTICIPANTS,
  receiptItems: initReceiptItems,
  restaurantName: '',

  setLocationName: (name) => set({ locationName: name }),

  setTaxRate: (rate) => {
    ssSet('tipsplit_taxrate', String(rate));
    set({ taxRate: rate });
    get().computeAmounts();
  },

  setIsOffline: (v) => set({ isOffline: v }),

  setBillAmount: (v) => {
    ssSet('tipsplit_bill', v);
    set({ billAmount: v });
    get().computeAmounts();
  },

  setIsTaxInclusive: (v) => {
    ssSet('tipsplit_taxincl', String(v));
    set({ isTaxInclusive: v });
    get().computeAmounts();
  },

  setTipPercent: (v) => {
    ssSet('tipsplit_tip', String(v));
    set({ tipPercent: v, customTipMode: false });
    get().computeAmounts();
  },

  setCustomTipMode: (v) => set({ customTipMode: v }),
  setScenario: (s) => set({ scenario: s }),

  setGuestCount: (n) => {
    ssSet('tipsplit_guests', String(n));
    set({ guestCount: n });
  },

  setDisplayCurrency: (c) => {
    lsSet('tipsplit_currency', c);
    set({ displayCurrency: c });
  },

  setExchangeRates: (r) => set({ exchangeRates: r }),

  setSplitMode: (m) => {
    ssSet('tipsplit_mode', m);
    set({ splitMode: m });
    get().computeAmounts();
  },

  setParticipants: (p) => {
    ssSet('tipsplit_parts', JSON.stringify(p));
    set({ participants: p });
  },

  setReceiptItems: (items) => {
    ssSet('tipsplit_items', JSON.stringify(items));
    set({ receiptItems: items });
    get().computeAmounts();
  },

  setRestaurantName: (name) => set({ restaurantName: name }),

  addParticipant: (p) => {
    const next = [...get().participants, p];
    ssSet('tipsplit_parts', JSON.stringify(next));
    set({ participants: next });
  },

  removeParticipant: (id) => {
    const nextParts = get().participants.filter((p) => p.id !== id);
    const nextItems = get().receiptItems.map((item) => ({
      ...item,
      assignedTo: item.assignedTo.filter((pid) => pid !== id),
    }));
    ssSet('tipsplit_parts', JSON.stringify(nextParts));
    ssSet('tipsplit_items', JSON.stringify(nextItems));
    set({ participants: nextParts, receiptItems: nextItems });
  },

  addReceiptItem: (item) => {
    const next = [...get().receiptItems, item];
    ssSet('tipsplit_items', JSON.stringify(next));
    set({ receiptItems: next });
    get().computeAmounts();
  },

  updateReceiptItem: (id, updates) => {
    const next = get().receiptItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    ssSet('tipsplit_items', JSON.stringify(next));
    set({ receiptItems: next });
    get().computeAmounts();
  },

  removeReceiptItem: (id) => {
    const next = get().receiptItems.filter((item) => item.id !== id);
    ssSet('tipsplit_items', JSON.stringify(next));
    set({ receiptItems: next });
    get().computeAmounts();
  },

  computeAmounts: () => {
    const state = get();
    let subtotal: number;

    if (state.splitMode === 'itemized' && state.receiptItems.length > 0) {
      subtotal = round2(state.receiptItems.reduce((s, item) => s + item.price, 0));
    } else {
      const raw = parseFloat(state.billAmount) || 0;
      subtotal = state.isTaxInclusive
        ? round2(raw / (1 + state.taxRate / 100))
        : round2(raw);
    }

    const taxAmount   = Math.round(subtotal * state.taxRate) / 100;
    const tipAmount   = Math.round(subtotal * state.tipPercent) / 100;
    const totalAmount = round2(subtotal + taxAmount + tipAmount);
    set({ subtotal, taxAmount, tipAmount, totalAmount });
  },
}));
