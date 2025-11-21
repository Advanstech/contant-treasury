'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Shield, 
  Building, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Users,
  BarChart3,
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface TradingStats {
  // Treasury Trading
  totalTreasuryVolume: number;
  activeAuctions: number;
  treasuryYield: number;
  
  // Repo Trading
  activeRepoPositions: number;
  totalRepoExposure: number;
  averageRepoRate: number;
  
  // Corporate Bonds
  activeBondIssues: number;
  totalBondVolume: number;
  averageBondYield: number;
  
  // Overall
  totalTrades: number;
  totalValue: number;
  marketParticipants: number;
}

export default function TradingPage() {
  const [stats, setStats] = useState<TradingStats>({
    totalTreasuryVolume: 0,
    activeAuctions: 0,
    treasuryYield: 0,
    activeRepoPositions: 0,
    totalRepoExposure: 0,
    averageRepoRate: 0,
    activeBondIssues: 0,
    totalBondVolume: 0,
    averageBondYield: 0,
    totalTrades: 0,
    totalValue: 0,
    marketParticipants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTradingStats();
  }, []);

  const fetchTradingStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/trading/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching trading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
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
          <h1 className="text-2xl font-bold text-foreground">Trading Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage all trading activities across Treasury, Repo, and Corporate Bonds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Trade
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              Live
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">{stats.totalTrades.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Trades Today</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">12.5%</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Real-time
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-muted-foreground">Total Trading Volume</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">8.3%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">{stats.marketParticipants}</p>
            <p className="text-sm text-muted-foreground">Market Participants</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">3</span>
              <span className="text-muted-foreground ml-1">new today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Type Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treasury Trading */}
        <Link href="/admin/trading/treasury" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Treasury Trading</h3>
                  <p className="text-sm text-muted-foreground">Government Securities</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Auctions</span>
                <span className="text-sm font-medium text-foreground">{stats.activeAuctions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Volume</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(stats.totalTreasuryVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Yield</span>
                <span className="text-sm font-medium text-foreground">{formatPercent(stats.treasuryYield)}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center text-sm text-primary">
                  <span>Manage Treasury Trading</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Repo Trading */}
        <Link href="/admin/trading/repos" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Repo Trading</h3>
                  <p className="text-sm text-muted-foreground">Repurchase Agreements</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Positions</span>
                <span className="text-sm font-medium text-foreground">{stats.activeRepoPositions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Exposure</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(stats.totalRepoExposure)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Rate</span>
                <span className="text-sm font-medium text-foreground">{formatPercent(stats.averageRepoRate)}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center text-sm text-primary">
                  <span>Manage Repo Positions</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Corporate Bonds */}
        <Link href="/admin/trading/corporate-bonds" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Building className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Corporate Bonds</h3>
                  <p className="text-sm text-muted-foreground">Corporate Debt Securities</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Issues</span>
                <span className="text-sm font-medium text-foreground">{stats.activeBondIssues}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(stats.totalBondVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Yield</span>
                <span className="text-sm font-medium text-foreground">{formatPercent(stats.averageBondYield)}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center text-sm text-primary">
                  <span>Manage Bond Issues</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Trading Activity</h2>
          <Link href="/admin/trading/activity" className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All Activity
          </Link>
        </div>
        
        <div className="space-y-4">
          {/* Activity items would be populated from API */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">91-Day T-Bill Auction</p>
                <p className="text-xs text-muted-foreground">Opened 2 hours ago • GHS 500M target</p>
              </div>
            </div>
            <span className="text-sm text-green-500">Active</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Repo Agreement #R2025-042</p>
                <p className="text-xs text-muted-foreground">GHS 50M • 7-day term • 18.5% rate</p>
              </div>
            </div>
            <span className="text-sm text-blue-500">Executed</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Building className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">GCB Corporate Bond Issue</p>
                <p className="text-xs text-muted-foreground">Bookbuilding opens tomorrow • GHS 200M</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
