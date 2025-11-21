'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Building, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import tradingApi, { Auction, AuctionsResponse } from '@/lib/trading-api';

export default function GovernmentBondsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'text-green-500 bg-green-500/10';
      case 'CLOSED':
        return 'text-blue-500 bg-blue-500/10';
      case 'UPCOMING':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const fetchGovernmentBonds = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data: AuctionsResponse = await tradingApi.getGovernmentBonds({
        status: status !== 'ALL' ? status : undefined,
        search: search || undefined,
        page,
        limit: 50,
      }, token);
      
      setAuctions(data.auctions);
      setPagination(data.pagination);
      setError(null);
    } catch (error) {
      console.error('Error fetching government bonds:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch government bonds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernmentBonds();
  }, [status, search, page]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/trading" className="text-muted-foreground hover:text-foreground transition-colors">
              Trading
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold text-foreground">Government Bonds</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage long-term government securities (2-year, 3-year, 5-year, 10-year Treasury Bonds)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Create Auction
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              Live
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(1500000000)}</p>
            <p className="text-sm text-muted-foreground">Total Volume Today</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">8.7%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Current
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">18.25%</p>
            <p className="text-sm text-muted-foreground">Average Yield</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">0.15%</span>
              <span className="text-muted-foreground ml-1">vs last auction</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Building className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-sm text-muted-foreground">Open Auctions</p>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">1 closing tomorrow</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Today
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">89</p>
            <p className="text-sm text-muted-foreground">Total Bids</p>
            <div className="flex items-center text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">15</span>
              <span className="text-muted-foreground ml-1">new today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by security code or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="ALL">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Government Bond Auctions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {auctions.length} of {pagination.total} auctions
          </p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading government bonds...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchGovernmentBonds}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Auction Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Bids
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cutoff Yield
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cover Ratio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-foreground">{auction.securityCode}</p>
                        <p className="text-sm text-muted-foreground">{auction.securityName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-foreground">{formatDate(auction.auctionDate)}</p>
                        <p className="text-sm text-muted-foreground">Settlement: {formatDate(auction.settlementDate)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {auction.totalBids.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatCurrency(auction.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {auction.cutoffYield.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {auction.coverRatio.toFixed(2)}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 text-sm border border-border rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
