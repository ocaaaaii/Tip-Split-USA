'use client';

import { useAppStore } from '@/store/useAppStore';

export default function HeaderBanner() {
  const { lang } = useAppStore();

  return (
    <div style={{ background: 'var(--cream-card)', position: 'relative', overflow: 'hidden' }}>
      {/* gradient accent line at top */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--cream-bg), #D4B880 40%, #688DA5 70%, var(--cream-bg))' }} />

      <div style={{ padding: '18px 24px 16px' }}>
        <h1 style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '0.02em',
          color: 'var(--mocha-dark)',
          lineHeight: 1.1,
        }}>
          TipSplit{' '}
          <em style={{ color: '#D4B880', fontWeight: '400', fontStyle: 'italic' }}>USA</em>
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--cream-border)', opacity: 0.5 }} />
          <span style={{
            fontSize: '9px', letterSpacing: '0.14em',
            color: 'var(--mocha-light)', textTransform: 'uppercase',
          }}>
            {lang === 'zh' || lang === 'sc' ? '智慧小費 · 公平分帳' : 'Smart Tip · Fair Split'}
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--cream-border)', opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
