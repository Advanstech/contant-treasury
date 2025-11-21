'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import DebugPanel from '@/components/debug/DebugPanel';
import { ThemeProvider } from '@/components/theme-provider';

type ProvidersProps = {
  children: React.ReactNode;
};

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="constant-treasury-theme-admin">
        {children}
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="constant-treasury-theme-public">
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProviderWrapper>
      <GeistProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
            {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
            {process.env.NODE_ENV === 'development' && <DebugPanel />}
          </AuthProvider>
        </QueryClientProvider>
      </GeistProvider>
    </ThemeProviderWrapper>
  );
}