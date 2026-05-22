'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/BottomNav';
import AppFooter from '@/components/AppFooter';
import HeaderBanner from '@/components/HeaderBanner';
import { getBillHistory, SCENARIO_ICONS } from '@/lib/history';
import type { BillRecord } from '@/lib/history';

// ── i18n labels ───────────────────────────────────────────────────────────
const L = {
  title:       { zh: '消費統計', sc: '消费统计', en: 'Spending Stats', ja: '統計', ko: '통계', es: 'Estadísticas', pt: 'Estatísticas' },
  period:      { zh: '時間範圍', sc: '时间范围', en: 'Period', ja: '期間', ko: '기간', es: 'Período', pt: 'Período' },
  allTime:     { zh: '全部', sc: '全部', en: 'All', ja: '全期間', ko: '전체', es: 'Todo', pt: 'Tudo' },
  thisMonth:   { zh: '本月', sc: '本月', en: 'This Month', ja: '今月', ko: '이번달', es: 'Este mes', pt: 'Este mês' },
  last3:       { zh: '近3個月', sc: '近3个月', en: 'Last 3M', ja: '3ヶ月', ko: '3개월', es: 'Últimos 3M', pt: 'Últimos 3M' },
  totalSpend:  { zh: '總消費', sc: '总消费', en: 'Total Spent', ja: '合計', ko: '합계', es: 'Total', pt: 'Total' },
  avgTip:      { zh: '平均小費率', sc: '平均小费率', en: 'Avg Tip %', ja: '平均チップ率', ko: '평균 팁률', es: 'Propina prom.', pt: 'Gorjeta méd.' },
  mostCommon:  { zh: '最常場景', sc: '最常场景', en: 'Top Scenario', ja: 'よく使う', ko: '자주 쓰는', es: 'Más frecuente', pt: 'Mais freq.' },
  bills:       { zh: '筆', sc: '笔', en: 'bills', ja: '件', ko: '건', es: 'facturas', pt: 'contas' },
  monthly:     { zh: '月度消費', sc: '月度消费', en: 'Monthly Spending', ja: '月別支出', ko: '월별 지출', es: 'Gasto mensual', pt: 'Gasto mensal' },
  byScenario:  { zh: '場景分佈', sc: '场景分布', en: 'By Scenario', ja: 'シナリオ別', ko: '시나리오별', es: 'Por escenario', pt: 'Por cenário' },
  noData:      { zh: '還沒有帳單記錄，先去結帳吧！', sc: '还没有账单记录，先去结账吧！', en: 'No bills yet — go split one first!', ja: 'まだ履歴がありません', ko: '아직 기록이 없어요', es: 'Sin registros aún', pt: 'Sem registros ainda' },
  avgPerBill:  { zh: '平均每筆', sc: '平均每笔', en: 'Avg per bill', ja: '平均/件', ko: '평균/건', es: 'Prom. x factura', pt: 'Méd. p/ conta' },
  guests:      { zh: '平均人數', sc: '平均人数', en: 'Avg Guests', ja: '平均人数', ko: '평균 인원', es: 'Inv. prom.', pt: 'Conv. méd.' },
} as const;
type LKey = keyof typeof L;
type Lang = 'zh' | 'sc' | 'en' | 'ja' | 'ko' | 'es' | 'pt';

function tl(key: LKey, lang: Lang): string {
  const rec = L[key] as Record<string, string>;
  return rec[lang] ?? rec['en'];
}

const SCENARIO_NAMES: Record<string, Record<Lang, string>> = {
  restaurant: { zh: '餐廳', sc: '餐厅', en: 'Restaurant', ja: 'レストラン', ko: '식당', es: 'Restaurante', pt: 'Restaurante' },
  takeout:    { zh: '外帶', sc: '外卖', en: 'Takeout', ja: 'テイクアウト', ko: '포장', es: 'Para llevar', pt: 'Viagem' },
  bar:        { zh: '酒吧', sc: '酒吧', en: 'Bar', ja: 'バー', ko: '바', es: 'Bar', pt: 'Bar' },
  taxi:       { zh: '計程車', sc: '出租车', en: 'Taxi', ja: 'タクシー', ko: '택시', es: 'Taxi', pt: 'Táxi' },
  hotel:      { zh: '飯店', sc: '酒店', en: 'Hotel', ja: 'ホテル', ko: '호텔', es: 'Hotel', pt: 'Hotel' },
  salon:      { zh: '沙龍', sc: '沙龙', en: 'Salon', ja: 'サロン', ko: '살롱', es: 'Salón', pt: 'Salão' },
  delivery:   { zh: '外送', sc: '外送', en: 'Delivery', ja: 'デリバリー', ko: '배달', es: 'Entrega', pt: 'Entrega' },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function getMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function filterByPeriod(bills: BillRecord[], period: 'all' | 'month' | '3m'): BillRecord[] {
  const now = new Date();
  if (period === 'all') return bills;
  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return bills.filter((b) => new Date(b.date) >= start);
  }
  const start = new Date(now);
  start.setMonth(start.getMonth() - 3);
  return bills.filter((b) => new Date(b.date) >= start);
}

// ── SVG Bar Chart ─────────────────────────────────────────────────────────
function MonthlyBarChart({ data }: { data: { month: string; total: number }[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.total), 1);
  const W = 300, H = 100, barW = Math.min(28, (W - 16) / data.length - 4);
  const gap = (W - 16) / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const bh = Math.max(4, (d.total / max) * H);
        const x = 8 + i * gap + gap / 2 - barW / 2;
        const y = H - bh;
        const label = d.month.slice(5); // "MM"
        return (
          <g key={d.month}>
            <rect
              x={x} y={y} width={barW} height={bh}
              rx={4}
              fill="#688DA5"
              opacity={0.85}
            />
            <text
              x={x + barW / 2} y={H + 14}
              textAnchor="middle"
              fontSize={9}
              fill="#A07858"
            >
              {label}
            </text>
            {bh > 20 && (
              <text
                x={x + barW / 2} y={y - 3}
                textAnchor="middle"
                fontSize={8}
                fill="#3D1D0A"
                fontWeight="600"
              >
                ${d.total.toFixed(0)}
              </text>
            )}
          </g>
        );
      })}
      {/* baseline */}
      <line x1={8} y1={H} x2={W - 8} y2={H} stroke="#D4B880" strokeWidth={1} />
    </svg>
  );
}

// ── Donut-style scenario circles ──────────────────────────────────────────
const PALETTE = ['#688DA5', '#7A9E7E', '#C4581A', '#8B6B9E', '#C4A32A', '#9E6B6B', '#4A7A88'];

export default function StatsPage() {
  const { lang } = useAppStore();
  const [period, setPeriod] = useState<'all' | 'month' | '3m'>('all');

  const allBills = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return getBillHistory();
  }, []);

  const bills = useMemo(() => filterByPeriod(allBills, period), [allBills, period]);

  // ── Aggregates ────────────────────────────────────────────────────────
  const totalSpent  = bills.reduce((s, b) => s + b.total, 0);
  const avgTip      = bills.length > 0
    ? bills.reduce((s, b) => s + b.tipPercent, 0) / bills.length
    : 0;
  const avgPerBill  = bills.length > 0 ? totalSpent / bills.length : 0;
  const avgGuests   = bills.length > 0
    ? bills.reduce((s, b) => s + b.guestCount, 0) / bills.length
    : 0;

  // ── Scenario breakdown ────────────────────────────────────────────────
  const scenarioMap: Record<string, { count: number; total: number }> = {};
  bills.forEach((b) => {
    if (!scenarioMap[b.scenario]) scenarioMap[b.scenario] = { count: 0, total: 0 };
    scenarioMap[b.scenario].count++;
    scenarioMap[b.scenario].total += b.total;
  });
  const scenarios = Object.entries(scenarioMap)
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.count - a.count);
  const topScenario = scenarios[0];

  // ── Monthly spending ──────────────────────────────────────────────────
  const monthlyMap: Record<string, number> = {};
  bills.forEach((b) => {
    const mk = getMonthKey(b.date);
    monthlyMap[mk] = (monthlyMap[mk] ?? 0) + b.total;
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, total]) => ({ month, total }));

  const PERIODS: { key: 'all' | 'month' | '3m'; label: LKey }[] = [
    { key: 'all',   label: 'allTime' },
    { key: 'month', label: 'thisMonth' },
    { key: '3m',    label: 'last3' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream-bg pb-28">
      <HeaderBanner />

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-mocha-dark">{tl('title', lang as Lang)}</h1>
      </div>

      {/* Period selector */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                background: period === key ? '#688DA5' : 'var(--cream-card)',
                color: period === key ? 'white' : 'var(--mocha-mid)',
                border: `1px solid ${period === key ? '#688DA5' : 'var(--cream-border)'}`,
              }}
            >
              {tl(label, lang as Lang)}
            </button>
          ))}
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <span className="text-6xl">📊</span>
          <p className="text-mocha-light font-medium">{tl('noData', lang as Lang)}</p>
        </div>
      ) : (
        <div className="px-4 space-y-4 animate-slide-up">

          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: tl('totalSpend', lang as Lang),
                value: `$${totalSpent.toFixed(2)}`,
                sub: `${bills.length} ${tl('bills', lang as Lang)}`,
                icon: '💰',
              },
              {
                label: tl('avgTip', lang as Lang),
                value: `${avgTip.toFixed(1)}%`,
                sub: `avg $${avgPerBill.toFixed(0)} ${tl('avgPerBill', lang as Lang)}`,
                icon: '🎯',
              },
              {
                label: tl('mostCommon', lang as Lang),
                value: topScenario
                  ? `${SCENARIO_ICONS[topScenario.key] ?? ''} ${(SCENARIO_NAMES[topScenario.key]?.[lang as Lang]) ?? topScenario.key}`
                  : '—',
                sub: topScenario ? `${topScenario.count} ${tl('bills', lang as Lang)}` : '',
                icon: '🏆',
              },
              {
                label: tl('guests', lang as Lang),
                value: `${avgGuests.toFixed(1)}`,
                sub: `avg / bill`,
                icon: '👥',
              },
            ].map((kpi, i) => (
              <div
                key={i}
                className="card p-3.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base">{kpi.icon}</span>
                  <p className="text-xs text-mocha-light font-medium truncate">{kpi.label}</p>
                </div>
                <p className="text-lg font-bold text-mocha-dark leading-tight truncate">{kpi.value}</p>
                <p className="text-xs text-mocha-light mt-0.5 truncate">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Monthly bar chart ── */}
          {monthlyData.length > 0 && (
            <div className="card p-4">
              <h2 className="text-xs font-bold text-mocha-light uppercase tracking-wider mb-3">
                {tl('monthly', lang as Lang)}
              </h2>
              <MonthlyBarChart data={monthlyData} />
            </div>
          )}

          {/* ── Scenario breakdown ── */}
          {scenarios.length > 0 && (
            <div className="card p-4">
              <h2 className="text-xs font-bold text-mocha-light uppercase tracking-wider mb-3">
                {tl('byScenario', lang as Lang)}
              </h2>
              <div className="space-y-2">
                {scenarios.map((sc, i) => {
                  const pct = totalSpent > 0 ? (sc.total / totalSpent) * 100 : 0;
                  const color = PALETTE[i % PALETTE.length];
                  const name = (SCENARIO_NAMES[sc.key]?.[lang as Lang]) ?? sc.key;
                  return (
                    <div key={sc.key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{SCENARIO_ICONS[sc.key] ?? '🍽️'}</span>
                          <span className="text-sm font-medium text-mocha-dark">{name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-mocha-dark">${sc.total.toFixed(2)}</span>
                          <span className="text-xs text-mocha-light ml-1.5">({sc.count})</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-cream-border overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Recent bills mini-list ── */}
          <div className="card p-4">
            <h2 className="text-xs font-bold text-mocha-light uppercase tracking-wider mb-3">
              {lang === 'zh' || lang === 'sc' ? '最近帳單' : lang === 'ja' ? '最近の請求' : lang === 'ko' ? '최근 청구서' : 'Recent Bills'}
            </h2>
            <div className="space-y-2">
              {bills.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">{SCENARIO_ICONS[b.scenario] ?? '🍽️'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-mocha-dark truncate">
                        {b.restaurantName || (SCENARIO_NAMES[b.scenario]?.[lang as Lang]) || b.scenario}
                      </p>
                      <p className="text-xs text-mocha-light">
                        {new Date(b.date).toLocaleDateString()} · {b.guestCount} pax · tip {b.tipPercent}%
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-mocha-dark flex-shrink-0 ml-2">${b.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Ko-fi subtle footer */}
      <div className="px-4 pb-2 text-center">
        <a
          href="https://ko-fi.com/tipsplit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-mocha-light hover:text-mocha-mid transition-colors"
        >
          <span>☕</span>
          <span>Enjoy TipSplit? Buy us a coffee</span>
        </a>
      </div>

      <AppFooter />
      <BottomNav />
    </div>
  );
}
