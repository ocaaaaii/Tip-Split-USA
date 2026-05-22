// Currency conversion utilities
// Tries to fetch live rates; falls back to hardcoded defaults

export type CurrencyCode = 'USD' | 'TWD' | 'CNY' | 'JPY' | 'EUR' | 'HKD' | 'KRW' | 'BRL' | 'MXN' | 'SGD';

export const CURRENCY_LABELS: Record<CurrencyCode, { label: string; symbol: string; flag: string }> = {
  USD: { label: 'US Dollar',        symbol: '$',    flag: '🇺🇸' },
  TWD: { label: '台幣',             symbol: 'NT$',  flag: '🇹🇼' },
  CNY: { label: '人民幣',           symbol: '¥',    flag: '🇨🇳' },
  JPY: { label: '日圓',             symbol: '¥',    flag: '🇯🇵' },
  EUR: { label: 'Euro',             symbol: '€',    flag: '🇪🇺' },
  HKD: { label: '港幣',             symbol: 'HK$',  flag: '🇭🇰' },
  KRW: { label: '韓圓',             symbol: '₩',    flag: '🇰🇷' },
  BRL: { label: 'Real Brasileiro',  symbol: 'R$',   flag: '🇧🇷' },
  MXN: { label: 'Peso Mexicano',    symbol: 'MX$',  flag: '🇲🇽' },
  SGD: { label: 'Singapore Dollar', symbol: 'S$',   flag: '🇸🇬' },
};

export const FALLBACK_RATES: Record<CurrencyCode, number> = {
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
const CACHE_TTL = 60 * 60 * 1000;

export async function fetchExchangeRates(): Promise<Record<CurrencyCode, number>> {
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < CACHE_TTL) {
    return cachedRates as Record<CurrencyCode, number>;
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
    return rates;
  } catch {
    return FALLBACK_RATES;
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
