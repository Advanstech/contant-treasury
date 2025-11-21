'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  Plus,
  X,
  Upload,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';

export default function SettlementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  // Form state for settlement batch creation
  const [formData, setFormData] = useState({
    allotmentIds: [] as string[],
    settlementDate: '',
  });

  // Fetch settlement batches
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settlements', 'batches', page, statusFilter],
    queryFn: () =>
      adminApi.settlements.getBatches({
        status: statusFilter || undefined,
        page,
        limit,
      }),
  });

  const batches = data?.batches || [];
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  // Create settlement batch mutation
  const createBatchMutation = useMutation({
    mutationFn: (data: any) => adminApi.settlements.createBatch(data),
    onSuccess: () => {
      toast.success('Settlement batch created successfully');
      setShowCreateModal(false);
      setFormData({
        allotmentIds: [],
        settlementDate: '',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settlements'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create settlement batch', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Filter batches by search query
  const filteredBatches = batches.filter((batch: any) =>
    batch.batchId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBatchMutation.mutate(formData);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/10 text-green-500';
      case 'SENT':
        return 'bg-blue-500/10 text-blue-500';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'FAILED':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settlement Batches</h1>
          <p className="text-muted-foreground mt-1">
            CSD settlement file generation and management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Settlement Batch
          </button>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold text-foreground">{data?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">
                {batches.filter((b: any) => b.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-bold text-foreground">
                {batches.filter((b: any) => b.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                GHS{' '}
                {(
                  batches.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-500 mb-1">
              CSD Settlement Process
            </h3>
            <p className="text-sm text-muted-foreground">
              Settlement batches generate CSV files for Ghana CSD. Files must be uploaded via SFTP
              before 4:20pm daily cutoff for same-day settlement.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by batch ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Batches Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No settlement batches found</p>
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBatches.map((batch: any) => (
                    <tr key={batch.batchId} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-foreground font-mono">
                          {batch.batchId}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            batch.status
                          )}`}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {batch.recordCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        GHS {((batch.totalAmount || 0) / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data?.total || 0)} of{' '}
              {data?.total || 0} batches
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Settlement Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Create Settlement Batch
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Generate CSD settlement file from allotments
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {/* Allotment IDs */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Allotment IDs *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.allotmentIds.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allotmentIds: e.target.value.split('\n').filter((id) => id.trim()),
                      })
                    }
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)] font-mono text-sm"
                    placeholder="Enter allotment UUIDs (one per line)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one allotment ID per line
                  </p>
                </div>

                {/* Settlement Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Settlement Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.settlementDate}
                    onChange={(e) =>
                      setFormData({ ...formData, settlementDate: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                  />
                </div>

                {/* Info Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-500 mb-1">
                        CSD Settlement Process
                      </h4>
                      <p className="text-xs text-gray-400">
                        This will create settlement instructions for the specified allotments and
                        generate a CSV file for Ghana CSD. The file must be uploaded via SFTP
                        before 4:20pm for same-day settlement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={createBatchMutation.isPending}
                className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {createBatchMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Batch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
