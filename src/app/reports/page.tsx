'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  BarChart3,
  Search,
  X,
  Filter,
  ArrowRight,
  Building2,
  Shield,
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'special';
  date: string;
  period: string;
  fileSize: string;
  pages: number;
  downloads: number;
  featured?: boolean;
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'annual' | 'quarterly' | 'monthly' | 'special'>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '2024' | '2023' | '2022'>('all');

  // Mock reports data
  const reports: Report[] = [
    {
      id: '1',
      title: 'Annual Report 2023',
      description: 'Comprehensive annual report covering Ghana Treasury market performance, auction results, and investor statistics',
      type: 'annual',
      date: '2024-03-15',
      period: '2023',
      fileSize: '12.5 MB',
      pages: 156,
      downloads: 3450,
      featured: true,
    },
    {
      id: '2',
      title: 'Q3 2024 Quarterly Report',
      description: 'Third quarter report on Treasury auction activity, yield trends, and market developments',
      type: 'quarterly',
      date: '2024-10-15',
      period: 'Q3 2024',
      fileSize: '4.2 MB',
      pages: 48,
      downloads: 1890,
      featured: true,
    },
    {
      id: '3',
      title: 'October 2024 Monthly Market Report',
      description: 'Monthly analysis of Treasury Bill and Government Bond auctions, yields, and investor participation',
      type: 'monthly',
      date: '2024-11-05',
      period: 'October 2024',
      fileSize: '1.8 MB',
      pages: 24,
      downloads: 890,
    },
    {
      id: '4',
      title: 'Q2 2024 Quarterly Report',
      description: 'Second quarter report covering auction results, market trends, and regulatory updates',
      type: 'quarterly',
      date: '2024-07-15',
      period: 'Q2 2024',
      fileSize: '3.9 MB',
      pages: 45,
      downloads: 2100,
    },
    {
      id: '5',
      title: 'Special Report: Ghana Yield Curve Analysis 2024',
      description: 'In-depth analysis of Ghana Treasury yield curve dynamics and interest rate forecasts',
      type: 'special',
      date: '2024-09-01',
      period: '2024',
      fileSize: '6.7 MB',
      pages: 72,
      downloads: 1560,
      featured: true,
    },
    {
      id: '6',
      title: 'Annual Report 2022',
      description: 'Full year report on Ghana Treasury market activity, investor trends, and economic outlook',
      type: 'annual',
      date: '2023-03-15',
      period: '2022',
      fileSize: '11.8 MB',
      pages: 148,
      downloads: 4200,
    },
    {
      id: '7',
      title: 'September 2024 Monthly Market Report',
      description: 'Monthly Treasury market update with auction results and yield analysis',
      type: 'monthly',
      date: '2024-10-05',
      period: 'September 2024',
      fileSize: '1.6 MB',
      pages: 22,
      downloads: 720,
    },
    {
      id: '8',
      title: 'Q1 2024 Quarterly Report',
      description: 'First quarter report on Treasury auction performance and market outlook',
      type: 'quarterly',
      date: '2024-04-15',
      period: 'Q1 2024',
      fileSize: '4.1 MB',
      pages: 46,
      downloads: 2340,
    },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesYear = yearFilter === 'all' || report.period.includes(yearFilter);
    return matchesSearch && matchesType && matchesYear;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'quarterly': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'monthly': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'special': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const featuredReports = reports.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reports & Publications</h1>
              <p className="text-muted-foreground">Annual reports, quarterly updates, and market analysis from Bank of Ghana Treasury operations</p>
            </div>
            <FileText className="h-12 w-12 text-primary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">{reports.length}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold text-foreground">
                  {reports.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latest Report</p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(reports[0].date).toLocaleDateString()}
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
                <p className="text-sm text-muted-foreground">Annual Reports</p>
                <p className="text-2xl font-bold text-foreground">
                  {reports.filter(r => r.type === 'annual').length}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Featured Reports */}
        {featuredReports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredReports.map((report, index) => (
                <AnimatedCard 
                  key={report.id}
                  className="border border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden"
                  delay={index * 100}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">{report.period}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{report.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{report.pages} pages</span>
                      <span>{report.fileSize}</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {report.downloads}
                      </span>
                    </div>
                    <AnimatedButton variant="primary" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </AnimatedButton>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="annual">Annual Reports</option>
              <option value="quarterly">Quarterly Reports</option>
              <option value="monthly">Monthly Reports</option>
              <option value="special">Special Reports</option>
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </AnimatedCard>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report, index) => (
            <AnimatedCard 
              key={report.id}
              className="border border-border overflow-hidden hover:shadow-lg transition-shadow"
              delay={index * 50}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">{report.period}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {report.pages} pages
                      </span>
                      <span>{report.fileSize}</span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {report.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <AnimatedButton variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </AnimatedButton>
                    <AnimatedButton variant="primary">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <AnimatedCard className="p-12 text-center border border-border">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <AnimatedButton variant="outline" onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setYearFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </AnimatedButton>
          </AnimatedCard>
        )}

        {/* CTA Section */}
        <AnimatedCard className="mt-12 p-8 border border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Stay Informed</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to receive notifications when new reports and market analysis are published.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <AnimatedButton variant="primary">
                  Subscribe to Updates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
              <Link href="/market-data">
                <AnimatedButton variant="outline">
                  View Market Data
                  <BarChart3 className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
