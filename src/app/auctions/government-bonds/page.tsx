'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Shield, 
  Calculator, 
  FileText, 
  ArrowUpRight, 
  CheckCircle,
  Info,
  Calendar,
  BarChart3,
  Award,
  PiggyBank
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface GovernmentBond {
  id: string;
  name: string;
  tenor: string;
  tenorYears: number;
  description: string;
  minInvestment: number;
  typicalAuctionAmount: number;
  riskLevel: 'LOW' | 'MODERATE';
  liquidity: 'MEDIUM' | 'HIGH';
  couponRate?: number;
  currentYield?: number;
  paymentFrequency: string;
  taxTreatment: string;
  nextAuction?: string;
  features: string[];
  suitability: string[];
  benefits: string[];
}

interface UpcomingBondAuction {
  id: string;
  bondType: string;
  auctionDate: string;
  settlementDate: string;
  targetAmount: number;
  status: 'SCHEDULED' | 'ANNOUNCED';
  daysUntil: number;
  couponRate?: number;
}

export default function GovernmentBondsPage() {
  const [bonds, setBonds] = useState<GovernmentBond[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<UpcomingBondAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBond, setSelectedBond] = useState<GovernmentBond | null>(null);

  useEffect(() => {
    fetchGovernmentBonds();
    fetchUpcomingAuctions();
  }, []);

  const fetchGovernmentBonds = async () => {
    try {
      // Mock data - replace with API call
      const mockBonds: GovernmentBond[] = [
        {
          id: '1',
          name: '2-Year Government Bond',
          tenor: '2 Years',
          tenorYears: 2,
          description: 'Medium-term government security offering regular semi-annual coupon payments with capital protection.',
          minInvestment: 5000,
          typicalAuctionAmount: 750000000,
          riskLevel: 'LOW',
          liquidity: 'MEDIUM',
          couponRate: 23.5,
          currentYield: 24.2,
          paymentFrequency: 'Semi-annual',
          taxTreatment: 'Tax-exempt coupon income',
          nextAuction: '2025-12-05',
          features: [
            'Fixed coupon payments',
            'Semi-annual interest payments',
            'Government guarantee',
            'Capital protection at maturity',
            'Secondary market trading',
            'Predictable income stream'
          ],
          suitability: [
            'Income-focused investors',
            'Retirement planning',
            'Medium-term financial goals',
            'Conservative portfolio allocation',
            'Regular income requirements'
          ],
          benefits: [
            'Regular income stream',
            'Higher yields than T-bills',
            'Capital preservation',
            'Inflation protection potential',
            'Portfolio diversification'
          ]
        },
        {
          id: '2',
          name: '3-Year Government Bond',
          tenor: '3 Years',
          tenorYears: 3,
          description: 'Longer-term government security providing attractive yields with regular coupon payments and excellent credit quality.',
          minInvestment: 5000,
          typicalAuctionAmount: 500000000,
          riskLevel: 'LOW',
          liquidity: 'MEDIUM',
          couponRate: 24.5,
          currentYield: 25.1,
          paymentFrequency: 'Semi-annual',
          taxTreatment: 'Tax-exempt coupon income',
          nextAuction: '2025-12-12',
          features: [
            'Fixed coupon payments',
            'Semi-annual interest payments',
            'Government guarantee',
            'Longer-term investment horizon',
            'Secondary market liquidity',
            'Attractive risk-adjusted returns'
          ],
          suitability: [
            'Long-term investors',
            'Income generation',
            'Portfolio stability',
            'Conservative growth objectives',
            'Retirement planning'
          ],
          benefits: [
            'Higher yields than shorter bonds',
            'Regular predictable income',
            'Government credit quality',
            'Inflation hedge potential',
            'Long-term capital preservation'
          ]
        },
        {
          id: '3',
          name: '5-Year Government Bond',
          tenor: '5 Years',
          tenorYears: 5,
          description: 'Strategic long-term government security offering competitive yields with regular income and capital appreciation potential.',
          minInvestment: 10000,
          typicalAuctionAmount: 600000000,
          riskLevel: 'LOW',
          liquidity: 'MEDIUM',
          couponRate: 25.5,
          currentYield: 26.0,
          paymentFrequency: 'Semi-annual',
          taxTreatment: 'Tax-exempt coupon income',
          nextAuction: '2025-12-19',
          features: [
            'Fixed coupon payments',
            'Semi-annual interest payments',
            'Government guarantee',
            'Long-term investment horizon',
            'Secondary market trading',
            'Strategic asset allocation tool'
          ],
          suitability: [
            'Long-term financial planning',
            'Retirement portfolio building',
            'Institutional investors',
            'Conservative long-term growth',
            'Income and capital balance'
          ],
          benefits: [
            'Highest yields among government bonds',
            'Long-term income stability',
            'Capital preservation with growth',
            'Portfolio duration management',
            'Inflation protection'
          ]
        },
        {
          id: '4',
          name: '10-Year Government Bond',
          tenor: '10 Years',
          tenorYears: 10,
          description: 'Strategic long-term government security for institutional investors seeking stable long-term returns and portfolio diversification.',
          minInvestment: 50000,
          typicalAuctionAmount: 400000000,
          riskLevel: 'LOW',
          liquidity: 'LOW',
          couponRate: 26.5,
          currentYield: 27.0,
          paymentFrequency: 'Semi-annual',
          taxTreatment: 'Tax-exempt coupon income',
          nextAuction: '2025-12-26',
          features: [
            'Fixed coupon payments',
            'Semi-annual interest payments',
            'Government guarantee',
            'Very long-term horizon',
            'Institutional grade security',
            'Strategic portfolio component'
          ],
          suitability: [
            'Institutional investors',
            'Pension funds',
            'Insurance companies',
            'Long-term fund managers',
            'Strategic asset allocation'
          ],
          benefits: [
            'Long-term yield premium',
            'Portfolio duration extension',
            'Liability matching',
            'Strategic asset allocation',
            'Government credit protection'
          ]
        }
      ];
      setBonds(mockBonds);
    } catch (error) {
      console.error('Failed to fetch government bonds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAuctions = async () => {
    try {
      // Mock data - replace with API call
      const mockAuctions: UpcomingBondAuction[] = [
        {
          id: '1',
          bondType: '2-Year Government Bond',
          auctionDate: '2025-12-05',
          settlementDate: '2025-12-08',
          targetAmount: 750000000,
          status: 'SCHEDULED',
          daysUntil: 16,
          couponRate: 23.5,
        },
        {
          id: '2',
          bondType: '3-Year Government Bond',
          auctionDate: '2025-12-12',
          settlementDate: '2025-12-15',
          targetAmount: 500000000,
          status: 'SCHEDULED',
          daysUntil: 23,
          couponRate: 24.5,
        },
        {
          id: '3',
          bondType: '5-Year Government Bond',
          auctionDate: '2025-12-19',
          settlementDate: '2025-12-22',
          targetAmount: 600000000,
          status: 'SCHEDULED',
          daysUntil: 30,
          couponRate: 25.5,
        }
      ];
      setUpcomingAuctions(mockAuctions);
    } catch (error) {
      console.error('Failed to fetch upcoming auctions:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLiquidityColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MEDIUM':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'LOW':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
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
              Government Bonds
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Long-term government securities with regular coupon payments
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview */}
        <AnimatedCard className="p-8 border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                What are Government Bonds?
              </h2>
              <p className="text-muted-foreground mb-4">
                Government Bonds are long-term debt securities issued by the Bank of Ghana 
                to finance government development projects and manage the national debt. 
                They provide regular coupon payments and return principal at maturity.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Fixed coupon payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Tax-exempt coupon income</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Government guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Secondary market trading</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Investment Calculator
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Investment Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Select Bond</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>2-Year Bond (23.5% coupon)</option>
                    <option>3-Year Bond (24.5% coupon)</option>
                    <option>5-Year Bond (25.5% coupon)</option>
                    <option>10-Year Bond (26.5% coupon)</option>
                  </select>
                </div>
                <AnimatedButton variant="primary" className="w-full">
                  Calculate Returns
                </AnimatedButton>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Benefits Overview */}
        <AnimatedCard className="p-6 border border-border mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Why Invest in Government Bonds?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Stable Income</h3>
              <p className="text-sm text-muted-foreground">
                Regular semi-annual coupon payments provide predictable income stream
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Capital Safety</h3>
              <p className="text-sm text-muted-foreground">
                Government guarantee ensures return of principal at maturity
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Higher Yields</h3>
              <p className="text-sm text-muted-foreground">
                Better returns than Treasury bills with longer investment horizon
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Portfolio Diversification</h3>
              <p className="text-sm text-muted-foreground">
                Adds stability and reduces overall portfolio risk
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Upcoming Auctions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Bond Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAuctions.map((auction, index) => (
              <AnimatedCard key={auction.id} delay={index * 100} className="p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{auction.bondType}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    auction.status === 'ANNOUNCED' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {auction.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auction Date:</span>
                    <span className="font-medium">{formatDate(auction.auctionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settlement:</span>
                    <span className="font-medium">{formatDate(auction.settlementDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">{formatCurrency(auction.targetAmount)}</span>
                  </div>
                  {auction.couponRate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coupon:</span>
                      <span className="font-medium">{auction.couponRate}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {auction.daysUntil} days until auction
                  </span>
                  <Link href="/auctions/upcoming">
                    <AnimatedButton variant="outline" className="text-sm">
                      View Details
                    </AnimatedButton>
                  </Link>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Available Government Bonds */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Government Bonds</h2>
          <div className="space-y-6">
            {bonds.map((bond, index) => (
              <AnimatedCard key={bond.id} delay={index * 100} className="p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{bond.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(bond.riskLevel)}`}>
                        {bond.riskLevel} Risk
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLiquidityColor(bond.liquidity)}`}>
                        {bond.liquidity} Liquidity
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{bond.description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      {bond.couponRate && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Coupon:</span>
                          <span className="text-lg font-bold text-primary">{bond.couponRate}%</span>
                        </div>
                      )}
                      {bond.currentYield && (
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">Current Yield:</span>
                          <span className="text-lg font-bold text-green-600">{bond.currentYield}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tenor</p>
                    <p className="font-medium text-foreground">{bond.tenor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Min Investment</p>
                    <p className="font-medium text-foreground">{formatCurrency(bond.minInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Freq.</p>
                    <p className="font-medium text-foreground">{bond.paymentFrequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tax Treatment</p>
                    <p className="font-medium text-foreground">{bond.taxTreatment}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bond.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Investment Benefits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bond.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {bond.nextAuction && (
                    <div className="text-sm text-muted-foreground">
                      <span>Next auction: </span>
                      <span className="font-medium text-foreground">{formatDate(bond.nextAuction)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <AnimatedButton 
                      variant="outline" 
                      className="text-sm"
                      onClick={() => setSelectedBond(bond)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Learn More
                    </AnimatedButton>
                    <Link href="/auctions/upcoming">
                      <AnimatedButton variant="primary" className="text-sm">
                        Invest Now
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Educational Content */}
        <AnimatedCard className="p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Government Bonds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">How Bonds Work</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Government Bonds pay regular coupon (interest) payments semi-annually and return 
                  the principal amount at maturity. They are issued at face value and can be 
                  traded in the secondary market.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">Example:</p>
                  <p>You buy a 2-year bond with face value GHS 10,000 and 23.5% coupon</p>
                  <p>You receive GHS 1,175 every 6 months (23.5% annual rate)</p>
                  <p>Total income over 2 years: GHS 4,700 + GHS 10,000 principal</p>
                  <p>Effective annual yield: ~24.2%</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Bond Investment Strategy</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Determine Time Horizon</p>
                    <p className="text-xs text-muted-foreground">Match bond tenor to your investment goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Assess Income Needs</p>
                    <p className="text-xs text-muted-foreground">Consider coupon payment frequency and amount</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Participate in Auction</p>
                    <p className="text-xs text-muted-foreground">Place competitive or non-competitive bids</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Hold or Trade</p>
                    <p className="text-xs text-muted-foreground">Hold to maturity or trade in secondary market</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Bond Detail Modal */}
      {selectedBond && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedBond.name}
                </h2>
                <button
                  onClick={() => setSelectedBond(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-muted-foreground">{selectedBond.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="font-medium">{selectedBond.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Liquidity</p>
                    <p className="font-medium">{selectedBond.liquidity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link href="/auctions/upcoming">
                    <AnimatedButton variant="primary">
                      Invest in {selectedBond.name}
                    </AnimatedButton>
                  </Link>
                  <AnimatedButton 
                    variant="outline"
                    onClick={() => setSelectedBond(null)}
                  >
                    Close
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
