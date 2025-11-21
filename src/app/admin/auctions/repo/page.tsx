'use client';

import { useState } from 'react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
} from 'lucide-react';

interface RepoOperation {
  id: string;
  repoId: string;
  security: {
    name: string;
    isin: string;
    type: 'TREASURY_BILL' | 'TREASURY_BOND';
  };
  repoRate: number;
  haircutPercent: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
  counterparty: string;
  createdAt: string;
}

export default function RepoOperationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'MATURED' | 'CLOSED'>('all');

  // Mock repo operations data
  const mockRepoOperations: RepoOperation[] = [
    {
      id: '1',
      repoId: 'repo-2024-001',
      security: {
        name: '91-Day Treasury Bill',
        isin: 'GH091TB202502',
        type: 'TREASURY_BILL',
      },
      repoRate: 15.5,
      haircutPercent: 2.0,
      totalAmount: 100000000,
      startDate: '2024-11-20',
      endDate: '2024-11-27',
      status: 'ACTIVE',
      counterparty: 'Bank of Ghana',
      createdAt: '2024-11-20T09:00:00Z',
    },
    {
      id: '2',
      repoId: 'repo-2024-002',
      security: {
        name: '182-Day Treasury Bill',
        isin: 'GH182TB202505',
        type: 'TREASURY_BILL',
      },
      repoRate: 16.2,
      haircutPercent: 3.0,
      totalAmount: 50000000,
      startDate: '2024-11-18',
      endDate: '2024-11-25',
      status: 'ACTIVE',
      counterparty: 'Standard Chartered Bank',
      createdAt: '2024-11-18T10:30:00Z',
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
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MATURED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Repo Operations</h1>
          <p className="text-muted-foreground">Manage repurchase agreement operations and collateral</p>
        </div>
        <AnimatedButton variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          New Repo Operation
        </AnimatedButton>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedCard className="p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Repos</p>
              <p className="text-2xl font-bold text-foreground">
                {mockRepoOperations.filter(op => op.status === 'ACTIVE').length}
              </p>
              <p className="text-sm text-muted-foreground">Currently active</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={100}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                ₵{(mockRepoOperations.reduce((sum, op) => sum + op.totalAmount, 0) / 1000000).toFixed(0)}M
              </p>
              <p className="text-sm text-muted-foreground">Outstanding repos</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={200}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Repo Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {(mockRepoOperations.reduce((sum, op) => sum + op.repoRate, 0) / mockRepoOperations.length).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Current average</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6 border border-border" delay={300}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maturing Today</p>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Require settlement</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Filters */}
      <AnimatedCard className="p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="MATURED">Matured</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </AnimatedCard>

      {/* Repo Operations List */}
      {filteredOperations.length > 0 ? (
        <div className="space-y-4">
          {filteredOperations.map((operation, index) => (
            <AnimatedCard 
              key={operation.id}
              className="border border-border overflow-hidden"
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
                        {operation.status}
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
                      ₵{(operation.totalAmount / 1000000).toFixed(0)}M
                    </p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Repo Rate</p>
                    <p className="text-sm font-medium">{operation.repoRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Haircut</p>
                    <p className="text-sm font-medium">{operation.haircutPercent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                    <p className="text-sm font-medium">
                      {new Date(operation.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">End Date</p>
                    <p className="text-sm font-medium">
                      {new Date(operation.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatedButton variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Agreement
                  </AnimatedButton>
                  {operation.status === 'ACTIVE' && (
                    <AnimatedButton variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Settlement
                    </AnimatedButton>
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
              : 'No repo operations have been created yet'}
          </p>
          <AnimatedButton variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Create First Repo Operation
          </AnimatedButton>
        </AnimatedCard>
      )}
    </div>
  );
}
