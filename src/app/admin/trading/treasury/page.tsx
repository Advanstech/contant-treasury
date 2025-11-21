'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Eye,
  Edit,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';

interface TreasuryAuction {
  id: string;
  securityCode: string;
  securityName: string;
  auctionDate: string;
  settlementDate: string;
  status: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'SETTLED';
  totalBids: number;
  totalAmount: number;
  minBidAmount: number;
  maxBidAmount?: number;
  cutoffYield?: number;
  weightedAvgYield?: number;
  coverRatio?: number;
}

export default function TreasuryTradingPage() {
  const [auctions, setAuctions] = useState<TreasuryAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);

  useEffect(() => {
    fetchTreasuryAuctions();
  }, []);

  const fetchTreasuryAuctions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/auctions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions || []);
      }
    } catch (error) {
      console.error('Error fetching treasury auctions:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'text-blue-500 bg-blue-500/10';
      case 'OPEN': return 'text-green-500 bg-green-500/10';
      case 'CLOSED': return 'text-orange-500 bg-orange-500/10';
      case 'SETTLED': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesFilter = filter === 'ALL' || auction.status === filter;
    const matchesSearch = searchTerm === '' || 
      auction.securityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.securityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <h1 className="text-2xl font-bold text-foreground">Treasury Trading</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage government securities auctions and trading
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => window.location.href = '/admin/auctions/create'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Auction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {auctions.filter(a => a.status === 'OPEN').length}
          </p>
          <p className="text-xs text-muted-foreground">Active Auctions</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(auctions.reduce((sum, a) => sum + a.totalAmount, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Total Volume</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {auctions.length > 0 ? formatPercent(auctions[0].cutoffYield || 0) : '0.00%'}
          </p>
          <p className="text-xs text-muted-foreground">Avg Cutoff Yield</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {auctions.filter(a => a.status === 'UPCOMING').length}
          </p>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="SETTLED">Settled</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by security code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Security</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Auction Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Settlement Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total Bids</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cutoff Yield</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cover Ratio</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{auction.securityCode}</p>
                      <p className="text-xs text-muted-foreground">{auction.securityName}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {new Date(auction.auctionDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {new Date(auction.settlementDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground">{auction.totalBids}</td>
                  <td className="p-4 text-sm text-foreground">{formatCurrency(auction.totalAmount)}</td>
                  <td className="p-4 text-sm text-foreground">
                    {auction.cutoffYield ? formatPercent(auction.cutoffYield) : '-'}
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {auction.coverRatio ? auction.coverRatio.toFixed(2) : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAuction(auction.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAuctions.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No treasury auctions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
