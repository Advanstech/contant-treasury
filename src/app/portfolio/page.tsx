'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Clock,
  Shield,
  AlertCircle,
  Download,
  Eye,
  Filter,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

export default function PortfolioPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'TREASURY_BILL' | 'TREASURY_BOND' | 'CORPORATE_BOND'>('all');
  const [sortBy, setSortBy] = useState<'marketValue' | 'yield' | 'maturity' | 'pnl'>('marketValue');

  // Mock portfolio data that would come from BoG backend APIs
  const mockHoldings = [
    {
      id: '1',
      security: {
        id: '1',
        name: '91-Day Treasury Bill',
        isin: 'GH091TB202511',
        type: 'TREASURY_BILL',
        maturityDate: '2025-02-15',
      },
      quantity: 1000000,
      averagePrice: 99.85,
      currentPrice: 99.88,
      marketValue: 998800,
      costBasis: 998500,
      unrealizedPnL: 300,
      unrealizedPnLPercent: 0.03,
      accruedInterest: 0,
      yieldToMaturity: 24.5,
      daysToMaturity: 45,
      purchaseDate: '2025-01-01',
      lastUpdated: '2025-11-20T10:30:00Z',
      bidReference: 'BID-1704985200000',
      auctionId: 'bog-2024-001',
      settlementDate: '2024-01-08',
      status: 'active'
    },
    {
      id: '2',
      security: {
        id: '2',
        name: '182-Day Treasury Bill',
        isin: 'GH182TB202506',
        type: 'TREASURY_BILL',
        maturityDate: '2025-05-20',
      },
      quantity: 2000000,
      averagePrice: 98.75,
      currentPrice: 99.20,
      marketValue: 1984000,
      costBasis: 1975000,
      unrealizedPnL: 9000,
      unrealizedPnLPercent: 0.46,
      accruedInterest: 0,
      yieldToMaturity: 25.2,
      daysToMaturity: 150,
      purchaseDate: '2024-11-20',
      lastUpdated: '2025-11-20T10:30:00Z',
      bidReference: 'BID-1705089600000',
      auctionId: 'bog-2024-002',
      settlementDate: '2024-11-20',
      status: 'active'
    },
    {
      id: '3',
      security: {
        id: '3',
        name: '5-Year Treasury Bond',
        isin: 'GH5YB2029',
        type: 'TREASURY_BOND',
        maturityDate: '2029-11-20',
        couponRate: 22.5,
      },
      quantity: 500000,
      averagePrice: 101.50,
      currentPrice: 102.25,
      marketValue: 511250,
      costBasis: 507500,
      unrealizedPnL: 3750,
      unrealizedPnLPercent: 0.74,
      accruedInterest: 5625,
      yieldToMaturity: 21.8,
      daysToMaturity: 1460,
      purchaseDate: '2024-11-20',
      lastUpdated: '2025-11-20T10:30:00Z',
      bidReference: 'BID-1705176000000',
      auctionId: 'bog-2024-003',
      settlementDate: '2024-11-20',
      status: 'active'
    }
  ];

  // Mock API call - in real app, this would use the BoG compliance APIs
  const { data: holdings, isLoading, refetch } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => Promise.resolve(mockHoldings),
    enabled: !!token,
  });

  // Filter and sort holdings
  const filteredHoldings = holdings?.filter(holding => {
    const matchesSearch = !searchQuery || 
      holding.security.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holding.security.isin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || holding.security.type === filterType;
    return matchesSearch && matchesType;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'marketValue':
        return b.marketValue - a.marketValue;
      case 'yield':
        return b.yieldToMaturity - a.yieldToMaturity;
      case 'maturity':
        return a.daysToMaturity - b.daysToMaturity;
      case 'pnl':
        return b.unrealizedPnL - a.unrealizedPnL;
      default:
        return 0;
    }
  });

  // Calculate portfolio statistics
  const stats = filteredHoldings?.reduce(
    (acc, holding) => {
      acc.totalMarketValue += holding.marketValue;
      acc.totalCostBasis += holding.costBasis;
      acc.totalPnL += holding.unrealizedPnL;
      acc.totalAccruedInterest += holding.accruedInterest;
      acc.totalHoldings += 1;
      
      if (holding.security.type === 'TREASURY_BILL') {
        acc.tBillValue += holding.marketValue;
      } else if (holding.security.type === 'TREASURY_BOND') {
        acc.tBondValue += holding.marketValue;
      } else {
        acc.corporateValue += holding.marketValue;
      }
      
      return acc;
    },
    {
      totalMarketValue: 0,
      totalCostBasis: 0,
      totalPnL: 0,
      totalAccruedInterest: 0,
      totalHoldings: 0,
      tBillValue: 0,
      tBondValue: 0,
      corporateValue: 0,
    }
  ) || {
    totalMarketValue: 0,
    totalCostBasis: 0,
    totalPnL: 0,
    totalAccruedInterest: 0,
    totalHoldings: 0,
    tBillValue: 0,
    tBondValue: 0,
    corporateValue: 0,
  };

  const totalReturnPercent = stats.totalCostBasis > 0 
    ? ((stats.totalPnL / stats.totalCostBasis) * 100) 
    : 0;

  const handleExport = () => {
    if (!filteredHoldings || filteredHoldings.length === 0) return;

    const headers = [
      'Security Name', 'ISIN', 'Type', 'Quantity', 'Avg Price', 
      'Current Price', 'Market Value', 'Cost Basis', 'P&L', 'P&L %',
      'Yield %', 'Days to Maturity', 'Maturity Date', 'Bid Reference'
    ];
    
    const rows = filteredHoldings.map(holding => [
      holding.security.name,
      holding.security.isin,
      holding.security.type,
      holding.quantity.toLocaleString(),
      `₵${holding.averagePrice.toFixed(2)}`,
      `₵${holding.currentPrice.toFixed(2)}`,
      `₵${holding.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `₵${holding.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `₵${holding.unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `${holding.unrealizedPnLPercent.toFixed(2)}%`,
      `${holding.yieldToMaturity.toFixed(2)}%`,
      holding.daysToMaturity,
      new Date(holding.security.maturityDate).toLocaleDateString(),
      holding.bidReference,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getSecurityTypeColor = (type: string) => {
    switch (type) {
      case 'TREASURY_BILL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'TREASURY_BOND': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CORPORATE_BOND': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMaturityStatus = (days: number) => {
    if (days <= 30) return { label: 'Near Maturity', color: 'text-red-600' };
    if (days <= 90) return { label: 'Approaching', color: 'text-orange-600' };
    return { label: 'Long Term', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Ghana Treasury Portfolio</h1>
              <p className="text-muted-foreground">Track your Bank of Ghana Treasury investments and auction results</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
              <AnimatedButton variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Statement</span>
              </AnimatedButton>
              <Link href="/auctions" className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 sm:px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">View Auctions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <AnimatedCard className="p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-muted-foreground">Total Value</div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">₵{stats.totalMarketValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 text-green-500" />
              <span className="text-green-500 font-semibold">+{totalReturnPercent.toFixed(2)}%</span>
              <span className="text-muted-foreground">returns</span>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-muted-foreground">Total Returns</div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">₵{stats.totalPnL.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              From ₵{stats.totalCostBasis.toLocaleString()} invested in BOG securities
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-muted-foreground">Active Investments</div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChart className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalHoldings}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              BOG T-Bills and Government Bonds
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-4 sm:p-6 border border-border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-muted-foreground">Avg. Yield</div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">
              {filteredHoldings && filteredHoldings.length > 0 
                ? (filteredHoldings.reduce((sum, h) => sum + h.yieldToMaturity, 0) / filteredHoldings.length).toFixed(1)
                : '0.0'}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Weighted average yield
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative min-w-0 z-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search holdings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="relative z-10 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="TREASURY_BILL">Treasury Bills</option>
              <option value="TREASURY_BOND">Treasury Bonds</option>
              <option value="CORPORATE_BOND">Corporate Bonds</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="marketValue">Sort by Value</option>
              <option value="yield">Sort by Yield</option>
              <option value="maturity">Sort by Maturity</option>
              <option value="pnl">Sort by P&L</option>
            </select>
            <AnimatedButton variant="outline" onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setSortBy('marketValue');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Holdings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
          </div>
        ) : filteredHoldings && filteredHoldings.length > 0 ? (
          <AnimatedCard className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Security</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Avg Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Current Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Market Value</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">P&L</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Yield %</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Maturity</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredHoldings.map((holding: any) => {
                    const maturityStatus = getMaturityStatus(holding.daysToMaturity);
                    return (
                      <tr key={holding.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium">{holding.security.name}</div>
                            <div className="text-xs text-muted-foreground">{holding.security.isin}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityTypeColor(holding.security.type)}`}>
                            {holding.security.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          {holding.quantity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          ₵{holding.averagePrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          ₵{holding.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold">
                          ₵{holding.marketValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className={holding.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                            <div className="font-medium">
                              ₵{holding.unrealizedPnL.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-xs">
                              {holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          {holding.yieldToMaturity.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium">{holding.daysToMaturity} days</div>
                            <div className={`text-xs ${maturityStatus.color}`}>
                              {maturityStatus.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(holding.security.maturityDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <AnimatedButton variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </AnimatedButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        ) : (
          <AnimatedCard className="p-12 text-center border border-border">
            <PieChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No holdings found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Your treasury security holdings will appear here'}
            </p>
            <Link
              href="/auctions"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Trading
            </Link>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}
