'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  X,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileText,
  Building2,
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface Auction {
  id: string;
  auctionId: string;
  security: {
    name: string;
    isin: string;
    type: 'TREASURY_BILL' | 'TREASURY_BOND';
    maturityDate: string;
    couponRate?: number;
  };
  auctionType: 'COMPETITIVE' | 'NON_COMPETITIVE';
  announcementDate: string;
  biddingOpenDate: string;
  biddingCloseDate: string;
  settlementDate: string;
  totalAmount: number;
  minBidAmount: number;
  maxBidAmount: number;
  priceRange?: {
    min: number;
    max: number;
  };
  status: 'ANNOUNCED' | 'OPEN' | 'CLOSED' | 'RESULTS_PUBLISHED' | 'SETTLED';
  results?: {
    averageYield: number;
    totalBids: number;
    totalAccepted: number;
    bidToCoverRatio: number;
    marginalPrice: number;
    publishedDate: string;
  };
  userBid?: {
    id: string;
    bidReference: string;
    quantity: number;
    price?: number;
    yield?: number;
    status: 'PENDING' | 'SUBMITTED' | 'ALLOTTED' | 'REJECTED';
    submittedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AuctionsPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ANNOUNCED' | 'OPEN' | 'CLOSED' | 'RESULTS_PUBLISHED' | 'SETTLED'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'TREASURY_BILL' | 'TREASURY_BOND'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'closing' | 'status'>('date');

  // Mock auctions data - in real app, this would come from BoG compliance APIs
  const mockAuctions: Auction[] = [
    {
      id: '1',
      auctionId: 'bog-2024-006',
      security: {
        name: '91-Day Treasury Bill',
        isin: 'GH091TB202502',
        type: 'TREASURY_BILL',
        maturityDate: '2025-04-15',
      },
      auctionType: 'COMPETITIVE',
      announcementDate: '2024-11-20',
      biddingOpenDate: '2024-11-20',
      biddingCloseDate: '2024-11-25',
      settlementDate: '2024-11-26',
      totalAmount: 500000000,
      minBidAmount: 1000,
      maxBidAmount: 50000000,
      status: 'OPEN',
      createdAt: '2024-11-20T09:00:00Z',
      updatedAt: '2024-11-20T09:00:00Z',
    },
    {
      id: '2',
      auctionId: 'bog-2024-005',
      security: {
        name: '364-Day Treasury Bill',
        isin: 'GH364TB202512',
        type: 'TREASURY_BILL',
        maturityDate: '2025-12-20',
      },
      auctionType: 'NON_COMPETITIVE',
      announcementDate: '2024-11-15',
      biddingOpenDate: '2024-11-15',
      biddingCloseDate: '2024-11-20',
      settlementDate: '2024-11-21',
      totalAmount: 300000000,
      minBidAmount: 1000,
      maxBidAmount: 25000000,
      status: 'CLOSED',
      results: {
        averageYield: 24.8,
        totalBids: 1250000000,
        totalAccepted: 300000000,
        bidToCoverRatio: 4.17,
        marginalPrice: 99.75,
        publishedDate: '2024-11-20',
      },
      userBid: {
        id: 'bid-2',
        bidReference: 'BID-1705348800000',
        quantity: 750000,
        status: 'REJECTED',
        submittedAt: '2024-11-18T10:30:00Z',
      },
      createdAt: '2024-11-15T09:00:00Z',
      updatedAt: '2024-11-20T16:30:00Z',
    },
    {
      id: '3',
      auctionId: 'bog-2024-004',
      security: {
        name: '182-Day Treasury Bill',
        isin: 'GH182TB202505',
        type: 'TREASURY_BILL',
        maturityDate: '2025-06-20',
      },
      auctionType: 'COMPETITIVE',
      announcementDate: '2024-11-10',
      biddingOpenDate: '2024-11-10',
      biddingCloseDate: '2024-11-15',
      settlementDate: '2024-11-16',
      totalAmount: 400000000,
      minBidAmount: 1000,
      maxBidAmount: 40000000,
      status: 'RESULTS_PUBLISHED',
      results: {
        averageYield: 25.2,
        totalBids: 980000000,
        totalAccepted: 400000000,
        bidToCoverRatio: 2.45,
        marginalPrice: 99.20,
        publishedDate: '2024-11-15',
      },
      userBid: {
        id: 'bid-3',
        bidReference: 'BID-1705262400000',
        quantity: 1500000,
        price: 99.80,
        yield: 24.8,
        status: 'ALLOTTED',
        submittedAt: '2024-11-12T14:20:00Z',
      },
      createdAt: '2024-11-10T09:00:00Z',
      updatedAt: '2024-11-15T16:30:00Z',
    },
    {
      id: '4',
      auctionId: 'bog-2024-003',
      security: {
        name: '5-Year Treasury Bond',
        isin: 'GH5YB2029',
        type: 'TREASURY_BOND',
        maturityDate: '2029-11-20',
        couponRate: 22.5,
      },
      auctionType: 'COMPETITIVE',
      announcementDate: '2024-11-05',
      biddingOpenDate: '2024-11-05',
      biddingCloseDate: '2024-11-10',
      settlementDate: '2024-11-11',
      totalAmount: 200000000,
      minBidAmount: 10000,
      maxBidAmount: 20000000,
      priceRange: {
        min: 98.00,
        max: 102.00,
      },
      status: 'SETTLED',
      results: {
        averageYield: 21.8,
        totalBids: 450000000,
        totalAccepted: 200000000,
        bidToCoverRatio: 2.25,
        marginalPrice: 102.25,
        publishedDate: '2024-11-10',
      },
      userBid: {
        id: 'bid-4',
        bidReference: 'BID-1705176000000',
        quantity: 500000,
        price: 101.50,
        yield: 21.8,
        status: 'ALLOTTED',
        submittedAt: '2024-11-08T11:45:00Z',
      },
      createdAt: '2024-11-05T09:00:00Z',
      updatedAt: '2024-11-11T16:30:00Z',
    },
  ];

  // Mock API call - in real app, this would use the BoG compliance APIs
  const { data: auctions, isLoading, refetch } = useQuery({
    queryKey: ['auctions', statusFilter, typeFilter],
    queryFn: () => Promise.resolve(mockAuctions),
    enabled: !!token,
  });

  // Filter and sort auctions
  const filteredAuctions = auctions?.filter(auction => {
    const matchesSearch = !searchQuery || 
      auction.security.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.auctionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.security.isin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || auction.status === statusFilter;
    const matchesType = typeFilter === 'all' || auction.security.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.biddingOpenDate).getTime() - new Date(a.biddingOpenDate).getTime();
      case 'amount':
        return b.totalAmount - a.totalAmount;
      case 'closing':
        return new Date(a.biddingCloseDate).getTime() - new Date(b.biddingCloseDate).getTime();
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = filteredAuctions?.reduce(
    (acc, auction) => {
      acc.totalAuctions += 1;
      acc.totalAmount += auction.totalAmount;
      
      if (auction.status === 'OPEN') acc.openCount += 1;
      if (auction.status === 'CLOSED') acc.closedCount += 1;
      if (auction.status === 'RESULTS_PUBLISHED') acc.resultsCount += 1;
      if (auction.status === 'SETTLED') acc.settledCount += 1;
      
      if (auction.userBid) {
        acc.userBidCount += 1;
        if (auction.userBid.status === 'ALLOTTED') acc.allottedCount += 1;
      }
      
      return acc;
    },
    {
      totalAuctions: 0,
      totalAmount: 0,
      openCount: 0,
      closedCount: 0,
      resultsCount: 0,
      settledCount: 0,
      userBidCount: 0,
      allottedCount: 0,
    }
  ) || {
    totalAuctions: 0,
    totalAmount: 0,
    openCount: 0,
    closedCount: 0,
    resultsCount: 0,
    settledCount: 0,
    userBidCount: 0,
    allottedCount: 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ANNOUNCED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'OPEN': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CLOSED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'RESULTS_PUBLISHED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'SETTLED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ANNOUNCED': return <Calendar className="h-4 w-4" />;
      case 'OPEN': return <Clock className="h-4 w-4" />;
      case 'CLOSED': return <AlertCircle className="h-4 w-4" />;
      case 'RESULTS_PUBLISHED': return <CheckCircle className="h-4 w-4" />;
      case 'SETTLED': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ALLOTTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTimeRemaining = (closeDate: string) => {
    const now = new Date();
    const close = new Date(closeDate);
    const diff = close.getTime() - now.getTime();
    
    if (diff <= 0) return 'Closed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Closing soon';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">BoG Treasury Auctions</h1>
              <p className="text-muted-foreground">Participate in Bank of Ghana Treasury securities auctions</p>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedButton variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Auctions</p>
                <p className="text-2xl font-bold text-green-600">{stats.openCount}</p>
                <p className="text-sm text-muted-foreground">Bidding active</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Bids</p>
                <p className="text-2xl font-bold text-foreground">{stats.userBidCount}</p>
                <p className="text-sm text-green-600">{stats.allottedCount} allotted</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Results Published</p>
                <p className="text-2xl font-bold text-foreground">{stats.resultsCount}</p>
                <p className="text-sm text-muted-foreground">Awaiting settlement</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">₵{(stats.totalAmount / 1000000).toFixed(0)}M</p>
                <p className="text-sm text-muted-foreground">{stats.totalAuctions} auctions</p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search auctions..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="ANNOUNCED">Announced</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="RESULTS_PUBLISHED">Results Published</option>
              <option value="SETTLED">Settled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="TREASURY_BILL">Treasury Bills</option>
              <option value="TREASURY_BOND">Treasury Bonds</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="closing">Sort by Closing</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </AnimatedCard>

        {/* Auctions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading auctions...</p>
          </div>
        ) : filteredAuctions && filteredAuctions.length > 0 ? (
          <div className="space-y-6">
            {filteredAuctions.map((auction, index) => (
              <AnimatedCard 
                key={auction.id}
                className="border border-border overflow-hidden"
                delay={index * 100}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {auction.security.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                          {getStatusIcon(auction.status)}
                          {auction.status.replace('_', ' ')}
                        </span>
                        {auction.status === 'OPEN' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {getTimeRemaining(auction.biddingCloseDate)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        ISIN: {auction.security.isin}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Auction ID: {auction.auctionId} • {auction.auctionType.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ₵{(auction.totalAmount / 1000000).toFixed(0)}M
                      </p>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bidding Opens</p>
                      <p className="text-sm font-medium">
                        {new Date(auction.biddingOpenDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bidding Closes</p>
                      <p className="text-sm font-medium">
                        {new Date(auction.biddingCloseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Settlement Date</p>
                      <p className="text-sm font-medium">
                        {new Date(auction.settlementDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Min/Max Bid</p>
                      <p className="text-sm font-medium">
                        ₵{auction.minBidAmount.toLocaleString()} - ₵{auction.maxBidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Results Section */}
                  {auction.results && (
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-foreground mb-3">Auction Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Average Yield</p>
                          <p className="text-sm font-medium">{auction.results.averageYield.toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Bid-to-Cover</p>
                          <p className="text-sm font-medium">{auction.results.bidToCoverRatio.toFixed(2)}x</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Bids</p>
                          <p className="text-sm font-medium">₵{(auction.results.totalBids / 1000000).toFixed(0)}M</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Marginal Price</p>
                          <p className="text-sm font-medium">₵{auction.results.marginalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Bid Section */}
                  {auction.userBid && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-foreground mb-3">Your Bid</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Reference: {auction.userBid.bidReference}</p>
                          <p className="text-sm font-medium">
                            Amount: ₵{auction.userBid.quantity.toLocaleString()}
                          </p>
                          {auction.userBid.yield && (
                            <p className="text-sm text-muted-foreground">
                              Yield: {auction.userBid.yield.toFixed(2)}%
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBidStatusColor(auction.userBid.status)}`}>
                          {auction.userBid.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {auction.status === 'OPEN' && (
                      <AnimatedButton variant="primary" className="flex-1">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Place Bid
                      </AnimatedButton>
                    )}
                    <AnimatedButton variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </AnimatedButton>
                    {auction.results && (
                      <AnimatedButton variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <AnimatedCard className="p-12 text-center border border-border">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No Treasury auctions are currently available'}
            </p>
            <AnimatedButton variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              Learn About Treasury Auctions
            </AnimatedButton>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
}
