'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'info' | 'error';
}

/**
 * Lightweight toast queue. `show` returns immediately and auto-dismisses
 * each toast after `duration` ms.
 */
export function useToast(duration = 2200) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, kind: Toast['kind'] = 'success') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss, duration]
  );

  useEffect(() => {
    const timers: number[] = [];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return { toasts, show, dismiss };
}
