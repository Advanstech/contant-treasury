'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, User, Bell, Shield, Palette, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(false);
  const [darkModeTime, setDarkModeTime] = useState('18:00');
  const [lightModeTime, setLightModeTime] = useState('06:00');

  useEffect(() => {
    setMounted(true);
    
    // Load saved preferences from localStorage
    const savedAutoTheme = localStorage.getItem('autoThemeEnabled') === 'true';
    const savedDarkTime = localStorage.getItem('darkModeTime') || '18:00';
    const savedLightTime = localStorage.getItem('lightModeTime') || '06:00';
    
    setAutoThemeEnabled(savedAutoTheme);
    setDarkModeTime(savedDarkTime);
    setLightModeTime(savedLightTime);
  }, []);

  // Auto theme switching based on time
  useEffect(() => {
    if (!mounted || !autoThemeEnabled) return;

    const checkAndUpdateTheme = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const [darkHour, darkMin] = darkModeTime.split(':').map(Number);
      const [lightHour, lightMin] = lightModeTime.split(':').map(Number);
      
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const darkMinutes = darkHour * 60 + darkMin;
      const lightMinutes = lightHour * 60 + lightMin;
      
      // If dark time is later than light time (e.g., 18:00 to 06:00)
      if (darkMinutes > lightMinutes) {
        if (currentMinutes >= darkMinutes || currentMinutes < lightMinutes) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      } else {
        // If light time is later than dark time (unusual but supported)
        if (currentMinutes >= lightMinutes && currentMinutes < darkMinutes) {
          setTheme('light');
        } else {
          setTheme('dark');
        }
      }
    };

    // Check immediately
    checkAndUpdateTheme();

    // Check every minute
    const interval = setInterval(checkAndUpdateTheme, 60000);

    return () => clearInterval(interval);
  }, [mounted, autoThemeEnabled, darkModeTime, lightModeTime, setTheme]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleAutoThemeToggle = (enabled: boolean) => {
    setAutoThemeEnabled(enabled);
    localStorage.setItem('autoThemeEnabled', String(enabled));
    
    if (!enabled) {
      // Reset to system theme when disabled
      setTheme('system');
    }
  };

  const handleDarkTimeChange = (time: string) => {
    setDarkModeTime(time);
    localStorage.setItem('darkModeTime', time);
  };

  const handleLightTimeChange = (time: string) => {
    setLightModeTime(time);
    localStorage.setItem('lightModeTime', time);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Appearance Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how Constant Treasury looks</p>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Theme Mode</label>
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <button
                    onClick={() => {
                      setTheme('light');
                      setAutoThemeEnabled(false);
                      localStorage.setItem('autoThemeEnabled', 'false');
                    }}
                    disabled={autoThemeEnabled}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      theme === 'light' && !autoThemeEnabled
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${autoThemeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      setAutoThemeEnabled(false);
                      localStorage.setItem('autoThemeEnabled', 'false');
                    }}
                    disabled={autoThemeEnabled}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark' && !autoThemeEnabled
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${autoThemeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('system');
                      setAutoThemeEnabled(false);
                      localStorage.setItem('autoThemeEnabled', 'false');
                    }}
                    disabled={autoThemeEnabled}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      theme === 'system' && !autoThemeEnabled
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${autoThemeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Monitor className="h-6 w-6" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
                {!mounted && (
                  <p className="text-xs text-muted-foreground mt-2">Current theme: {theme || 'system'}</p>
                )}
              </div>

              {/* Auto Theme Switching */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <label className="text-sm font-medium block">Automatic Theme Switching</label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically switch between light and dark mode based on time
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAutoThemeToggle(!autoThemeEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoThemeEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoThemeEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {autoThemeEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-2">
                        Switch to Dark Mode
                      </label>
                      <input
                        type="time"
                        value={darkModeTime}
                        onChange={(e) => handleDarkTimeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Default: 6:00 PM</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-2">
                        Switch to Light Mode
                      </label>
                      <input
                        type="time"
                        value={lightModeTime}
                        onChange={(e) => handleLightTimeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Default: 6:00 AM</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Account</h2>
                <p className="text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-base mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                <p className="text-base mt-1 capitalize">{user?.accountType?.toLowerCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-base mt-1">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Trade Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified about your trades</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">Manage your security settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/settings/change-password"
                className="block text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </Link>
              <Link
                href="/settings/two-factor"
                className="block text-left px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add extra security to your account</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
