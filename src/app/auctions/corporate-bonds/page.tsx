'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  Clock,
  Percent,
  Award,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

interface CorporateBond {
  id: string;
  bondId: string;
  issuer: {
    name: string;
    type: 'BANK' | 'CORPORATE' | 'GOVERNMENT_AGENCY';
    industry?: string;
    logo?: string;
  };
  security: {
    name: string;
    isin: string;
    couponRate: number;
    maturityDate: string;
    faceValue: number;
  };
  issueDetails: {
    issueSize: number;
    issueDate: string;
    minimumSubscription: number;
    paymentFrequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY';
    creditRating: string;
  };
  status: 'ANNOUNCED' | 'BOOKBUILDING' | 'ALLOTTED' | 'LISTED' | 'MATURED';
  bookbuildingDates?: {
    openDate: string;
    closeDate: string;
  };
  pricing?: {
    priceRange: {
      min: number;
      max: number;
    };
    yieldRange: {
      min: number;
      max: number;
    };
  };
  createdAt: string;
}

export default function CorporateBondsPage() {
  const { token, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ANNOUNCED' | 'BOOKBUILDING' | 'ALLOTTED' | 'LISTED' | 'MATURED'>('all');
  const [issuerFilter, setIssuerFilter] = useState<'all' | 'BANK' | 'CORPORATE' | 'GOVERNMENT_AGENCY'>('all');

  // Mock corporate bonds data
  const mockCorporateBonds: CorporateBond[] = [
    {
      id: '1',
      bondId: 'cb-2024-001',
      issuer: {
        name: 'Ghana Commercial Bank',
        type: 'BANK',
        industry: 'Banking',
      },
      security: {
        name: '5-Year Senior Unsecured Bond',
        isin: 'GHGCB2029',
        couponRate: 18.5,
        maturityDate: '2029-11-20',
        faceValue: 1000,
      },
      issueDetails: {
        issueSize: 200000000,
        issueDate: '2024-11-20',
        minimumSubscription: 50000,
        paymentFrequency: 'SEMI_ANNUAL',
        creditRating: 'A-',
      },
      status: 'BOOKBUILDING',
      bookbuildingDates: {
        openDate: '2024-11-20',
        closeDate: '2024-11-27',
      },
      pricing: {
        priceRange: {
          min: 98.50,
          max: 101.50,
        },
        yieldRange: {
          min: 17.8,
          max: 19.2,
        },
      },
      createdAt: '2024-11-20T09:00:00Z',
    },
    {
      id: '2',
      bondId: 'cb-2024-002',
      issuer: {
        name: 'Ghana Cocoa Board',
        type: 'GOVERNMENT_AGENCY',
        industry: 'Agriculture',
      },
      security: {
        name: '7-Year Fixed Rate Bond',
        isin: 'GHCOCB2031',
        couponRate: 19.0,
        maturityDate: '2031-12-15',
        faceValue: 1000,
      },
      issueDetails: {
        issueSize: 150000000,
        issueDate: '2024-11-15',
        minimumSubscription: 25000,
        paymentFrequency: 'ANNUAL',
        creditRating: 'BBB+',
      },
      status: 'ALLOTTED',
      createdAt: '2024-11-15T10:30:00Z',
    },
    {
      id: '3',
      bondId: 'cb-2024-003',
      issuer: {
        name: 'MTN Ghana',
        type: 'CORPORATE',
        industry: 'Telecommunications',
      },
      security: {
        name: '10-Year Senior Secured Bond',
        isin: 'GHMTN2034',
        couponRate: 20.5,
        maturityDate: '2034-06-30',
        faceValue: 1000,
      },
      issueDetails: {
        issueSize: 300000000,
        issueDate: '2024-11-10',
        minimumSubscription: 100000,
        paymentFrequency: 'SEMI_ANNUAL',
        creditRating: 'BBB',
      },
      status: 'LISTED',
      createdAt: '2024-11-10T14:20:00Z',
    },
    {
      id: '4',
      bondId: 'cb-2024-004',
      issuer: {
        name: 'Ecobank Ghana',
        type: 'BANK',
        industry: 'Banking',
      },
      security: {
        name: '3-Year Tier 2 Bond',
        isin: 'GHECOB2027',
        couponRate: 17.75,
        maturityDate: '2027-09-30',
        faceValue: 1000,
      },
      issueDetails: {
        issueSize: 100000000,
        issueDate: '2024-11-25',
        minimumSubscription: 10000,
        paymentFrequency: 'ANNUAL',
        creditRating: 'BBB-',
      },
      status: 'ANNOUNCED',
      bookbuildingDates: {
        openDate: '2024-11-25',
        closeDate: '2024-12-02',
      },
      pricing: {
        priceRange: {
          min: 99.00,
          max: 102.00,
        },
        yieldRange: {
          min: 16.5,
          max: 18.5,
        },
      },
      createdAt: '2024-11-25T11:00:00Z',
    },
  ];

  const filteredBonds = mockCorporateBonds.filter(bond => {
    const matchesSearch = !searchQuery || 
      bond.bondId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bond.security.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bond.issuer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bond.status === statusFilter;
    const matchesIssuer = issuerFilter === 'all' || bond.issuer.type === issuerFilter;
    return matchesSearch && matchesStatus && matchesIssuer;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ANNOUNCED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'BOOKBUILDING': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ALLOTTED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LISTED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'MATURED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ANNOUNCED': return <Calendar className="h-4 w-4" />;
      case 'BOOKBUILDING': return <TrendingUp className="h-4 w-4" />;
      case 'ALLOTTED': return <Award className="h-4 w-4" />;
      case 'LISTED': return <Building2 className="h-4 w-4" />;
      case 'MATURED': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getIssuerTypeColor = (type: string) => {
    switch (type) {
      case 'BANK': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CORPORATE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'GOVERNMENT_AGENCY': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDaysRemaining = (closeDate: string) => {
    const now = new Date();
    const close = new Date(closeDate);
    const diff = close.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Closed';
  };

  const getCreditRatingColor = (rating: string) => {
    if (rating.startsWith('AAA') || rating.startsWith('AA') || rating.startsWith('A')) {
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    } else if (rating.startsWith('BBB')) {
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    } else {
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Corporate Bonds</h1>
              <p className="text-muted-foreground">
                Invest in corporate debt securities from Ghana's leading companies and institutions
              </p>
            </div>
            {isAuthenticated && (
              <AnimatedButton variant="primary">
                <Briefcase className="h-4 w-4 mr-2" />
                My Bond Portfolio
              </AnimatedButton>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Issuers</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(mockCorporateBonds.map(b => b.issuer.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Active corporates</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Issue Size</p>
                <p className="text-2xl font-bold text-foreground">
                  ₵{(mockCorporateBonds.reduce((sum, bond) => sum + bond.issueDetails.issueSize, 0) / 1000000).toFixed(0)}M
                </p>
                <p className="text-sm text-muted-foreground">Across all bonds</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bookbuilding Open</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockCorporateBonds.filter(b => b.status === 'BOOKBUILDING').length}
                </p>
                <p className="text-sm text-muted-foreground">Currently accepting bids</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listed Bonds</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockCorporateBonds.filter(b => b.status === 'LISTED').length}
                </p>
                <p className="text-sm text-muted-foreground">Trading on exchange</p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <input
                type="text"
                placeholder="Search corporate bonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="ANNOUNCED">Announced</option>
              <option value="BOOKBUILDING">Bookbuilding</option>
              <option value="ALLOTTED">Allotted</option>
              <option value="LISTED">Listed</option>
              <option value="MATURED">Matured</option>
            </select>
            <select
              value={issuerFilter}
              onChange={(e) => setIssuerFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Issuer Types</option>
              <option value="BANK">Banks</option>
              <option value="CORPORATE">Corporates</option>
              <option value="GOVERNMENT_AGENCY">Government Agencies</option>
            </select>
            <AnimatedButton variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Corporate Bonds List */}
        {filteredBonds.length > 0 ? (
          <div className="space-y-6">
            {filteredBonds.map((bond, index) => (
              <AnimatedCard 
                key={bond.id}
                className="border border-border overflow-hidden hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {bond.security.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bond.status)}`}>
                          {getStatusIcon(bond.status)}
                          {bond.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIssuerTypeColor(bond.issuer.type)}`}>
                          {bond.issuer.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Issuer: {bond.issuer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bond ID: {bond.bondId} • ISIN: {bond.security.isin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ₵{(bond.issueDetails.issueSize / 1000000).toFixed(0)}M
                      </p>
                      <p className="text-sm text-muted-foreground">Issue Size</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Coupon Rate</p>
                      <p className="text-sm font-semibold text-green-600">{bond.security.couponRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Credit Rating</p>
                      <p className={`text-sm font-medium px-2 py-1 rounded ${getCreditRatingColor(bond.issueDetails.creditRating)}`}>
                        {bond.issueDetails.creditRating}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Maturity</p>
                      <p className="text-sm font-medium">
                        {new Date(bond.security.maturityDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Min Subscription</p>
                      <p className="text-sm font-medium">₵{bond.issueDetails.minimumSubscription.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Bookbuilding Dates */}
                  {bond.bookbuildingDates && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Bookbuilding Period
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Opens</p>
                          <p className="text-sm font-medium">
                            {new Date(bond.bookbuildingDates.openDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Closes in</p>
                          <p className="text-sm font-medium text-blue-600">
                            {getDaysRemaining(bond.bookbuildingDates.closeDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Range */}
                  {bond.pricing && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Percent className="h-4 w-4 text-green-600" />
                        Pricing Range
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                          <p className="text-sm font-medium">
                            ₵{bond.pricing.priceRange.min.toFixed(2)} - ₵{bond.pricing.priceRange.max.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Yield Range</p>
                          <p className="text-sm font-medium">
                            {bond.pricing.yieldRange.min.toFixed(2)}% - {bond.pricing.yieldRange.max.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Link href={`/auctions/corporate-bonds/${bond.id}`}>
                      <AnimatedButton variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </AnimatedButton>
                    </Link>
                    {bond.status === 'BOOKBUILDING' ? (
                      isAuthenticated ? (
                        <AnimatedButton variant="primary" className="flex-1">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Place Bid
                        </AnimatedButton>
                      ) : (
                        <Link href="/login">
                          <AnimatedButton variant="primary" className="flex-1">
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Sign In to Bid
                          </AnimatedButton>
                        </Link>
                      )
                    ) : bond.status === 'LISTED' ? (
                      <AnimatedButton variant="primary" className="flex-1">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trade on Exchange
                      </AnimatedButton>
                    ) : null}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <AnimatedCard className="p-12 text-center border border-border">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No corporate bonds found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' || issuerFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No corporate bond issuances are currently available'}
            </p>
            <AnimatedButton variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Bond Calendar
            </AnimatedButton>
          </AnimatedCard>
        )}

        {/* Educational Section */}
        <AnimatedCard className="mt-8 p-6 border border-border bg-purple-50 dark:bg-purple-900/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Understanding Corporate Bonds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">What are Corporate Bonds?</h4>
              <p className="text-sm text-muted-foreground">
                Debt securities issued by companies to raise capital for expansion, operations, or other business needs. Investors receive regular interest payments.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Bookbuilding Process</h4>
              <p className="text-sm text-muted-foreground">
                Investors submit bids within the price/yield range. The issuer allocates bonds based on bid prices, typically favoring higher bids for better yields.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Risk & Returns</h4>
              <p className="text-sm text-muted-foreground">
                Higher yields than government securities but with credit risk. Credit ratings help assess the issuer's ability to meet payment obligations.
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
