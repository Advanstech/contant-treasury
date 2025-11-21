'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Calculator,
  Info
} from 'lucide-react';
import auctionsData from '@/data/bog-auctions.json';

interface BogAuction {
  id: string;
  securityType: string;
  tenorDays: number;
  issueDate: string;
  maturityDate: string;
  biddingOpenDate: string;
  biddingCloseDate: string;
  settlementDate: string;
  targetAmount: number;
  minBidAmount: number;
  maxBidAmount: number;
  status: string;
  couponRate?: number;
  results?: {
    totalBids: number;
    totalBidders: number;
    averageYield: number;
    marginRate: number;
  } | null;
}

interface BidForm {
  bidType: 'competitive' | 'non-competitive';
  amount: string;
  yieldRate?: string;
  discountRate?: string;
}

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<BogAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bidForm, setBidForm] = useState<BidForm>({
    bidType: 'non-competitive',
    amount: '',
  });

  const [calculatedReturns, setCalculatedReturns] = useState({
    discountAmount: 0,
    netInvestment: 0,
    effectiveYield: 0,
  });

  useEffect(() => {
    const foundAuction = auctionsData.auctions.find(a => a.id === params.id);
    if (foundAuction) {
      setAuction(foundAuction);
    }
    setLoading(false);
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      timeZone: 'Africa/Accra',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const calculateReturns = () => {
    const amount = parseFloat(bidForm.amount) || 0;
    const yieldRate = parseFloat(bidForm.yieldRate || '0') / 100;
    const discountRate = parseFloat(bidForm.discountRate || '0') / 100;
    
    if (amount <= 0) {
      setCalculatedReturns({ discountAmount: 0, netInvestment: 0, effectiveYield: 0 });
      return;
    }

    let discountAmount = 0;
    let netInvestment = amount;
    let effectiveYield = 0;

    if (auction?.securityType === 'T-BILL') {
      if (bidForm.bidType === 'competitive' && discountRate > 0) {
        discountAmount = amount * discountRate * (auction.tenorDays / 365);
        netInvestment = amount - discountAmount;
        effectiveYield = (discountAmount / netInvestment) * (365 / auction.tenorDays);
      } else if (bidForm.bidType === 'non-competitive' && auction.results?.marginRate) {
        const marginRate = auction.results.marginRate / 100;
        discountAmount = amount * marginRate * (auction.tenorDays / 365);
        netInvestment = amount - discountAmount;
        effectiveYield = marginRate;
      }
    } else if (auction?.securityType === 'GOVERNMENT BOND' && auction.couponRate) {
      effectiveYield = auction.couponRate;
    }

    setCalculatedReturns({
      discountAmount: Math.round(discountAmount),
      netInvestment: Math.round(netInvestment),
      effectiveYield: Math.round(effectiveYield * 100) / 100,
    });
  };

  useEffect(() => {
    calculateReturns();
  }, [bidForm.amount, bidForm.yieldRate, bidForm.discountRate, bidForm.bidType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bidForm.amount || parseFloat(bidForm.amount) <= 0) {
      newErrors.amount = 'Bid amount is required';
    } else {
      const amount = parseFloat(bidForm.amount);
      if (amount < (auction?.minBidAmount || 0)) {
        newErrors.amount = `Minimum bid amount is ${formatCurrency(auction?.minBidAmount || 0)}`;
      }
      if (amount > (auction?.maxBidAmount || 0)) {
        newErrors.amount = `Maximum bid amount is ${formatCurrency(auction?.maxBidAmount || 0)}`;
      }
      if (amount % 1000 !== 0) {
        newErrors.amount = 'Bid amount must be in multiples of GHS 1,000';
      }
    }

    if (bidForm.bidType === 'competitive') {
      if (auction?.securityType === 'T-BILL') {
        if (!bidForm.discountRate || parseFloat(bidForm.discountRate) <= 0) {
          newErrors.discountRate = 'Discount rate is required for competitive bids';
        } else if (parseFloat(bidForm.discountRate) > 50) {
          newErrors.discountRate = 'Discount rate seems too high';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const confirmBid = () => {
    setBidPlaced(true);
    setShowConfirmation(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Auction Not Found</h2>
          <p className="text-gray-600 mb-4">The auction you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/client/calendar')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  if (bidPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bid Successfully Placed!</h2>
          <p className="text-gray-600 mb-6">
            Your bid of {formatCurrency(parseFloat(bidForm.amount))} has been submitted for auction {auction.id}.
          </p>
          <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Bid Reference:</span>
              <span className="font-medium">BID-{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-yellow-600">Pending Auction Results</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Settlement:</span>
              <span className="font-medium">{new Date(auction.settlementDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/client/portfolio')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Portfolio
            </button>
            <button
              onClick={() => router.push('/client/calendar')}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {auction.securityType === 'T-BILL' ? 'Treasury Bill' : 'Government Bond'} Auction
              </h1>
              <p className="text-gray-600">Auction ID: {auction.id}</p>
            </div>
            <div className={`px-3 py-1 rounded-full border ${getStatusColor(auction.status)}`}>
              {auction.status}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                Tenor
              </div>
              <div className="font-semibold">{auction.tenorDays} Days</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                Target Amount
              </div>
              <div className="font-semibold">{formatCurrency(auction.targetAmount)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                Bidding Closes
              </div>
              <div className="font-semibold">{formatDateTime(auction.biddingCloseDate)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {auction.couponRate ? 'Coupon Rate' : 'Yield Range'}
              </div>
              <div className="font-semibold">
                {auction.couponRate ? `${auction.couponRate}%` : auction.results ? `${auction.results.averageYield}%` : 'TBA'}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Issue Date</div>
                <div className="font-medium">{new Date(auction.issueDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Maturity Date</div>
                <div className="font-medium">{new Date(auction.maturityDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Settlement Date</div>
                <div className="font-medium">{new Date(auction.settlementDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {auction.status === 'OPEN' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Place Your Bid</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBidForm({ ...bidForm, bidType: 'non-competitive' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bidForm.bidType === 'non-competitive'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Non-Competitive</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Accept marginal rate, guaranteed allotment
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidForm({ ...bidForm, bidType: 'competitive' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bidForm.bidType === 'competitive'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Competitive</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Specify your desired yield/discount rate
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount (GHS)
                </label>
                <input
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter amount between ${formatCurrency(auction.minBidAmount)} and ${formatCurrency(auction.maxBidAmount)}`}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Must be in multiples of GHS 1,000
                </p>
              </div>

              {bidForm.bidType === 'competitive' && auction.securityType === 'T-BILL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bidForm.discountRate}
                    onChange={(e) => setBidForm({ ...bidForm, discountRate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter discount rate"
                  />
                  {errors.discountRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.discountRate}</p>
                  )}
                </div>
              )}

              {parseFloat(bidForm.amount) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">Estimated Returns</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-blue-700">Discount Amount</div>
                      <div className="font-semibold text-blue-900">
                        {formatCurrency(calculatedReturns.discountAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-700">Net Investment</div>
                      <div className="font-semibold text-blue-900">
                        {formatCurrency(calculatedReturns.netInvestment)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-700">Effective Yield</div>
                      <div className="font-semibold text-blue-900">
                        {calculatedReturns.effectiveYield}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <ul className="space-y-1 text-amber-700">
                    <li>• Bids are irrevocable once submitted</li>
                    <li>• Allotment depends on auction results and available amount</li>
                    <li>• Settlement will occur on {new Date(auction.settlementDate).toLocaleDateString()}</li>
                    <li>• You can view your bid status in your portfolio after submission</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Review and Submit Bid
              </button>
            </form>
          </div>
        )}

        {auction.status !== 'OPEN' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {auction.status === 'UPCOMING' ? 'Bidding Not Yet Open' : 'Bidding Closed'}
            </h3>
            <p className="text-gray-600 mb-4">
              {auction.status === 'UPCOMING' 
                ? `Bidding opens on ${formatDateTime(auction.biddingOpenDate)}`
                : 'This auction has already closed for bidding'
              }
            </p>
            <button
              onClick={() => router.push('/client/calendar')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Other Auctions
            </button>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Your Bid</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Auction:</span>
                <span className="font-medium">{auction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security:</span>
                <span className="font-medium">
                  {auction.securityType === 'T-BILL' ? 'T-Bill' : 'Government Bond'} ({auction.tenorDays}D)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bid Type:</span>
                <span className="font-medium capitalize">{bidForm.bidType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{formatCurrency(parseFloat(bidForm.amount))}</span>
              </div>
              {bidForm.bidType === 'competitive' && bidForm.discountRate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount Rate:</span>
                  <span className="font-medium">{bidForm.discountRate}%</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBid}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
