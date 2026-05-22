'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  getBillHistory, deleteBill, assignBillToTrip,
  getTrips, createTrip, deleteTrip, getTripStats,
  SCENARIO_ICONS, type BillRecord, type TripRecord,
} from '@/lib/history';

interface Props { onClose: () => void; }

export default function HistorySheet({ onClose }: Props) {
  const { lang } = useAppStore();
  const [tab, setTab]         = useState<'bills' | 'trips'>('bills');
  const [bills, setBills]     = useState<BillRecord[]>([]);
  const [trips, setTrips]     = useState<TripRecord[]>([]);
  const [newTripName, setNewTripName] = useState('');
  const [assigningBill, setAssigningBill] = useState<string | null>(null);

  const reload = () => { setBills(getBillHistory()); setTrips(getTrips()); };
  useEffect(() => { reload(); }, []);

  const handleDeleteBill = (id: string) => { deleteBill(id); reload(); };
  const handleAssign = (billId: string, tripId: string | null) => {
    assignBillToTrip(billId, tripId); setAssigningBill(null); reload();
  };
  const handleCreateTrip = () => {
    if (!newTripName.trim()) return;
    createTrip(newTripName); setNewTripName(''); reload();
  };
  const handleDeleteTrip = (id: string) => { deleteTrip(id); reload(); };

  const dateStr = (iso: string) => {
    const d = new Date(iso);
    return lang === 'zh'
      ? `${d.getMonth()+1}/${d.getDate()}`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const ungrouped = bills.filter((b) => !b.tripId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(30,14,5,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] mx-auto animate-slide-up flex flex-col"
        style={{ background: '#EDE0C0', borderRadius: '1.5rem 1.5rem 0 0', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D4B880' }} />
        </div>

        {/* Header + Tab bar */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#3D1D0A', fontFamily: 'var(--font-playfair, Georgia, serif)' }}>
              {lang === 'zh' ? '帳單記錄' : 'Bill History'}
            </h2>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: '#F7EED8', border: '1px solid #D4B880', color: '#6B3A20', fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: 'flex', gap: 8, background: '#F7EED8', borderRadius: 12, padding: 4, border: '1px solid #D4B880' }}>
            {(['bills','trips'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 9, fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: tab === t ? '#688DA5' : 'transparent',
                  color: tab === t ? '#F7EED8' : '#6B3A20',
                  border: 'none',
                }}
              >
                {t === 'bills' ? (lang === 'zh' ? '📋 歷史記錄' : '📋 History') : (lang === 'zh' ? '🗺️ 旅遊行程' : '🗺️ Trips')}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 pb-8">

          {/* ─── Bills tab ─── */}
          {tab === 'bills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bills.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#A07858', fontSize: 13 }}>
                  {lang === 'zh' ? '尚無記錄。完成計算後自動儲存！' : 'No history yet. Bills auto-save after each calculation!'}
                </div>
              )}
              {bills.map((bill) => {
                const trip = bill.tripId ? trips.find((t) => t.id === bill.tripId) : null;
                return (
                  <div key={bill.id} style={{ background: '#F7EED8', borderRadius: 14, border: '1px solid #D4B880', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{SCENARIO_ICONS[bill.scenario] ?? '🍽️'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: '#3D1D0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {bill.restaurantName || bill.location}
                          </p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: '#3D1D0A', flexShrink: 0 }}>${bill.total.toFixed(2)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: '#A07858' }}>{dateStr(bill.date)}</span>
                          <span style={{ fontSize: 10, color: '#D4B880' }}>•</span>
                          <span style={{ fontSize: 11, color: '#A07858' }}>Tip {bill.tipPercent}%</span>
                          {trip && (
                            <>
                              <span style={{ fontSize: 10, color: '#D4B880' }}>•</span>
                              <span style={{ fontSize: 11, background: trip.color + '20', color: trip.color, padding: '1px 6px', borderRadius: 6, border: `1px solid ${trip.color}40` }}>
                                {trip.emoji} {trip.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', borderTop: '1px solid #E8D5BA' }}>
                      <button
                        onClick={() => setAssigningBill(assigningBill === bill.id ? null : bill.id)}
                        style={{ flex: 1, padding: '8px 0', fontSize: 12, color: '#688DA5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {lang === 'zh' ? '🗺️ 加入行程' : '🗺️ Add to Trip'}
                      </button>
                      <div style={{ width: 1, background: '#E8D5BA' }} />
                      <button
                        onClick={() => handleDeleteBill(bill.id)}
                        style={{ flex: 1, padding: '8px 0', fontSize: 12, color: '#C4581A', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {lang === 'zh' ? '🗑️ 刪除' : '🗑️ Delete'}
                      </button>
                    </div>
                    {assigningBill === bill.id && (
                      <div style={{ padding: '8px 14px 12px', borderTop: '1px solid #E8D5BA', background: '#EDE0C0' }}>
                        <p style={{ fontSize: 11, color: '#6B3A20', marginBottom: 6 }}>
                          {lang === 'zh' ? '選擇行程：' : 'Choose a trip:'}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {trips.map((tr) => (
                            <button
                              key={tr.id}
                              onClick={() => handleAssign(bill.id, tr.id)}
                              style={{
                                padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                background: bill.tripId === tr.id ? tr.color : tr.color + '18',
                                color: bill.tripId === tr.id ? '#F7EED8' : tr.color,
                                border: `1.5px solid ${tr.color}`,
                              }}
                            >
                              {tr.emoji} {tr.name}
                            </button>
                          ))}
                          {bill.tripId && (
                            <button
                              onClick={() => handleAssign(bill.id, null)}
                              style={{ padding: '5px 10px', borderRadius: 8, fontSize: 12, color: '#A07858', background: '#EDE0C0', border: '1px solid #D4B880', cursor: 'pointer' }}
                            >
                              {lang === 'zh' ? '移除行程' : 'Remove'}
                            </button>
                          )}
                          {trips.length === 0 && (
                            <p style={{ fontSize: 12, color: '#A07858' }}>
                              {lang === 'zh' ? '先到「旅遊行程」分頁建立行程' : 'Create a trip in the Trips tab first'}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Trips tab ─── */}
          {tab === 'trips' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Create trip */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <input
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTrip()}
                  placeholder={lang === 'zh' ? '行程名稱（如：NYC 5天）' : 'Trip name (e.g. NYC 5 Days)'}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #D4B880', background: '#F7EED8', fontSize: 13, color: '#3D1D0A', outline: 'none' }}
                />
                <button
                  onClick={handleCreateTrip}
                  style={{ padding: '10px 18px', borderRadius: 10, background: '#688DA5', color: '#F7EED8', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              {trips.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#A07858', fontSize: 13 }}>
                  {lang === 'zh' ? '還沒有行程，建立一個吧！' : 'No trips yet — create one above!'}
                </div>
              )}

              {trips.map((trip) => {
                const stats = getTripStats(trip.id);
                const tripBills = bills.filter((b) => b.tripId === trip.id);
                return (
                  <div key={trip.id} style={{ background: '#F7EED8', borderRadius: 14, border: `1.5px solid ${trip.color}40`, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', background: trip.color + '10' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 24 }}>{trip.emoji}</span>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: '#3D1D0A' }}>{trip.name}</p>
                            <p style={{ fontSize: 11, color: '#A07858' }}>
                              {stats.count} {lang === 'zh' ? '筆帳單' : 'bills'}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, fontSize: 20, color: '#3D1D0A' }}>${stats.total.toFixed(2)}</p>
                          {stats.count > 0 && (
                            <p style={{ fontSize: 11, color: '#A07858' }}>
                              {lang === 'zh' ? '平均' : 'avg'} ${(stats.total / stats.count).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {tripBills.length > 0 && (
                      <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {tripBills.map((b) => (
                          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B3A20' }}>
                            <span>{SCENARIO_ICONS[b.scenario]} {b.restaurantName || b.location} · {dateStr(b.date)}</span>
                            <span style={{ fontWeight: 600 }}>${b.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid #E8D5BA', padding: '8px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        style={{ fontSize: 12, color: '#C4581A', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {lang === 'zh' ? '刪除行程' : 'Delete trip'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
