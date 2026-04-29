'use client';

import { useEffect } from 'react';

export const SWRegister = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    // Register on idle so the SW install doesn't compete with first paint.
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch((err) => console.error('[SW] registration failed:', err));
    };
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void) => void;
    }).requestIdleCallback;
    if (ric) {
      ric(register);
    } else {
      setTimeout(register, 1500);
    }
  }, []);

  return null;
};
