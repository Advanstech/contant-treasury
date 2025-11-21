'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Clock,
  FileText,
  BarChart3,
  Users,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Upload,
  Settings,
  Calendar,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface PdSubmission {
  id: string;
  submissionReference: string;
  auctionId: string;
  auctionTitle: string;
  securityType: 'TREASURY_BILL' | 'TREASURY_BOND';
  totalAmount: number;
  competitiveBids: number;
  nonCompetitiveBids: number;
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt?: string;
  submittedBy?: string;
  bogReference?: string;
}

interface PositionLimit {
  id: string;
  securityType: 'TREASURY_BILL' | 'TREASURY_BOND';
  limit: number;
  current: number;
  utilization: number;
  status: 'HEALTHY' | 'WARNING' | 'BREACH';
}

interface MarketMakingObligation {
  id: string;
  security: string;
  isin: string;
  minBidSize: number;
  maxBidSize: number;
  requiredSpread: number;
  currentSpread: number;
  compliance: 'COMPLIANT' | 'BREACH' | 'WARNING';
}

export default function PrimaryDealerDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'limits' | 'market-making' | 'reporting'>('overview');

  // Mock data - in production, fetch from PD APIs
  const mockSubmissions: PdSubmission[] = [
    {
      id: '1',
      submissionReference: 'PD-SUB-2024-001',
      auctionId: 'bog-2024-006',
      auctionTitle: '91-Day Treasury Bill',
      securityType: 'TREASURY_BILL',
      totalAmount: 250000000,
      competitiveBids: 180000000,
      nonCompetitiveBids: 70000000,
      status: 'SUBMITTED',
      submittedAt: '2024-11-20T14:30:00Z',
      submittedBy: 'John Smith',
      bogReference: 'BOG-PD-2024-001'
    },
    {
      id: '2',
      submissionReference: 'PD-SUB-2024-002',
      auctionId: 'bog-2024-007',
      auctionTitle: '2-Year Treasury Bond',
      securityType: 'TREASURY_BOND',
      totalAmount: 500000000,
      competitiveBids: 400000000,
      nonCompetitiveBids: 100000000,
      status: 'ACCEPTED',
      submittedAt: '2024-11-19T16:45:00Z',
      submittedBy: 'Jane Doe',
      bogReference: 'BOG-PD-2024-002'
    }
  ];

  const mockPositionLimits: PositionLimit[] = [
    {
      id: '1',
      securityType: 'TREASURY_BILL',
      limit: 1000000000,
      current: 750000000,
      utilization: 75,
      status: 'WARNING'
    },
    {
      id: '2',
      securityType: 'TREASURY_BOND',
      limit: 2000000000,
      current: 1200000000,
      utilization: 60,
      status: 'HEALTHY'
    }
  ];

  const mockMarketMaking: MarketMakingObligation[] = [
    {
      id: '1',
      security: '91-Day Treasury Bill',
      isin: 'GH091TB202502',
      minBidSize: 50000000,
      maxBidSize: 500000000,
      requiredSpread: 0.25,
      currentSpread: 0.20,
      compliance: 'COMPLIANT'
    },
    {
      id: '2',
      security: '2-Year Treasury Bond',
      isin: 'GH2YB202506',
      minBidSize: 100000000,
      maxBidSize: 1000000000,
      requiredSpread: 0.50,
      currentSpread: 0.60,
      compliance: 'BREACH'
    }
  ];

  const { data: submissions, isLoading: loadingSubmissions } = useQuery({
    queryKey: ['pd-submissions'],
    queryFn: () => Promise.resolve(mockSubmissions),
    enabled: !!token,
  });

  const { data: positionLimits, isLoading: loadingLimits } = useQuery({
    queryKey: ['pd-position-limits'],
    queryFn: () => Promise.resolve(mockPositionLimits),
    enabled: !!token,
  });

  const { data: marketMaking, isLoading: loadingMarketMaking } = useQuery({
    queryKey: ['pd-market-making'],
    queryFn: () => Promise.resolve(mockMarketMaking),
    enabled: !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'DRAFT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'HEALTHY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'BREACH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLIANT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard className="p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Submissions</p>
              <p className="text-2xl font-bold text-foreground">{submissions?.filter(s => s.status === 'SUBMITTED').length || 0}</p>
              <p className="text-sm text-muted-foreground">Pending BoG response</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accepted Bids</p>
              <p className="text-2xl font-bold text-foreground">{submissions?.filter(s => s.status === 'ACCEPTED').length || 0}</p>
              <p className="text-sm text-muted-foreground">Successfully allocated</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={200}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position Utilization</p>
              <p className="text-2xl font-bold text-foreground">
                {positionLimits ? Math.round(positionLimits.reduce((acc, limit) => acc + limit.utilization, 0) / positionLimits.length) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Average across securities</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={300}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Market Making</p>
              <p className="text-2xl font-bold text-foreground">{marketMaking?.filter(m => m.compliance === 'COMPLIANT').length || 0}/{marketMaking?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Compliant obligations</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Activity */}
      <AnimatedCard className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {submissions?.slice(0, 3).map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(submission.status)}`}>
                  {submission.status === 'SUBMITTED' && <Clock className="h-4 w-4" />}
                  {submission.status === 'ACCEPTED' && <CheckCircle className="h-4 w-4" />}
                  {submission.status === 'REJECTED' && <AlertCircle className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{submission.auctionTitle}</p>
                  <p className="text-sm text-muted-foreground">{submission.submissionReference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">₵{(submission.totalAmount / 1000000).toFixed(0)}M</p>
                <p className="text-sm text-muted-foreground">{submission.status}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">PD Submissions</h3>
        <AnimatedButton variant="primary">
          <Upload className="h-4 w-4 mr-2" />
          New Submission
        </AnimatedButton>
      </div>

      <AnimatedCard className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Submission Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Auction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bid Composition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {submissions?.map((submission) => (
                <tr key={submission.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{submission.submissionReference}</p>
                      <p className="text-xs text-muted-foreground">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Draft'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{submission.auctionTitle}</p>
                      <p className="text-xs text-muted-foreground">{submission.auctionId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">₵{(submission.totalAmount / 1000000).toFixed(0)}M</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Competitive: ₵{(submission.competitiveBids / 1000000).toFixed(0)}M</p>
                      <p className="text-muted-foreground">Non-Competitive: ₵{(submission.nonCompetitiveBids / 1000000).toFixed(0)}M</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </AnimatedButton>
                      {submission.status === 'DRAFT' && (
                        <AnimatedButton variant="primary" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Submit
                        </AnimatedButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderPositionLimits = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Position Limits</h3>
        <AnimatedButton variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Limits
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {positionLimits?.map((limit) => (
          <AnimatedCard key={limit.id} className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">{limit.securityType.replace('_', ' ')}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(limit.status)}`}>
                {limit.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className={`font-medium ${getUtilizationColor(limit.utilization)}`}>
                    {limit.utilization}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      limit.utilization >= 90 ? 'bg-red-500' :
                      limit.utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${limit.utilization}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Position</p>
                  <p className="font-medium text-foreground">₵{(limit.current / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Limit</p>
                  <p className="font-medium text-foreground">₵{(limit.limit / 1000000).toFixed(0)}M</p>
                </div>
              </div>
              
              {limit.status !== 'HEALTHY' && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      {limit.status === 'WARNING' ? 'Approaching Limit' : 'Limit Breached'}
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {limit.status === 'WARNING' 
                        ? 'Consider reducing positions or requesting limit increase'
                        : 'Immediate action required - positions exceed regulatory limits'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderMarketMaking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Market Making Obligations</h3>
        <AnimatedButton variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Obligations
        </AnimatedButton>
      </div>

      <AnimatedCard className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Security
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ISIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bid Size Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Spread Requirement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Current Spread
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Compliance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {marketMaking?.map((obligation) => (
                <tr key={obligation.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">{obligation.security}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-muted-foreground">{obligation.isin}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-muted-foreground">
                      ₵{(obligation.minBidSize / 1000000).toFixed(0)}M - ₵{(obligation.maxBidSize / 1000000).toFixed(0)}M
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-muted-foreground">{obligation.requiredSpread}%</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm font-medium ${
                      obligation.currentSpread <= obligation.requiredSpread ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {obligation.currentSpread}%
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(obligation.compliance)}`}>
                      {obligation.compliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">BoG Regulatory Reporting</h3>
        <AnimatedButton variant="primary">
          <Download className="h-4 w-4 mr-2" />
          Generate Reports
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard className="p-6 border border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Daily Position Report</h4>
              <p className="text-sm text-muted-foreground">Required by BoG</p>
            </div>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </AnimatedButton>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Weekly Trading Summary</h4>
              <p className="text-sm text-muted-foreground">Market activity</p>
            </div>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </AnimatedButton>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={200}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Compliance Certificate</h4>
              <p className="text-sm text-muted-foreground">Monthly certification</p>
            </div>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Generate Certificate
          </AnimatedButton>
        </AnimatedCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Primary Dealer Portal</h1>
              <p className="text-muted-foreground">Constant Capital Ghana - BoG Licensed Primary Dealer Operations</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'submissions', label: 'PD Submissions', icon: Upload },
              { id: 'limits', label: 'Position Limits', icon: Target },
              { id: 'market-making', label: 'Market Making', icon: Zap },
              { id: 'reporting', label: 'Regulatory Reporting', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'submissions' && renderSubmissions()}
        {activeTab === 'limits' && renderPositionLimits()}
        {activeTab === 'market-making' && renderMarketMaking()}
        {activeTab === 'reporting' && renderReporting()}
      </div>
    </div>
  );
}
