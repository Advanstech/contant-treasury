import * as React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, subtitle, className = '' }: PageTitleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
        {children}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, subtitle, className = '' }: SectionTitleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
        {children}
      </h2>
      {subtitle && (
        <p className="text-base text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`}>
      {children}
    </h3>
  );
}

interface SubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function Subtitle({ children, className = '' }: SubtitleProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}
