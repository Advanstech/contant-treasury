'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import tradingApi from '@/lib/trading-api';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Search,
  X,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function MyTradesPage() {
  const { token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');

  // Fetch trades
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades', dateFilter],
    queryFn: () => {
      const filters: any = {};
      
      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        filters.startDate = startDate.toISOString();
      }

      return tradingApi.getTrades(filters, token!);
    },
    enabled: !!token,
  });

  // Filter trades by search query
  const filteredTrades = trades?.filter((trade: any) =>
    trade.security?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trade.tradeNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = filteredTrades?.reduce(
    (acc: any, trade: any) => {
      const value = trade.quantity * trade.price;
      acc.totalValue += value;
      acc.totalTrades += 1;
      
      if (trade.side === 'BUY') {
        acc.buyValue += value;
        acc.buyCount += 1;
      } else {
        acc.sellValue += value;
        acc.sellCount += 1;
      }
      
      return acc;
    },
    { totalValue: 0, totalTrades: 0, buyValue: 0, buyCount: 0, sellValue: 0, sellCount: 0 }
  ) || { totalValue: 0, totalTrades: 0, buyValue: 0, buyCount: 0, sellValue: 0, sellCount: 0 };

  const handleExport = () => {
    // Simple CSV export
    if (!filteredTrades || filteredTrades.length === 0) return;

    const headers = ['Date', 'Trade #', 'Security', 'Side', 'Quantity', 'Price', 'Value', 'Fees'];
    const rows = filteredTrades.map((trade: any) => [
      new Date(trade.executedAt).toLocaleDateString(),
      trade.tradeNumber,
      trade.security?.name || '',
      trade.side,
      trade.quantity,
      trade.price.toFixed(2),
      (trade.quantity * trade.price).toFixed(2),
      trade.totalFees?.toFixed(2) || '0.00',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Trades</h1>
              <p className="text-muted-foreground">View your complete trading history</p>
            </div>
            <button
              onClick={handleExport}
              disabled={!filteredTrades || filteredTrades.length === 0}
              className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold">₵{(stats.totalValue / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-xl font-bold">{stats.totalTrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Buy Trades</p>
                <p className="text-xl font-bold">{stats.buyCount}</p>
                <p className="text-xs text-muted-foreground">₵{(stats.buyValue / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sell Trades</p>
                <p className="text-xl font-bold">{stats.sellCount}</p>
                <p className="text-xs text-muted-foreground">₵{(stats.sellValue / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by security or trade number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trades List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading trades...</p>
          </div>
        ) : filteredTrades && filteredTrades.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Trade #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Security</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Side</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Value</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTrades.map((trade: any) => (
                    <tr key={trade.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(trade.executedAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {new Date(trade.executedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono">{trade.tradeNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{trade.security?.name || 'Security'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.side === 'BUY'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {trade.side === 'BUY' ? (
                            <>
                              <ArrowUpRight className="h-3 w-3" />
                              BUY
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-3 w-3" />
                              SELL
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {trade.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        ₵{trade.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold">
                        ₵{(trade.quantity * trade.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        ₵{trade.totalFees?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No trades found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Your executed trades will appear here'}
            </p>
            <a
              href="/trading"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Trading
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
