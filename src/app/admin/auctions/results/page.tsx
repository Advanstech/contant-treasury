'use client';

import { useState } from 'react';
import {
  FileText,
  Upload,
  Save,
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/admin-api';
import type { AuctionResultDto } from '@/lib/admin-api';

export default function AuctionResultsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [selectedAuction, setSelectedAuction] = useState('');
  const [uploadMode, setUploadMode] = useState<'manual' | 'api'>('manual');
  const [resultData, setResultData] = useState({
    totalOffered: '',
    totalAllocated: '',
    cutoffYield: '',
    weightedAvgYield: '',
    totalBids: '',
    acceptedBids: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch pending auctions (CLOSED phase - awaiting results)
  const { data: auctionsData, isLoading: isLoadingAuctions } = useQuery({
    queryKey: ['admin', 'auctions', 'pending-results'],
    queryFn: () => adminApi.auctions.getAll({ phase: 'CLOSED' }),
  });

  const pendingAuctions = auctionsData?.auctions || [];

  // Submit results mutation
  const submitResultsMutation = useMutation({
    mutationFn: (data: { auctionId: string; cutoffYield: number; weightedAvgYield: number }) => 
      adminApi.auctions.enterResults(data.auctionId, {
        cutoffYield: data.cutoffYield,
        weightedAvgYield: data.weightedAvgYield,
      }),
    onSuccess: (data) => {
      toast.success('Auction results submitted successfully!', {
        description: 'Client allocations have been processed.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'auctions'] });
      router.push('/admin/auctions');
    },
    onError: (error: any) => {
      toast.error('Failed to submit results', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedAuction) {
      newErrors.auction = 'Please select an auction';
    }
    if (!resultData.totalOffered || Number(resultData.totalOffered) <= 0) {
      newErrors.totalOffered = 'Total offered must be greater than 0';
    }
    if (!resultData.totalAllocated || Number(resultData.totalAllocated) <= 0) {
      newErrors.totalAllocated = 'Total allocated must be greater than 0';
    }
    if (Number(resultData.totalAllocated) > Number(resultData.totalOffered)) {
      newErrors.totalAllocated = 'Allocated cannot exceed offered amount';
    }
    if (!resultData.cutoffYield || Number(resultData.cutoffYield) <= 0) {
      newErrors.cutoffYield = 'Cutoff yield is required';
    }
    if (!resultData.weightedAvgYield || Number(resultData.weightedAvgYield) <= 0) {
      newErrors.weightedAvgYield = 'Weighted average yield is required';
    }
    if (!resultData.totalBids || Number(resultData.totalBids) <= 0) {
      newErrors.totalBids = 'Total bids must be greater than 0';
    }
    if (!resultData.acceptedBids || Number(resultData.acceptedBids) <= 0) {
      newErrors.acceptedBids = 'Accepted bids must be greater than 0';
    }
    if (Number(resultData.acceptedBids) > Number(resultData.totalBids)) {
      newErrors.acceptedBids = 'Accepted bids cannot exceed total bids';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const resultsData = {
      auctionId: selectedAuction,
      cutoffYield: Number(resultData.cutoffYield),
      weightedAvgYield: Number(resultData.weightedAvgYield),
    };

    submitResultsMutation.mutate(resultsData);
  };

  // BoG API sync mutation
  const syncMutation = useMutation({
    mutationFn: () => adminApi.auctions.syncFromBog(),
    onSuccess: (data) => {
      toast.success('BoG sync completed!', {
        description: `${data.count} auction results synced successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'auctions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to sync with BoG', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const handleBogSync = async () => {
    syncMutation.mutate();
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/auctions"
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Auction Results Entry</h1>
          <p className="text-gray-400 mt-1">
            Enter BoG auction results manually or sync via API
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-[hsl(240,55%,10%)] border border-white/10 rounded-lg w-fit">
        <button
          onClick={() => setUploadMode('manual')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            uploadMode === 'manual'
              ? 'bg-[hsl(25,95%,53%)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setUploadMode('api')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            uploadMode === 'api'
              ? 'bg-[hsl(25,95%,53%)] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          BoG API Sync
        </button>
      </div>

      {uploadMode === 'manual' ? (
        /* Manual Entry Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Auction */}
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[hsl(25,95%,53%)]" />
              Select Auction
            </h2>
            {isLoadingAuctions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[hsl(25,95%,53%)]" />
                <span className="ml-2 text-gray-400">Loading auctions...</span>
              </div>
            ) : pendingAuctions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No pending auctions awaiting results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAuctions.map((auction) => (
                <label
                  key={auction.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAuction === auction.id
                      ? 'border-[hsl(25,95%,53%)] bg-[hsl(25,95%,53%)]/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="auction"
                    value={auction.id}
                    checked={selectedAuction === auction.id}
                    onChange={(e) => setSelectedAuction(e.target.value)}
                    className="w-4 h-4 text-[hsl(25,95%,53%)]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{auction.securityName}</span>
                      <span className="text-sm text-gray-400">({auction.auctionCode})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{new Date(auction.biddingCloseDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{auction.tenor} days</span>
                      <span>•</span>
                      <span>GHS {(auction.targetAmount / 1000000).toFixed(1)}M target</span>
                    </div>
                  </div>
                </label>
                ))}
              </div>
            )}
            {errors.auction && (
              <p className="text-red-400 text-sm mt-2">{errors.auction}</p>
            )}
          </div>

          {selectedAuction && (
            <>
              {/* Auction Metrics */}
              <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(25,95%,53%)]" />
                  Auction Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Offered (GHS)
                    </label>
                    <input
                      type="number"
                      value={resultData.totalOffered}
                      onChange={(e) => {
                        setResultData({ ...resultData, totalOffered: e.target.value });
                        if (errors.totalOffered) setErrors({ ...errors, totalOffered: '' });
                      }}
                      placeholder="e.g., 1000000"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.totalOffered ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.totalOffered && (
                      <p className="text-red-400 text-sm mt-1">{errors.totalOffered}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Allocated (GHS)
                    </label>
                    <input
                      type="number"
                      value={resultData.totalAllocated}
                      onChange={(e) => {
                        setResultData({ ...resultData, totalAllocated: e.target.value });
                        if (errors.totalAllocated) setErrors({ ...errors, totalAllocated: '' });
                      }}
                      placeholder="e.g., 800000"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.totalAllocated ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.totalAllocated && (
                      <p className="text-red-400 text-sm mt-1">{errors.totalAllocated}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cutoff Yield (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={resultData.cutoffYield}
                      onChange={(e) => {
                        setResultData({ ...resultData, cutoffYield: e.target.value });
                        if (errors.cutoffYield) setErrors({ ...errors, cutoffYield: '' });
                      }}
                      placeholder="e.g., 24.50"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.cutoffYield ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.cutoffYield && (
                      <p className="text-red-400 text-sm mt-1">{errors.cutoffYield}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weighted Avg Yield (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={resultData.weightedAvgYield}
                      onChange={(e) => {
                        setResultData({
                          ...resultData,
                          weightedAvgYield: e.target.value,
                        });
                        if (errors.weightedAvgYield) setErrors({ ...errors, weightedAvgYield: '' });
                      }}
                      placeholder="e.g., 24.30"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.weightedAvgYield ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.weightedAvgYield && (
                      <p className="text-red-400 text-sm mt-1">{errors.weightedAvgYield}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bid Statistics */}
              <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(25,95%,53%)]" />
                  Bid Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Bids Received
                    </label>
                    <input
                      type="number"
                      value={resultData.totalBids}
                      onChange={(e) => {
                        setResultData({ ...resultData, totalBids: e.target.value });
                        if (errors.totalBids) setErrors({ ...errors, totalBids: '' });
                      }}
                      placeholder="e.g., 234"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.totalBids ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.totalBids && (
                      <p className="text-red-400 text-sm mt-1">{errors.totalBids}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Accepted Bids
                    </label>
                    <input
                      type="number"
                      value={resultData.acceptedBids}
                      onChange={(e) => {
                        setResultData({ ...resultData, acceptedBids: e.target.value });
                        if (errors.acceptedBids) setErrors({ ...errors, acceptedBids: '' });
                      }}
                      placeholder="e.g., 187"
                      className={`w-full px-4 py-2 bg-[hsl(240,60%,8%)] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(25,95%,53%)] ${
                        errors.acceptedBids ? 'border-red-500' : 'border-white/10'
                      }`}
                      required
                    />
                    {errors.acceptedBids && (
                      <p className="text-red-400 text-sm mt-1">{errors.acceptedBids}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-500 mb-1">
                    Important: Result Entry
                  </p>
                  <p className="text-sm text-gray-400">
                    This will trigger client allocation and settlement instruction generation.
                    Please ensure all data is accurate before submitting.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitResultsMutation.isPending}
                  className="flex-1 px-6 py-3 bg-[hsl(25,95%,53%)] text-white rounded-lg font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitResultsMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Submit Results & Allocate
                    </>
                  )}
                </button>
                <Link
                  href="/admin/auctions"
                  className="px-6 py-3 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </>
          )}
        </form>
      ) : (
        /* BoG API Sync */
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(25,95%,53%)]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[hsl(25,95%,53%)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sync with BoG API
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Automatically fetch and process auction results from Bank of Ghana API
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              <button
                onClick={handleBogSync}
                disabled={syncMutation.isPending}
                className="w-full px-6 py-3 bg-[hsl(25,95%,53%)] text-white rounded-lg font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Sync Auction Results
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500">
                Last sync: 2 hours ago • Status: Connected
              </p>
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left">
              <p className="text-sm text-blue-400 font-medium mb-2">
                Automatic Processing:
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Fetches results from BoG webhook</li>
                <li>• Validates auction data</li>
                <li>• Allocates to clients automatically</li>
                <li>• Generates settlement instructions</li>
                <li>• Sends notifications to clients</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
