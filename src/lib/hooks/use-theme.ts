import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

export function getStoredTheme(): Theme {
  if (globalThis.document === undefined) return 'system';
  const stored = globalThis.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system')
    return stored;
  return 'system';
}

export function applyTheme(theme: Theme) {
  const doc = globalThis.document?.documentElement;
  if (!doc) return;
  if (theme === 'system') {
    delete doc.dataset.theme;
    return;
  }
  doc.dataset.theme = theme;
}

export type EffectiveTheme = 'light' | 'dark';

export function useTheme(): {
  theme: Theme;
  setTheme: (t: Theme) => void;
  effectiveTheme: EffectiveTheme;
} {
  const [theme, setTheme] = useState<Theme>('system');
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setTheme(getStoredTheme()));
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (
      globalThis.window === undefined ||
      typeof globalThis.window.matchMedia !== 'function'
    )
      return;
    const mq = globalThis.window.matchMedia('(prefers-color-scheme: dark)');
    const update = (): void => setPrefersDark(mq.matches);
    queueMicrotask(update);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const setThemeAndPersist = useCallback((next: Theme) => {
    setTheme(next);
    if (globalThis.localStorage !== undefined) {
      globalThis.localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  }, []);

  let effectiveTheme: EffectiveTheme;
  if (theme === 'system') {
    effectiveTheme = prefersDark ? 'dark' : 'light';
  } else {
    effectiveTheme = theme;
  }

  return { theme, setTheme: setThemeAndPersist, effectiveTheme };
}
