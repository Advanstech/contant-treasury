'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function KYCPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile KYC tab - this is the canonical KYC location
    router.replace('/profile?tab=kyc');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
