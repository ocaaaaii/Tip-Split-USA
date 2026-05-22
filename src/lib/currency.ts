// Currency conversion utilities
// Tries to fetch live rates; falls back to hardcoded defaults

export type CurrencyCode = 'NONE' | 'USD' | 'TWD' | 'CNY' | 'JPY' | 'EUR' | 'HKD' | 'KRW' | 'BRL' | 'MXN' | 'SGD';

export const CURRENCY_LABELS: Record<CurrencyCode, { label: string; symbol: string; flag: string }> = {
  NONE: { label: 'No conversion', symbol: '—',  flag: '✕'  },
  USD: { label: 'US Dollar',        symbol: '$',    flag: '\u{1F1FA}\u{1F1F8}' },
  TWD: { label: '台幣',     symbol: 'NT$',  flag: '\u{1F1F9}\u{1F1FC}' },
  CNY: { label: '人民幣', symbol: '¥', flag: '\u{1F1E8}\u{1F1F3}' },
  JPY: { label: '日圓',     symbol: '¥', flag: '\u{1F1EF}\u{1F1F5}' },
  EUR: { label: 'Euro',             symbol: '€', flag: '\u{1F1EA}\u{1F1FA}' },
  HKD: { label: '港幣',     symbol: 'HK$',  flag: '\u{1F1ED}\u{1F1F0}' },
  KRW: { label: '韓圓',     symbol: '₩', flag: '\u{1F1F0}\u{1F1F7}' },
  BRL: { label: 'Real Brasileiro',  symbol: 'R$',   flag: '\u{1F1E7}\u{1F1F7}' },
  MXN: { label: 'Peso Mexicano',    symbol: 'MX$',  flag: '\u{1F1F2}\u{1F1FD}' },
  SGD: { label: 'Singapore Dollar', symbol: 'S$',   flag: '\u{1F1F8}\u{1F1EC}' },
};

export const FALLBACK_RATES: Record<CurrencyCode, number> = {
  NONE: 1.0,
  USD: 1.0,
  TWD: 32.0,
  CNY: 7.25,
  JPY: 155.0,
  EUR: 0.92,
  HKD: 7.82,
  KRW: 1380.0,
  BRL: 5.05,
  MXN: 17.5,
  SGD: 1.35,
};

let cachedRates: Record<string, number> | null = null;
let lastFetchTime = 0;
let lastFetchIsLive = false;
const CACHE_TTL = 60 * 60 * 1000;

export interface RateResult {
  rates: Record<CurrencyCode, number>;
  isLive: boolean;
  fetchedAt: number;
}

export async function fetchExchangeRates(): Promise<RateResult> {
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < CACHE_TTL) {
    return { rates: cachedRates as Record<CurrencyCode, number>, isLive: lastFetchIsLive, fetchedAt: lastFetchTime };
  }
  try {
    const res = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (data.result !== 'success') throw new Error('Bad result');

    const r = data.rates;
    const rates: Record<CurrencyCode, number> = {
      NONE: 1.0,
      USD: 1.0,
      TWD: r.TWD ?? FALLBACK_RATES.TWD,
      CNY: r.CNY ?? FALLBACK_RATES.CNY,
      JPY: r.JPY ?? FALLBACK_RATES.JPY,
      EUR: r.EUR ?? FALLBACK_RATES.EUR,
      HKD: r.HKD ?? FALLBACK_RATES.HKD,
      KRW: r.KRW ?? FALLBACK_RATES.KRW,
      BRL: r.BRL ?? FALLBACK_RATES.BRL,
      MXN: r.MXN ?? FALLBACK_RATES.MXN,
      SGD: r.SGD ?? FALLBACK_RATES.SGD,
    };
    cachedRates = rates;
    lastFetchTime = now;
    lastFetchIsLive = true;
    return { rates, isLive: true, fetchedAt: now };
  } catch {
    lastFetchIsLive = false;
    return { rates: FALLBACK_RATES, isLive: false, fetchedAt: now };
  }
}

export function convertFromUSD(
  amountUSD: number,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number>
): number {
  return amountUSD * (rates[targetCurrency] ?? FALLBACK_RATES[targetCurrency]);
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const { symbol } = CURRENCY_LABELS[currency];
  if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}
