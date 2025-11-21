'use client';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true 
}: TableSkeletonProps) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="border-b border-border pb-3 mb-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse shimmer" />
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4 py-3 border-b border-border/50"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={cn(
                  'h-4 bg-muted rounded animate-pulse shimmer',
                  colIndex === 0 && 'w-3/4', // First column shorter
                  colIndex === columns - 1 && 'w-1/2' // Last column shorter
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 4 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse shimmer" />
            <div className="flex-1">
              <div className="h-4 w-20 bg-muted rounded animate-pulse shimmer mb-2" />
              <div className="h-6 w-16 bg-muted rounded animate-pulse shimmer" />
            </div>
          </div>
          <div className="h-3 w-full bg-muted rounded animate-pulse shimmer" />
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export function ListSkeleton({ items = 5, showAvatar = false }: ListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
          {showAvatar && (
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse shimmer" />
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse shimmer" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse shimmer" />
          </div>
          <div className="h-8 w-20 bg-muted rounded animate-pulse shimmer" />
        </div>
      ))}
    </div>
  );
}

// Utility function for cn
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
