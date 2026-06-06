import { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  loadThemePreference,
  saveThemePreference,
  type ThemeMode,
} from '@/lib/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => loadThemePreference());

  useEffect(() => {
    applyTheme(theme);
    saveThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      if (current === 'system') return 'light';
      if (current === 'light') return 'dark';
      return 'system';
    });
  }, []);

  return { theme, setTheme, cycleTheme };
}
