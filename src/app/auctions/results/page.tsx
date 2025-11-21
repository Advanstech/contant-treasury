'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Download, 
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import { PDFGenerator } from '@/lib/pdf-generator';

interface AuctionResult {
  id: string;
  auctionCode: string;
  securityName: string;
  securityType: 'TREASURY_BILL' | 'GOVERNMENT_BOND';
  auctionDate: string;
  settlementDate: string;
  targetAmount: number;
  totalBids: number;
  totalAccepted: number;
  bidCoverRatio: number;
  highRate?: number;
  lowRate?: number;
  weightedAverageRate: number;
  marginalRate?: number;
  price: number;
  status: 'COMPLETED' | 'PARTIALLY_ALLOTED' | 'UNDER_SUBSCRIBED';
  isReopening: boolean;
  tenor: string;
  cusip: string;
}

interface FilterOptions {
  securityType: string;
  dateRange: string;
  status: string;
  searchTerm: string;
}

export default function AuctionResultsPage() {
  const [results, setResults] = useState<AuctionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    securityType: '',
    dateRange: '',
    status: '',
    searchTerm: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState<AuctionResult | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'rate'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 15;

  useEffect(() => {
    fetchAuctionResults();
  }, []);

  const fetchAuctionResults = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockResults: AuctionResult[] = [
        {
          id: '1',
          auctionCode: 'GHA-TB-091-2025-Q3',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-11-14',
          settlementDate: '2025-11-17',
          targetAmount: 500000000,
          totalBids: 650000000,
          totalAccepted: 500000000,
          bidCoverRatio: 1.30,
          highRate: 24.85,
          lowRate: 24.50,
          weightedAverageRate: 24.65,
          marginalRate: 24.70,
          price: 97.50,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '91 Days',
          cusip: 'GHA000123456',
        },
        {
          id: '2',
          auctionCode: 'GHA-TB-182-2025-Q3',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-11-07',
          settlementDate: '2025-11-10',
          targetAmount: 400000000,
          totalBids: 520000000,
          totalAccepted: 400000000,
          bidCoverRatio: 1.30,
          highRate: 25.35,
          lowRate: 25.00,
          weightedAverageRate: 25.15,
          marginalRate: 25.20,
          price: 95.00,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '182 Days',
          cusip: 'GHA000123457',
        },
        {
          id: '3',
          auctionCode: 'GHA-BD-002-2025-Q3',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-10-31',
          settlementDate: '2025-11-03',
          targetAmount: 750000000,
          totalBids: 825000000,
          totalAccepted: 750000000,
          bidCoverRatio: 1.10,
          highRate: 24.00,
          lowRate: 23.50,
          weightedAverageRate: 23.75,
          marginalRate: 23.80,
          price: 101.25,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '2 Years',
          cusip: 'GHA000123458',
        },
        {
          id: '4',
          auctionCode: 'GHA-TB-364-2025-Q3',
          securityName: '364-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-10-24',
          settlementDate: '2025-10-27',
          targetAmount: 600000000,
          totalBids: 540000000,
          totalAccepted: 540000000,
          bidCoverRatio: 0.90,
          highRate: 26.85,
          lowRate: 26.50,
          weightedAverageRate: 26.65,
          marginalRate: 26.70,
          price: 92.50,
          status: 'UNDER_SUBSCRIBED',
          isReopening: false,
          tenor: '364 Days',
          cusip: 'GHA000123459',
        },
        {
          id: '5',
          auctionCode: 'GHA-BD-003-2025-Q3',
          securityName: '3-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-10-17',
          settlementDate: '2025-10-20',
          targetAmount: 500000000,
          totalBids: 550000000,
          totalAccepted: 500000000,
          bidCoverRatio: 1.10,
          highRate: 25.00,
          lowRate: 24.50,
          weightedAverageRate: 24.75,
          marginalRate: 24.80,
          price: 102.50,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '3 Years',
          cusip: 'GHA000123460',
        },
        {
          id: '6',
          auctionCode: 'GHA-TB-091-2025-Q2',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-10-10',
          settlementDate: '2025-10-13',
          targetAmount: 500000000,
          totalBids: 675000000,
          totalAccepted: 500000000,
          bidCoverRatio: 1.35,
          highRate: 24.75,
          lowRate: 24.40,
          weightedAverageRate: 24.55,
          marginalRate: 24.60,
          price: 97.75,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '91 Days',
          cusip: 'GHA000123461',
        },
        {
          id: '7',
          auctionCode: 'GHA-BD-002-2025-Q2-R',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-10-03',
          settlementDate: '2025-10-06',
          targetAmount: 250000000,
          totalBids: 275000000,
          totalAccepted: 250000000,
          bidCoverRatio: 1.10,
          highRate: 23.80,
          lowRate: 23.50,
          weightedAverageRate: 23.65,
          marginalRate: 23.70,
          price: 101.35,
          status: 'COMPLETED',
          isReopening: true,
          tenor: '2 Years',
          cusip: 'GHA000123458',
        },
        {
          id: '8',
          auctionCode: 'GHA-TB-182-2025-Q2',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-09-26',
          settlementDate: '2025-09-29',
          targetAmount: 400000000,
          totalBids: 480000000,
          totalAccepted: 400000000,
          bidCoverRatio: 1.20,
          highRate: 25.25,
          lowRate: 24.90,
          weightedAverageRate: 25.05,
          marginalRate: 25.10,
          price: 95.25,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '182 Days',
          cusip: 'GHA000123462',
        },
        {
          id: '9',
          auctionCode: 'GHA-BD-005-2025-Q2',
          securityName: '5-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          auctionDate: '2025-09-19',
          settlementDate: '2025-09-22',
          targetAmount: 600000000,
          totalBids: 630000000,
          totalAccepted: 600000000,
          bidCoverRatio: 1.05,
          highRate: 26.00,
          lowRate: 25.50,
          weightedAverageRate: 25.75,
          marginalRate: 25.80,
          price: 103.75,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '5 Years',
          cusip: 'GHA000123463',
        },
        {
          id: '10',
          auctionCode: 'GHA-TB-091-2025-Q1',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          auctionDate: '2025-09-12',
          settlementDate: '2025-09-15',
          targetAmount: 500000000,
          totalBids: 600000000,
          totalAccepted: 500000000,
          bidCoverRatio: 1.20,
          highRate: 24.65,
          lowRate: 24.30,
          weightedAverageRate: 24.45,
          marginalRate: 24.50,
          price: 98.00,
          status: 'COMPLETED',
          isReopening: false,
          tenor: '91 Days',
          cusip: 'GHA000123464',
        },
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Failed to fetch auction results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedResults = results
    .filter(result => {
      const matchesType = !filters.securityType || result.securityType === filters.securityType;
      const matchesStatus = !filters.status || result.status === filters.status;
      const matchesSearch = !filters.searchTerm || 
        result.auctionCode.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        result.securityName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime();
          break;
        case 'amount':
          comparison = a.targetAmount - b.targetAmount;
          break;
        case 'rate':
          comparison = a.weightedAverageRate - b.weightedAverageRate;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSecurityTypeColor = (type: string) => {
    switch (type) {
      case 'TREASURY_BILL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'GOVERNMENT_BOND':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PARTIALLY_ALLOTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'UNDER_SUBSCRIBED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSortIcon = (field: 'date' | 'amount' | 'rate') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />;
  };

  const handleSort = (field: 'date' | 'amount' | 'rate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDownloadPDF = (result: AuctionResult) => {
    try {
      const pdfData = {
        auctionCode: result.auctionCode,
        securityName: result.securityName,
        securityType: result.securityType,
        auctionDate: result.auctionDate,
        settlementDate: result.settlementDate,
        targetAmount: result.targetAmount,
        totalBids: result.totalBids,
        totalAccepted: result.totalAccepted,
        bidCoverRatio: result.bidCoverRatio,
        highRate: result.highRate,
        lowRate: result.lowRate,
        weightedAverageRate: result.weightedAverageRate,
        marginalRate: result.marginalRate,
        price: result.price,
        status: result.status,
        tenor: result.tenor,
        cusip: result.cusip,
      };

      const pdf = PDFGenerator.generateAuctionResultPDF(pdfData);
      pdf.save(`${result.auctionCode}-Results.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        'Auction Code', 'Security Name', 'Type', 'Auction Date', 'Settlement Date',
        'Target Amount', 'Total Bids', 'Total Accepted', 'Bid Cover Ratio',
        'Weighted Avg Rate', 'Price', 'Status'
      ];
      
      const csvData = filteredAndSortedResults.map(result => [
        result.auctionCode,
        result.securityName,
        result.securityType.replace('_', ' '),
        formatDate(result.auctionDate),
        formatDate(result.settlementDate),
        result.targetAmount.toString(),
        result.totalBids.toString(),
        result.totalAccepted.toString(),
        result.bidCoverRatio.toFixed(2),
        result.weightedAverageRate.toFixed(2),
        result.price.toFixed(2),
        result.status.replace('_', ' ')
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `auction-results-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
              Auction Results
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Historical auction results and performance data
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Auctions</p>
                <p className="text-2xl font-bold text-foreground">{results.length}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(results.reduce((sum, r) => sum + r.totalAccepted, 0))}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Cover Ratio</p>
                <p className="text-2xl font-bold text-foreground">
                  {(results.reduce((sum, r) => sum + r.bidCoverRatio, 0) / results.length).toFixed(2)}x
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {results.length > 0 ? `${results[0].weightedAverageRate.toFixed(2)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters and Search */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={filters.securityType}
              onChange={(e) => setFilters({...filters, securityType: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="TREASURY_BILL">Treasury Bills</option>
              <option value="GOVERNMENT_BOND">Government Bonds</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PARTIALLY_ALLOTED">Partially Alloted</option>
              <option value="UNDER_SUBSCRIBED">Under Subscribed</option>
            </select>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Time</option>
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <AnimatedButton 
              variant="outline" 
              className="w-full"
              onClick={() => setFilters({securityType: '', dateRange: '', status: '', searchTerm: ''})}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>

        {/* Results Table */}
        <AnimatedCard className="border border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Auction Results</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedResults.length} of {filteredAndSortedResults.length} results
                </span>
                <AnimatedButton variant="outline" className="text-sm" onClick={handleExportCSV}>
                  <Download className="h-3 w-3 mr-1" />
                  Export CSV
                </AnimatedButton>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading auction results...</p>
              </div>
            ) : paginatedResults.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Auction Date
                          {getSortIcon('date')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Security</th>
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('amount')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Target Amount
                          {getSortIcon('amount')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Cover Ratio</th>
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('rate')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Weighted Avg Rate
                          {getSortIcon('rate')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResults.map((result, index) => (
                      <tr key={result.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{formatDate(result.auctionDate)}</p>
                            <p className="text-xs text-muted-foreground">{result.auctionCode}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">{result.securityName}</p>
                              {result.isReopening && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                                  Reopening
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSecurityTypeColor(result.securityType)}`}>
                                {result.securityType.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">{result.tenor}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{formatCurrency(result.targetAmount)}</p>
                            <p className="text-xs text-muted-foreground">
                              Accepted: {formatCurrency(result.totalAccepted)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`font-medium ${
                            result.bidCoverRatio >= 1.2 ? 'text-green-600' : 
                            result.bidCoverRatio >= 1.0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.bidCoverRatio.toFixed(2)}x
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{result.weightedAverageRate.toFixed(2)}%</p>
                            {result.highRate && result.lowRate && (
                              <p className="text-xs text-muted-foreground">
                                {result.lowRate.toFixed(2)}% - {result.highRate.toFixed(2)}%
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <AnimatedButton 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => setSelectedResult(result)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </AnimatedButton>
                            <AnimatedButton 
                              variant="primary" 
                              className="text-xs"
                              onClick={() => handleDownloadPDF(result)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </AnimatedButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-foreground hover:bg-accent border border-border'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedResult.securityName} - {formatDate(selectedResult.auctionDate)}
                </h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Auction Code</p>
                    <p className="font-medium">{selectedResult.auctionCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CUSIP</p>
                    <p className="font-medium">{selectedResult.cusip}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Auction Date</p>
                    <p className="font-medium">{formatDate(selectedResult.auctionDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Settlement Date</p>
                    <p className="font-medium">{formatDate(selectedResult.settlementDate)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Amount</p>
                    <p className="font-medium">{formatCurrency(selectedResult.targetAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                    <p className="font-medium">{formatCurrency(selectedResult.totalBids)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Accepted</p>
                    <p className="font-medium">{formatCurrency(selectedResult.totalAccepted)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bid Cover Ratio</p>
                    <p className="font-medium">{selectedResult.bidCoverRatio.toFixed(2)}x</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Weighted Average Rate</p>
                    <p className="font-medium">{selectedResult.weightedAverageRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marginal Rate</p>
                    <p className="font-medium">{selectedResult.marginalRate?.toFixed(2)}%</p>
                  </div>
                  {selectedResult.highRate && selectedResult.lowRate && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">High Rate</p>
                        <p className="font-medium">{selectedResult.highRate.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Low Rate</p>
                        <p className="font-medium">{selectedResult.lowRate.toFixed(2)}%</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityTypeColor(selectedResult.securityType)}`}>
                      {selectedResult.securityType.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedResult.status)}`}>
                      {selectedResult.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatedButton variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download PDF
                    </AnimatedButton>
                    <AnimatedButton 
                      variant="primary"
                      onClick={() => setSelectedResult(null)}
                    >
                      Close
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
