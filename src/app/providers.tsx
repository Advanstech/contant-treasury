'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GeistProvider, CssBaseline } from '@geist-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import DebugPanel from '@/components/debug/DebugPanel';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthContext, AuthContextType } from '@/contexts/auth-context';

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

// Client-side only wrapper to ensure router context is available
function ClientSideAuthProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [AuthProviderComponent, setAuthProviderComponent] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import AuthProvider only on client side
    import('@/contexts/AuthContext').then(mod => {
      setAuthProviderComponent(() => mod.AuthProvider);
    });
  }, []);

  if (!isClient || !AuthProviderComponent) {
    // Provide fallback auth context during SSR/hydration
    const fallbackContext = {
      user: null,
      token: null,
      loading: true,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      updateProfile: async () => {},
      isAuthenticated: false,
      hasRole: () => false,
    };
    
    return (
      <AuthContext.Provider value={fallbackContext}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProviderWrapper>
      <GeistProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ClientSideAuthProvider>
            {children}
            <Toaster position="top-right" richColors />
            {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
            {process.env.NODE_ENV === 'development' && <DebugPanel />}
          </ClientSideAuthProvider>
        </QueryClientProvider>
      </GeistProvider>
    </ThemeProviderWrapper>
  );
}