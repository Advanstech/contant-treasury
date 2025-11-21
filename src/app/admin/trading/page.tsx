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
import tradingApi, { TradingStats } from '@/lib/trading-api';

export default function TradingPage() {
  const [stats, setStats] = useState<TradingStats>({
    totalTreasuryBillVolume: 0,
    activeTreasuryBillAuctions: 0,
    treasuryBillYield: 0,
    totalGovernmentBondVolume: 0,
    activeGovernmentBondAuctions: 0,
    governmentBondYield: 0,
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
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchTradingStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data = await tradingApi.getTradingStats(token);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trading stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trading statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradingStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load trading data</p>
          <button 
            onClick={fetchTradingStats}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Treasury Bills */}
        <Link href="/admin/trading/treasury-bills" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Treasury Bills</h3>
                  <p className="text-sm text-muted-foreground">Short-term Government</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-semibold">{formatCurrency(stats.totalTreasuryBillVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Auctions</span>
                <span className="font-semibold">{stats.activeTreasuryBillAuctions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Yield</span>
                <span className="font-semibold">{stats.treasuryBillYield.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Government Bonds */}
        <Link href="/admin/trading/government-bonds" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Building className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Government Bonds</h3>
                  <p className="text-sm text-muted-foreground">Long-term Government</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-semibold">{formatCurrency(stats.totalGovernmentBondVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Auctions</span>
                <span className="font-semibold">{stats.activeGovernmentBondAuctions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Yield</span>
                <span className="font-semibold">{stats.governmentBondYield.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Repo Trading */}
        <Link href="/admin/trading/repos" className="group">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <Activity className="w-5 h-5 text-orange-500" />
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
                <span className="font-semibold">{stats.activeRepoPositions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exposure</span>
                <span className="font-semibold">{formatCurrency(stats.totalRepoExposure)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Rate</span>
                <span className="font-semibold">{stats.averageRepoRate.toFixed(2)}%</span>
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
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Corporate Bonds</h3>
                  <p className="text-sm text-muted-foreground">Corporate Debt Issues</p>
                </div>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Issues</span>
                <span className="font-semibold">{stats.activeBondIssues}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="font-semibold">{formatCurrency(stats.totalBondVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Yield</span>
                <span className="font-semibold">{stats.averageBondYield.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Trading Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">91-Day Treasury Bill Auction</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">GHS 500M</p>
              <p className="text-sm text-green-500">14.75% Yield</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Repo Agreement - ABC Securities</p>
                <p className="text-sm text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">GHS 100M</p>
              <p className="text-sm text-muted-foreground">7-Day Term</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Corporate Bond Issue - Ghana Telecom</p>
                <p className="text-sm text-muted-foreground">6 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">GHS 200M</p>
              <p className="text-sm text-muted-foreground">Bookbuilding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
