'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeInitializer() {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Re-apply the saved theme on client mount (handles SSR hydration gap)
    const saved = localStorage.getItem('tipsplit_theme') as 'system' | 'light' | 'dark' | null;
    setTheme(saved ?? 'system');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
