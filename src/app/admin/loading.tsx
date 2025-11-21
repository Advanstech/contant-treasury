'use client';

import { Loader2, TrendingUp } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[hsl(240,60%,8%)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-[hsl(240,55%,10%)] rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-96 bg-[hsl(240,55%,10%)] rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[hsl(240,55%,15%)] rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-20 bg-[hsl(240,55%,15%)] rounded animate-pulse mb-2" />
                  <div className="h-6 w-16 bg-[hsl(240,55%,15%)] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-[hsl(25,95%,53%)] animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground animate-pulse">
                Loading admin dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
