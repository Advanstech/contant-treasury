'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Eye,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  User,
  Building2,
  FileText,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedStatCard, AnimatedButton } from '@/components/ui/animated-card';

interface Transaction {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: string;
  type: 'BID' | 'TRADE' | 'ALLOCATION' | 'SETTLEMENT' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'COMPLETED';
  security?: {
    symbol: string;
    name: string;
    type: string;
  };
  details: {
    amount?: number;
    quantity?: number;
    price?: number;
    yield?: number;
    reference?: string;
    description?: string;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  complianceFlags: string[];
  location?: string;
  device?: string;
}

interface TransactionStats {
  totalTransactions: number;
  activeUsers: number;
  totalVolume: number;
  pendingTransactions: number;
  failedTransactions: number;
  highRiskTransactions: number;
  avgTransactionValue: number;
  peakHour: string;
}

export default function AdminTransactionsPage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (isAuthenticated && (hasRole('ADMIN') || hasRole('SUPER_ADMIN'))) {
      fetchTransactionData();
      const interval = setInterval(() => {
        if (autoRefresh) {
          fetchTransactionData();
        }
      }, 3000); // Refresh every 3 seconds for live simulation
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, autoRefresh]);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      
      // Mock transaction data for live simulation
      const mockTransactions: Transaction[] = [
        {
          id: 'txn_001',
          timestamp: new Date().toISOString(),
          userId: 'user_001',
          userEmail: 'investor1@constantcap.com.gh',
          userName: 'Kwame Asante',
          userRole: 'RETAIL',
          type: 'BID',
          status: 'EXECUTED',
          security: {
            symbol: 'GHA-TB-091',
            name: '91-Day Treasury Bill',
            type: 'TREASURY_BILL'
          },
          details: {
            amount: 1000000,
            quantity: 100000,
            price: 98.75,
            yield: 5.2,
            reference: 'BID-2024-001'
          },
          riskLevel: 'LOW',
          complianceFlags: [],
          location: 'Accra, Ghana',
          device: 'Web Browser'
        },
        {
          id: 'txn_002',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          userId: 'user_002',
          userEmail: 'pd_bank@constantcap.com.gh',
          userName: 'Primary Dealer Bank',
          userRole: 'PRIMARY_DEALER',
          type: 'BID',
          status: 'PENDING',
          security: {
            symbol: 'GHA-BD-002',
            name: '2-Year Government Bond',
            type: 'GOVERNMENT_BOND'
          },
          details: {
            amount: 50000000,
            quantity: 50000,
            price: 101.25,
            yield: 24.2,
            reference: 'BID-2024-002'
          },
          riskLevel: 'MEDIUM',
          complianceFlags: ['LARGE_AMOUNT'],
          location: 'Accra, Ghana',
          device: 'API'
        },
        {
          id: 'txn_003',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          userId: 'user_003',
          userEmail: 'corporate@company.com.gh',
          userName: 'Corporate Investor Ltd',
          userRole: 'INSTITUTIONAL',
          type: 'TRADE',
          status: 'EXECUTED',
          security: {
            symbol: 'GHA-CB-GCB',
            name: 'Ghana Commercial Bank 5Y Bond',
            type: 'CORPORATE_BOND'
          },
          details: {
            amount: 2500000,
            quantity: 25000,
            price: 99.85,
            yield: 18.6,
            reference: 'TRADE-2024-001'
          },
          riskLevel: 'LOW',
          complianceFlags: [],
          location: 'Tema, Ghana',
          device: 'Mobile App'
        },
        {
          id: 'txn_004',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          userId: 'user_004',
          userEmail: 'trader@constantcap.com.gh',
          userName: 'John Trader',
          userRole: 'TRADER',
          type: 'ALLOCATION',
          status: 'COMPLETED',
          security: {
            symbol: 'GHA-TB-182',
            name: '182-Day Treasury Bill',
            type: 'TREASURY_BILL'
          },
          details: {
            amount: 2000000,
            quantity: 200000,
            reference: 'ALLOC-2024-001',
            description: 'Auction allocation successful'
          },
          riskLevel: 'LOW',
          complianceFlags: [],
          location: 'Accra, Ghana',
          device: 'Web Browser'
        },
        {
          id: 'txn_005',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          userId: 'user_005',
          userEmail: 'suspicious@unknown.com',
          userName: 'Unknown User',
          userRole: 'RETAIL',
          type: 'BID',
          status: 'FAILED',
          security: {
            symbol: 'GHA-CB-MTN',
            name: 'MTN Ghana 10Y Bond',
            type: 'CORPORATE_BOND'
          },
          details: {
            amount: 10000000,
            quantity: 10000,
            price: 98.45,
            reference: 'BID-2024-005',
            description: 'Insufficient funds'
          },
          riskLevel: 'HIGH',
          complianceFlags: ['SUSPICIOUS_ACTIVITY', 'FAILED_TRANSACTION'],
          location: 'Unknown Location',
          device: 'Unknown Device'
        }
      ];

      // Mock stats
      const mockStats: TransactionStats = {
        totalTransactions: 1247,
        activeUsers: 89,
        totalVolume: 450000000,
        pendingTransactions: 23,
        failedTransactions: 12,
        highRiskTransactions: 5,
        avgTransactionValue: 360800,
        peakHour: '14:30'
      };

      setTransactions(mockTransactions);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || transaction.status === filterStatus;
    const matchesRisk = filterRisk === 'ALL' || transaction.riskLevel === filterRisk;
    return matchesSearch && matchesType && matchesStatus && matchesRisk;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BID': return <TrendingUp className="h-4 w-4" />;
      case 'TRADE': return <Activity className="h-4 w-4" />;
      case 'ALLOCATION': return <CheckCircle className="h-4 w-4" />;
      case 'SETTLEMENT': return <DollarSign className="h-4 w-4" />;
      case 'DEPOSIT': return <ArrowUpRight className="h-4 w-4" />;
      case 'WITHDRAWAL': return <ArrowDownRight className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated || !hasRole('ADMIN') && !hasRole('SUPER_ADMIN')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Admin access required to view transactions</p>
          <Link href="/admin">
            <AnimatedButton variant="primary">Back to Admin</AnimatedButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                Live Transaction Monitor
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring of all user transactions and trading activity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Live' : 'Paused'}
              </button>
              <AnimatedButton variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatedStatCard
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              change={{ value: '+127 today', type: 'increase' }}
              icon={<Activity className="h-5 w-5 text-white" />}
              delay={0}
            />
            <AnimatedStatCard
              title="Active Users"
              value={stats.activeUsers}
              change={{ value: '+12 today', type: 'increase' }}
              icon={<Users className="h-5 w-5 text-white" />}
              delay={100}
            />
            <AnimatedStatCard
              title="Total Volume"
              value={formatCurrency(stats.totalVolume)}
              change={{ value: '+₵45M today', type: 'increase' }}
              icon={<DollarSign className="h-5 w-5 text-white" />}
              delay={200}
            />
            <AnimatedStatCard
              title="Pending"
              value={stats.pendingTransactions}
              change={{ value: 'Need attention', type: 'neutral' }}
              icon={<Clock className="h-5 w-5 text-white" />}
              delay={300}
            />
          </div>
        )}

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by user, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Types</option>
              <option value="BID">Bids</option>
              <option value="TRADE">Trades</option>
              <option value="ALLOCATION">Allocations</option>
              <option value="SETTLEMENT">Settlements</option>
              <option value="DEPOSIT">Deposits</option>
              <option value="WITHDRAWAL">Withdrawals</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="EXECUTED">Executed</option>
              <option value="FAILED">Failed</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>
        </AnimatedCard>

        {/* Transactions Table */}
        <AnimatedCard className="border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Live Transaction Feed
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{formatTime(transaction.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{transaction.userName}</div>
                          <div className="text-xs text-muted-foreground">{transaction.userEmail}</div>
                          <div className="text-xs text-muted-foreground">{transaction.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="text-sm font-medium text-foreground">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {transaction.security ? (
                        <div>
                          <div className="text-sm font-medium text-foreground">{transaction.security.symbol}</div>
                          <div className="text-xs text-muted-foreground">{transaction.security.name}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {transaction.details.amount ? formatCurrency(transaction.details.amount) : 'N/A'}
                      </div>
                      {transaction.details.quantity && (
                        <div className="text-xs text-muted-foreground">
                          Qty: {transaction.details.quantity.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(transaction.riskLevel)}`}>
                        {transaction.riskLevel}
                      </span>
                      {transaction.complianceFlags.length > 0 && (
                        <div className="mt-1">
                          <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Transaction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono">{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span>{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(selectedTransaction.riskLevel)}`}>
                      {selectedTransaction.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">User Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedTransaction.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedTransaction.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{selectedTransaction.userRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{selectedTransaction.location || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device:</span>
                    <span>{selectedTransaction.device || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedTransaction.security && (
              <div className="mt-6">
                <h4 className="font-medium text-foreground mb-2">Security Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span>{selectedTransaction.security.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{selectedTransaction.security.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{selectedTransaction.security.type}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="font-medium text-foreground mb-2">Transaction Details</h4>
              <div className="space-y-2 text-sm">
                {selectedTransaction.details.amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span>{formatCurrency(selectedTransaction.details.amount)}</span>
                  </div>
                )}
                {selectedTransaction.details.quantity && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{selectedTransaction.details.quantity.toLocaleString()}</span>
                  </div>
                )}
                {selectedTransaction.details.price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span>₵{selectedTransaction.details.price.toFixed(2)}</span>
                  </div>
                )}
                {selectedTransaction.details.yield && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yield:</span>
                    <span>{selectedTransaction.details.yield}%</span>
                  </div>
                )}
                {selectedTransaction.details.reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-mono">{selectedTransaction.details.reference}</span>
                  </div>
                )}
                {selectedTransaction.details.description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span>{selectedTransaction.details.description}</span>
                  </div>
                )}
              </div>
            </div>
            
            {selectedTransaction.complianceFlags.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Compliance Flags
                </h4>
                <div className="space-y-1">
                  {selectedTransaction.complianceFlags.map((flag, index) => (
                    <span key={index} className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded mr-2 mb-1">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-6">
              <AnimatedButton variant="primary">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </AnimatedButton>
              <AnimatedButton variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Contract
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
