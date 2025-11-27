'use client';

import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Database, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, RefreshCw, Download, Settings, Server, Zap } from 'lucide-react';

interface SystemMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  dbConnections: number;
  apiResponseTime: number;
  requestRate: number;
}

interface HealthStatus {
  overall: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  services: {
    api: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    database: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    redis: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    email: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  };
  uptime: string;
  version: string;
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  // Generate mock metrics data
  const generateMockMetrics = (): SystemMetric[] => {
    const data: SystemMetric[] = [];
    const now = new Date();
    const intervals = timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : timeRange === '24h' ? 1440 : 10080;
    const intervalMinutes = timeRange === '1h' ? 1 : timeRange === '6h' ? 1 : timeRange === '24h' ? 10 : 15;
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
      
      // Generate realistic patterns with some randomness
      const baseCpu = 30 + Math.sin(i / 20) * 20;
      const baseMemory = 45 + Math.cos(i / 15) * 15;
      const baseResponseTime = 150 + Math.sin(i / 30) * 50;
      
      data.push({
        timestamp: timestamp.toISOString(),
        cpu: Math.max(5, Math.min(95, baseCpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(20, Math.min(90, baseMemory + (Math.random() - 0.5) * 15)),
        disk: 65 + Math.random() * 10,
        networkIn: Math.max(0, 1000 + Math.random() * 5000),
        networkOut: Math.max(0, 800 + Math.random() * 3000),
        dbConnections: Math.floor(15 + Math.random() * 35),
        apiResponseTime: Math.max(50, baseResponseTime + (Math.random() - 0.5) * 100),
        requestRate: Math.max(0, 50 + Math.random() * 200)
      });
    }
    
    return data;
  };

  // Generate mock health status
  const generateMockHealth = (): HealthStatus => {
    const overall = Math.random() > 0.8 ? 'WARNING' : Math.random() > 0.95 ? 'CRITICAL' : 'HEALTHY';
    
    return {
      overall,
      services: {
        api: Math.random() > 0.9 ? 'WARNING' : 'HEALTHY',
        database: Math.random() > 0.95 ? 'CRITICAL' : 'HEALTHY',
        redis: Math.random() > 0.85 ? 'WARNING' : 'HEALTHY',
        email: Math.random() > 0.92 ? 'WARNING' : 'HEALTHY'
      },
      uptime: '45 days, 12 hours, 34 minutes',
      version: '2.1.0'
    };
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, timeRange]);

  const fetchData = async () => {
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 300));
      setMetrics(generateMockMetrics());
      setHealth(generateMockHealth());
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CRITICAL': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle className="w-4 h-4" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4" />;
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (current: number, threshold: number) => {
    if (current > threshold * 1.2) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (current > threshold) return <TrendingUp className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (uptime: string) => {
    return uptime;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time system performance metrics and health status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
          
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      {health && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">System Health</h2>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(health.overall)}`}>
              {getHealthIcon(health.overall)}
              {health.overall}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">API Service</p>
                  <span className={`inline-flex items-center gap-1 text-xs ${getHealthColor(health.services.api)}`}>
                    {getHealthIcon(health.services.api)}
                    {health.services.api}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Database</p>
                  <span className={`inline-flex items-center gap-1 text-xs ${getHealthColor(health.services.database)}`}>
                    {getHealthIcon(health.services.database)}
                    {health.services.database}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Redis Cache</p>
                  <span className={`inline-flex items-center gap-1 text-xs ${getHealthColor(health.services.redis)}`}>
                    {getHealthIcon(health.services.redis)}
                    {health.services.redis}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Service</p>
                  <span className={`inline-flex items-center gap-1 text-xs ${getHealthColor(health.services.email)}`}>
                    {getHealthIcon(health.services.email)}
                    {health.services.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <span>Uptime: {formatUptime(health.uptime)}</span>
            <span>Version: {health.version}</span>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">CPU Usage</h3>
              </div>
              {getTrendIcon(latestMetrics.cpu, 70)}
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">{latestMetrics.cpu.toFixed(1)}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    latestMetrics.cpu > 80 ? 'bg-red-500' : 
                    latestMetrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${latestMetrics.cpu}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Threshold: 70%</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Memory Usage</h3>
              </div>
              {getTrendIcon(latestMetrics.memory, 80)}
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">{latestMetrics.memory.toFixed(1)}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    latestMetrics.memory > 85 ? 'bg-red-500' : 
                    latestMetrics.memory > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${latestMetrics.memory}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Threshold: 80%</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">DB Connections</h3>
              </div>
              {getTrendIcon(latestMetrics.dbConnections, 40)}
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">{latestMetrics.dbConnections}</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    latestMetrics.dbConnections > 45 ? 'bg-red-500' : 
                    latestMetrics.dbConnections > 35 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (latestMetrics.dbConnections / 50) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Max: 50 connections</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">API Response Time</h3>
              </div>
              {getTrendIcon(latestMetrics.apiResponseTime, 500)}
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">{latestMetrics.apiResponseTime.toFixed(0)}ms</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    latestMetrics.apiResponseTime > 1000 ? 'bg-red-500' : 
                    latestMetrics.apiResponseTime > 500 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (latestMetrics.apiResponseTime / 1000) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Threshold: 500ms</p>
            </div>
          </div>
        </div>
      )}

      {/* Network & Request Metrics */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wifi className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Network Traffic</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Incoming</span>
                <span className="text-sm font-medium text-foreground">{formatBytes(latestMetrics.networkIn)}/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Outgoing</span>
                <span className="text-sm font-medium text-foreground">{formatBytes(latestMetrics.networkOut)}/s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disk Usage</span>
                <span className="text-sm font-medium text-foreground">{latestMetrics.disk.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Request Metrics</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Request Rate</span>
                <span className="text-sm font-medium text-foreground">{latestMetrics.requestRate.toFixed(0)}/min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Connections</span>
                <span className="text-sm font-medium text-foreground">{Math.floor(latestMetrics.requestRate / 10)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Error Rate</span>
                <span className="text-sm font-medium text-green-600">0.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
          </div>
          <button
            onClick={() => {
              const csv = [
                'Timestamp,CPU,Memory,DB Connections,API Response Time,Request Rate',
                ...metrics.map(m => 
                  `${m.timestamp},${m.cpu},${m.memory},${m.dbConnections},${m.apiResponseTime},${m.requestRate}`
                )
              ].join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Performance charts will be rendered here</p>
            <p className="text-xs text-muted-foreground mt-1">Integrate with charting library (Recharts/Chart.js)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
