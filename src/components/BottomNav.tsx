'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { t, translations } from '@/lib/i18n';
import clsx from 'clsx';

const HREFS = ['/', '/split', '/summary'] as const;
type Href = typeof HREFS[number];

const ICONS: Record<Href, string> = {
  '/':        '\u{1F9EE}',  // 🧮
  '/split':   '\u{1F465}',  // 👥
  '/summary': '\u{1F4CB}',  // 📋
};

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useAppStore();
  const n = translations.nav;

  const labels: Record<Href, string> = {
    '/':        t(n.calculator, lang),
    '/split':   t(n.split, lang),
    '/summary': t(n.summary, lang),
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[540px] z-50 pointer-events-none">
      <div className="mx-4 mb-4 pointer-events-auto">
        <div
          className="flex items-center justify-around rounded-2xl px-2 py-2"
          style={{
            background: 'rgba(253,250,246,0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid #D4B880',
            boxShadow: '0 4px 24px rgba(61,29,10,0.12)',
          }}
        >
          {HREFS.map((href) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200',
                  active
                    ? 'bg-accent-warm/10 text-accent-warm'
                    : 'text-mocha-light hover:text-mocha-mid'
                )}
              >
                <span className="text-xl leading-none">{ICONS[href]}</span>
                <span className={clsx('text-xs font-medium whitespace-nowrap', active ? 'text-accent-warm' : 'text-mocha-light')}>
                  {labels[href]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
