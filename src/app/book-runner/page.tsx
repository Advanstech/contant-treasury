'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
  Calendar,
  Target,
  PieChart,
  Briefcase,
  Eye,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  UserCheck,
  Building
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface BookbuildingIssue {
  id: string;
  issueReference: string;
  issuerName: string;
  securityType: 'CORPORATE_BOND' | 'EQUITY' | 'SUKUK';
  issueName: string;
  isin: string;
  totalAmount: number;
  issuePrice: number;
  status: 'ANNOUNCED' | 'BOOKBUILDING' | 'ALLOCATED' | 'CLOSED';
  bookbuildingOpenDate: string;
  bookbuildingCloseDate: string;
  allocationDate?: string;
  totalSubscriptions: number;
  oversubscriptionRatio: number;
  institutionalAllocation: number;
  retailAllocation: number;
}

interface SyndicateMember {
  id: string;
  memberName: string;
  memberType: 'LEAD_MANAGER' | 'CO_MANAGER' | 'SELLING_AGENT';
  commitmentAmount: number;
  allocatedAmount: number;
  commissionRate: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface AllocationTranche {
  id: string;
  trancheName: string;
  trancheType: 'INSTITUTIONAL' | 'RETAIL' | 'EMPLOYEE' | 'PREFERRED';
  totalAllocation: number;
  minSubscription: number;
  maxSubscription: number;
  allocatedInvestors: number;
  utilization: number;
}

export default function BookRunnerDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookbuilding' | 'syndicate' | 'allocation' | 'reporting'>('overview');

  // Mock data - in production, fetch from Book Runner APIs
  const mockIssues: BookbuildingIssue[] = [
    {
      id: '1',
      issueReference: 'BR-ISSUE-2024-001',
      issuerName: 'Ghana Commercial Bank Ltd',
      securityType: 'CORPORATE_BOND',
      issueName: '5-Year Fixed Rate Senior Bond',
      isin: 'GHGCB5Y202401',
      totalAmount: 500000000,
      issuePrice: 100,
      status: 'BOOKBUILDING',
      bookbuildingOpenDate: '2024-11-20',
      bookbuildingCloseDate: '2024-11-27',
      totalSubscriptions: 650000000,
      oversubscriptionRatio: 1.3,
      institutionalAllocation: 350000000,
      retailAllocation: 150000000,
    },
    {
      id: '2',
      issueReference: 'BR-ISSUE-2024-002',
      issuerName: 'Ashanti Gold Mines Ltd',
      securityType: 'EQUITY',
      issueName: 'Initial Public Offering',
      isin: 'GHAGMIPO202402',
      totalAmount: 200000000,
      issuePrice: 2.50,
      status: 'ALLOCATED',
      bookbuildingOpenDate: '2024-11-15',
      bookbuildingCloseDate: '2024-11-22',
      allocationDate: '2024-11-25',
      totalSubscriptions: 280000000,
      oversubscriptionRatio: 1.4,
      institutionalAllocation: 120000000,
      retailAllocation: 80000000,
    }
  ];

  const mockSyndicateMembers: SyndicateMember[] = [
    {
      id: '1',
      memberName: 'Constant Capital Ghana Ltd',
      memberType: 'LEAD_MANAGER',
      commitmentAmount: 200000000,
      allocatedAmount: 180000000,
      commissionRate: 2.5,
      status: 'ACTIVE',
    },
    {
      id: '2',
      memberName: 'Databank Brokerage Ltd',
      memberType: 'CO_MANAGER',
      commitmentAmount: 150000000,
      allocatedAmount: 120000000,
      commissionRate: 2.0,
      status: 'ACTIVE',
    },
    {
      id: '3',
      memberName: 'Ecobank Ghana Ltd',
      memberType: 'SELLING_AGENT',
      commitmentAmount: 100000000,
      allocatedAmount: 95000000,
      commissionRate: 1.5,
      status: 'ACTIVE',
    }
  ];

  const mockAllocationTranches: AllocationTranche[] = [
    {
      id: '1',
      trancheName: 'Institutional Investors',
      trancheType: 'INSTITUTIONAL',
      totalAllocation: 350000000,
      minSubscription: 1000000,
      maxSubscription: 50000000,
      allocatedInvestors: 25,
      utilization: 85,
    },
    {
      id: '2',
      trancheName: 'Retail Investors',
      trancheType: 'RETAIL',
      totalAllocation: 150000000,
      minSubscription: 1000,
      maxSubscription: 1000000,
      allocatedInvestors: 1250,
      utilization: 92,
    }
  ];

  const { data: issues, isLoading: loadingIssues } = useQuery({
    queryKey: ['bookrunner-issues'],
    queryFn: () => Promise.resolve(mockIssues),
    enabled: !!token,
  });

  const { data: syndicateMembers, isLoading: loadingSyndicate } = useQuery({
    queryKey: ['syndicate-members'],
    queryFn: () => Promise.resolve(mockSyndicateMembers),
    enabled: !!token,
  });

  const { data: allocationTranches, isLoading: loadingTranches } = useQuery({
    queryKey: ['allocation-tranches'],
    queryFn: () => Promise.resolve(mockAllocationTranches),
    enabled: !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKBUILDING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ALLOCATED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'ANNOUNCED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'LEAD_MANAGER': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CO_MANAGER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SELLING_AGENT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard className="p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Issues</p>
              <p className="text-2xl font-bold text-foreground">{issues?.filter(i => i.status === 'BOOKBUILDING').length || 0}</p>
              <p className="text-sm text-muted-foreground">Bookbuilding open</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allocated Issues</p>
              <p className="text-2xl font-bold text-foreground">{issues?.filter(i => i.status === 'ALLOCATED').length || 0}</p>
              <p className="text-sm text-muted-foreground">Successfully allocated</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={200}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Syndicate Members</p>
              <p className="text-2xl font-bold text-foreground">{syndicateMembers?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Active partnerships</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={300}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Percent className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Oversubscription</p>
              <p className="text-2xl font-bold text-foreground">
                {issues ? (issues.reduce((acc, issue) => acc + issue.oversubscriptionRatio, 0) / issues.length).toFixed(1) : 0}x
              </p>
              <p className="text-sm text-muted-foreground">Demand ratio</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Issues */}
      <AnimatedCard className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Recent Bookbuilding Issues
        </h3>
        <div className="space-y-4">
          {issues?.slice(0, 3).map((issue) => (
            <div key={issue.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(issue.status)}`}>
                  {issue.status === 'BOOKBUILDING' && <Clock className="h-4 w-4" />}
                  {issue.status === 'ALLOCATED' && <CheckCircle className="h-4 w-4" />}
                  {issue.status === 'CLOSED' && <FileText className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{issue.issueName}</p>
                  <p className="text-sm text-muted-foreground">{issue.issuerName} • {issue.issueReference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">₵{(issue.totalAmount / 1000000).toFixed(0)}M</p>
                <p className="text-sm text-muted-foreground">{issue.oversubscriptionRatio}x oversubscribed</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

  const renderBookbuilding = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Bookbuilding Issues</h3>
        <AnimatedButton variant="primary">
          <Upload className="h-4 w-4 mr-2" />
          New Issue
        </AnimatedButton>
      </div>

      <AnimatedCard className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Issue Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Issuer & Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subscription Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bookbuilding Period
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
              {issues?.map((issue) => (
                <tr key={issue.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{issue.issueReference}</p>
                      <p className="text-xs text-muted-foreground">ISIN: {issue.isin}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{issue.issueName}</p>
                      <p className="text-xs text-muted-foreground">{issue.issuerName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">₵{(issue.totalAmount / 1000000).toFixed(0)}M</p>
                    <p className="text-xs text-muted-foreground">@ ₵{issue.issuePrice}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Subscribed: ₵{(issue.totalSubscriptions / 1000000).toFixed(0)}M</p>
                      <p className="text-muted-foreground">Oversubscription: {issue.oversubscriptionRatio}x</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-muted-foreground">{new Date(issue.bookbuildingOpenDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">to {new Date(issue.bookbuildingCloseDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </AnimatedButton>
                      {issue.status === 'BOOKBUILDING' && (
                        <AnimatedButton variant="primary">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Allocate
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

  const renderSyndicate = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Syndicate Members</h3>
        <AnimatedButton variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Manage Syndicate
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {syndicateMembers?.map((member) => (
          <AnimatedCard key={member.id} className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">{member.memberName}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemberTypeColor(member.memberType)}`}>
                {member.memberType.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Commitment</p>
                  <p className="font-medium text-foreground">₵{(member.commitmentAmount / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Allocated</p>
                  <p className="font-medium text-foreground">₵{(member.allocatedAmount / 1000000).toFixed(0)}M</p>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-muted-foreground">Commission Rate</p>
                <p className="font-medium text-foreground">{member.commissionRate}%</p>
              </div>
              
              <div className="text-sm">
                <p className="text-muted-foreground">Utilization</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(member.allocatedAmount / member.commitmentAmount) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-foreground">
                    {Math.round((member.allocatedAmount / member.commitmentAmount) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Allocation Tranches</h3>
        <AnimatedButton variant="primary">
          <PieChart className="h-4 w-4 mr-2" />
          Run Allocation
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allocationTranches?.map((tranche) => (
          <AnimatedCard key={tranche.id} className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">{tranche.trancheName}</h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tranche.trancheType}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium text-foreground">{tranche.utilization}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${tranche.utilization}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Allocation</p>
                  <p className="font-medium text-foreground">₵{(tranche.totalAllocation / 1000000).toFixed(0)}M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Investors</p>
                  <p className="font-medium text-foreground">{tranche.allocatedInvestors}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Min Subscription</p>
                  <p className="font-medium text-foreground">₵{tranche.minSubscription.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Subscription</p>
                  <p className="font-medium text-foreground">₵{tranche.maxSubscription.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Book Runner Reports</h3>
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
              <h4 className="font-semibold text-foreground">Subscription Report</h4>
              <p className="text-sm text-muted-foreground">Detailed subscription analysis</p>
            </div>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </AnimatedButton>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <PieChart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Allocation Summary</h4>
              <p className="text-sm text-muted-foreground">Investor allocation breakdown</p>
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
              <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Syndicate Performance</h4>
              <p className="text-sm text-muted-foreground">Member performance metrics</p>
            </div>
          </div>
          <AnimatedButton variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Report
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
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Book Runner Portal</h1>
              <p className="text-muted-foreground">Constant Capital Ghana - IPO & Corporate Bond Underwriting Operations</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'bookbuilding', label: 'Bookbuilding', icon: Briefcase },
              { id: 'syndicate', label: 'Syndicate Management', icon: Users },
              { id: 'allocation', label: 'Allocation', icon: PieChart },
              { id: 'reporting', label: 'Reporting', icon: FileText }
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
        {activeTab === 'bookbuilding' && renderBookbuilding()}
        {activeTab === 'syndicate' && renderSyndicate()}
        {activeTab === 'allocation' && renderAllocation()}
        {activeTab === 'reporting' && renderReporting()}
      </div>
    </div>
  );
}
