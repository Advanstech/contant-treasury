'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, Filter, BarChart3, Shield, Activity, Building, TrendingUp, Users } from 'lucide-react';

type ReportType = 
  // User & Compliance Reports
  | 'users' | 'kyc' | 'audit-trail' | 'compliance'
  // Treasury Reports
  | 'auctions' | 'bids' | 'treasury-trading' | 'settlements'
  // Repo Reports
  | 'repo-positions' | 'repo-collateral' | 'repo-exposure'
  // Corporate Bond Reports
  | 'corporate-bonds' | 'bond-allocations' | 'bond-applications'
  // Financial Reports
  | 'transactions' | 'positions' | 'risk-exposure' | 'regulatory';

type ReportFormat = 'csv' | 'pdf';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('users');
  const [format, setFormat] = useState<ReportFormat>('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = {
    'User & Compliance': [
      { value: 'users', label: 'User Report', description: 'Export user data with KYC status', icon: Users },
      { value: 'kyc', label: 'KYC Report', description: 'Export KYC verification status', icon: Shield },
      { value: 'audit-trail', label: 'Audit Trail', description: 'System activity and audit logs', icon: FileText },
      { value: 'compliance', label: 'Compliance Report', description: 'Regulatory compliance status', icon: Shield },
    ],
    'Treasury Trading': [
      { value: 'auctions', label: 'Auction Report', description: 'Export auction details and results', icon: BarChart3 },
      { value: 'bids', label: 'Bid Report', description: 'Export bid data by auction', icon: TrendingUp },
      { value: 'treasury-trading', label: 'Treasury Trading', description: 'Complete treasury trading activity', icon: Activity },
      { value: 'settlements', label: 'Settlement Report', description: 'CSD settlement status and files', icon: Download },
    ],
    'Repo Trading': [
      { value: 'repo-positions', label: 'Repo Positions', description: 'Active repo agreements and positions', icon: Activity },
      { value: 'repo-collateral', label: 'Collateral Report', description: 'Collateral valuation and haircuts', icon: Shield },
      { value: 'repo-exposure', label: 'Repo Exposure', description: 'Counterparty exposure analysis', icon: TrendingUp },
    ],
    'Corporate Bonds': [
      { value: 'corporate-bonds', label: 'Bond Issues', description: 'Corporate bond issuances and status', icon: Building },
      { value: 'bond-allocations', label: 'Bond Allocations', description: 'Investor allocation details', icon: BarChart3 },
      { value: 'bond-applications', label: 'Bond Applications', description: 'Bookbuilding applications', icon: FileText },
    ],
    'Financial & Risk': [
      { value: 'transactions', label: 'Transaction Report', description: 'Export payment transactions', icon: Download },
      { value: 'positions', label: 'Position Report', description: 'Portfolio positions and holdings', icon: BarChart3 },
      { value: 'risk-exposure', label: 'Risk Exposure', description: 'Market and counterparty risk', icon: TrendingUp },
      { value: 'regulatory', label: 'Regulatory Reports', description: 'BoG and regulatory submissions', icon: Shield },
    ],
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (status) params.append('status', status);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/reports/${reportType}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate comprehensive reports for Treasury, Repo, and Corporate Bond trading activities
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Type Selection */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Select Report Type</h2>
          </div>
          
          {/* Categorized Report Types */}
          {Object.entries(reportCategories).map(([category, reports]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reports.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setReportType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all flex items-start gap-3 ${
                        reportType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${reportType === type.value ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{type.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">{type.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Report Options */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Export Format</h2>
            <div className="space-y-3">
              <button
                onClick={() => setFormat('csv')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                  format === 'csv'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="font-medium text-foreground">CSV</div>
                  <div className="text-sm text-muted-foreground">Excel compatible format</div>
                </div>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setFormat('pdf')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                  format === 'pdf'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div>
                  <div className="font-medium text-foreground">PDF</div>
                  <div className="text-sm text-muted-foreground">Print-ready format</div>
                </div>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Date Range</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                  setStartDate(firstDay.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="w-full p-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setStartDate(lastWeek.toISOString().split('T')[0]);
                  setEndDate(today.toISOString().split('T')[0]);
                }}
                className="w-full p-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  const firstDayCurrent = new Date(today.getFullYear(), today.getMonth(), 1);
                  setStartDate(lastMonth.toISOString().split('T')[0]);
                  setEndDate(firstDayCurrent.toISOString().split('T')[0]);
                }}
                className="w-full p-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Last Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Report Preview</h2>
          <Filter className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            {reportType ? `${reportCategories[Object.keys(reportCategories).find(key => 
              reportCategories[key as keyof typeof reportCategories].some(r => r.value === reportType)
            ) as keyof typeof reportCategories]?.find(r => r.value === reportType)?.label} report will be generated` : 'Select a report type to preview'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Format: {format.toUpperCase()} {startDate && endDate && `• ${startDate} to ${endDate}`}
          </p>
        </div>
      </div>
    </div>
  );
}
