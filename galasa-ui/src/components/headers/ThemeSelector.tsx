/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React, { useTransition } from "react";
import styles from "@/styles/Selector.module.css"; 
import { ThemeType, useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Laptop } from '@carbon/icons-react';

type FullThemeType = ThemeType | 'system';

const themeOptions: { id: FullThemeType; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={20} /> },
  { id: 'dark', label: 'Dark', icon: <Moon size={20} /> },
  { id: 'system', label: 'System', icon: <Laptop size={20} /> },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const idx = themeOptions.findIndex((o) => o.id === theme);
  const currentTheme = themeOptions[idx] || themeOptions[0];
  const next = themeOptions[(idx + 1) % themeOptions.length];

  const cycleTheme = () => {
    startTransition(() => {
      if (next.id === 'system') {
        setTheme('system');
      } else {
        setTheme(next.id as ThemeType);
      }
    });
  };

  return (
    <div className={styles.themeSwitcher}>
      <button
        onClick={cycleTheme}
        className={styles.iconButton + (currentTheme.id === theme ? ` ${styles.active}` : '')}
        disabled={isPending}
        aria-label={currentTheme.label}
      >
        {currentTheme.icon}
      </button>
    </div>
  );
}
