'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
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
  };
}

export default function CalendarPage() {
  const [auctions] = useState<BogAuction[]>(auctionsData.auctions);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-4 h-4" />;
      case 'UPCOMING':
        return <Calendar className="w-4 h-4" />;
      case 'CLOSED':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAuctionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return auctions.filter(auction => {
      const closeDate = new Date(auction.biddingCloseDate).toISOString().split('T')[0];
      const openDate = new Date(auction.biddingOpenDate).toISOString().split('T')[0];
      return dateStr === closeDate || dateStr === openDate || dateStr === auction.issueDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
      const dayAuctions = getAuctionsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 p-2 overflow-hidden ${isToday ? 'bg-blue-50' : ''}`}
        >
          <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
          <div className="space-y-1">
            {dayAuctions.slice(0, 2).map((auction, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded truncate ${getStatusColor(auction.status)}`}
              >
                {auction.securityType === 'T-BILL' ? 'T-Bill' : 'Bond'} {auction.tenorDays}D
              </div>
            ))}
            {dayAuctions.length > 2 && (
              <div className="text-xs text-gray-500">+{dayAuctions.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderListView = () => {
    const sortedAuctions = [...auctions].sort((a, b) => 
      new Date(a.biddingCloseDate).getTime() - new Date(b.biddingCloseDate).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedAuctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {auction.securityType === 'T-BILL' ? 'Treasury Bill' : 'Government Bond'}
                </h3>
                <p className="text-sm text-gray-600">
                  {auction.tenorDays} Days • Matures {new Date(auction.maturityDate).toLocaleDateString()}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(auction.status)}`}>
                {getStatusIcon(auction.status)}
                <span className="text-sm font-medium">{auction.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  Target Amount
                </div>
                <div className="font-semibold">{formatCurrency(auction.targetAmount)}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  Bidding Closes
                </div>
                <div className="font-semibold">
                  {new Date(auction.biddingCloseDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Min/Max Bid</div>
                <div className="font-semibold">
                  {formatCurrency(auction.minBidAmount)} - {formatCurrency(auction.maxBidAmount)}
                </div>
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

            {auction.status === 'OPEN' && (
              <div className="flex justify-end">
                <a
                  href={`/client/auctions/${auction.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Place Bid
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auction Calendar</h1>
          <p className="text-gray-600">
            View and participate in Bank of Ghana Treasury Bills and Government Bonds auctions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-xl font-semibold">
                {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div>
              <div className="grid grid-cols-7 gap-0 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0">
                {renderCalendar()}
              </div>
            </div>
          ) : (
            renderListView()
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Open Auctions</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {auctions.filter(a => a.status === 'OPEN').length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Upcoming</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {auctions.filter(a => a.status === 'UPCOMING').length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold">Total This Month</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                auctions
                  .filter(a => new Date(a.biddingCloseDate).getMonth() === selectedMonth.getMonth())
                  .reduce((sum, a) => sum + a.targetAmount, 0)
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
