'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  ArrowUpRight,
  Clock,
  Building2,
  Percent,
  AlertCircle,
  Shield,
  Download,
  ChevronRight,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface RepoOperation {
  id: string;
  repoId: string;
  security: {
    name: string;
    isin: string;
    type: 'TREASURY_BILL' | 'TREASURY_BOND';
    maturityDate: string;
  };
  repoRate: number;
  haircutPercent: number;
  totalAmount: number;
  availableAmount: number;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'ACTIVE' | 'MATURED' | 'CLOSED';
  counterparty: string;
  minInvestment: number;
  description: string;
  terms: string[];
  createdAt: string;
}

export default function RepoDetailPage() {
  const { token, isAuthenticated } = useAuth();
  const params = useParams();
  const repoId = params.id as string;
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Mock repo operation data
  const mockRepoOperation: RepoOperation = {
    id: repoId,
    repoId: 'repo-2024-001',
    security: {
      name: '91-Day Treasury Bill',
      isin: 'GH091TB202502',
      type: 'TREASURY_BILL',
      maturityDate: '2025-04-15',
    },
    repoRate: 15.5,
    haircutPercent: 2.0,
    totalAmount: 100000000,
    availableAmount: 75000000,
    startDate: '2024-11-20',
    endDate: '2024-11-27',
    status: 'OPEN',
    counterparty: 'Bank of Ghana',
    minInvestment: 50000,
    description: 'This repurchase agreement offers investors the opportunity to provide short-term financing to Bank of Ghana using high-quality government treasury bills as collateral. The transaction provides attractive returns with minimal credit risk due to the government security backing.',
    terms: [
      'Minimum investment: ₵50,000',
      'Term: 7 days from start date',
      'Collateral: 91-Day Treasury Bill (GH091TB202502)',
      'Haircut: 2% (collateral value exceeds cash provided)',
      'Settlement: T+0 (same day)',
      'Early termination not permitted',
    ],
    createdAt: '2024-11-20T09:00:00Z',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MATURED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateReturns = (amount: number) => {
    const days = getDaysRemaining(mockRepoOperation.endDate);
    const returns = amount * (mockRepoOperation.repoRate / 100) * (days / 365);
    return returns;
  };

  const handleInvestment = () => {
    const amount = parseFloat(investmentAmount);
    if (amount >= mockRepoOperation.minInvestment && amount <= mockRepoOperation.availableAmount) {
      // Handle investment logic
      console.log('Investing:', amount);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/auctions" className="hover:text-foreground">Auctions</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/auctions/repo" className="hover:text-foreground">Repo Operations</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{mockRepoOperation.repoId}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{mockRepoOperation.repoId}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockRepoOperation.status)}`}>
                  Open for Participation
                </span>
              </div>
              <p className="text-muted-foreground">
                Repurchase agreement with {mockRepoOperation.counterparty}
              </p>
            </div>
            <Link href="/auctions/repo">
              <AnimatedButton variant="outline">
                ← Back to Repo Operations
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
                <TrendingUp className="h-5 w-5" />
                Transaction Details
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security</p>
                  <p className="font-medium">{mockRepoOperation.security.name}</p>
                  <p className="text-sm text-muted-foreground">{mockRepoOperation.security.isin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Counterparty</p>
                  <p className="font-medium">{mockRepoOperation.counterparty}</p>
                  <p className="text-sm text-muted-foreground">Regulated Financial Institution</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Repo Rate</p>
                  <p className="text-2xl font-bold text-green-600">{mockRepoOperation.repoRate}%</p>
                  <p className="text-sm text-muted-foreground">Annualized return</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Haircut</p>
                  <p className="text-2xl font-bold">{mockRepoOperation.haircutPercent}%</p>
                  <p className="text-sm text-muted-foreground">Collateral protection</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Term</p>
                  <p className="text-2xl font-bold">{getDaysRemaining(mockRepoOperation.endDate)} days</p>
                  <p className="text-sm text-muted-foreground">From {new Date(mockRepoOperation.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maturity</p>
                  <p className="text-2xl font-bold">{new Date(mockRepoOperation.security.maturityDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Underlying security</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Transaction Description
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockRepoOperation.description}
                </p>
              </div>
            </AnimatedCard>

            {/* Terms & Conditions */}
            <AnimatedCard className="p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Terms & Conditions
              </h2>
              <ul className="space-y-3">
                {mockRepoOperation.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{term}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>

            {/* Investment Calculator */}
            {mockRepoOperation.status === 'OPEN' && (
              <AnimatedCard className="p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Investment Calculator
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Amount (₵)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      min={mockRepoOperation.minInvestment}
                      max={mockRepoOperation.availableAmount}
                      step={1000}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Min: ₵${mockRepoOperation.minInvestment.toLocaleString()}`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: ₵{mockRepoOperation.availableAmount.toLocaleString()}
                    </p>
                  </div>

                  {investmentAmount && parseFloat(investmentAmount) >= mockRepoOperation.minInvestment && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Estimated Returns</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Principal Amount</p>
                          <p className="text-lg font-bold">₵{parseFloat(investmentAmount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Earned</p>
                          <p className="text-lg font-bold text-green-600">
                            ₵{calculateReturns(parseFloat(investmentAmount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Return</p>
                          <p className="text-lg font-bold">
                            ₵{(parseFloat(investmentAmount) + calculateReturns(parseFloat(investmentAmount))).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Effective Yield</p>
                          <p className="text-lg font-bold text-green-600">{mockRepoOperation.repoRate}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Participation Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-green-600">Open</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Amount</span>
                  <span className="text-sm font-medium">₵{(mockRepoOperation.availableAmount / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Remaining</span>
                  <span className="text-sm font-medium">{getDaysRemaining(mockRepoOperation.endDate)} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min Investment</span>
                  <span className="text-sm font-medium">₵{mockRepoOperation.minInvestment.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subscribed</span>
                  <span className="font-medium">
                    {((mockRepoOperation.totalAmount - mockRepoOperation.availableAmount) / mockRepoOperation.totalAmount * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(mockRepoOperation.totalAmount - mockRepoOperation.availableAmount) / mockRepoOperation.totalAmount * 100}%` }}
                  />
                </div>
              </div>
            </AnimatedCard>

            {/* Actions */}
            <AnimatedCard className="p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Actions
              </h3>
              <div className="space-y-3">
                {mockRepoOperation.status === 'OPEN' ? (
                  isAuthenticated ? (
                    <>
                      <AnimatedButton 
                        variant="primary" 
                        className="w-full"
                        onClick={handleInvestment}
                        disabled={!investmentAmount || parseFloat(investmentAmount) < mockRepoOperation.minInvestment}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Participate Now
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
                          Sign In to Participate
                        </AnimatedButton>
                      </Link>
                      <AnimatedButton variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Information
                      </AnimatedButton>
                    </>
                  )
                ) : (
                  <AnimatedButton variant="outline" className="w-full" disabled>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Participation Closed
                  </AnimatedButton>
                )}
              </div>
            </AnimatedCard>

            {/* Risk Information */}
            <AnimatedCard className="p-6 border border-border bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Risk Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>• Government securities provide high credit quality</p>
                <p>• Haircut provides additional protection against collateral value fluctuations</p>
                <p>• Short-term nature reduces interest rate risk</p>
                <p>• Regulated counterparty with strong oversight</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
