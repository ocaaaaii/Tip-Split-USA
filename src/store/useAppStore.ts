import { create } from 'zustand';
import type { CurrencyCode } from '@/lib/currency';
import { FALLBACK_RATES } from '@/lib/currency';
import type { ReceiptItem, Participant } from '@/lib/splitAlgorithm';
import { DEFAULT_TAX_RATE } from '@/data/taxRates';
import type { Lang } from '@/lib/i18n';

export type Scenario = 'restaurant' | 'takeout' | 'bar' | 'taxi' | 'hotel' | 'salon' | 'delivery';
export type Theme = 'system' | 'light' | 'dark';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ss(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function ssSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
}
function ls(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

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
// Initial values read from storage (runs once at module load — client only)
// ---------------------------------------------------------------------------
const initBillAmount   = ss('tipsplit_bill')      ?? '';
const initTaxRate      = parseFloat(ss('tipsplit_taxrate') ?? '') || DEFAULT_TAX_RATE;
const initTipPercent   = parseFloat(ss('tipsplit_tip')     ?? '') || 18;
const initTaxInclusive = ss('tipsplit_taxincl') === 'true';
const initGuestCount   = parseInt(ss('tipsplit_guests')    ?? '', 10) || 2;

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
  splitMode: 'even',
  participants: [{ id: 'p1', name: 'You', color: '#688DA5' }],
  receiptItems: [],
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
  setGuestCount: (n) => { ssSet('tipsplit_guests', String(n)); set({ guestCount: n }); },

  setDisplayCurrency: (c) => {
    lsSet('tipsplit_currency', c);
    set({ displayCurrency: c });
  },

  setExchangeRates: (r) => set({ exchangeRates: r }),

  setSplitMode: (m) => {
    set({ splitMode: m });
    get().computeAmounts();
  },

  setParticipants: (p) => set({ participants: p }),

  setReceiptItems: (items) => {
    set({ receiptItems: items });
    get().computeAmounts();
  },

  setRestaurantName: (name) => set({ restaurantName: name }),

  addParticipant: (p) =>
    set((state) => ({ participants: [...state.participants, p] })),

  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
      receiptItems: state.receiptItems.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((pid) => pid !== id),
      })),
    })),

  addReceiptItem: (item) => {
    set((state) => ({ receiptItems: [...state.receiptItems, item] }));
    get().computeAmounts();
  },

  updateReceiptItem: (id, updates) => {
    set((state) => ({
      receiptItems: state.receiptItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    get().computeAmounts();
  },

  removeReceiptItem: (id) => {
    set((state) => ({
      receiptItems: state.receiptItems.filter((item) => item.id !== id),
    }));
    get().computeAmounts();
  },

  computeAmounts: () => {
    const state = get();
    let subtotal: number;

    // In itemized mode, derive subtotal from receipt items so summary is never zeroed.
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
