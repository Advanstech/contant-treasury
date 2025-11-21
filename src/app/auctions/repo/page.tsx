'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  Clock,
  Building2,
  Percent,
  AlertCircle,
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
  createdAt: string;
}

export default function RepoOperationsPage() {
  const { token, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'OPEN' | 'ACTIVE' | 'MATURED' | 'CLOSED'>('all');

  // Mock repo operations data
  const mockRepoOperations: RepoOperation[] = [
    {
      id: '1',
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
      createdAt: '2024-11-20T09:00:00Z',
    },
    {
      id: '2',
      repoId: 'repo-2024-002',
      security: {
        name: '182-Day Treasury Bill',
        isin: 'GH182TB202505',
        type: 'TREASURY_BILL',
        maturityDate: '2025-06-20',
      },
      repoRate: 16.2,
      haircutPercent: 3.0,
      totalAmount: 50000000,
      availableAmount: 25000000,
      startDate: '2024-11-18',
      endDate: '2024-11-25',
      status: 'OPEN',
      counterparty: 'Standard Chartered Bank',
      minInvestment: 25000,
      createdAt: '2024-11-18T10:30:00Z',
    },
    {
      id: '3',
      repoId: 'repo-2024-003',
      security: {
        name: '364-Day Treasury Bill',
        isin: 'GH364TB202512',
        type: 'TREASURY_BILL',
        maturityDate: '2025-12-20',
      },
      repoRate: 17.8,
      haircutPercent: 5.0,
      totalAmount: 75000000,
      availableAmount: 0,
      startDate: '2024-11-15',
      endDate: '2024-11-22',
      status: 'ACTIVE',
      counterparty: 'Ghana Commercial Bank',
      minInvestment: 100000,
      createdAt: '2024-11-15T14:20:00Z',
    },
  ];

  const filteredOperations = mockRepoOperations.filter(operation => {
    const matchesSearch = !searchQuery || 
      operation.repoId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operation.security.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operation.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || operation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MATURED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="h-4 w-4" />;
      case 'ACTIVE': return <TrendingUp className="h-4 w-4" />;
      case 'MATURED': return <Calendar className="h-4 w-4" />;
      case 'CLOSED': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Expired';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Repo Operations</h1>
              <p className="text-muted-foreground">
                Participate in repurchase agreement transactions with government securities as collateral
              </p>
            </div>
            {isAuthenticated && (
              <AnimatedButton variant="primary">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                View My Repo Positions
              </AnimatedButton>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open for Participation</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockRepoOperations.filter(op => op.status === 'OPEN').length}
                </p>
                <p className="text-sm text-muted-foreground">Available repos</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Available</p>
                <p className="text-2xl font-bold text-foreground">
                  ₵{(mockRepoOperations.reduce((sum, op) => sum + op.availableAmount, 0) / 1000000).toFixed(0)}M
                </p>
                <p className="text-sm text-muted-foreground">Across all repos</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Repo Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {(mockRepoOperations.reduce((sum, op) => sum + op.repoRate, 0) / mockRepoOperations.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Current market rate</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Counterparties</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(mockRepoOperations.map(op => op.counterparty)).size}
                </p>
                <p className="text-sm text-muted-foreground">Participating institutions</p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <input
                type="text"
                placeholder="Search repo operations..."
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
              <option value="OPEN">Open for Participation</option>
              <option value="ACTIVE">Active</option>
              <option value="MATURED">Matured</option>
              <option value="CLOSED">Closed</option>
            </select>
            <AnimatedButton variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Repo Operations List */}
        {filteredOperations.length > 0 ? (
          <div className="space-y-6">
            {filteredOperations.map((operation, index) => (
              <AnimatedCard 
                key={operation.id}
                className="border border-border overflow-hidden hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {operation.repoId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
                          {getStatusIcon(operation.status)}
                          {operation.status === 'OPEN' ? 'Open for Participation' : operation.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Security: {operation.security.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ISIN: {operation.security.isin} • Counterparty: {operation.counterparty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ₵{(operation.availableAmount / 1000000).toFixed(0)}M
                      </p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Repo Rate</p>
                      <p className="text-sm font-semibold text-green-600">{operation.repoRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Haircut</p>
                      <p className="text-sm font-medium">{operation.haircutPercent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Min Investment</p>
                      <p className="text-sm font-medium">₵{operation.minInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Term</p>
                      <p className="text-sm font-medium">{getDaysRemaining(operation.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Maturity</p>
                      <p className="text-sm font-medium">
                        {new Date(operation.security.maturityDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Participation Progress</span>
                      <span className="font-medium">
                        {((operation.totalAmount - operation.availableAmount) / operation.totalAmount * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(operation.totalAmount - operation.availableAmount) / operation.totalAmount * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/auctions/repo/${operation.id}`}>
                      <AnimatedButton variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </AnimatedButton>
                    </Link>
                    {operation.status === 'OPEN' && operation.availableAmount > 0 && (
                      <>
                        {isAuthenticated ? (
                          <AnimatedButton variant="primary" className="flex-1">
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Participate
                          </AnimatedButton>
                        ) : (
                          <Link href="/login">
                            <AnimatedButton variant="primary" className="flex-1">
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Sign In to Participate
                            </AnimatedButton>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <AnimatedCard className="p-12 text-center border border-border">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No repo operations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No repo operations are currently available'}
            </p>
            <AnimatedButton variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Repo Calendar
            </AnimatedButton>
          </AnimatedCard>
        )}

        {/* Educational Section */}
        <AnimatedCard className="mt-8 p-6 border border-border bg-blue-50 dark:bg-blue-900/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Understanding Repo Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">What is a Repo?</h4>
              <p className="text-sm text-muted-foreground">
                A repurchase agreement is a short-term borrowing where government securities are sold with an agreement to repurchase them at a slightly higher price.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How it Works</h4>
              <p className="text-sm text-muted-foreground">
                You provide cash to the counterparty and receive government securities as collateral. At maturity, you get your cash back plus interest (repo rate).
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benefits</h4>
              <p className="text-sm text-muted-foreground">
                Low-risk investment with government securities as collateral, competitive returns, and short-term liquidity options.
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
