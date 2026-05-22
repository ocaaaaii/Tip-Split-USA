'use client';

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '20px 16px 8px',
        borderTop: '1px solid var(--cream-border)',
        marginTop: '8px',
      }}
    >
      <p style={{ fontSize: '11px', color: 'var(--mocha-light)', marginBottom: '6px', opacity: 0.7 }}>
        Developed with by{' '}
        <span style={{ fontWeight: 600 }}>CA &amp; SC</span>
      </p>
      <p style={{ fontSize: '10px', color: 'var(--mocha-light)', opacity: 0.45, letterSpacing: '0.04em' }}>
        © {year} TipSplit USA · All rights reserved.
      </p>
    </footer>
  );
}
