'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import adminApi, { AdminAuction } from '@/lib/admin-api';

export default function AuctionsListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [securityTypeFilter, setSecurityTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch auctions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'auctions', page, phaseFilter, securityTypeFilter],
    queryFn: () =>
      adminApi.auctions.getAll({
        phase: phaseFilter || undefined,
        auctionType: securityTypeFilter || undefined,
        page,
        limit,
      }),
  });

  const auctions = data?.auctions || [];
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  // Filter auctions by search query
  const filteredAuctions = auctions.filter(
    (auction) =>
      auction.auctionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.securityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.auctions.delete(id),
    onSuccess: () => {
      toast.success('Auction deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'auctions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to delete auction', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Get phase badge color
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'ANNOUNCED':
        return 'bg-blue-500/10 text-blue-500';
      case 'BIDDING':
        return 'bg-green-500/10 text-green-500';
      case 'CLOSED':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'ALLOCATED':
        return 'bg-purple-500/10 text-purple-500';
      case 'SETTLED':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  // Handle delete
  const handleDelete = (id: string, auctionCode: string) => {
    if (confirm(`Are you sure you want to delete auction ${auctionCode}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">All Auctions</h1>
          <p className="text-gray-400 mt-1">
            Manage all Treasury auction listings
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
          <button
            onClick={() => router.push('/admin/auctions/create')}
            className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Auction
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
              <p className="text-sm text-gray-400">Total Auctions</p>
              <p className="text-2xl font-bold text-white">{data?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">
                {auctions.filter((a) => a.phase === 'BIDDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">
                {auctions.filter((a) => a.phase === 'ANNOUNCED').length}
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
              <p className="text-sm text-gray-400">Total Volume</p>
              <p className="text-2xl font-bold text-white">
                GHS{' '}
                {(
                  auctions.reduce((sum, a) => sum + (a.targetAmount || 0), 0) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Search by code or security..."
                className="w-full pl-10 pr-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
              />
            </div>
          </div>

          {/* Phase Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Phase
            </label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
            >
              <option value="">All Phases</option>
              <option value="ANNOUNCED">Announced</option>
              <option value="BIDDING">Bidding</option>
              <option value="CLOSED">Closed</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="SETTLED">Settled</option>
            </select>
          </div>

          {/* Security Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Security Type
            </label>
            <select
              value={securityTypeFilter}
              onChange={(e) => setSecurityTypeFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
            >
              <option value="">All Types</option>
              <option value="TREASURY_BILL">Treasury Bill</option>
              <option value="BOND">Bond</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(25,95%,53%)]" />
          <span className="ml-3 text-gray-400">Loading auctions...</span>
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No auctions found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or create a new auction
          </p>
          <button
            onClick={() => router.push('/admin/auctions/create')}
            className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Auction
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Auction Code
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Security
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Tenor
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Target Amount
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Phase
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Auction Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuctions.map((auction) => (
                    <tr
                      key={auction.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="text-white font-mono text-sm font-medium">
                          {auction.auctionCode}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white text-sm font-medium">
                            {auction.securityName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {auction.auctionType.replace('_', ' ')}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white text-sm">
                          {auction.tenor} days
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium text-sm">
                          GHS {((auction.targetAmount || 0) / 1000000).toFixed(2)}M
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getPhaseColor(
                            auction.phase
                          )}`}
                        >
                          {auction.phase}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(auction.biddingOpenDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/auctions/${auction.id}`)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/auctions/${auction.id}/edit`)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(auction.id, auction.auctionCode)}
                            disabled={deleteMutation.isPending}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
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
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, data?.total || 0)} of {data?.total || 0}{' '}
              auctions
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
    </div>
  );
}
