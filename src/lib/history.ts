// Bill history + Trip management — LocalStorage backed

export interface BillRecord {
  id: string;
  date: string;           // ISO 8601
  scenario: string;
  location: string;
  restaurantName: string;
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  total: number;
  tipPercent: number;
  taxRate: number;
  guestCount: number;
  currency: string;
  tripId?: string;
}

export interface TripRecord {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
}

const HISTORY_KEY = 'tipsplit_history_v1';
const TRIPS_KEY   = 'tipsplit_trips_v1';
const MAX_BILLS   = 20;

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

function save(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Bills ──────────────────────────────────────────────────────────────────
export function getBillHistory(): BillRecord[] {
  return load<BillRecord[]>(HISTORY_KEY, []);
}

export function saveBill(bill: BillRecord): void {
  const history = getBillHistory();
  const exists = history.some((b) => b.id === bill.id);
  if (exists) return;
  const updated = [bill, ...history].slice(0, MAX_BILLS);
  save(HISTORY_KEY, updated);
}

export function deleteBill(id: string): void {
  save(HISTORY_KEY, getBillHistory().filter((b) => b.id !== id));
}

export function assignBillToTrip(billId: string, tripId: string | null): void {
  const updated = getBillHistory().map((b) =>
    b.id === billId ? { ...b, tripId: tripId ?? undefined } : b
  );
  save(HISTORY_KEY, updated);
}

// ── Trips ──────────────────────────────────────────────────────────────────
export function getTrips(): TripRecord[] {
  return load<TripRecord[]>(TRIPS_KEY, []);
}

export function createTrip(name: string): TripRecord {
  const TRIP_COLORS = ['#688DA5','#7A9E7E','#C4581A','#8B6B9E','#9E6B6B','#4A7A88'];
  const TRIP_EMOJIS = ['🗺️','✈️','🏝️','🎡','🍜','🏨'];
  const trips = getTrips();
  const idx = trips.length % TRIP_COLORS.length;
  const trip: TripRecord = {
    id: Math.random().toString(36).slice(2),
    name: name.trim(),
    emoji: TRIP_EMOJIS[idx],
    color: TRIP_COLORS[idx],
    createdAt: new Date().toISOString(),
  };
  save(TRIPS_KEY, [...trips, trip]);
  return trip;
}

export function deleteTrip(id: string): void {
  save(TRIPS_KEY, getTrips().filter((t) => t.id !== id));
  // un-assign bills belonging to this trip
  const bills = getBillHistory().map((b) =>
    b.tripId === id ? { ...b, tripId: undefined } : b
  );
  save(HISTORY_KEY, bills);
}

export function getTripStats(tripId: string): { count: number; total: number } {
  const bills = getBillHistory().filter((b) => b.tripId === tripId);
  return { count: bills.length, total: bills.reduce((s, b) => s + b.total, 0) };
}

export const SCENARIO_ICONS: Record<string, string> = {
  restaurant: '🍽️', takeout: '🥡', bar: '🍹',
  taxi: '🚖', hotel: '🛏️', salon: '💅', delivery: '📦',
};
