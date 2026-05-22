'use client';

import { useAppStore } from '@/store/useAppStore';

export default function HeaderBanner() {
  const { lang } = useAppStore();

  return (
    <div style={{ background: '#3D1D0A', position: 'relative', overflow: 'hidden' }}>
      {/* gradient accent line at top */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #3D1D0A, #D4B880 40%, #688DA5 70%, #3D1D0A)' }} />

      <div style={{ padding: '18px 24px 20px' }}>
        {/* main title */}
        <h1 style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '0.02em',
          color: '#F7EED8',
          lineHeight: 1.1,
        }}>
          TipSplit{' '}
          <em style={{ color: '#D4B880', fontWeight: '400', fontStyle: 'italic' }}>USA</em>
        </h1>

        {/* bottom rule + tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(212,184,128,0.35)' }} />
          <span style={{
            fontSize: '9px', letterSpacing: '0.14em',
            color: 'rgba(212,184,128,0.55)', textTransform: 'uppercase',
          }}>
            {lang === 'zh' ? '智慧小費 · 公平分帳' : 'Smart Tip · Fair Split'}
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(212,184,128,0.35)' }} />
        </div>
      </div>
    </div>
  );
}
