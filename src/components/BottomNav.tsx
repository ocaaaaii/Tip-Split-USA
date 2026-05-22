'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

const HREFS = ['/', '/split', '/summary', '/stats'] as const;
type Href = typeof HREFS[number];

const ICONS: Record<Href, string> = {
  '/':        '\u{1F9EE}',
  '/split':   '\u{1F465}',
  '/summary': '\u{1F4CB}',
  '/stats':   '\u{1F4CA}',
};

const NAV_LABELS: Record<Href, Record<string, string>> = {
  '/':        { zh: '計算機', sc: '计算器', en: 'Calc', ja: '計算機', ko: '계산기', es: 'Calc', pt: 'Calc' },
  '/split':   { zh: '分帳', sc: '分账', en: 'Split', ja: '割り勘', ko: '나누기', es: 'Dividir', pt: 'Dividir' },
  '/summary': { zh: '總覽', sc: '总览', en: 'Summary', ja: '概要', ko: '요약', es: 'Resumen', pt: 'Resumo' },
  '/stats':   { zh: '統計', sc: '统计', en: 'Stats', ja: '統計', ko: '통계', es: 'Stats', pt: 'Stats' },
};

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[540px] z-50 pointer-events-none">
      <div className="mx-4 mb-3 pointer-events-auto">
        <div
          className="flex items-center justify-around rounded-2xl px-2 py-2"
          style={{
            background: 'var(--nav-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--nav-border)',
            boxShadow: '0 4px 24px rgba(61,29,10,0.18)',
          }}
        >
          {HREFS.map((href) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            const label = NAV_LABELS[href][lang] ?? NAV_LABELS[href]['en'];
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200',
                  active
                    ? 'bg-accent-warm/10 text-accent-warm'
                    : 'text-mocha-light hover:text-mocha-mid'
                )}
              >
                <span className="text-xl leading-none">{ICONS[href]}</span>
                <span className={clsx('text-xs font-medium whitespace-nowrap', active ? 'text-accent-warm' : 'text-mocha-light')}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '9px',
          letterSpacing: '0.08em',
          color: 'var(--mocha-light)',
          opacity: 0.45,
          marginTop: '4px',
          pointerEvents: 'none',
        }}>
          developed by CA & SC
        </p>
      </div>
    </nav>
  );
}
