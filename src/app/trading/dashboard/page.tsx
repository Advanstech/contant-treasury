'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Wallet,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedStatCard, AnimatedButton } from '@/components/ui/animated-card';

interface MarketData {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
}

interface PortfolioPosition {
  id: string;
  securityName: string;
  securityType: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

interface RecentTrade {
  id: string;
  securityName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: string;
  status: 'EXECUTED' | 'PENDING' | 'FAILED';
}

export default function TradingDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock market data
      const mockMarketData: MarketData[] = [
        {
          symbol: 'GHA-TB-091',
          name: '91-Day Treasury Bill',
          lastPrice: 98.75,
          change: 0.05,
          changePercent: 0.05,
          volume: 1500000,
          high: 98.80,
          low: 98.70,
          bid: 98.74,
          ask: 98.76,
        },
        {
          symbol: 'GHA-TB-182',
          name: '182-Day Treasury Bill',
          lastPrice: 97.50,
          change: -0.10,
          changePercent: -0.10,
          volume: 1200000,
          high: 97.60,
          low: 97.45,
          bid: 97.48,
          ask: 97.52,
        },
        {
          symbol: 'GHA-BD-002',
          name: '2-Year Government Bond',
          lastPrice: 101.25,
          change: 0.15,
          changePercent: 0.15,
          volume: 800000,
          high: 101.30,
          low: 101.20,
          bid: 101.23,
          ask: 101.27,
        },
        {
          symbol: 'GHA-BD-003',
          name: '3-Year Government Bond',
          lastPrice: 102.50,
          change: 0.20,
          changePercent: 0.20,
          volume: 600000,
          high: 102.55,
          low: 102.45,
          bid: 102.48,
          ask: 102.52,
        },
      ];

      // Mock portfolio positions
      const mockPositions: PortfolioPosition[] = [
        {
          id: '1',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          quantity: 100000,
          averagePrice: 98.50,
          currentPrice: 98.75,
          marketValue: 9875000,
          unrealizedPnL: 25000,
          unrealizedPnLPercent: 0.25,
        },
        {
          id: '2',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          quantity: 50000,
          averagePrice: 101.00,
          currentPrice: 101.25,
          marketValue: 5062500,
          unrealizedPnL: 12500,
          unrealizedPnLPercent: 0.25,
        },
      ];

      // Mock recent trades
      const mockTrades: RecentTrade[] = [
        {
          id: '1',
          securityName: '91-Day Treasury Bill',
          type: 'BUY',
          quantity: 50000,
          price: 98.70,
          totalValue: 4935000,
          timestamp: '2025-11-19T10:30:00Z',
          status: 'EXECUTED',
        },
        {
          id: '2',
          securityName: '182-Day Treasury Bill',
          type: 'SELL',
          quantity: 25000,
          price: 97.55,
          totalValue: 2438750,
          timestamp: '2025-11-19T09:15:00Z',
          status: 'EXECUTED',
        },
        {
          id: '3',
          securityName: '2-Year Government Bond',
          type: 'BUY',
          quantity: 30000,
          price: 101.20,
          totalValue: 3036000,
          timestamp: '2025-11-18T14:45:00Z',
          status: 'PENDING',
        },
      ];

      setMarketData(mockMarketData);
      setPositions(mockPositions);
      setRecentTrades(mockTrades);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPortfolioValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Trading Dashboard
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your trading dashboard
          </p>
          <Link href="/login">
            <AnimatedButton variant="primary">
              Sign In
            </AnimatedButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
                Trading Dashboard
              </h1>
              <p className="text-muted-foreground animate-fade-in-up">
                Secondary market trading and portfolio overview
              </p>
            </div>
            <Link href="/trading/orderbook">
              <AnimatedButton variant="primary">
                <Activity className="h-4 w-4 mr-2" />
                Live Trading
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedStatCard
            title="Portfolio Value"
            value={showBalance ? formatCurrency(totalPortfolioValue) : '••••••'}
            change={undefined}
            icon={<Wallet className="h-5 w-5 text-white" />}
            delay={0}
          />
          <AnimatedStatCard
            title="Unrealized P&L"
            value={showBalance ? formatCurrency(totalUnrealizedPnL) : '••••••'}
            change={{
              value: formatPercent(totalUnrealizedPnL > 0 ? 
                (totalUnrealizedPnL / (totalPortfolioValue - totalUnrealizedPnL)) * 100 : 0),
              type: totalUnrealizedPnL >= 0 ? 'increase' : 'decrease'
            }}
            icon={<DollarSign className="h-5 w-5 text-white" />}
            delay={100}
          />
          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account Balance</p>
                <p className="text-2xl font-bold text-foreground">
                  {showBalance ? formatCurrency(2500000) : '••••••'}
                </p>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Overview */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedCard className="p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Market Overview</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Live
                </div>
              </div>
              
              <div className="space-y-4">
                {marketData.map((market, index) => (
                  <AnimatedCard key={market.symbol} delay={index * 50} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{market.name}</h3>
                          <span className="text-sm text-muted-foreground">{market.symbol}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Last</p>
                            <p className="font-medium text-foreground">{market.lastPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Bid/Ask</p>
                            <p className="font-medium text-foreground">
                              {market.bid.toFixed(2)} / {market.ask.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Volume</p>
                            <p className="font-medium text-foreground">
                              {(market.volume / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Range</p>
                            <p className="font-medium text-foreground">
                              {market.low.toFixed(2)} - {market.high.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className={`flex items-center gap-1 ${
                          market.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {market.change >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          market.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercent(market.changePercent)}
                        </p>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedCard>

            {/* Recent Trades */}
            <AnimatedCard className="p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Trades</h2>
                <Link href="/trading/orders">
                  <AnimatedButton variant="outline" className="text-sm">
                    View All
                  </AnimatedButton>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <AnimatedCard key={trade.id} delay={index * 50} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          trade.type === 'BUY' 
                            ? 'bg-green-100 dark:bg-green-900/20' 
                            : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {trade.type === 'BUY' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{trade.securityName}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.type} {trade.quantity.toLocaleString()} @ {trade.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatCurrency(trade.totalValue)}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDate(trade.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedCard>
          </div>

          {/* Portfolio Positions */}
          <div className="space-y-6">
            <AnimatedCard className="p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Positions</h2>
                <Link href="/trading/portfolio">
                  <AnimatedButton variant="outline" className="text-sm">
                    View All
                  </AnimatedButton>
                </Link>
              </div>
              
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <AnimatedCard key={position.id} delay={index * 50} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground">{position.securityName}</p>
                        <p className="text-sm text-muted-foreground">
                          {position.quantity.toLocaleString()} units
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Avg Price</p>
                          <p className="font-medium">{position.averagePrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">{position.currentPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Market Value</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(position.marketValue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">P&L</span>
                          <span className={`font-medium ${
                            position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(position.unrealizedPnL)} ({formatPercent(position.unrealizedPnLPercent)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedCard>

            {/* Quick Actions */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/trading/orderbook">
                  <AnimatedButton variant="primary" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Place Order
                  </AnimatedButton>
                </Link>
                <Link href="/auctions/upcoming">
                  <AnimatedButton variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Primary Market
                  </AnimatedButton>
                </Link>
                <Link href="/trading/portfolio">
                  <AnimatedButton variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Portfolio Details
                  </AnimatedButton>
                </Link>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
