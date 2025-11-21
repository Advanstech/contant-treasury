'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Admin routes have their own layout, so don't wrap with Header/Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // Public routes get Header and Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
