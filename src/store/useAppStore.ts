import { create } from 'zustand';
import type { CurrencyCode } from '@/lib/currency';
import { FALLBACK_RATES } from '@/lib/currency';
import type { ReceiptItem, Participant } from '@/lib/splitAlgorithm';
import { DEFAULT_TAX_RATE } from '@/data/taxRates';
import type { Lang } from '@/lib/i18n';

export type Scenario = 'restaurant' | 'takeout' | 'bar' | 'taxi' | 'hotel' | 'salon' | 'delivery';
export type Theme = 'system' | 'light' | 'dark';

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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const useAppStore = create<AppState>((set, get) => ({
  lang: 'en' as Lang,
  setLang: (l) => set({ lang: l }),
  theme: (typeof window !== 'undefined' ? (localStorage.getItem('tipsplit_theme') as Theme | null) : null) ?? 'system',
  setTheme: (t) => {
    if (typeof window !== 'undefined') localStorage.setItem('tipsplit_theme', t);
    const html = document.documentElement;
    if (t === 'dark')  { html.setAttribute('data-theme', 'dark'); }
    else if (t === 'light') { html.setAttribute('data-theme', 'light'); }
    else               { html.removeAttribute('data-theme'); }
    set({ theme: t });
  },
  locationName: 'Detecting location...',
  taxRate: DEFAULT_TAX_RATE,
  isOffline: false,
  billAmount: '',
  isTaxInclusive: false,
  tipPercent: 18,
  tipAmount: 0,
  customTipMode: false,
  scenario: 'restaurant',
  guestCount: 2,
  displayCurrency: 'TWD',
  exchangeRates: FALLBACK_RATES,
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
  splitMode: 'even',
  participants: [{ id: 'p1', name: 'You', color: '#688DA5' }],
  receiptItems: [],
  restaurantName: '',
  setLocationName: (name) => set({ locationName: name }),
  setTaxRate: (rate) => { set({ taxRate: rate }); get().computeAmounts(); },
  setIsOffline: (v) => set({ isOffline: v }),
  setBillAmount: (v) => { set({ billAmount: v }); get().computeAmounts(); },
  setIsTaxInclusive: (v) => { set({ isTaxInclusive: v }); get().computeAmounts(); },
  setTipPercent: (v) => { set({ tipPercent: v, customTipMode: false }); get().computeAmounts(); },
  setCustomTipMode: (v) => set({ customTipMode: v }),
  setScenario: (s) => set({ scenario: s }),
  setGuestCount: (n) => set({ guestCount: n }),
  setDisplayCurrency: (c) => set({ displayCurrency: c }),
  setExchangeRates: (r) => set({ exchangeRates: r }),
  setSplitMode: (m) => set({ splitMode: m }),
  setParticipants: (p) => set({ participants: p }),
  setReceiptItems: (items) => set({ receiptItems: items }),
  setRestaurantName: (name) => set({ restaurantName: name }),
  addParticipant: (p) => set((state) => ({ participants: [...state.participants, p] })),
  removeParticipant: (id) => set((state) => ({
    participants: state.participants.filter((p) => p.id !== id),
    receiptItems: state.receiptItems.map((item) => ({
      ...item,
      assignedTo: item.assignedTo.filter((pid) => pid !== id),
    })),
  })),
  addReceiptItem: (item) => set((state) => ({ receiptItems: [...state.receiptItems, item] })),
  updateReceiptItem: (id, updates) => set((state) => ({
    receiptItems: state.receiptItems.map((item) => item.id === id ? { ...item, ...updates } : item),
  })),
  removeReceiptItem: (id) => set((state) => ({
    receiptItems: state.receiptItems.filter((item) => item.id !== id),
  })),
  computeAmounts: () => {
    const state = get();
    const raw = parseFloat(state.billAmount) || 0;
    let subtotal = state.isTaxInclusive ? raw / (1 + state.taxRate / 100) : raw;
    subtotal = Math.round(subtotal * 100) / 100;
    const taxAmount = Math.round(subtotal * state.taxRate) / 100;
    const tipAmount = Math.round(subtotal * state.tipPercent) / 100;
    const totalAmount = round2(subtotal + taxAmount + tipAmount);
    set({ subtotal, taxAmount, tipAmount, totalAmount });
  },
}));
