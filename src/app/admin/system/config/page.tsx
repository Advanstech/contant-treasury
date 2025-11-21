'use client';

import { useState, useEffect } from 'react';
import { Settings, Database, Shield, Bell, Globe, Users, Key, Lock, Smartphone, Mail, CreditCard, HelpCircle, Save, RefreshCw, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface SystemConfig {
  // General Settings
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  
  // Security Settings
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  allowedIpRanges: string[];
  
  // Trading Settings
  tradingEnabled: boolean;
  minBidAmount: number;
  maxBidAmount: number;
  tradingHours: {
    open: string;
    close: string;
  };
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // API Settings
  apiRateLimit: number;
  bogApiEnabled: boolean;
  csdApiEnabled: boolean;
  
  // Compliance Settings
  kycRequired: boolean;
  kycAutoApprove: boolean;
  auditLogRetention: number;
}

export default function SystemConfigPage() {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: 'Constant Treasury',
    siteDescription: 'Ghana\'s premier digital platform for government securities trading',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowedIpRanges: [],
    tradingEnabled: true,
    minBidAmount: 1000,
    maxBidAmount: 100000000,
    tradingHours: {
      open: '08:00',
      close: '16:00'
    },
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    apiRateLimit: 100,
    bogApiEnabled: false,
    csdApiEnabled: false,
    kycRequired: true,
    kycAutoApprove: false,
    auditLogRetention: 90
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/system/config`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/system/config`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        }
      );
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving configuration' });
    } finally {
      setSaving(false);
    }
  };

  const resetConfig = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/system/config/reset`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        await fetchConfig();
        setMessage({ type: 'success', text: 'Configuration reset to defaults' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error resetting configuration' });
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system-wide settings and configuration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetConfig}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Site Description
              </label>
              <textarea
                value={config.siteDescription}
                onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.maintenanceMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Maintenance Mode</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.allowRegistrations}
                  onChange={(e) => setConfig(prev => ({ ...prev, allowRegistrations: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Allow New Registrations</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.requireEmailVerification}
                  onChange={(e) => setConfig(prev => ({ ...prev, requireEmailVerification: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Require Email Verification</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => setConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={config.maxLoginAttempts}
                onChange={(e) => setConfig(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                value={config.passwordMinLength}
                onChange={(e) => setConfig(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.requireTwoFactor}
                  onChange={(e) => setConfig(prev => ({ ...prev, requireTwoFactor: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Require Two-Factor Authentication</span>
              </label>
            </div>
          </div>
        </div>

        {/* Trading Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Trading Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.tradingEnabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, tradingEnabled: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Enable Trading</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Bid Amount (GHS)
              </label>
              <input
                type="number"
                value={config.minBidAmount}
                onChange={(e) => setConfig(prev => ({ ...prev, minBidAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Maximum Bid Amount (GHS)
              </label>
              <input
                type="number"
                value={config.maxBidAmount}
                onChange={(e) => setConfig(prev => ({ ...prev, maxBidAmount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trading Hours - Open
                </label>
                <input
                  type="time"
                  value={config.tradingHours.open}
                  onChange={(e) => updateConfig('tradingHours', 'open', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trading Hours - Close
                </label>
                <input
                  type="time"
                  value={config.tradingHours.close}
                  onChange={(e) => updateConfig('tradingHours', 'close', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.emailNotifications}
                  onChange={(e) => setConfig(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Email Notifications</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.smsNotifications}
                  onChange={(e) => setConfig(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">SMS Notifications</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.pushNotifications}
                  onChange={(e) => setConfig(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Push Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">API Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                API Rate Limit (requests per minute)
              </label>
              <input
                type="number"
                value={config.apiRateLimit}
                onChange={(e) => setConfig(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.bogApiEnabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, bogApiEnabled: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">BoG API Integration</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.csdApiEnabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, csdApiEnabled: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">CSD API Integration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Compliance Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Compliance Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.kycRequired}
                  onChange={(e) => setConfig(prev => ({ ...prev, kycRequired: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">KYC Required for Trading</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.kycAutoApprove}
                  onChange={(e) => setConfig(prev => ({ ...prev, kycAutoApprove: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Auto-approve KYC (Testing Only)</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Audit Log Retention (days)
              </label>
              <input
                type="number"
                value={config.auditLogRetention}
                onChange={(e) => setConfig(prev => ({ ...prev, auditLogRetention: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
