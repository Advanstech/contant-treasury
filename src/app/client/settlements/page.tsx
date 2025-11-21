'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download,
  Filter,
  Search,
  Eye,
  FileText
} from 'lucide-react';

interface Settlement {
  id: string;
  auctionId: string;
  securityType: 'T-BILL' | 'GOVERNMENT BOND';
  tenorDays: number;
  bidReference: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  settlementDate: string | null;
  expectedDate: string;
  csdReference?: string;
  failureReason?: string;
  holdingsCreated: boolean;
}

export default function SettlementsPage() {
  const [settlements] = useState<Settlement[]>([
    {
      id: 'stl-001',
      auctionId: 'bog-2024-001',
      securityType: 'T-BILL',
      tenorDays: 91,
      bidReference: 'BID-1704985200000',
      amount: 25000,
      status: 'COMPLETED',
      settlementDate: '2024-01-08',
      expectedDate: '2024-01-08',
      csdReference: 'CSD-2024-001234',
      holdingsCreated: true
    },
    {
      id: 'stl-002',
      auctionId: 'bog-2024-002',
      securityType: 'T-BILL',
      tenorDays: 182,
      bidReference: 'BID-1705176000000',
      amount: 15000,
      status: 'COMPLETED',
      settlementDate: '2024-01-15',
      expectedDate: '2024-01-15',
      csdReference: 'CSD-2024-001235',
      holdingsCreated: true
    },
    {
      id: 'stl-003',
      auctionId: 'bog-2024-003',
      securityType: 'GOVERNMENT BOND',
      tenorDays: 1095,
      bidReference: 'BID-1705089600000',
      amount: 50000,
      status: 'COMPLETED',
      settlementDate: '2024-01-22',
      expectedDate: '2024-01-22',
      csdReference: 'CSD-2024-001236',
      holdingsCreated: true
    },
    {
      id: 'stl-004',
      auctionId: 'bog-2024-004',
      securityType: 'T-BILL',
      tenorDays: 91,
      bidReference: 'BID-1705262400000',
      amount: 20000,
      status: 'PENDING',
      settlementDate: null,
      expectedDate: '2024-01-29',
      holdingsCreated: false
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const statusFilters = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'PROCESSING':
        return <AlertCircle className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const filter = statusFilters.find(f => f.value === status);
    return filter ? filter.color : statusFilters[0].color;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-GH');
  };

  const filteredSettlements = settlements.filter(settlement => {
    const matchesStatus = selectedStatus === 'all' || settlement.status === selectedStatus;
    const matchesSearch = settlement.bidReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.auctionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedSettlements = [...filteredSettlements].sort((a, b) => {
    // Sort by expected date descending
    return new Date(b.expectedDate).getTime() - new Date(a.expectedDate).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Status</h1>
          <p className="text-gray-600">
            Track the settlement status of your auction bids and holdings creation
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {settlements.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Settlements</h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {settlements.filter(s => s.status === 'COMPLETED').length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {settlements.filter(s => s.status === 'PENDING').length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  settlements
                    .filter(s => s.status === 'PENDING')
                    .reduce((sum, s) => sum + s.amount, 0)
                )}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending Amount</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by bid reference or auction ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === filter.value
                      ? filter.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getStatusIcon(filter.value)}
                  <span className="ml-2">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Settlement Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSettlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {settlement.bidReference}
                        </div>
                        <div className="text-sm text-gray-500">
                          Settlement ID: {settlement.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {settlement.securityType === 'T-BILL' ? 'T-Bill' : 'Government Bond'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {settlement.tenorDays} Days • {settlement.auctionId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(settlement.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(settlement.expectedDate)}
                      </div>
                      {settlement.settlementDate && (
                        <div className="text-sm text-green-600">
                          Settled: {formatDate(settlement.settlementDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                        {getStatusIcon(settlement.status)}
                        {settlement.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSettlement(settlement)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedSettlements.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No settlements found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'No settlements are available at this time'
                }
              </p>
            </div>
          )}
        </div>

        {/* Settlement Detail Modal */}
        {selectedSettlement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Settlement Details
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedSettlement.bidReference}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSettlement(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Auction ID</h3>
                    <p className="text-gray-900">{selectedSettlement.auctionId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Security Type</h3>
                    <p className="text-gray-900">
                      {selectedSettlement.securityType === 'T-BILL' ? 'Treasury Bill' : 'Government Bond'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tenor</h3>
                    <p className="text-gray-900">{selectedSettlement.tenorDays} Days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Amount</h3>
                    <p className="text-gray-900">{formatCurrency(selectedSettlement.amount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Expected Settlement</h3>
                    <p className="text-gray-900">{formatDate(selectedSettlement.expectedDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Actual Settlement</h3>
                    <p className="text-gray-900">{formatDate(selectedSettlement.settlementDate || '')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSettlement.status)}`}>
                      {getStatusIcon(selectedSettlement.status)}
                      {selectedSettlement.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Holdings Created</h3>
                    <p className="text-gray-900">
                      {selectedSettlement.holdingsCreated ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {selectedSettlement.csdReference && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">CSD Reference</h3>
                    <p className="text-gray-700">{selectedSettlement.csdReference}</p>
                  </div>
                )}

                {selectedSettlement.failureReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-red-900 mb-2">Failure Reason</h3>
                    <p className="text-red-700">{selectedSettlement.failureReason}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Settlement Notice
                  </button>
                  <button
                    onClick={() => setSelectedSettlement(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
