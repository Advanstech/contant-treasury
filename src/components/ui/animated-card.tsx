'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  className, 
  delay = 0,
  hover = true,
  onClick 
}: AnimatedCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'bg-card border border-border rounded-xl transition-all duration-300 ease-out',
        
        // Animation on mount
        'animate-fade-in-up',
        
        // Hover effects
        hover && 'hover:shadow-lg hover:border-primary/20 hover:scale-[1.02]',
        
        // Click effects
        onClick && 'cursor-pointer active:scale-[0.98]',
        
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function AnimatedButton({
  children,
  className,
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick
}: AnimatedButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]',
    secondary: 'bg-muted text-muted-foreground hover:bg-muted/80 active:scale-[0.98]',
    outline: 'border border-border text-foreground hover:bg-muted active:scale-[0.98]'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        loading && 'opacity-50 cursor-not-allowed',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={loading || disabled}
    >
      <span className={cn(
        'inline-flex items-center gap-2',
        loading && 'animate-pulse'
      )}>
        {children}
      </span>
    </button>
  );
}

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: ReactNode;
  delay?: number;
}

export function AnimatedStatCard({
  title,
  value,
  change,
  icon,
  delay = 0
}: AnimatedStatCardProps) {
  return (
    <AnimatedCard delay={delay}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground animate-fade-in">{title}</p>
            <p className="text-2xl font-bold text-foreground animate-fade-in-up">
              {value}
            </p>
            {change && (
              <p className={cn(
                'text-sm animate-fade-in',
                change.type === 'increase' && 'text-green-600',
                change.type === 'decrease' && 'text-red-600',
                change.type === 'neutral' && 'text-muted-foreground'
              )}>
                {change.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
