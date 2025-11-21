'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[hsl(240,60%,8%)] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[hsl(25,95%,53%)] animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[hsl(25,95%,53%)]/20 border-t-transparent rounded-full animate-pulse" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          Loading Constant Treasury...
        </p>
      </div>
    </div>
  );
}
