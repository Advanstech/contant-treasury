'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Wallet,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedStatCard, AnimatedButton } from '@/components/ui/animated-card';
import { PDFGenerator } from '@/lib/pdf-generator';

interface PortfolioPosition {
  id: string;
  securityName: string;
  securityType: 'TREASURY_BILL' | 'GOVERNMENT_BOND';
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  costBasis: number;
  yieldToMaturity?: number;
  maturityDate?: string;
  daysToMaturity?: number;
  couponRate?: number;
  accruedInterest?: number;
  lastUpdate: string;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  cashBalance: number;
  availableToTrade: number;
  totalYield: number;
  dayChange: number;
  dayChangePercent: number;
}

interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

export default function PortfolioPage() {
  const { user, isAuthenticated } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [allocation, setAllocation] = useState<AssetAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'yield'>('value');

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolioData();
    }
  }, [isAuthenticated]);

  const handleDownloadPortfolioStatement = () => {
    try {
      if (!summary) return;
      
      const pdf = PDFGenerator.generatePortfolioStatementPDF(
        filteredPositions,
        summary,
        showBalance
      );
      pdf.save(`portfolio-statement-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to generate portfolio statement PDF:', error);
    }
  };

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Mock portfolio positions
      const mockPositions: PortfolioPosition[] = [
        {
          id: '1',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-091',
          quantity: 100000,
          averagePrice: 98.50,
          currentPrice: 98.75,
          marketValue: 9875000,
          unrealizedPnL: 25000,
          unrealizedPnLPercent: 0.25,
          costBasis: 9850000,
          maturityDate: '2026-02-23',
          daysToMaturity: 95,
          lastUpdate: '2025-11-19T14:30:00Z',
        },
        {
          id: '2',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-182',
          quantity: 75000,
          averagePrice: 97.25,
          currentPrice: 97.50,
          marketValue: 7312500,
          unrealizedPnL: 18750,
          unrealizedPnLPercent: 0.26,
          costBasis: 7293750,
          maturityDate: '2026-05-20',
          daysToMaturity: 182,
          lastUpdate: '2025-11-19T14:30:00Z',
        },
        {
          id: '3',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-002',
          quantity: 50000,
          averagePrice: 101.00,
          currentPrice: 101.25,
          marketValue: 5062500,
          unrealizedPnL: 12500,
          unrealizedPnLPercent: 0.25,
          costBasis: 5050000,
          yieldToMaturity: 24.2,
          couponRate: 23.5,
          accruedInterest: 58333,
          maturityDate: '2027-12-08',
          daysToMaturity: 750,
          lastUpdate: '2025-11-19T14:30:00Z',
        },
        {
          id: '4',
          securityName: '3-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-003',
          quantity: 30000,
          averagePrice: 102.00,
          currentPrice: 102.50,
          marketValue: 3075000,
          unrealizedPnL: 15000,
          unrealizedPnLPercent: 0.49,
          costBasis: 3060000,
          yieldToMaturity: 25.1,
          couponRate: 24.5,
          accruedInterest: 36667,
          maturityDate: '2028-12-08',
          daysToMaturity: 1115,
          lastUpdate: '2025-11-19T14:30:00Z',
        },
        {
          id: '5',
          securityName: '5-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-005',
          quantity: 20000,
          averagePrice: 103.50,
          currentPrice: 103.75,
          marketValue: 2075000,
          unrealizedPnL: 5000,
          unrealizedPnLPercent: 0.24,
          costBasis: 2070000,
          yieldToMaturity: 26.0,
          couponRate: 25.5,
          accruedInterest: 25500,
          maturityDate: '2030-12-08',
          daysToMaturity: 1850,
          lastUpdate: '2025-11-19T14:30:00Z',
        },
      ];

      // Mock portfolio summary
      const mockSummary: PortfolioSummary = {
        totalValue: 27400000,
        totalCost: 27323750,
        totalPnL: 76250,
        totalPnLPercent: 0.28,
        cashBalance: 2500000,
        availableToTrade: 2000000,
        totalYield: 24.8,
        dayChange: 15000,
        dayChangePercent: 0.05,
      };

      // Mock asset allocation
      const mockAllocation: AssetAllocation[] = [
        { type: 'Treasury Bills', value: 17187500, percentage: 62.7, color: 'bg-blue-500' },
        { type: 'Government Bonds', value: 10212500, percentage: 37.3, color: 'bg-green-500' },
        { type: 'Cash', value: 2500000, percentage: 8.4, color: 'bg-purple-500' },
      ];

      setPositions(mockPositions);
      setSummary(mockSummary);
      setAllocation(mockAllocation);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions
    .filter(position => {
      const matchesSearch = !searchTerm || 
        position.securityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || position.securityType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.marketValue - a.marketValue;
        case 'pnl':
          return b.unrealizedPnL - a.unrealizedPnL;
        case 'yield':
          return (b.yieldToMaturity || 0) - (a.yieldToMaturity || 0);
        default:
          return 0;
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            My Portfolio
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your portfolio
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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Portfolio
              </h1>
              <p className="text-muted-foreground">
                Track your Treasury securities holdings and performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <Link href="/trading/orderbook">
                <AnimatedButton variant="primary">
                  Trade Now
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatedStatCard
              title="Portfolio Value"
              value={showBalance ? formatCurrency(summary.totalValue) : '••••••'}
              change={{
                value: formatPercent(summary.dayChangePercent),
                type: summary.dayChange >= 0 ? 'increase' : 'decrease'
              }}
              icon={<Wallet className="h-5 w-5 text-white" />}
              delay={0}
            />
            <AnimatedStatCard
              title="Total P&L"
              value={showBalance ? formatCurrency(summary.totalPnL) : '••••••'}
              change={{
                value: formatPercent(summary.totalPnLPercent),
                type: summary.totalPnL >= 0 ? 'increase' : 'decrease'
              }}
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              delay={100}
            />
            <AnimatedStatCard
              title="Available to Trade"
              value={showBalance ? formatCurrency(summary.availableToTrade) : '••••••'}
              change={undefined}
              icon={<DollarSign className="h-5 w-5 text-white" />}
              delay={200}
            />
            <AnimatedStatCard
              title="Average Yield"
              value={`${summary.totalYield.toFixed(2)}%`}
              change={undefined}
              icon={<BarChart3 className="h-5 w-5 text-white" />}
              delay={300}
            />
          </div>
        )}

        {/* Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AnimatedCard className="p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Asset Allocation</h2>
              <div className="space-y-4">
                {allocation.map((asset, index) => (
                  <div key={asset.type} className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{asset.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {showBalance ? formatCurrency(asset.value) : '••••••'} ({asset.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${asset.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>

          <AnimatedCard className="p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Positions</span>
                <span className="font-medium text-foreground">{positions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cash Balance</span>
                <span className="font-medium text-foreground">
                  {showBalance ? formatCurrency(summary?.cashBalance || 0) : '••••••'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Day Change</span>
                <span className={`font-medium ${
                  (summary?.dayChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {showBalance ? formatCurrency(summary?.dayChange || 0) : '••••••'}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <AnimatedButton variant="outline" className="w-full" onClick={handleDownloadPortfolioStatement}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Portfolio
                </AnimatedButton>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Positions */}
        <AnimatedCard className="border border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Holdings</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  <option value="TREASURY_BILL">Treasury Bills</option>
                  <option value="GOVERNMENT_BOND">Government Bonds</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="value">Sort by Value</option>
                  <option value="pnl">Sort by P&L</option>
                  <option value="yield">Sort by Yield</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading portfolio data...</p>
              </div>
            ) : filteredPositions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No positions found
                </h3>
                <p className="text-muted-foreground">
                  Start building your portfolio by trading Treasury securities.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Security</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Avg Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Current Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Market Value</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">P&L</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Yield</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPositions.map((position, index) => (
                      <tr key={position.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{position.securityName}</p>
                            <p className="text-xs text-muted-foreground">{position.symbol}</p>
                            {position.maturityDate && (
                              <p className="text-xs text-muted-foreground">
                                Matures: {formatDate(position.maturityDate)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">
                            {position.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">
                            {position.averagePrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">
                            {position.currentPrice.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">
                            {showBalance ? formatCurrency(position.marketValue) : '••••••'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`font-medium ${
                            position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {showBalance ? formatCurrency(position.unrealizedPnL) : '••••••'}
                            <div className="text-xs">
                              {formatPercent(position.unrealizedPnLPercent)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">
                            {position.yieldToMaturity ? `${position.yieldToMaturity.toFixed(2)}%` : 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Link href="/trading/orderbook">
                              <AnimatedButton variant="outline" className="text-xs">
                                Trade
                              </AnimatedButton>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
