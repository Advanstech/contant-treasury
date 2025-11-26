'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
  priority?: boolean;
}

export function Logo({ 
  size = 'md', 
  variant = 'full', 
  className = '', 
  priority = false 
}: LogoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Current theme (fallback to system theme)
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Size configurations matching constantcap.com.gh
  const sizeConfig = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 66 },
    xl: { width: 240, height: 80 }
  };

  const { width, height } = sizeConfig[size];

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-muted rounded-lg" style={{ width, height }} />
      </div>
    );
  }

  // Use actual Constant Capital logos
  const logoSrc = isDark 
    ? '/logos/constant-capital-logo-dark.png'
    : '/logos/constant-capital-logo.png';

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="relative transition-transform group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="Constant Capital Ghana"
          width={width}
          height={height}
          className="object-contain"
          priority={priority}
          sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
        />
      </div>
    </div>
  );
}

// Logo component for specific contexts
export function HeaderLogo({ className = '' }: { className?: string }) {
  return (
    <Logo 
      size="sm" 
      variant="full" 
      className={className}
      priority={true}
    />
  );
}

export function FooterLogo({ className = '' }: { className?: string }) {
  return (
    <Logo 
      size="sm" 
      variant="full" 
      className={className}
    />
  );
}

export function AdminLogo({ className = '' }: { className?: string }) {
  return (
    <Logo 
      size="sm" 
      variant="full" 
      className={className}
      priority={true}
    />
  );
}

export function MobileLogo({ className = '' }: { className?: string }) {
  return (
    <Logo 
      size="sm" 
      variant="icon" 
      className={className}
    />
  );
}
