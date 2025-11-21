'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  ArrowUpRight,
  Clock,
  Percent,
  Award,
  AlertCircle,
  Shield,
  Download,
  ChevronRight,
  User,
  Briefcase,
  BarChart3,
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
    description: string;
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
    listingExchange: string;
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
  useOfProceeds: string[];
  riskFactors: string[];
  createdAt: string;
}

export default function CorporateBondDetailPage() {
  const { token, isAuthenticated } = useAuth();
  const params = useParams();
  const bondId = params.id as string;
  const [bidAmount, setBidAmount] = useState('');
  const [bidPrice, setBidPrice] = useState('');

  // Mock corporate bond data
  const mockCorporateBond: CorporateBond = {
    id: bondId,
    bondId: 'cb-2024-001',
    issuer: {
      name: 'Ghana Commercial Bank',
      type: 'BANK',
      industry: 'Banking',
      description: 'Ghana Commercial Bank is one of the leading financial institutions in Ghana with over 70 years of banking excellence. The bank has a strong capital base and extensive branch network across the country.',
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
      listingExchange: 'Ghana Stock Exchange',
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
    useOfProceeds: [
      'Business expansion and growth initiatives',
      'Digital transformation and technology upgrades',
      'Working capital support for lending operations',
      'Branch network expansion',
    ],
    riskFactors: [
      'Interest rate risk - bond prices may fluctuate with market interest rates',
      'Credit risk - potential deterioration of issuer\'s creditworthiness',
      'Liquidity risk - secondary market trading may be limited',
      'Inflation risk - returns may be eroded by inflation over time',
    ],
    createdAt: '2024-11-20T09:00:00Z',
  };

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

  const getDaysRemaining = (closeDate: string) => {
    const now = new Date();
    const close = new Date(closeDate);
    const diff = close.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getYearsToMaturity = (maturityDate: string) => {
    const now = new Date();
    const maturity = new Date(maturityDate);
    const diff = maturity.getTime() - now.getTime();
    const years = diff / (1000 * 60 * 60 * 24 * 365);
    return years.toFixed(1);
  };

  const calculateYield = (price: number) => {
    const years = getYearsToMaturity(mockCorporateBond.security.maturityDate);
    const coupon = mockCorporateBond.security.couponRate;
    const yield_ = (coupon + (100 - price) / parseFloat(years)) * 100 / 100;
    return yield_.toFixed(2);
  };

  const handleBidSubmission = () => {
    const amount = parseFloat(bidAmount);
    const price = parseFloat(bidPrice);
    if (amount >= mockCorporateBond.issueDetails.minimumSubscription && 
        price >= mockCorporateBond.pricing!.priceRange.min && 
        price <= mockCorporateBond.pricing!.priceRange.max) {
      // Handle bid submission logic
      console.log('Submitting bid:', { amount, price, yield: calculateYield(price) });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/auctions" className="hover:text-foreground">Auctions</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/auctions/corporate-bonds" className="hover:text-foreground">Corporate Bonds</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{mockCorporateBond.bondId}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{mockCorporateBond.bondId}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockCorporateBond.status)}`}>
                  Bookbuilding Open
                </span>
              </div>
              <p className="text-muted-foreground">
                {mockCorporateBond.security.name} issued by {mockCorporateBond.issuer.name}
              </p>
            </div>
            <Link href="/auctions/corporate-bonds">
              <AnimatedButton variant="outline">
                ← Back to Corporate Bonds
              </AnimatedButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Details */}
            <AnimatedCard className="p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bond Details
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issuer</p>
                  <p className="font-medium">{mockCorporateBond.issuer.name}</p>
                  <p className="text-sm text-muted-foreground">{mockCorporateBond.issuer.industry} • {mockCorporateBond.issuer.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security</p>
                  <p className="font-medium">{mockCorporateBond.security.name}</p>
                  <p className="text-sm text-muted-foreground">{mockCorporateBond.security.isin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Coupon Rate</p>
                  <p className="text-2xl font-bold text-green-600">{mockCorporateBond.security.couponRate}%</p>
                  <p className="text-sm text-muted-foreground">Fixed rate, paid {mockCorporateBond.issueDetails.paymentFrequency.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{mockCorporateBond.issueDetails.creditRating}</p>
                  <p className="text-sm text-muted-foreground">Investment grade rating</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maturity</p>
                  <p className="text-2xl font-bold">{getYearsToMaturity(mockCorporateBond.security.maturityDate)} years</p>
                  <p className="text-sm text-muted-foreground">{new Date(mockCorporateBond.security.maturityDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Face Value</p>
                  <p className="text-2xl font-bold">₵{mockCorporateBond.security.faceValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Per bond unit</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  About the Issuer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockCorporateBond.issuer.description}
                </p>
              </div>
            </AnimatedCard>

            {/* Bookbuilding Information */}
            {mockCorporateBond.status === 'BOOKBUILDING' && (
              <AnimatedCard className="p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Bookbuilding Information
                </h2>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                    <p className="text-lg font-bold">
                      ₵{mockCorporateBond.pricing!.priceRange.min.toFixed(2)} - ₵{mockCorporateBond.pricing!.priceRange.max.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Per ₵1,000 face value</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Yield Range</p>
                    <p className="text-lg font-bold">
                      {mockCorporateBond.pricing!.yieldRange.min.toFixed(2)}% - {mockCorporateBond.pricing!.yieldRange.max.toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Annualized yield to maturity</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bookbuilding Period</p>
                    <p className="text-lg font-bold">
                      {new Date(mockCorporateBond.bookbuildingDates!.openDate).toLocaleDateString()} - {new Date(mockCorporateBond.bookbuildingDates!.closeDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{getDaysRemaining(mockCorporateBond.bookbuildingDates!.closeDate)} days remaining</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Minimum Subscription</p>
                    <p className="text-lg font-bold">₵{mockCorporateBond.issueDetails.minimumSubscription.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Minimum investment amount</p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">How Bookbuilding Works</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Investors submit bids within the price range. Higher prices (lower yields) are given priority in allocation. The final issue price is determined based on demand.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-green-600">Higher Price</p>
                      <p className="text-muted-foreground">Lower Yield</p>
                      <p className="text-muted-foreground">Priority Allocation</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Market Price</p>
                      <p className="text-muted-foreground">Fair Yield</p>
                      <p className="text-muted-foreground">Standard Allocation</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-orange-600">Lower Price</p>
                      <p className="text-muted-foreground">Higher Yield</p>
                      <p className="text-muted-foreground">Limited Allocation</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* Use of Proceeds */}
            <AnimatedCard className="p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Use of Proceeds
              </h2>
              <ul className="space-y-3">
                {mockCorporateBond.useOfProceeds.map((proceed, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{proceed}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>

            {/* Risk Factors */}
            <AnimatedCard className="p-6 border border-border bg-red-50 dark:bg-red-900/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Risk Factors
              </h2>
              <ul className="space-y-3">
                {mockCorporateBond.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Issue Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-green-600">Bookbuilding</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Issue Size</span>
                  <span className="text-sm font-medium">₵{(mockCorporateBond.issueDetails.issueSize / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Remaining</span>
                  <span className="text-sm font-medium">{getDaysRemaining(mockCorporateBond.bookbuildingDates!.closeDate)} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exchange</span>
                  <span className="text-sm font-medium">{mockCorporateBond.issueDetails.listingExchange}</span>
                </div>
              </div>
            </AnimatedCard>

            {/* Bid Calculator */}
            {mockCorporateBond.status === 'BOOKBUILDING' && (
              <AnimatedCard className="p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Bid Calculator
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Amount (₵)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={mockCorporateBond.issueDetails.minimumSubscription}
                      step={1000}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Min: ₵${mockCorporateBond.issueDetails.minimumSubscription.toLocaleString()}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bid Price (₵)</label>
                    <input
                      type="number"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(e.target.value)}
                      min={mockCorporateBond.pricing!.priceRange.min}
                      max={mockCorporateBond.pricing!.priceRange.max}
                      step={0.01}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`${mockCorporateBond.pricing!.priceRange.min.toFixed(2)} - ${mockCorporateBond.pricing!.priceRange.max.toFixed(2)}`}
                    />
                  </div>

                  {bidAmount && bidPrice && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Number of Bonds</p>
                          <p className="font-medium">{Math.floor(parseFloat(bidAmount) / (parseFloat(bidPrice) * 1000))}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Yield to Maturity</p>
                          <p className="font-medium">{calculateYield(parseFloat(bidPrice))}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            )}

            {/* Actions */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Actions
              </h3>
              <div className="space-y-3">
                {mockCorporateBond.status === 'BOOKBUILDING' ? (
                  isAuthenticated ? (
                    <>
                      <AnimatedButton 
                        variant="primary" 
                        className="w-full"
                        onClick={handleBidSubmission}
                        disabled={!bidAmount || !bidPrice || parseFloat(bidAmount) < mockCorporateBond.issueDetails.minimumSubscription}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Submit Bid
                      </AnimatedButton>
                      <AnimatedButton variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Prospectus
                      </AnimatedButton>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <AnimatedButton variant="primary" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Sign In to Bid
                        </AnimatedButton>
                      </Link>
                      <AnimatedButton variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Information
                      </AnimatedButton>
                    </>
                  )
                ) : mockCorporateBond.status === 'LISTED' ? (
                  <>
                    <AnimatedButton variant="primary" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trade on Exchange
                    </AnimatedButton>
                    <AnimatedButton variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Market Data
                    </AnimatedButton>
                  </>
                ) : (
                  <AnimatedButton variant="outline" className="w-full" disabled>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Bookbuilding Closed
                  </AnimatedButton>
                )}
              </div>
            </AnimatedCard>

            {/* Key Information */}
            <AnimatedCard className="p-6 border border-border bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Key Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Frequency</span>
                  <span className="font-medium">{mockCorporateBond.issueDetails.paymentFrequency.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing</span>
                  <span className="font-medium">{mockCorporateBond.issueDetails.listingExchange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Type</span>
                  <span className="font-medium">Senior Unsecured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Governing Law</span>
                  <span className="font-medium">Ghanaian Law</span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
