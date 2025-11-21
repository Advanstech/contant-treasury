'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Eye,
  Building2,
  Users,
  BarChart3,
  Download,
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

export default function AuctionDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  // Mock auction data - in real app, this would come from BoG compliance APIs
  const mockAuction: Auction = {
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
  };

  const { data: auction, isLoading, error } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => {
      // In real app, fetch from API
      if (auctionId === '1') return Promise.resolve(mockAuction);
      return Promise.reject(new Error('Auction not found'));
    },
    enabled: !!token && !!auctionId,
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <AnimatedCard className="p-12 text-center border border-border">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Auction Not Found</h3>
            <p className="text-muted-foreground mb-6">
              The auction you're looking for doesn't exist or has been removed.
            </p>
            <AnimatedButton variant="primary" onClick={() => router.push('/auctions')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </AnimatedButton>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  if (isLoading || !auction) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading auction details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <AnimatedButton variant="outline" onClick={() => router.push('/auctions')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </AnimatedButton>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {auction.security.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                  {getStatusIcon(auction.status)}
                  {auction.status.replace('_', ' ')}
                </span>
                {auction.status === 'OPEN' && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {getTimeRemaining(auction.biddingCloseDate)}
                  </span>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-1">
                ISIN: {auction.security.isin}
              </p>
              <p className="text-sm text-muted-foreground">
                Auction ID: {auction.auctionId} • {auction.auctionType.replace('_', ' ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                ₵{(auction.totalAmount / 1000000).toFixed(0)}M
              </p>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Details */}
            <AnimatedCard className="p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Auction Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security Type</p>
                  <p className="font-medium">{auction.security.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maturity Date</p>
                  <p className="font-medium">
                    {new Date(auction.security.maturityDate).toLocaleDateString()}
                  </p>
                </div>
                {auction.security.couponRate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coupon Rate</p>
                    <p className="font-medium">{auction.security.couponRate}%</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Auction Type</p>
                  <p className="font-medium">{auction.auctionType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Announcement Date</p>
                  <p className="font-medium">
                    {new Date(auction.announcementDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bidding Opens</p>
                  <p className="font-medium">
                    {new Date(auction.biddingOpenDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bidding Closes</p>
                  <p className="font-medium">
                    {new Date(auction.biddingCloseDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Settlement Date</p>
                  <p className="font-medium">
                    {new Date(auction.settlementDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Minimum Bid</p>
                  <p className="font-medium">₵{auction.minBidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maximum Bid</p>
                  <p className="font-medium">₵{auction.maxBidAmount.toLocaleString()}</p>
                </div>
              </div>
              {auction.priceRange && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Price Range</p>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">₵{auction.priceRange.min.toFixed(2)}</span>
                    <span className="text-muted-foreground">to</span>
                    <span className="font-medium">₵{auction.priceRange.max.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </AnimatedCard>

            {/* Auction Results */}
            {auction.results && (
              <AnimatedCard className="p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Auction Results
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Yield</p>
                    <p className="text-lg font-semibold">{auction.results.averageYield.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bid-to-Cover Ratio</p>
                    <p className="text-lg font-semibold">{auction.results.bidToCoverRatio.toFixed(2)}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
                    <p className="text-lg font-semibold">₵{(auction.results.totalBids / 1000000).toFixed(0)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Marginal Price</p>
                    <p className="text-lg font-semibold">₵{auction.results.marginalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Published Date</p>
                  <p className="font-medium">
                    {new Date(auction.results.publishedDate).toLocaleDateString()}
                  </p>
                </div>
              </AnimatedCard>
            )}

            {/* Your Bid */}
            {auction.userBid && (
              <AnimatedCard className="p-6 border border-border bg-blue-50 dark:bg-blue-900/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Bid
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reference</p>
                    <p className="font-medium">{auction.userBid.bidReference}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBidStatusColor(auction.userBid.status)}`}>
                    {auction.userBid.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bid Amount</p>
                    <p className="font-medium">₵{auction.userBid.quantity.toLocaleString()}</p>
                  </div>
                  {auction.userBid.price && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bid Price</p>
                      <p className="font-medium">₵{auction.userBid.price.toFixed(2)}</p>
                    </div>
                  )}
                  {auction.userBid.yield && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bid Yield</p>
                      <p className="font-medium">{auction.userBid.yield.toFixed(2)}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="font-medium">
                      {new Date(auction.userBid.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {auction.status === 'OPEN' && (
                  <AnimatedButton variant="primary" className="w-full">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Place Bid
                  </AnimatedButton>
                )}
                <AnimatedButton variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Prospectus
                </AnimatedButton>
                {auction.results && (
                  <AnimatedButton variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Results
                  </AnimatedButton>
                )}
              </div>
            </AnimatedCard>

            {/* Key Information */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4">Key Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Issuer</p>
                    <p className="font-medium">Bank of Ghana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Currency</p>
                    <p className="font-medium">GHS (₵)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Settlement</p>
                    <p className="font-medium">T+1</p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
