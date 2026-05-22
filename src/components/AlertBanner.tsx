'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'info' | 'success';
  dismissible?: boolean;
}

export default function AlertBanner({ message, type = 'warning', dismissible = true }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = {
    warning: 'bg-accent-orange/15 border-accent-orange/40 text-mocha-dark',
    info: 'bg-accent-sky/15 border-accent-sky/40 text-mocha-dark',
    success: 'bg-accent-sage/15 border-accent-sage/40 text-mocha-dark',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-2 px-3.5 py-3 rounded-xl border text-sm animate-slide-up',
        styles[type]
      )}
    >
      <p className="flex-1 leading-snug">{message}</p>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="text-mocha-light hover:text-mocha-mid flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      )}
    </div>
  );
}
