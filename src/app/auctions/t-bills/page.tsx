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
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface TreasuryBill {
  id: string;
  name: string;
  tenor: string;
  tenorDays: number;
  description: string;
  minInvestment: number;
  typicalAuctionAmount: number;
  riskLevel: 'LOW' | 'VERY_LOW';
  liquidity: 'HIGH' | 'VERY_HIGH';
  taxTreatment: string;
  currentYield?: number;
  nextAuction?: string;
  features: string[];
  suitability: string[];
}

interface UpcomingBillAuction {
  id: string;
  billType: string;
  auctionDate: string;
  settlementDate: string;
  targetAmount: number;
  status: 'SCHEDULED' | 'ANNOUNCED';
  daysUntil: number;
}

export default function TreasuryBillsPage() {
  const [bills, setBills] = useState<TreasuryBill[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<UpcomingBillAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<TreasuryBill | null>(null);

  useEffect(() => {
    fetchTreasuryBills();
    fetchUpcomingAuctions();
  }, []);

  const fetchTreasuryBills = async () => {
    try {
      // Mock data - replace with API call
      const mockBills: TreasuryBill[] = [
        {
          id: '1',
          name: '91-Day Treasury Bill',
          tenor: '91 Days',
          tenorDays: 91,
          description: 'Short-term government security with maturity of 91 days, offering competitive returns with high liquidity.',
          minInvestment: 1000,
          typicalAuctionAmount: 500000000,
          riskLevel: 'VERY_LOW',
          liquidity: 'VERY_HIGH',
          taxTreatment: 'Tax-exempt interest income',
          currentYield: 24.5,
          nextAuction: '2025-11-21',
          features: [
            'Weekly auctions',
            'High liquidity',
            'Tax-exempt returns',
            'Low minimum investment',
            'Competitive yields',
            'Government guarantee'
          ],
          suitability: [
            'Conservative investors',
            'Cash management',
            'Short-term savings goals',
            'Emergency fund allocation',
            'Portfolio diversification'
          ]
        },
        {
          id: '2',
          name: '182-Day Treasury Bill',
          tenor: '182 Days',
          tenorDays: 182,
          description: 'Medium-term government security providing higher yields than 91-day bills while maintaining excellent liquidity.',
          minInvestment: 1000,
          typicalAuctionAmount: 400000000,
          riskLevel: 'VERY_LOW',
          liquidity: 'HIGH',
          taxTreatment: 'Tax-exempt interest income',
          currentYield: 25.2,
          nextAuction: '2025-11-28',
          features: [
            'Bi-weekly auctions',
            'Higher yields than 91-day',
            'Good liquidity',
            'Tax-exempt returns',
            'Government guarantee',
            'Predictable returns'
          ],
          suitability: [
            'Medium-term savings',
            'Income generation',
            'Conservative growth',
            'Portfolio stability',
            'Retirement planning'
          ]
        },
        {
          id: '3',
          name: '364-Day Treasury Bill',
          tenor: '364 Days',
          tenorDays: 364,
          description: 'Longer-term Treasury bill offering the highest yields among T-bills with annual maturity.',
          minInvestment: 1000,
          typicalAuctionAmount: 600000000,
          riskLevel: 'VERY_LOW',
          liquidity: 'HIGH',
          taxTreatment: 'Tax-exempt interest income',
          currentYield: 26.8,
          nextAuction: '2025-12-05',
          features: [
            'Monthly auctions',
            'Highest T-bill yields',
            'Annual maturity',
            'Tax-exempt returns',
            'Government guarantee',
            'Inflation hedge potential'
          ],
          suitability: [
            'Annual investment goals',
            'Higher yield requirements',
            'Conservative investors seeking better returns',
            'Long-term cash planning',
            'Educational savings'
          ]
        }
      ];
      setBills(mockBills);
    } catch (error) {
      console.error('Failed to fetch treasury bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAuctions = async () => {
    try {
      // Mock data - replace with API call
      const mockAuctions: UpcomingBillAuction[] = [
        {
          id: '1',
          billType: '91-Day Treasury Bill',
          auctionDate: '2025-11-21',
          settlementDate: '2025-11-24',
          targetAmount: 500000000,
          status: 'ANNOUNCED',
          daysUntil: 2,
        },
        {
          id: '2',
          billType: '182-Day Treasury Bill',
          auctionDate: '2025-11-28',
          settlementDate: '2025-12-01',
          targetAmount: 400000000,
          status: 'SCHEDULED',
          daysUntil: 9,
        },
        {
          id: '3',
          billType: '364-Day Treasury Bill',
          auctionDate: '2025-12-05',
          settlementDate: '2025-12-08',
          targetAmount: 600000000,
          status: 'SCHEDULED',
          daysUntil: 16,
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
      case 'VERY_LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLiquidityColor = (level: string) => {
    switch (level) {
      case 'VERY_HIGH':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'HIGH':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
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
              Treasury Bills
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Safe, liquid government securities with tax-exempt returns
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
                <Shield className="h-5 w-5 text-primary" />
                What are Treasury Bills?
              </h2>
              <p className="text-muted-foreground mb-4">
                Treasury Bills are short-term government securities issued by the Bank of Ghana 
                to finance government operations and manage the national debt. They represent 
                one of the safest investment options available with government guarantee.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Government guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Tax-exempt interest income</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">High liquidity and safety</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-foreground">Low minimum investment (GHS 1,000)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Quick Calculator
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
                  <label className="text-sm text-muted-foreground">Select Tenor</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>91 Days</option>
                    <option>182 Days</option>
                    <option>364 Days</option>
                  </select>
                </div>
                <AnimatedButton variant="primary" className="w-full">
                  Calculate Returns
                </AnimatedButton>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Upcoming Auctions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingAuctions.map((auction, index) => (
              <AnimatedCard key={auction.id} delay={index * 100} className="p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{auction.billType}</h3>
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

        {/* Available Treasury Bills */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Treasury Bills</h2>
          <div className="space-y-6">
            {bills.map((bill, index) => (
              <AnimatedCard key={bill.id} delay={index * 100} className="p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{bill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(bill.riskLevel)}`}>
                        {bill.riskLevel} Risk
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLiquidityColor(bill.liquidity)}`}>
                        {bill.liquidity} Liquidity
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{bill.description}</p>
                    {bill.currentYield && (
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Current Yield:</span>
                        <span className="text-lg font-bold text-primary">{bill.currentYield}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tenor</p>
                    <p className="font-medium text-foreground">{bill.tenor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Min Investment</p>
                    <p className="font-medium text-foreground">{formatCurrency(bill.minInvestment)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Typical Auction</p>
                    <p className="font-medium text-foreground">{formatCurrency(bill.typicalAuctionAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tax Treatment</p>
                    <p className="font-medium text-foreground">{bill.taxTreatment}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bill.features.map((feature, idx) => (
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
                    Suitable For
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bill.suitability.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  {bill.nextAuction && (
                    <div className="text-sm text-muted-foreground">
                      <span>Next auction: </span>
                      <span className="font-medium text-foreground">{formatDate(bill.nextAuction)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <AnimatedButton 
                      variant="outline" 
                      className="text-sm"
                      onClick={() => setSelectedBill(bill)}
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Treasury Bills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">How Treasury Bills Work</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Treasury Bills are issued at a discount to face value and mature at par. 
                  The difference between the purchase price and face value represents your return.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">Example:</p>
                  <p>You buy a 91-day T-bill with face value GHS 10,000 for GHS 9,350</p>
                  <p>At maturity (91 days), you receive GHS 10,000</p>
                  <p>Your return: GHS 650 (6.95% for 91 days)</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Investment Process</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Open Account</p>
                    <p className="text-xs text-muted-foreground">Complete KYC and CSD registration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Place Bid</p>
                    <p className="text-xs text-muted-foreground">Submit competitive or non-competitive bid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Wait for Results</p>
                    <p className="text-xs text-muted-foreground">Auction results announced next business day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Settlement</p>
                    <p className="text-xs text-muted-foreground">Securities credited to your CSD account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedBill.name}
                </h2>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-muted-foreground">{selectedBill.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="font-medium">{selectedBill.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Liquidity</p>
                    <p className="font-medium">{selectedBill.liquidity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link href="/auctions/upcoming">
                    <AnimatedButton variant="primary">
                      Invest in {selectedBill.name}
                    </AnimatedButton>
                  </Link>
                  <AnimatedButton 
                    variant="outline"
                    onClick={() => setSelectedBill(null)}
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
