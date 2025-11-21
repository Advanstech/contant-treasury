'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface SectionThemeProviderProps extends Omit<ThemeProviderProps, 'defaultTheme' | 'storageKey'> {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'constant-treasury-theme', ...props }: SectionThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme={defaultTheme} 
      enableSystem={false} 
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
