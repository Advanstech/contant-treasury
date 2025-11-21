'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
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
  Download,
  Upload,
  Check,
  X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';

export default function SettlementConfirmationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedConfirmation, setSelectedConfirmation] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  // Fetch settlement confirmations
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settlements', 'confirmations', page, statusFilter],
    queryFn: () =>
      adminApi.settlements.getBatches({
        status: statusFilter || undefined,
        page,
        limit,
      }),
  });

  const batches = data?.batches || [];
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  // Confirm settlement mutation
  const confirmSettlementMutation = useMutation({
    mutationFn: (batchId: string) => adminApi.settlements.confirmSettlement(batchId),
    onSuccess: () => {
      toast.success('Settlement confirmed successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'settlements'] });
    },
    onError: (error: any) => {
      toast.error('Failed to confirm settlement', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Filter batches by search query
  const filteredBatches = batches.filter((batch: any) =>
    batch.batchId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'SENT':
        return <Upload className="w-5 h-5 text-blue-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settlement Confirmations</h1>
          <p className="text-gray-400 mt-1">
            Track and confirm CSD settlement status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Batches</p>
              <p className="text-2xl font-bold text-white">{data?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">
                {batches.filter((b: any) => b.status === 'PENDING' || b.status === 'SENT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Confirmed</p>
              <p className="text-2xl font-bold text-white">
                {batches.filter((b: any) => b.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-white">
                {batches.filter((b: any) => b.status === 'FAILED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-500 mb-1">
              Settlement Confirmation Process
            </h3>
            <p className="text-sm text-gray-400">
              After uploading settlement files to CSD via SFTP, confirmations are received from the
              CSD system. Confirm settlements here once CSD processing is complete. Confirmed
              settlements will create client holdings and release earmarked funds.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by batch ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent to CSD</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Confirmations Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[hsl(25,95%,53%)] animate-spin" />
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No settlement confirmations found</p>
        </div>
      ) : (
        <>
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Confirmed At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredBatches.map((batch: any) => (
                    <tr key={batch.batchId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(batch.status)}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              batch.status
                            )}`}
                          >
                            {batch.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-white font-mono">
                          {batch.batchId}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {batch.recordCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        GHS {((batch.totalAmount || 0) / 1000000).toFixed(2)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {batch.sentAt ? new Date(batch.sentAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {batch.confirmedAt ? new Date(batch.confirmedAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedConfirmation(batch)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          {batch.status === 'SENT' && (
                            <button
                              onClick={() => confirmSettlementMutation.mutate(batch.batchId)}
                              disabled={confirmSettlementMutation.isPending}
                              className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                              title="Confirm Settlement"
                            >
                              <Check className="w-3 h-3" />
                              Confirm
                            </button>
                          )}
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
              {data?.total || 0} confirmations
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

      {/* Confirmation Details Modal */}
      {selectedConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Settlement Confirmation Details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 font-mono">
                    {selectedConfirmation.batchId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConfirmation(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedConfirmation.status)}
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        selectedConfirmation.status
                      )}`}
                    >
                      {selectedConfirmation.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Record Count</p>
                    <p className="text-white font-medium">
                      {selectedConfirmation.recordCount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-white font-medium">
                      GHS {((selectedConfirmation.totalAmount || 0) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Created At</p>
                    <p className="text-white">
                      {new Date(selectedConfirmation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Sent At</p>
                    <p className="text-white">
                      {selectedConfirmation.sentAt
                        ? new Date(selectedConfirmation.sentAt).toLocaleString()
                        : 'Not sent'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Confirmed At</p>
                    <p className="text-white">
                      {selectedConfirmation.confirmedAt
                        ? new Date(selectedConfirmation.confirmedAt).toLocaleString()
                        : 'Not confirmed'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Updated At</p>
                    <p className="text-white">
                      {new Date(selectedConfirmation.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">Settlement Timeline</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Batch Created</p>
                        <p className="text-xs text-gray-400">
                          {new Date(selectedConfirmation.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedConfirmation.sentAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Sent to CSD</p>
                          <p className="text-xs text-gray-400">
                            {new Date(selectedConfirmation.sentAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedConfirmation.confirmedAt && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Confirmed by CSD</p>
                          <p className="text-xs text-gray-400">
                            {new Date(selectedConfirmation.confirmedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedConfirmation(null)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              {selectedConfirmation.status === 'SENT' && (
                <button
                  onClick={() => {
                    confirmSettlementMutation.mutate(selectedConfirmation.batchId);
                    setSelectedConfirmation(null);
                  }}
                  disabled={confirmSettlementMutation.isPending}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Confirm Settlement
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
