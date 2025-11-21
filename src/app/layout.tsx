// apps/web/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport = {
  themeColor: '#006B3F', // Ghana's green color
};

export const metadata: Metadata = {
  title: "Constant Treasury - Secure Government Securities Platform",
  description: "Invest in secure government securities with Constant Treasury. Buy, manage, and track your investments with ease.",
  keywords: ["Ghana", "Treasury", "Bonds", "Securities", "Investment", "Government", "Constant Capital"],
  authors: [{ name: 'Constant Capital Ghana' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}