/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/headers/ThemeSelector';

// Utility to render with provider
const renderWithTheme = (ui: React.ReactNode) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('ThemeSelector', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: (query: string) => ({
            matches: query.includes('dark'), // simulate system preference
            media: query,
            onchange: null,
            addListener: jest.fn(), // for older APIs
            removeListener: jest.fn(),
            addEventListener: jest.fn(), // for modern APIs
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          }),
        });
      });
      
  it('renders all theme buttons with correct labels', () => {
    renderWithTheme(<ThemeSelector />);

    expect(screen.getByLabelText(/Light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dark/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/System/i)).toBeInTheDocument();
  });

  it('sets theme to dark on clicking Dark button', () => {
    renderWithTheme(<ThemeSelector />);
    const darkBtn = screen.getByLabelText(/Dark/i);
    fireEvent.click(darkBtn);

    expect(document.documentElement.getAttribute('data-carbon-theme')).toBe('dark');
    expect(localStorage.getItem('preferred-theme')).toBe('dark');
  });

  it('sets theme to light on clicking Light button', () => {
    renderWithTheme(<ThemeSelector />);
    const lightBtn = screen.getByLabelText(/Light/i);
    fireEvent.click(lightBtn);

    expect(document.documentElement.getAttribute('data-carbon-theme')).toBe('light');
    expect(localStorage.getItem('preferred-theme')).toBe('light');
  });

});
