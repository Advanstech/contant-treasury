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
  Users,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi, { PdSubmission } from '@/lib/admin-api';

export default function PdSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<PdSubmission | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  // Form state for manual submission
  const [formData, setFormData] = useState({
    auctionId: '',
    pdCode: 'PD001',
    omnibusReference: '',
    submissionType: 'MIXED',
    totalAmount: '',
    bidCount: '',
    submissionMode: 'MANUAL',
  });

  // Fetch PD submissions
  const {
    data,
    isLoading,
    refetch,
  } = useQuery<{ submissions: PdSubmission[]; total: number }, Error>({
    queryKey: ['admin', 'pd-submissions', page, statusFilter],
    queryFn: () =>
      adminApi.pdSubmissions.getAll({
        status: statusFilter || undefined,
        page,
        limit,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const status = error?.response?.status;

      if (status === 404) {
        toast.info(
          'PD submissions API is not available yet. This section will be enabled once the backend service is implemented.',
        );
      } else {
        toast.error('Failed to load PD submissions', {
          description: error?.response?.data?.message || 'An unexpected error occurred',
        });
      }
    },
  });

  const submissions: PdSubmission[] = data?.submissions || [];
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  // Create manual submission mutation
  const createSubmissionMutation = useMutation({
    mutationFn: (data: any) => adminApi.pdSubmissions.create(data),
    onSuccess: () => {
      toast.success('PD Submission created successfully');
      setShowCreateModal(false);
      setFormData({
        auctionId: '',
        pdCode: 'PD001',
        omnibusReference: '',
        submissionType: 'MIXED',
        totalAmount: '',
        bidCount: '',
        submissionMode: 'MANUAL',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pd-submissions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create submission', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Filter submissions by search query
  const filteredSubmissions: PdSubmission[] = submissions.filter(
    (submission: PdSubmission) =>
      submission.submissionCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.auction as any)?.auctionCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view submission details
  const handleViewSubmission = async (submissionId: string) => {
    try {
      const submission = await adminApi.pdSubmissions.getById(submissionId);
      setSelectedSubmission(submission);
    } catch (error: any) {
      toast.error('Failed to load submission details', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubmissionMutation.mutate({
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      bidCount: parseInt(formData.bidCount),
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-500/10 text-blue-500';
      case 'ACCEPTED':
        return 'bg-green-500/10 text-green-500';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-500';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">PD Submissions</h1>
          <p className="text-gray-400 mt-1">
            Primary Dealer omnibus submissions to Bank of Ghana
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Manual Submission
          </button>
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
              <p className="text-sm text-gray-400">Total Submissions</p>
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
                {submissions.filter((s: PdSubmission) => s.status === 'PENDING').length}
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
              <p className="text-sm text-gray-400">Accepted</p>
              <p className="text-2xl font-bold text-white">
                {submissions.filter((s: PdSubmission) => s.status === 'ACCEPTED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(25,95%,53%)]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[hsl(25,95%,53%)]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                GHS{' '}
                {(
                  submissions.reduce(
                    (sum: number, s: PdSubmission) => sum + (s.totalAmount || 0),
                    0,
                  ) / 1000000
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
              BoG Compliance
            </h3>
            <p className="text-sm text-gray-400">
              All PD submissions are digitally signed and submitted to Bank of Ghana via
              secure API. Each submission aggregates client bids into an omnibus order.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by reference or auction code..."
                className="w-full pl-10 pr-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(25,95%,53%)]" />
          <span className="ml-3 text-gray-400">Loading submissions...</span>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No submissions found
          </h3>
          <p className="text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Reference
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Auction
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Bids
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Total Amount
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Submitted
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="text-white font-mono text-sm">
                          {submission.submissionCode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white text-sm">
                          {(submission.auction as any)?.auctionCode || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-white text-sm">
                            {submission.totalBids || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium text-sm">
                          GHS {((submission.totalAmount || 0) / 1000000).toFixed(2)}M
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewSubmission(submission.id)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
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
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, data?.total || 0)} of {data?.total || 0}{' '}
              submissions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
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

      {/* Create Manual Submission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Create Manual PD Submission
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Manually enter PD submission for BoG auction
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
                {/* Auction ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auction ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.auctionId}
                    onChange={(e) => setFormData({ ...formData, auctionId: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                    placeholder="Enter auction UUID"
                  />
                </div>

                {/* PD Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    PD Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pdCode}
                    onChange={(e) => setFormData({ ...formData, pdCode: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                    placeholder="PD001"
                  />
                </div>

                {/* Omnibus Reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Omnibus Reference
                  </label>
                  <input
                    type="text"
                    value={formData.omnibusReference}
                    onChange={(e) => setFormData({ ...formData, omnibusReference: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                    placeholder="Auto-generated if left empty"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                </div>

                {/* Submission Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Submission Type *
                  </label>
                  <select
                    required
                    value={formData.submissionType}
                    onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                  >
                    <option value="MIXED">Mixed (Competitive + Non-Competitive)</option>
                    <option value="COMPETITIVE">Competitive Only</option>
                    <option value="NON_COMPETITIVE">Non-Competitive Only</option>
                  </select>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                    placeholder="1000000.00"
                  />
                </div>

                {/* Bid Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Bids *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.bidCount}
                    onChange={(e) => setFormData({ ...formData, bidCount: e.target.value })}
                    className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(25,95%,53%)]"
                    placeholder="10"
                  />
                </div>

                {/* Info Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-500 mb-1">
                        Manual Entry Mode
                      </h4>
                      <p className="text-xs text-gray-400">
                        This submission will be marked as MANUAL. Once BoG API credentials are available,
                        submissions can be automatically sent to Bank of Ghana.
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
                disabled={createSubmissionMutation.isPending}
                className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {createSubmissionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Submission
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Submission Details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 font-mono">
                    {selectedSubmission.submissionCode}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Auction Code</p>
                    <p className="text-white font-medium">
                      {(selectedSubmission.auction as any)?.auctionCode || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Bids</p>
                    <p className="text-white font-medium">
                      {selectedSubmission.totalBids || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-white font-medium">
                      GHS{' '}
                      {((selectedSubmission.totalAmount || 0) / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Submitted At</p>
                    <p className="text-white">
                      {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">BoG Response</p>
                    <p className="text-white">
                      {selectedSubmission.bogResponse ? 'Received' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* BoG Response */}
                {selectedSubmission.bogResponse && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">BoG Response</p>
                    <pre className="bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg p-4 text-sm text-white overflow-x-auto">
                      {JSON.stringify(selectedSubmission.bogResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
