import { toCssVariables } from '@sa/theme';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    return (window.localStorage.getItem('soybean-theme-mode') as ThemeMode | null) ?? 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const vars = toCssVariables();
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    root.dataset.theme = mode;
    window.localStorage.setItem('soybean-theme-mode', mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleMode: () => setMode(current => (current === 'light' ? 'dark' : 'light')) }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }
  return context;
}
