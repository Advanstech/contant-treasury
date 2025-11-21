'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeTest() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg">
        <div className="space-y-2 text-sm">
          <div>Loading theme...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg">
      <div className="space-y-2 text-sm">
        <div>Current theme: <span className="font-mono bg-muted px-2 py-1 rounded">{theme || 'system'}</span></div>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme('light')}
            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
          >
            System
          </button>
        </div>
      </div>
    </div>
  );
}
