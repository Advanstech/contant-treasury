'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Clock,
  Info,
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface YieldData {
  tenor: string;
  days: number;
  currentYield: number;
  previousYield: number;
  change: number;
  volume: number;
}

interface MarketRate {
  security: string;
  type: 'T-Bill' | 'Bond';
  maturity: string;
  yield: number;
  price: number;
  change: number;
  volume: number;
  lastUpdated: string;
}

export default function MarketDataPage() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [dataType, setDataType] = useState<'yield' | 'volume' | 'price'>('yield');

  // Mock yield curve data
  const yieldCurveData: YieldData[] = [
    { tenor: '91-Day', days: 91, currentYield: 24.5, previousYield: 24.2, change: 0.3, volume: 450000000 },
    { tenor: '182-Day', days: 182, currentYield: 25.2, previousYield: 25.0, change: 0.2, volume: 380000000 },
    { tenor: '364-Day', days: 364, currentYield: 26.1, previousYield: 26.3, change: -0.2, volume: 320000000 },
    { tenor: '2-Year', days: 730, currentYield: 23.8, previousYield: 24.1, change: -0.3, volume: 180000000 },
    { tenor: '3-Year', days: 1095, currentYield: 23.5, previousYield: 23.8, change: -0.3, volume: 150000000 },
    { tenor: '5-Year', days: 1825, currentYield: 22.9, previousYield: 23.2, change: -0.3, volume: 120000000 },
    { tenor: '10-Year', days: 3650, currentYield: 22.2, previousYield: 22.6, change: -0.4, volume: 90000000 },
  ];

  // Mock market rates
  const marketRates: MarketRate[] = [
    {
      security: '91-Day T-Bill',
      type: 'T-Bill',
      maturity: '2025-02-15',
      yield: 24.5,
      price: 99.38,
      change: 0.3,
      volume: 450000000,
      lastUpdated: '2024-11-19T10:30:00',
    },
    {
      security: '182-Day T-Bill',
      type: 'T-Bill',
      maturity: '2025-05-20',
      yield: 25.2,
      price: 98.75,
      change: 0.2,
      volume: 380000000,
      lastUpdated: '2024-11-19T10:30:00',
    },
    {
      security: '364-Day T-Bill',
      type: 'T-Bill',
      maturity: '2025-11-19',
      yield: 26.1,
      price: 97.45,
      change: -0.2,
      volume: 320000000,
      lastUpdated: '2024-11-19T10:30:00',
    },
    {
      security: '5-Year Bond',
      type: 'Bond',
      maturity: '2029-11-19',
      yield: 22.9,
      price: 102.15,
      change: -0.3,
      volume: 120000000,
      lastUpdated: '2024-11-19T10:30:00',
    },
  ];

  const maxYield = Math.max(...yieldCurveData.map(d => d.currentYield));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Market Data</h1>
              <p className="text-muted-foreground">Real-time Ghana Treasury yield curves, rates, and secondary market prices</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">Nov 19, 2024 10:30 AM</p>
              </div>
              <AnimatedButton variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">91-Day T-Bill</p>
                <p className="text-2xl font-bold text-foreground">24.5%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +0.3%
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">364-Day T-Bill</p>
                <p className="text-2xl font-bold text-foreground">26.1%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3" />
                  -0.2%
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">5-Year Bond</p>
                <p className="text-2xl font-bold text-foreground">22.9%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3" />
                  -0.3%
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">₵1.69B</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Yield Curve Chart */}
        <AnimatedCard className="p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Ghana Treasury Yield Curve</h2>
              <p className="text-sm text-muted-foreground">Current yields across different maturities</p>
            </div>
            <div className="flex gap-2">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    timeframe === period
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Yield Curve Visualization */}
          <div className="space-y-4">
            {yieldCurveData.map((data, index) => (
              <div key={data.tenor} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.tenor}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">₵{(data.volume / 1000000).toFixed(0)}M</span>
                    <span className={`font-bold ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.currentYield.toFixed(1)}%
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(data.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                    style={{ width: `${(data.currentYield / maxYield) * 100}%` }}
                  >
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-foreground">
                      {data.currentYield.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">About the Yield Curve</p>
              <p>
                The yield curve shows the relationship between Treasury security yields and their time to maturity. 
                An upward sloping curve (longer maturities have higher yields) is typical in normal market conditions.
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Market Rates Table */}
        <AnimatedCard className="border border-border overflow-hidden mb-8">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Secondary Market Rates</h2>
                <p className="text-sm text-muted-foreground">Live trading prices and yields</p>
              </div>
              <AnimatedButton variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </AnimatedButton>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Security</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Maturity</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Yield %</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Change</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Volume</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {marketRates.map((rate) => (
                  <tr key={rate.security} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{rate.security}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate.type === 'T-Bill' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {rate.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(rate.maturity).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold">
                      {rate.yield.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      ₵{rate.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className={`flex items-center justify-end gap-1 font-medium ${
                        rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {rate.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(rate.change).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      ₵{(rate.volume / 1000000).toFixed(0)}M
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link href="/auctions">
                        <AnimatedButton variant="outline">
                          Trade
                        </AnimatedButton>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>

        {/* CTA Section */}
        <AnimatedCard className="p-8 border border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Trading Ghana Treasury Securities</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Access live auctions, competitive yields, and secure government-backed investments.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auctions">
                <AnimatedButton variant="primary">
                  View Live Auctions
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
              <Link href="/investor-presentations">
                <AnimatedButton variant="outline">
                  Learn More
                  <Info className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
