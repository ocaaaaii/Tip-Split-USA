'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const DISMISSED_KEY = 'tipsplit_install_dismissed';

export default function InstallBanner() {
  const { lang } = useAppStore();
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // iOS detection (no beforeinstallprompt, show manual instruction)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    const standalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;

    if (standalone) return; // already installed

    if (ios) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void });
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const isZh = lang === 'zh' || lang === 'sc';

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[500px] z-40 animate-slide-up"
      style={{
        background: 'var(--cream-card)',
        border: '1px solid var(--cream-border)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(61,29,10,0.18)',
        padding: '12px 14px',
      }}
    >
      <div className="flex items-center gap-3">
        <img src="/icon-192.png" alt="TipSplit" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-mocha-dark leading-tight">
            {isZh ? '加到主畫面' : 'Add to Home Screen'}
          </p>
          <p className="text-xs text-mocha-light leading-tight mt-0.5">
            {isIOS
              ? (isZh ? '點 Safari 分享 → 加入主畫面' : 'Tap Share → Add to Home Screen')
              : (isZh ? '像 App 一樣直接開啟，支援離線使用' : 'Open like an app · works offline')}
          </p>
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white active:scale-95 transition-all"
            style={{ background: 'var(--accent-warm)' }}
          >
            {isZh ? '安裝' : 'Install'}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-mocha-light hover:text-mocha-mid text-base"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
