'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle, Filter, ArrowUpRight, DollarSign, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface UpcomingAuction {
  id: string;
  auctionCode: string;
  securityName: string;
  securityType: 'TREASURY_BILL' | 'GOVERNMENT_BOND';
  auctionDate: string;
  settlementDate: string;
  announcementDate: string;
  targetAmount: number;
  status: 'SCHEDULED' | 'ANNOUNCED';
  daysUntilAuction: number;
  tenor: string;
  cusip: string;
}

export default function UpcomingAuctionsPage() {
  const [auctions, setAuctions] = useState<UpcomingAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');

  useEffect(() => {
    fetchUpcomingAuctions();
  }, []);

  const fetchUpcomingAuctions = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockAuctions: UpcomingAuction[] = [
        {
          id: '1',
          auctionCode: 'GHA-TB-091-2025-Q4',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-11-21',
          settlementDate: '2025-11-24',
          announcementDate: '2025-11-14',
          targetAmount: 500000000,
          status: 'ANNOUNCED',
          daysUntilAuction: 2,
          tenor: '91 Days',
          cusip: 'GHA000123456',
        },
        {
          id: '2',
          auctionCode: 'GHA-TB-182-2025-Q4',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-11-28',
          settlementDate: '2025-12-01',
          announcementDate: '2025-11-21',
          targetAmount: 400000000,
          status: 'SCHEDULED',
          daysUntilAuction: 9,
          tenor: '182 Days',
          cusip: 'GHA000123457',
        },
        {
          id: '3',
          auctionCode: 'GHA-TB-364-2025-Q4',
          securityName: '364-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-12-05',
          settlementDate: '2025-12-08',
          announcementDate: '2025-11-28',
          targetAmount: 600000000,
          status: 'SCHEDULED',
          daysUntilAuction: 16,
          tenor: '364 Days',
          cusip: 'GHA000123458',
        },
        {
          id: '4',
          auctionCode: 'GHA-BD-002-2025-Q4',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-12-12',
          settlementDate: '2025-12-15',
          announcementDate: '2025-12-05',
          targetAmount: 750000000,
          status: 'SCHEDULED',
          daysUntilAuction: 23,
          tenor: '2 Years',
          cusip: 'GHA000123459',
        },
        {
          id: '5',
          auctionCode: 'GHA-BD-003-2025-Q4',
          securityName: '3-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-12-19',
          settlementDate: '2025-12-22',
          announcementDate: '2025-12-12',
          targetAmount: 500000000,
          status: 'SCHEDULED',
          daysUntilAuction: 30,
          tenor: '3 Years',
          cusip: 'GHA000123460',
        },
      ];
      setAuctions(mockAuctions);
    } catch (error) {
      console.error('Failed to fetch upcoming auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = auctions.filter(auction => {
    return !filterType || auction.securityType === filterType;
  });

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
      weekday: 'short',
    });
  };

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 3) return 'text-red-600 dark:text-red-400';
    if (daysUntil <= 7) return 'text-orange-600 dark:text-orange-400';
    if (daysUntil <= 14) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getUrgencyBg = (daysUntil: number) => {
    if (daysUntil <= 3) return 'bg-red-100 dark:bg-red-900/20';
    if (daysUntil <= 7) return 'bg-orange-100 dark:bg-orange-900/20';
    if (daysUntil <= 14) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };

  const getSecurityTypeColor = (type: string) => {
    switch (type) {
      case 'TREASURY_BILL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'GOVERNMENT_BOND':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ANNOUNCED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
              Upcoming Treasury Auctions
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Stay ahead of the market with Bank of Ghana's scheduled Treasury auctions
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Auctions</p>
                <p className="text-2xl font-bold text-foreground">{filteredAuctions.length}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Auction</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredAuctions.length > 0 ? filteredAuctions[0].daysUntilAuction : 0} days
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Target</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(filteredAuctions.reduce((sum, a) => sum + a.targetAmount, 0))}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="TREASURY_BILL">Treasury Bills</option>
              <option value="GOVERNMENT_BOND">Government Bonds</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAuctions.length} auction{filteredAuctions.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading auction data...</p>
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No upcoming auctions found
            </h3>
            <p className="text-muted-foreground">
              Check back later for new auction announcements.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAuctions.map((auction, index) => (
              <AnimatedCard key={auction.id} delay={index * 50} className="p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {auction.securityName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityTypeColor(auction.securityType)}`}>
                        {auction.securityType.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {auction.auctionCode} • CUSIP: {auction.cusip}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Auction Date</p>
                        <p className="font-medium text-foreground">
                          {formatDate(auction.auctionDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Settlement Date</p>
                        <p className="font-medium text-foreground">
                          {formatDate(auction.settlementDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Target Amount</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(auction.targetAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Tenor</p>
                        <p className="font-medium text-foreground">{auction.tenor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getUrgencyBg(auction.daysUntilAuction)}`}>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${getUrgencyColor(auction.daysUntilAuction)}`}>
                          {auction.daysUntilAuction}
                        </p>
                        <p className={`text-xs ${getUrgencyColor(auction.daysUntilAuction)}`}>
                          days
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Until auction</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Announced: {formatDate(auction.announcementDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/auctions/${auction.id}`}>
                      <AnimatedButton variant="outline" className="text-sm">
                        View Details
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </AnimatedButton>
                    </Link>
                    {auction.status === 'ANNOUNCED' && (
                      <AnimatedButton variant="primary" className="text-sm">
                        Place Bid
                        <TrendingUp className="h-3 w-3 ml-1" />
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                About Treasury Auctions
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                The Bank of Ghana conducts regular Treasury auctions to finance government operations 
                and manage the national debt. Auctions are typically held weekly for Treasury bills 
                and monthly for government bonds.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">Competitive Bidding</p>
                  <p className="text-muted-foreground">
                    Submit bids with your desired yield rate. Allocation is based on competitive rates.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Non-Competitive Bidding</p>
                  <p className="text-muted-foreground">
                    Guaranteed allocation at the weighted average rate for smaller investors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
