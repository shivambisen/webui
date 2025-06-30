/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'white' | 'g100';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'white',
  setTheme: () => {},
});

export const ThemeProvider = ({
  children,
  initialTheme = 'white',
}: {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}) => {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-carbon-theme', newTheme);
      localStorage.setItem('preferred-theme', newTheme);
      document.cookie = `preferred-theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('preferred-theme') as ThemeType;
      if (storedTheme === 'white' || storedTheme === 'g100') {
        setTheme(storedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'g100' : 'white');
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
