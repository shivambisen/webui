/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React, { useTransition } from "react";
import styles from "@/styles/Selector.module.css"; 
import { ThemeType, useTheme } from "@/contexts/ThemeContext";
import { Tooltip } from '@carbon/react';
import { Sun, Moon, Laptop } from '@carbon/icons-react';
import clsx from 'clsx';

type FullThemeType = ThemeType | 'system';

const themeOptions: { id: FullThemeType; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={20} /> },
  { id: 'dark', label: 'Dark', icon: <Moon size={20} /> },
  { id: 'system', label: 'System', icon: <Laptop size={20} /> },
];

export default function ThemeSelector() {
  const { theme, setTheme, source, setSource } = useTheme();
  const [isPending, startTransition] = useTransition();
  const currentTheme = source === 'system' ? 'system' : theme;
  const handleThemeChange = (id: FullThemeType) => {
    startTransition(() => {
      if (id === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.removeItem('preferred-theme');
        setSource('system');
        setTheme(prefersDark ? 'dark' : 'light');
      } else {
        localStorage.setItem('preferred-theme', id);
        setSource('manual');
        setTheme(id as ThemeType);
      }
    });
  };

  return (
    <div className={styles.themeSwitcher}>
      {themeOptions.map((option) => (
        <Tooltip key={option.id} label={option.label} align="bottom">
          <button
            onClick={() => handleThemeChange(option.id)}
            className={clsx(styles.iconButton, {
              [styles.active]: currentTheme === option.id,
            })}
            disabled={isPending}
            aria-label={option.label}
          >
            {option.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
