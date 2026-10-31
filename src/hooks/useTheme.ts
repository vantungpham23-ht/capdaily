'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'capdaily.theme';

/**
 * Manages the light/dark theme.
 * - Initial value comes from localStorage, otherwise the OS preference.
 * - The `dark` class is toggled on <html> so Tailwind's dark variant works.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = 'light';
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        initial = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initial = 'dark';
      }
    } catch {
      // ignore
    }

    setTheme(initial);
    setMounted(true);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    document.documentElement.style.colorScheme = initial;
  }, []);

  const apply = useCallback((next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    apply(theme === 'dark' ? 'light' : 'dark');
  }, [theme, apply]);

  return { theme, toggle, mounted };
}
