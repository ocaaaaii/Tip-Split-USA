'use client';

import { useAppStore } from '@/store/useAppStore';

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
];

function haptic(ms = 8) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(ms);
  }
}

export default function NumberPad() {
  const { billAmount, setBillAmount } = useAppStore();

  const handleKey = (key: string) => {
    haptic(key === '⌫' ? 18 : 8);

    if (key === '⌫') {
      setBillAmount(billAmount.slice(0, -1));
      return;
    }
    if (key === '.' && billAmount.includes('.')) return;
    const dotIdx = billAmount.indexOf('.');
    if (dotIdx !== -1 && billAmount.length - dotIdx > 2) return;
    if (billAmount.replace('.', '').length >= 7) return;

    const next = billAmount + key;
    if (next.length > 1 && next[0] === '0' && next[1] !== '.') {
      setBillAmount(next.slice(1));
    } else {
      setBillAmount(next);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {KEYS.flat().map((key) => {
        const isDelete = key === '⌫';
        const isDot    = key === '.';
        return (
          <button
            key={key}
            onPointerDown={(e) => { e.preventDefault(); handleKey(key); }}
            className="numkey h-14 rounded-2xl select-none"
            style={{
              background: isDelete
                ? 'linear-gradient(145deg, #C8A870, #D4B880)'
                : isDot
                ? '#EDE0C0'
                : '#F7EED8',
              border: `1px solid ${isDelete ? '#B89A60' : '#D4B880'}`,
              boxShadow: isDelete
                ? '0 3px 8px rgba(61,29,10,0.18), inset 0 1px 0 rgba(255,255,255,0.15)'
                : '0 2px 6px rgba(61,29,10,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
              fontSize: isDelete ? '18px' : '22px',
              fontWeight: isDelete ? '600' : '500',
              color: isDelete ? '#F7EED8' : '#3D1D0A',
              letterSpacing: '-0.02em',
            }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
