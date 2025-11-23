'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedButton } from './animated-card';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2; // Show 2 pages before and after current
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>
      
      <div className="flex items-center gap-2">
        <AnimatedButton
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 text-xs px-3 py-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </AnimatedButton>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-muted-foreground">...</span>
              ) : (
                <AnimatedButton
                  variant={currentPage === page ? 'primary' : 'outline'}
                  onClick={() => onPageChange(page as number)}
                  className="min-w-[40px] text-xs"
                >
                  {page}
                </AnimatedButton>
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatedButton
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 text-xs px-3 py-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </AnimatedButton>
      </div>
    </div>
  );
}
