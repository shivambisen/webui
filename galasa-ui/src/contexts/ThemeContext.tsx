/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'light' | 'dark';
export type ThemeSource = 'manual' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  source: ThemeSource;
  setSource: (source: ThemeSource) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  source: 'manual',
  setSource: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [source, setSource] = useState<ThemeSource>('manual');
  const [isLoaded, setIsLoaded] = useState(false);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-carbon-theme', newTheme);
    localStorage.setItem('preferred-theme', newTheme);
  };

  useEffect(() => {
    const stored = localStorage.getItem('preferred-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      setSource('manual');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      setSource('system');
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null; // Prevent flash by not rendering anything until theme is loaded

  return (
    <ThemeContext.Provider value={{ theme, setTheme, source, setSource }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
