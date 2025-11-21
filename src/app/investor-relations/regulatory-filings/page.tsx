'use client';

import { useState, useEffect } from 'react';
import { 
  Scale, 
  Download, 
  Calendar, 
  Filter,
  Search,
  Eye,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface RegulatoryFiling {
  id: string;
  title: string;
  regulator: 'BOG' | 'SEC' | 'GSE' | 'OTHER';
  type: 'ANNUAL' | 'QUARTERLY' | 'ADHOC' | 'COMPLIANCE' | 'AUDIT' | 'RISK';
  filingDate: string;
  effectiveDate?: string;
  status: 'COMPLETED' | 'PENDING' | 'REVIEW' | 'APPROVED';
  fileUrl: string;
  fileSize: string;
  description: string;
  requirements: string[];
  complianceScore: number;
  nextFilingDate?: string;
}

interface FilingFilter {
  regulator: string;
  type: string;
  status: string;
  search: string;
}

export default function RegulatoryFilingsPage() {
  const [filings, setFilings] = useState<RegulatoryFiling[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilingFilter>({
    regulator: '',
    type: '',
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFiling, setSelectedFiling] = useState<RegulatoryFiling | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchRegulatoryFilings();
  }, []);

  const fetchRegulatoryFilings = async () => {
    setLoading(true);
    try {
      // Mock regulatory filings data
      const mockFilings: RegulatoryFiling[] = [
        {
          id: '1',
          title: 'BoG Annual Compliance Report 2024',
          regulator: 'BOG',
          type: 'ANNUAL',
          filingDate: '2025-03-31',
          effectiveDate: '2024-12-31',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '4.2 MB',
          description: 'Comprehensive annual compliance report submitted to Bank of Ghana covering all regulatory requirements.',
          requirements: ['Capital Adequacy', 'Risk Management', 'Anti-Money Laundering', 'Consumer Protection'],
          complianceScore: 98,
          nextFilingDate: '2026-03-31'
        },
        {
          id: '2',
          title: 'SEC Quarterly Disclosure Q3 2025',
          regulator: 'SEC',
          type: 'QUARTERLY',
          filingDate: '2025-10-30',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '2.8 MB',
          description: 'Quarterly disclosure filing to Securities and Exchange Commission Ghana.',
          requirements: ['Financial Statements', 'Material Disclosures', 'Risk Factors', 'Corporate Actions'],
          complianceScore: 95,
          nextFilingDate: '2026-01-31'
        },
        {
          id: '3',
          title: 'GSE Trading Compliance Report',
          regulator: 'GSE',
          type: 'COMPLIANCE',
          filingDate: '2025-11-15',
          status: 'APPROVED',
          fileUrl: '#',
          fileSize: '1.5 MB',
          description: 'Monthly trading compliance report for Ghana Stock Exchange.',
          requirements: ['Trading Volumes', 'Market Integrity', 'Order Fairness', 'Price Discovery'],
          complianceScore: 92,
          nextFilingDate: '2025-12-15'
        },
        {
          id: '4',
          title: 'BoG Risk Assessment Q2 2025',
          regulator: 'BOG',
          type: 'RISK',
          filingDate: '2025-07-31',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '3.1 MB',
          description: 'Quarterly risk assessment and stress testing results for Bank of Ghana.',
          requirements: ['Credit Risk', 'Market Risk', 'Operational Risk', 'Liquidity Risk'],
          complianceScore: 96,
          nextFilingDate: '2026-01-31'
        },
        {
          id: '5',
          title: 'SEC Anti-Money Laundering Report',
          regulator: 'SEC',
          type: 'COMPLIANCE',
          filingDate: '2025-09-30',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '2.2 MB',
          description: 'Annual anti-money laundering and counter-terrorism financing report.',
          requirements: ['KYC Compliance', 'Transaction Monitoring', 'Suspicious Activity Reports', 'Training Records'],
          complianceScore: 94,
          nextFilingDate: '2026-09-30'
        },
        {
          id: '6',
          title: 'Independent Audit Report 2024',
          regulator: 'OTHER',
          type: 'AUDIT',
          filingDate: '2025-04-15',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '5.8 MB',
          description: 'Independent external audit report for fiscal year 2024.',
          requirements: ['Financial Controls', 'Internal Audit', 'Governance Review', 'Management Letter'],
          complianceScore: 97,
          nextFilingDate: '2026-04-15'
        },
        {
          id: '7',
          title: 'BoG Adhoc Security Update',
          regulator: 'BOG',
          type: 'ADHOC',
          filingDate: '2025-11-10',
          status: 'PENDING',
          fileUrl: '#',
          fileSize: '0.8 MB',
          description: 'Adhoc filing regarding security enhancements and cyber security measures.',
          requirements: ['Cyber Security', 'Data Protection', 'Incident Response', 'System Updates'],
          complianceScore: 88,
          nextFilingDate: '2025-11-25'
        },
        {
          id: '8',
          title: 'SEC Market Conduct Report Q1 2025',
          regulator: 'SEC',
          type: 'QUARTERLY',
          filingDate: '2025-04-30',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '1.9 MB',
          description: 'Quarterly market conduct and investor protection report.',
          requirements: ['Fair Trading', 'Investor Protection', 'Complaint Handling', 'Market Surveillance'],
          complianceScore: 93,
          nextFilingDate: '2025-07-31'
        },
        {
          id: '9',
          title: 'GSE Annual Market Report 2024',
          regulator: 'GSE',
          type: 'ANNUAL',
          filingDate: '2025-02-28',
          status: 'COMPLETED',
          fileUrl: '#',
          fileSize: '3.5 MB',
          description: 'Annual market activity and compliance report for Ghana Stock Exchange.',
          requirements: ['Trading Statistics', 'Market Quality', 'Compliance Metrics', 'Performance Review'],
          complianceScore: 91,
          nextFilingDate: '2026-02-28'
        },
        {
          id: '10',
          title: 'BoG Capital Adequacy Assessment',
          regulator: 'BOG',
          type: 'COMPLIANCE',
          filingDate: '2025-10-15',
          status: 'REVIEW',
          fileUrl: '#',
          fileSize: '2.6 MB',
          description: 'Bi-annual capital adequacy and solvency assessment.',
          requirements: ['Capital Ratios', 'Stress Testing', 'Capital Planning', 'Risk Weighted Assets'],
          complianceScore: 90,
          nextFilingDate: '2026-04-15'
        }
      ];
      setFilings(mockFilings);
    } catch (error) {
      console.error('Failed to fetch regulatory filings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFilings = filings.filter(filing => {
    const matchesRegulator = !filters.regulator || filing.regulator === filters.regulator;
    const matchesType = !filters.type || filing.type === filters.type;
    const matchesStatus = !filters.status || filing.status === filters.status;
    const matchesSearch = !filters.search || 
      filing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      filing.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesRegulator && matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFilings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFilings = filteredFilings.slice(startIndex, startIndex + itemsPerPage);

  const getRegulatorLabel = (regulator: string) => {
    switch (regulator) {
      case 'BOG': return 'Bank of Ghana';
      case 'SEC': return 'SEC Ghana';
      case 'GSE': return 'Ghana Stock Exchange';
      case 'OTHER': return 'Other';
      default: return regulator;
    }
  };

  const getRegulatorColor = (regulator: string) => {
    switch (regulator) {
      case 'BOG': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SEC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'GSE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'OTHER': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'REVIEW':
        return <Eye className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'APPROVED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const regulators = [...new Set(filings.map(f => f.regulator))];
  const types = [...new Set(filings.map(f => f.type))];
  const statuses = [...new Set(filings.map(f => f.status))];

  const handleDownload = (filing: RegulatoryFiling) => {
    console.log('Downloading filing:', filing.title);
  };

  const complianceStats = {
    totalFilings: filings.length,
    completedFilings: filings.filter(f => f.status === 'COMPLETED').length,
    pendingFilings: filings.filter(f => f.status === 'PENDING').length,
    averageCompliance: Math.round(filings.reduce((sum, f) => sum + f.complianceScore, 0) / filings.length)
  };

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
                Regulatory Filings
              </h1>
              <p className="text-muted-foreground">
                BoG, SEC, GSE compliance documents and regulatory disclosures
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Compliance Certificate
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Filings</p>
                <p className="text-2xl font-bold text-foreground">{complianceStats.totalFilings}</p>
                <p className="text-sm text-muted-foreground">This year</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{complianceStats.completedFilings}</p>
                <p className="text-sm text-green-600">On track</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{complianceStats.pendingFilings}</p>
                <p className="text-sm text-yellow-600">In progress</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className={`text-2xl font-bold ${getComplianceScoreColor(complianceStats.averageCompliance)}`}>
                  {complianceStats.averageCompliance}%
                </p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search filings..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={filters.regulator}
              onChange={(e) => setFilters({...filters, regulator: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Regulators</option>
              {regulators.map(regulator => (
                <option key={regulator} value={regulator}>{getRegulatorLabel(regulator)}</option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <AnimatedButton 
              variant="outline" 
              onClick={() => setFilters({regulator: '', type: '', status: '', search: ''})}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Filings Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Regulatory Filings ({filteredFilings.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading regulatory filings...</p>
          </div>
        ) : paginatedFilings.length === 0 ? (
          <div className="text-center py-12">
            <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No filings found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new filings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFilings.map((filing, index) => (
              <AnimatedCard 
                key={filing.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 50}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRegulatorColor(filing.regulator)}`}>
                      {getRegulatorLabel(filing.regulator)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(filing.status)}`}>
                      {getStatusIcon(filing.status)}
                      {filing.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {filing.fileSize}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {filing.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {filing.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Compliance Score:</span>
                    <span className={`font-medium ${getComplianceScoreColor(filing.complianceScore)}`}>
                      {filing.complianceScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Filing Date:</span>
                    <span>{formatDate(filing.filingDate)}</span>
                  </div>
                  {filing.nextFilingDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Filing:</span>
                      <span>{formatDate(filing.nextFilingDate)}</span>
                    </div>
                  )}
                </div>

                {filing.requirements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Requirements:</p>
                    <div className="space-y-1">
                      {filing.requirements.slice(0, 2).map((requirement, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-1 w-1 bg-primary rounded-full" />
                          {requirement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedFiling(filing)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(filing)}
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

      {/* Filing Details Modal */}
      {selectedFiling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {selectedFiling.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRegulatorColor(selectedFiling.regulator)}`}>
                      {getRegulatorLabel(selectedFiling.regulator)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedFiling.status)}`}>
                      {getStatusIcon(selectedFiling.status)}
                      {selectedFiling.status}
                    </span>
                    <span>{formatDate(selectedFiling.filingDate)}</span>
                    <span>{selectedFiling.fileSize}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFiling(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  {selectedFiling.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Compliance Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Compliance Score:</span>
                        <span className={`font-medium ${getComplianceScoreColor(selectedFiling.complianceScore)}`}>
                          {selectedFiling.complianceScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Filing Date:</span>
                        <span>{formatDate(selectedFiling.filingDate)}</span>
                      </div>
                      {selectedFiling.effectiveDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Effective Date:</span>
                          <span>{formatDate(selectedFiling.effectiveDate)}</span>
                        </div>
                      )}
                      {selectedFiling.nextFilingDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next Filing Date:</span>
                          <span>{formatDate(selectedFiling.nextFilingDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Regulatory Requirements</h3>
                    <div className="space-y-2">
                      {selectedFiling.requirements.map((requirement, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-muted/30 rounded text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Regulated by {getRegulatorLabel(selectedFiling.regulator)}
                </div>
                <div className="flex items-center gap-3">
                  <AnimatedButton variant="outline" onClick={() => setSelectedFiling(null)}>
                    Close
                  </AnimatedButton>
                  <AnimatedButton variant="primary" onClick={() => handleDownload(selectedFiling)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Filing
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
