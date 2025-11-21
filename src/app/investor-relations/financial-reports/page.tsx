'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface FinancialReport {
  id: string;
  title: string;
  type: 'ANNUAL_REPORT' | 'QUARTERLY_REPORT' | 'FINANCIAL_STATEMENT' | 'MDA' | 'INVESTOR_PRESENTATION';
  year: number;
  quarter?: string;
  period: string;
  publishDate: string;
  fileUrl: string;
  fileSize: string;
  description: string;
  keyHighlights: string[];
  downloadCount: number;
}

interface ReportFilter {
  type: string;
  year: string;
  search: string;
}

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilter>({
    type: '',
    year: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchFinancialReports();
  }, []);

  const fetchFinancialReports = async () => {
    setLoading(true);
    try {
      // Mock financial reports data
      const mockReports: FinancialReport[] = [
        {
          id: '1',
          title: 'Annual Report 2024',
          type: 'ANNUAL_REPORT',
          year: 2024,
          period: 'FY 2024',
          publishDate: '2025-03-31',
          fileUrl: '#',
          fileSize: '8.5 MB',
          description: 'Comprehensive annual report including financial statements, management discussion, and strategic outlook.',
          keyHighlights: ['Revenue Growth: 45%', 'AUM: ₵2.5B', 'Active Users: 50,000+', 'Market Share: 35%'],
          downloadCount: 1250
        },
        {
          id: '2',
          title: 'Q3 2025 Quarterly Report',
          type: 'QUARTERLY_REPORT',
          year: 2025,
          quarter: 'Q3',
          period: 'Q3 2025',
          publishDate: '2025-10-30',
          fileUrl: '#',
          fileSize: '3.2 MB',
          description: 'Third quarter 2025 financial results and operational highlights.',
          keyHighlights: ['Quarterly Revenue: ₵125M', 'New Users: 8,500', 'Trading Volume: ₵2.8B', 'Profit Margin: 18%'],
          downloadCount: 850
        },
        {
          id: '3',
          title: 'Q2 2025 Quarterly Report',
          type: 'QUARTERLY_REPORT',
          year: 2025,
          quarter: 'Q2',
          period: 'Q2 2025',
          publishDate: '2025-07-31',
          fileUrl: '#',
          fileSize: '3.1 MB',
          description: 'Second quarter 2025 financial results and operational highlights.',
          keyHighlights: ['Quarterly Revenue: ₵118M', 'New Users: 7,200', 'Trading Volume: ₵2.5B', 'Profit Margin: 17%'],
          downloadCount: 720
        },
        {
          id: '4',
          title: 'Audited Financial Statements 2024',
          type: 'FINANCIAL_STATEMENT',
          year: 2024,
          period: 'FY 2024',
          publishDate: '2025-03-15',
          fileUrl: '#',
          fileSize: '2.8 MB',
          description: 'Complete audited financial statements including balance sheet, income statement, and cash flows.',
          keyHighlights: ['Total Assets: ₵3.2B', 'Revenue: ₵420M', 'Net Income: ₵75M', 'Equity: ₵1.8B'],
          downloadCount: 950
        },
        {
          id: '5',
          title: 'Investor Presentation October 2025',
          type: 'INVESTOR_PRESENTATION',
          year: 2025,
          period: 'October 2025',
          publishDate: '2025-10-15',
          fileUrl: '#',
          fileSize: '5.2 MB',
          description: 'Latest investor presentation covering strategy, market position, and growth initiatives.',
          keyHighlights: ['Market Leadership', 'Technology Platform', 'Growth Strategy', 'Risk Management'],
          downloadCount: 650
        },
        {
          id: '6',
          title: 'Management Discussion & Analysis 2024',
          type: 'MDA',
          year: 2024,
          period: 'FY 2024',
          publishDate: '2025-03-20',
          fileUrl: '#',
          fileSize: '1.8 MB',
          description: 'Detailed management discussion and analysis of financial results and business performance.',
          keyHighlights: ['Business Overview', 'Risk Factors', 'Future Outlook', 'Strategic Initiatives'],
          downloadCount: 420
        },
        {
          id: '7',
          title: 'Q1 2025 Quarterly Report',
          type: 'QUARTERLY_REPORT',
          year: 2025,
          quarter: 'Q1',
          period: 'Q1 2025',
          publishDate: '2025-04-30',
          fileUrl: '#',
          fileSize: '3.0 MB',
          description: 'First quarter 2025 financial results and operational highlights.',
          keyHighlights: ['Quarterly Revenue: ₵105M', 'New Users: 6,800', 'Trading Volume: ₵2.2B', 'Profit Margin: 16%'],
          downloadCount: 680
        },
        {
          id: '8',
          title: 'Annual Report 2023',
          type: 'ANNUAL_REPORT',
          year: 2023,
          period: 'FY 2023',
          publishDate: '2024-03-31',
          fileUrl: '#',
          fileSize: '7.8 MB',
          description: 'Comprehensive annual report including financial statements, management discussion, and strategic outlook.',
          keyHighlights: ['Revenue Growth: 38%', 'AUM: ₵1.8B', 'Active Users: 35,000+', 'Market Share: 28%'],
          downloadCount: 1100
        },
        {
          id: '9',
          title: 'Audited Financial Statements 2023',
          type: 'FINANCIAL_STATEMENT',
          year: 2023,
          period: 'FY 2023',
          publishDate: '2024-03-15',
          fileUrl: '#',
          fileSize: '2.6 MB',
          description: 'Complete audited financial statements including balance sheet, income statement, and cash flows.',
          keyHighlights: ['Total Assets: ₵2.4B', 'Revenue: ₵320M', 'Net Income: ₵58M', 'Equity: ₵1.5B'],
          downloadCount: 890
        },
        {
          id: '10',
          title: 'Q4 2024 Quarterly Report',
          type: 'QUARTERLY_REPORT',
          year: 2024,
          quarter: 'Q4',
          period: 'Q4 2024',
          publishDate: '2025-01-31',
          fileUrl: '#',
          fileSize: '3.3 MB',
          description: 'Fourth quarter 2024 financial results and operational highlights.',
          keyHighlights: ['Quarterly Revenue: ₵112M', 'New Users: 7,500', 'Trading Volume: ₵2.4B', 'Profit Margin: 17%'],
          downloadCount: 750
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch financial reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = !filters.type || report.type === filters.type;
    const matchesYear = !filters.year || report.year.toString() === filters.year;
    const matchesSearch = !filters.search || 
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesYear && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'ANNUAL_REPORT': return 'Annual Report';
      case 'QUARTERLY_REPORT': return 'Quarterly Report';
      case 'FINANCIAL_STATEMENT': return 'Financial Statement';
      case 'MDA': return 'MD&A';
      case 'INVESTOR_PRESENTATION': return 'Investor Presentation';
      default: return type;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'ANNUAL_REPORT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'QUARTERLY_REPORT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'FINANCIAL_STATEMENT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'MDA': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'INVESTOR_PRESENTATION': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (report: FinancialReport) => {
    // Mock download functionality
    console.log('Downloading report:', report.title);
    // Update download count
    setReports(prev => prev.map(r => 
      r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
  };

  const years = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a);
  const reportTypes = [...new Set(reports.map(r => r.type))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/investor-relations" className="text-primary hover:text-primary/80 text-sm mb-2 inline-block">
                ← Back to Investor Relations
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Financial Reports
              </h1>
              <p className="text-muted-foreground">
                Access our audited financial statements, quarterly results, and annual reports
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download All Reports
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue (2024)</p>
                <p className="text-2xl font-bold text-foreground">₵420M</p>
                <p className="text-sm text-green-600">+45% YoY</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AUM</p>
                <p className="text-2xl font-bold text-foreground">₵2.5B</p>
                <p className="text-sm text-green-600">+38% YoY</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold text-foreground">₵75M</p>
                <p className="text-sm text-green-600">+52% YoY</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-foreground">18%</p>
                <p className="text-sm text-green-600">+2.1% YoY</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{getReportTypeLabel(type)}</option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <AnimatedButton 
              variant="outline" 
              onClick={() => setFilters({type: '', year: '', search: ''})}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Available Reports ({filteredReports.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading financial reports...</p>
          </div>
        ) : paginatedReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No reports found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new reports.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReports.map((report, index) => (
              <AnimatedCard 
                key={report.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 50}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                    {getReportTypeLabel(report.type)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.fileSize}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {report.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {report.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(report.publishDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {report.downloadCount.toLocaleString()}
                  </div>
                </div>

                {report.keyHighlights.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Key Highlights:</p>
                    <div className="space-y-1">
                      {report.keyHighlights.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-1 w-1 bg-primary rounded-full" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <AnimatedButton 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => handleDownload(report)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
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
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {selectedReport.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(selectedReport.type)}`}>
                      {getReportTypeLabel(selectedReport.type)}
                    </span>
                    <span>{formatDate(selectedReport.publishDate)}</span>
                    <span>{selectedReport.fileSize}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  {selectedReport.description}
                </p>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Key Highlights:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedReport.keyHighlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Downloaded {selectedReport.downloadCount.toLocaleString()} times
                </div>
                <div className="flex items-center gap-3">
                  <AnimatedButton variant="outline" onClick={() => setSelectedReport(null)}>
                    Close
                  </AnimatedButton>
                  <AnimatedButton variant="primary" onClick={() => handleDownload(selectedReport)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
