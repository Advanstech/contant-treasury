'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  Building2,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Users,
  Activity,
  Eye,
  Download,
  Upload,
  Settings,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Truck,
  Receipt,
  CreditCard,
  Building
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface SettlementBatch {
  id: string;
  batchReference: string;
  settlementDate: string;
  totalTransactions: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  csdSubmissionTime?: string;
  csdConfirmationTime?: string;
  failureReason?: string;
}

interface SafekeepingAccount {
  id: string;
  accountNumber: string;
  clientName: string;
  clientType: 'INDIVIDUAL' | 'INSTITUTION' | 'CORPORATE';
  totalHoldings: number;
  marketValue: number;
  securitiesCount: number;
  lastActivity: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

interface CorporateAction {
  id: string;
  actionReference: string;
  securityName: string;
  isin: string;
  actionType: 'COUPON_PAYMENT' | 'MATURITY' | 'CALL_OPTION' | 'BONUS_ISSUE' | 'RIGHTS_ISSUE';
  recordDate: string;
  paymentDate: string;
  totalAmount: number;
  affectedHolders: number;
  status: 'ANNOUNCED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

interface CustodyPosition {
  id: string;
  securityName: string;
  isin: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  clientName: string;
  accountNumber: string;
}

export default function CustodianDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settlement' | 'safekeeping' | 'corporate-actions' | 'reporting'>('overview');

  // Mock data - in production, fetch from Custodian APIs
  const mockSettlementBatches: SettlementBatch[] = [
    {
      id: '1',
      batchReference: 'CSD-BATCH-2024-001',
      settlementDate: '2024-11-26',
      totalTransactions: 1250,
      totalAmount: 850000000,
      status: 'COMPLETED',
      csdSubmissionTime: '2024-11-25T16:20:00Z',
      csdConfirmationTime: '2024-11-26T11:45:00Z',
    },
    {
      id: '2',
      batchReference: 'CSD-BATCH-2024-002',
      settlementDate: '2024-11-27',
      totalTransactions: 980,
      totalAmount: 620000000,
      status: 'PROCESSING',
      csdSubmissionTime: '2024-11-26T16:18:00Z',
    },
    {
      id: '3',
      batchReference: 'CSD-BATCH-2024-003',
      settlementDate: '2024-11-28',
      totalTransactions: 1450,
      totalAmount: 1200000000,
      status: 'PENDING',
    }
  ];

  const mockSafekeepingAccounts: SafekeepingAccount[] = [
    {
      id: '1',
      accountNumber: 'CSD-ACC-001234',
      clientName: 'John Smith',
      clientType: 'INDIVIDUAL',
      totalHoldings: 5000000,
      marketValue: 5125000,
      securitiesCount: 8,
      lastActivity: '2024-11-25',
      status: 'ACTIVE',
    },
    {
      id: '2',
      accountNumber: 'CSD-ACC-002345',
      clientName: 'Ghana Commercial Bank',
      clientType: 'INSTITUTION',
      totalHoldings: 50000000,
      marketValue: 51500000,
      securitiesCount: 25,
      lastActivity: '2024-11-24',
      status: 'ACTIVE',
    },
    {
      id: '3',
      accountNumber: 'CSD-ACC-003456',
      clientName: 'Ashanti Mining Ltd',
      clientType: 'CORPORATE',
      totalHoldings: 25000000,
      marketValue: 25750000,
      securitiesCount: 15,
      lastActivity: '2024-11-23',
      status: 'ACTIVE',
    }
  ];

  const mockCorporateActions: CorporateAction[] = [
    {
      id: '1',
      actionReference: 'CA-COUPON-2024-001',
      securityName: '5-Year Treasury Bond 2029',
      isin: 'GH5YB202901',
      actionType: 'COUPON_PAYMENT',
      recordDate: '2024-11-25',
      paymentDate: '2024-11-28',
      totalAmount: 12500000,
      affectedHolders: 2500,
      status: 'PROCESSING',
    },
    {
      id: '2',
      actionReference: 'CA-MATURITY-2024-002',
      securityName: '91-Day Treasury Bill',
      isin: 'GH091TB202402',
      actionType: 'MATURITY',
      recordDate: '2024-11-24',
      paymentDate: '2024-11-27',
      totalAmount: 85000000,
      affectedHolders: 1200,
      status: 'COMPLETED',
    },
    {
      id: '3',
      actionReference: 'CA-CALL-2024-003',
      securityName: '10-Year Corporate Bond',
      isin: 'GH10YCB202403',
      actionType: 'CALL_OPTION',
      recordDate: '2024-11-26',
      paymentDate: '2024-11-30',
      totalAmount: 50000000,
      affectedHolders: 180,
      status: 'ANNOUNCED',
    }
  ];

  const mockPositions: CustodyPosition[] = [
    {
      id: '1',
      securityName: '91-Day Treasury Bill',
      isin: 'GH091TB202502',
      quantity: 1000000,
      averageCost: 98.50,
      currentPrice: 99.25,
      marketValue: 992500,
      unrealizedPnL: 7500,
      clientName: 'John Smith',
      accountNumber: 'CSD-ACC-001234',
    },
    {
      id: '2',
      securityName: '2-Year Treasury Bond',
      isin: 'GH2YB202506',
      quantity: 500000,
      averageCost: 101.20,
      currentPrice: 102.15,
      marketValue: 510750,
      unrealizedPnL: 4750,
      clientName: 'John Smith',
      accountNumber: 'CSD-ACC-001234',
    }
  ];

  const { data: settlementBatches, isLoading: loadingSettlements } = useQuery({
    queryKey: ['custodian-settlements'],
    queryFn: () => Promise.resolve(mockSettlementBatches),
    enabled: !!token,
  });

  const { data: safekeepingAccounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ['custodian-accounts'],
    queryFn: () => Promise.resolve(mockSafekeepingAccounts),
    enabled: !!token,
  });

  const { data: corporateActions, isLoading: loadingActions } = useQuery({
    queryKey: ['custodian-corporate-actions'],
    queryFn: () => Promise.resolve(mockCorporateActions),
    enabled: !!token,
  });

  const { data: positions, isLoading: loadingPositions } = useQuery({
    queryKey: ['custodian-positions'],
    queryFn: () => Promise.resolve(mockPositions),
    enabled: !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ANNOUNCED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SUSPENDED': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'COUPON_PAYMENT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MATURITY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CALL_OPTION': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'BONUS_ISSUE': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'RIGHTS_ISSUE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Settlements</p>
              <p className="text-2xl font-bold text-foreground">{settlementBatches?.filter(s => s.status === 'PENDING').length || 0}</p>
              <p className="text-sm text-muted-foreground">Awaiting processing</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Settlements</p>
              <p className="text-2xl font-bold text-foreground">{settlementBatches?.filter(s => s.status === 'COMPLETED').length || 0}</p>
              <p className="text-sm text-muted-foreground">Successfully processed</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={200}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custody Accounts</p>
              <p className="text-2xl font-bold text-foreground">{safekeepingAccounts?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Active accounts</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={300}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Corporate Actions</p>
              <p className="text-2xl font-bold text-foreground">{corporateActions?.filter(ca => ca.status === 'PROCESSING').length || 0}</p>
              <p className="text-sm text-muted-foreground">Currently processing</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Activity */}
      <AnimatedCard className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Recent Custodian Activity
        </h3>
        <div className="space-y-4">
          {settlementBatches?.slice(0, 3).map((batch) => (
            <div key={batch.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(batch.status)}`}>
                  {batch.status === 'COMPLETED' && <CheckCircle className="h-4 w-4" />}
                  {batch.status === 'PROCESSING' && <Clock className="h-4 w-4" />}
                  {batch.status === 'PENDING' && <AlertCircle className="h-4 w-4" />}
                  {batch.status === 'FAILED' && <AlertCircle className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{batch.batchReference}</p>
                  <p className="text-sm text-muted-foreground">Settlement Date: {new Date(batch.settlementDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">₵{(batch.totalAmount / 1000000).toFixed(0)}M</p>
                <p className="text-sm text-muted-foreground">{batch.totalTransactions} transactions</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

  const renderSettlement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">CSD Settlement Batches</h3>
        <AnimatedButton variant="primary">
          <Upload className="h-4 w-4 mr-2" />
          Create Batch
        </AnimatedButton>
      </div>

      <AnimatedCard className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Batch Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Settlement Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  CSD Status
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
              {settlementBatches?.map((batch) => (
                <tr key={batch.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{batch.batchReference}</p>
                      {batch.csdSubmissionTime && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(batch.csdSubmissionTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">
                      {new Date(batch.settlementDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">₵{(batch.totalAmount / 1000000).toFixed(0)}M</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">{batch.totalTransactions.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {batch.csdConfirmationTime ? (
                      <div className="text-sm">
                        <p className="text-green-600">Confirmed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(batch.csdConfirmationTime).toLocaleString()}
                        </p>
                      </div>
                    ) : batch.csdSubmissionTime ? (
                      <div className="text-sm">
                        <p className="text-blue-600">Submitted</p>
                        <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Not submitted</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </AnimatedButton>
                      {batch.status === 'PENDING' && (
                        <AnimatedButton variant="primary">
                          <Upload className="h-4 w-4 mr-1" />
                          Submit to CSD
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

  const renderSafekeeping = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Safekeeping Accounts</h3>
        <AnimatedButton variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Manage Accounts
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safekeepingAccounts?.map((account) => (
          <AnimatedCard key={account.id} className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">{account.clientName}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                {account.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Account Number</p>
                <p className="font-medium text-foreground">{account.accountNumber}</p>
              </div>
              
              <div className="text-sm">
                <p className="text-muted-foreground">Client Type</p>
                <p className="font-medium text-foreground">{account.clientType}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Holdings</p>
                  <p className="font-medium text-foreground">₵{(account.totalHoldings / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Market Value</p>
                  <p className="font-medium text-foreground">₵{(account.marketValue / 1000000).toFixed(2)}M</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Securities</p>
                  <p className="font-medium text-foreground">{account.securitiesCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Activity</p>
                  <p className="font-medium text-foreground">{new Date(account.lastActivity).toLocaleDateString()}</p>
                </div>
              </div>
              
              <AnimatedButton variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Positions
              </AnimatedButton>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );

  const renderCorporateActions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Corporate Actions</h3>
        <AnimatedButton variant="primary">
          <Receipt className="h-4 w-4 mr-2" />
          Process Actions
        </AnimatedButton>
      </div>

      <AnimatedCard className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Security
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Affected Holders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment Date
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
              {corporateActions?.map((action) => (
                <tr key={action.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.actionReference}</p>
                      <p className="text-xs text-muted-foreground">Record: {new Date(action.recordDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.securityName}</p>
                      <p className="text-xs text-muted-foreground">{action.isin}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionTypeColor(action.actionType)}`}>
                      {action.actionType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">₵{(action.totalAmount / 1000000).toFixed(0)}M</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">{action.affectedHolders.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-foreground">
                      {new Date(action.paymentDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </AnimatedButton>
                      {action.status === 'ANNOUNCED' && (
                        <AnimatedButton variant="primary">
                          <Receipt className="h-4 w-4 mr-1" />
                          Process
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

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Custodian Reports</h3>
        <AnimatedButton variant="primary">
          <Download className="h-4 w-4 mr-2" />
          Generate Reports
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard className="p-6 border border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Portfolio Valuation</h4>
              <p className="text-sm text-muted-foreground">Account holdings statement</p>
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
              <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Settlement Report</h4>
              <p className="text-sm text-muted-foreground">Daily settlement status</p>
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
              <Receipt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Corporate Actions Summary</h4>
              <p className="text-sm text-muted-foreground">Monthly action processing</p>
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
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Custodian Portal</h1>
              <p className="text-muted-foreground">Constant Capital Ghana - Securities Safekeeping & Settlement Operations</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'settlement', label: 'Settlement', icon: Truck },
              { id: 'safekeeping', label: 'Safekeeping', icon: Database },
              { id: 'corporate-actions', label: 'Corporate Actions', icon: Receipt },
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
        {activeTab === 'settlement' && renderSettlement()}
        {activeTab === 'safekeeping' && renderSafekeeping()}
        {activeTab === 'corporate-actions' && renderCorporateActions()}
        {activeTab === 'reporting' && renderReporting()}
      </div>
    </div>
  );
}
