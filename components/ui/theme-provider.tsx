'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'day' | 'night';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'day', toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('day');

  useEffect(() => {
    const stored = window.localStorage.getItem('ecl-theme');
    if (stored === 'day' || stored === 'night') setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'night' ? 'night' : 'day');
    window.localStorage.setItem('ecl-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'day' ? 'night' : 'day'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
