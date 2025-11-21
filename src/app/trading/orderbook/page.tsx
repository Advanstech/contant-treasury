'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Activity,
  Clock,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedStatCard, AnimatedButton } from '@/components/ui/animated-card';
import OrderForm from '@/components/trading/OrderForm';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
  orders: number;
}

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
  spread: number;
}

interface RecentTrade {
  id: string;
  time: string;
  price: number;
  quantity: number;
  type: 'BUY' | 'SELL';
}

export default function OrderBookPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedSecurity, setSelectedSecurity] = useState<string>('GHA-TB-091');
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderBookData();
      const interval = setInterval(() => {
        if (autoRefresh) {
          fetchOrderBookData();
        }
      }, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, selectedSecurity, autoRefresh]);

  const fetchOrderBookData = async () => {
    try {
      // Mock market data
      const mockMarketData: Record<string, MarketData> = {
        'GHA-TB-091': {
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
          spread: 0.02,
        },
        'GHA-TB-182': {
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
          spread: 0.04,
        },
        'GHA-BD-002': {
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
          spread: 0.04,
        },
      };

      // Mock order book data
      const mockBuyOrders: OrderBookEntry[] = [
        { price: 98.74, quantity: 500000, total: 493700000, orders: 12 },
        { price: 98.73, quantity: 750000, total: 740475000, orders: 18 },
        { price: 98.72, quantity: 300000, total: 296160000, orders: 8 },
        { price: 98.71, quantity: 1000000, total: 987100000, orders: 25 },
        { price: 98.70, quantity: 450000, total: 444150000, orders: 15 },
        { price: 98.69, quantity: 600000, total: 592140000, orders: 20 },
        { price: 98.68, quantity: 250000, total: 246700000, orders: 6 },
        { price: 98.67, quantity: 800000, total: 789360000, orders: 22 },
      ];

      const mockSellOrders: OrderBookEntry[] = [
        { price: 98.76, quantity: 400000, total: 395040000, orders: 10 },
        { price: 98.77, quantity: 600000, total: 592620000, orders: 16 },
        { price: 98.78, quantity: 350000, total: 345730000, orders: 9 },
        { price: 98.79, quantity: 900000, total: 889110000, orders: 24 },
        { price: 98.80, quantity: 550000, total: 543400000, orders: 14 },
        { price: 98.81, quantity: 700000, total: 691670000, orders: 19 },
        { price: 98.82, quantity: 200000, total: 197640000, orders: 5 },
        { price: 98.83, quantity: 850000, total: 839855000, orders: 21 },
      ];

      // Mock recent trades
      const mockRecentTrades: RecentTrade[] = [
        { id: '1', time: '14:32:15', price: 98.75, quantity: 100000, type: 'BUY' },
        { id: '2', time: '14:32:12', price: 98.74, quantity: 250000, type: 'SELL' },
        { id: '3', time: '14:32:08', price: 98.75, quantity: 50000, type: 'BUY' },
        { id: '4', time: '14:32:05', price: 98.73, quantity: 150000, type: 'BUY' },
        { id: '5', time: '14:32:01', price: 98.76, quantity: 200000, type: 'SELL' },
        { id: '6', time: '14:31:58', price: 98.75, quantity: 300000, type: 'BUY' },
        { id: '7', time: '14:31:54', price: 98.74, quantity: 100000, type: 'SELL' },
        { id: '8', time: '14:31:51', price: 98.75, quantity: 75000, type: 'BUY' },
      ];

      setMarketData(mockMarketData);
      setBuyOrders(mockBuyOrders);
      setSellOrders(mockSellOrders);
      setRecentTrades(mockRecentTrades);
    } catch (error) {
      console.error('Failed to fetch order book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (order: any) => {
    setOrderLoading(true);
    try {
      // Mock order submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Order submitted:', order);
      // Show success message
    } catch (error) {
      console.error('Failed to submit order:', error);
    } finally {
      setOrderLoading(false);
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const currentSecurity = marketData[selectedSecurity];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Order Book
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the live trading interface
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Live Order Book
              </h1>
              <p className="text-muted-foreground text-sm">
                Real-time secondary market trading
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </button>
              <Link href="/trading/dashboard">
                <AnimatedButton variant="outline" className="text-sm">
                  Dashboard
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Security Selector and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(marketData).map(([symbol, data], index) => (
                <AnimatedCard
                  key={symbol}
                  delay={index * 50}
                  className={`p-4 border cursor-pointer transition-all ${
                    selectedSecurity === symbol 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedSecurity(symbol)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{symbol}</span>
                    <div className={`flex items-center gap-1 ${
                      data.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {data.change >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-lg font-bold text-foreground">
                      {data.lastPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.name}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Bid: {data.bid.toFixed(2)}</span>
                    <span>Ask: {data.ask.toFixed(2)}</span>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
          
          <AnimatedCard className="p-4 border border-border" delay={300}>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Market Stats</span>
            </div>
            {currentSecurity && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-medium">{formatNumber(currentSecurity.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High</span>
                  <span className="font-medium">{currentSecurity.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low</span>
                  <span className="font-medium">{currentSecurity.low.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spread</span>
                  <span className="font-medium">{currentSecurity.spread.toFixed(2)}</span>
                </div>
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Book */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Book Display */}
            <AnimatedCard className="border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Order Book</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Sell Orders */}
                  <div>
                    <div className="text-xs font-medium text-red-600 mb-3">Sell (Ask)</div>
                    <div className="space-y-1">
                      {sellOrders.slice().reverse().map((order, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <span className="text-red-600 font-medium w-12 text-right">
                            {order.price.toFixed(2)}
                          </span>
                          <div className="flex-1 bg-red-100 dark:bg-red-900/20 rounded h-4 relative overflow-hidden">
                            <div 
                              className="absolute inset-y-0 left-0 bg-red-500/20 rounded"
                              style={{ width: `${Math.min((order.total / 1000000000) * 100, 100)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              {formatNumber(order.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buy Orders */}
                  <div>
                    <div className="text-xs font-medium text-green-600 mb-3">Buy (Bid)</div>
                    <div className="space-y-1">
                      {buyOrders.map((order, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <span className="text-green-600 font-medium w-12 text-right">
                            {order.price.toFixed(2)}
                          </span>
                          <div className="flex-1 bg-green-100 dark:bg-green-900/20 rounded h-4 relative overflow-hidden">
                            <div 
                              className="absolute inset-y-0 left-0 bg-green-500/20 rounded"
                              style={{ width: `${Math.min((order.total / 1000000000) * 100, 100)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              {formatNumber(order.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spread Display */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spread</span>
                    <span className="font-medium text-foreground">
                      {currentSecurity?.spread.toFixed(2)} ({currentSecurity ? ((currentSecurity.spread / currentSecurity.ask) * 100).toFixed(3) : '0'}%)
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Recent Trades */}
            <AnimatedCard className="border border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Recent Trades</h2>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {recentTrades.map((trade, index) => (
                    <div key={trade.id} className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono">
                          {trade.time}
                        </span>
                        <span className={`font-medium ${
                          trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {formatNumber(trade.quantity)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          trade.type === 'BUY' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {trade.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {currentSecurity && (
                <OrderForm
                  security={currentSecurity}
                  onSubmit={handleOrderSubmit}
                  loading={orderLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
