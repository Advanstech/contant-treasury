'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Filter,
  Search,
  Eye,
  FileSpreadsheet,
  Receipt
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'STATEMENT' | 'TRANSACTION_HISTORY' | 'TAX_DOCUMENT' | 'HOLDINGS_SUMMARY';
  description: string;
  generatedDate: string;
  period: string;
  format: 'PDF' | 'EXCEL';
  size: string;
  downloadUrl: string;
}

export default function ReportsPage() {
  const [reports] = useState<Report[]>([
    {
      id: 'rpt-001',
      name: 'Monthly Statement - January 2024',
      type: 'STATEMENT',
      description: 'Complete account statement including all holdings, transactions, and performance for January 2024',
      generatedDate: '2024-02-01',
      period: 'January 2024',
      format: 'PDF',
      size: '2.4 MB',
      downloadUrl: '/reports/monthly-statement-jan-2024.pdf'
    },
    {
      id: 'rpt-002',
      name: 'Transaction History - Q4 2023',
      type: 'TRANSACTION_HISTORY',
      description: 'Detailed transaction history for all auction bids, settlements, and holdings in Q4 2023',
      generatedDate: '2024-01-05',
      period: 'October - December 2023',
      format: 'EXCEL',
      size: '1.8 MB',
      downloadUrl: '/reports/transaction-history-q4-2023.xlsx'
    },
    {
      id: 'rpt-003',
      name: 'Tax Summary - 2023',
      type: 'TAX_DOCUMENT',
      description: 'Annual tax summary including interest income and capital gains for tax filing purposes',
      generatedDate: '2024-01-15',
      period: 'Full Year 2023',
      format: 'PDF',
      size: '856 KB',
      downloadUrl: '/reports/tax-summary-2023.pdf'
    },
    {
      id: 'rpt-004',
      name: 'Holdings Summary - Current',
      type: 'HOLDINGS_SUMMARY',
      description: 'Current portfolio holdings with market values, yields, and maturity schedules',
      generatedDate: '2024-01-28',
      period: 'As of January 28, 2024',
      format: 'EXCEL',
      size: '1.2 MB',
      downloadUrl: '/reports/holdings-summary-current.xlsx'
    },
    {
      id: 'rpt-005',
      name: 'Monthly Statement - December 2023',
      type: 'STATEMENT',
      description: 'Complete account statement for December 2023 including year-end summary',
      generatedDate: '2024-01-01',
      period: 'December 2023',
      format: 'PDF',
      size: '3.1 MB',
      downloadUrl: '/reports/monthly-statement-dec-2023.pdf'
    },
    {
      id: 'rpt-006',
      name: 'Auction Results Report - 2023',
      type: 'TRANSACTION_HISTORY',
      description: 'Comprehensive report of all auction participations and results for 2023',
      generatedDate: '2024-01-10',
      period: 'Full Year 2023',
      format: 'EXCEL',
      size: '2.7 MB',
      downloadUrl: '/reports/auction-results-2023.xlsx'
    }
  ]);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reportTypes = [
    { value: 'all', label: 'All Reports', color: 'bg-gray-100 text-gray-800' },
    { value: 'STATEMENT', label: 'Statements', color: 'bg-blue-100 text-blue-800' },
    { value: 'TRANSACTION_HISTORY', label: 'Transaction History', color: 'bg-green-100 text-green-800' },
    { value: 'TAX_DOCUMENT', label: 'Tax Documents', color: 'bg-purple-100 text-purple-800' },
    { value: 'HOLDINGS_SUMMARY', label: 'Holdings Summary', color: 'bg-orange-100 text-orange-800' },
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'STATEMENT':
        return <Receipt className="w-4 h-4" />;
      case 'TRANSACTION_HISTORY':
        return <FileText className="w-4 h-4" />;
      case 'TAX_DOCUMENT':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'HOLDINGS_SUMMARY':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    return format === 'PDF' ? 
      <FileText className="w-4 h-4 text-red-500" /> : 
      <FileSpreadsheet className="w-4 h-4 text-green-500" />;
  };

  const getTypeColor = (type: string) => {
    const reportType = reportTypes.find(t => t.value === type);
    return reportType ? reportType.color : reportTypes[0].color;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      timeZone: 'Africa/Accra',
      dateStyle: 'medium',
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedReports = [...filteredReports].sort((a, b) => 
    new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()
  );

  const handleDownload = (report: Report) => {
    // In a real app, this would trigger actual download
    console.log(`Downloading ${report.name} from ${report.downloadUrl}`);
    // For demo, we'll just show an alert
    alert(`Download started: ${report.name} (${report.format})`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Documents</h1>
          <p className="text-gray-600">
            Download account statements, transaction history, tax documents, and portfolio summaries
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Monthly Statement</h3>
            <p className="text-blue-100 text-sm mb-4">
              Download your current month account statement
            </p>
            <button 
              onClick={() => handleDownload(reports.find(r => r.type === 'STATEMENT') || reports[0])}
              className="w-full px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Download Latest
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tax Documents</h3>
            <p className="text-green-100 text-sm mb-4">
              Get your annual tax summary for filing
            </p>
            <button 
              onClick={() => handleDownload(reports.find(r => r.type === 'TAX_DOCUMENT') || reports[0])}
              className="w-full px-4 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors"
            >
              Download Tax Summary
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
            <p className="text-purple-100 text-sm mb-4">
              Current holdings with market values and yields
            </p>
            <button 
              onClick={() => handleDownload(reports.find(r => r.type === 'HOLDINGS_SUMMARY') || reports[0])}
              className="w-full px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
            >
              Download Summary
            </button>
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
                  placeholder="Search reports by name or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type.value
                      ? type.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getReportIcon(type.value)}
                  <span className="ml-2">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(report.type)}`}>
                      {getReportIcon(report.type)}
                      {reportTypes.find(t => t.value === report.type)?.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {getFormatIcon(report.format)}
                      <span className="text-sm text-gray-500">{report.format}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Period:</span>
                  <span className="font-medium text-gray-900">{report.period}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Generated:</span>
                  <span className="font-medium text-gray-900">{formatDate(report.generatedDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">File Size:</span>
                  <span className="font-medium text-gray-900">{report.size}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDownload(report)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No reports are available at this time'
              }
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help with Reports?</h3>
              <p className="text-blue-800 mb-4">
                Our reports are generated monthly and are available for download in PDF and Excel formats. 
                If you need custom reports or have questions about your statements, please contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText className="w-4 h-4" />
                  Request Custom Report
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
