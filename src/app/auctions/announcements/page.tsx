'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Download, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  ArrowUpRight,
  Bell,
  Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface Announcement {
  id: string;
  title: string;
  type: 'AUCTION_ANNOUNCEMENT' | 'RESULT_NOTICE' | 'CALENDAR_UPDATE' | 'REGULATORY_NOTICE';
  summary: string;
  content: string;
  publishDate: string;
  effectiveDate?: string;
  auctionDate?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isImportant: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
}

export default function AuctionAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: '91-Day Treasury Bill Auction - November 21, 2025',
          type: 'AUCTION_ANNOUNCEMENT',
          summary: 'Bank of Ghana announces auction of GHS 500 million 91-day Treasury bills',
          content: 'The Bank of Ghana announces the auction of 91-day Treasury bills with a target amount of GHS 500 million. The auction will be conducted on November 21, 2025, with settlement on November 24, 2025.',
          publishDate: '2025-11-14T09:00:00Z',
          effectiveDate: '2025-11-14',
          auctionDate: '2025-11-21',
          fileUrl: '/files/tb-091-nov-2025.pdf',
          fileName: 'TB-091-Auction-Notice-Nov-2025.pdf',
          fileSize: '245 KB',
          isImportant: true,
          status: 'ACTIVE',
        },
        {
          id: '2',
          title: 'Q4 2025 Treasury Issuance Calendar Update',
          type: 'CALENDAR_UPDATE',
          summary: 'Updated schedule for Treasury securities auctions in Q4 2025',
          content: 'The Bank of Ghana has updated the Treasury issuance calendar for Q4 2025, including additional auction dates and adjusted target amounts for Treasury bills and government bonds.',
          publishDate: '2025-11-10T14:30:00Z',
          effectiveDate: '2025-11-10',
          fileUrl: '/files/q4-2025-calendar-update.pdf',
          fileName: 'Q4-2025-Calendar-Update.pdf',
          fileSize: '1.2 MB',
          isImportant: false,
          status: 'ACTIVE',
        },
        {
          id: '3',
          title: '182-Day Treasury Bill Auction Results - November 14, 2025',
          type: 'RESULT_NOTICE',
          summary: 'Results of the 182-day Treasury bill auction conducted on November 14, 2025',
          content: 'The Bank of Ghana announces the results of the 182-day Treasury bill auction held on November 14, 2025. The auction was oversubscribed with a total bid amount of GHS 650 million against a target of GHS 400 million.',
          publishDate: '2025-11-15T16:00:00Z',
          auctionDate: '2025-11-14',
          isImportant: false,
          status: 'ACTIVE',
        },
        {
          id: '4',
          title: '2-Year Government Bond Auction - December 5, 2025',
          type: 'AUCTION_ANNOUNCEMENT',
          summary: 'Bank of Ghana announces auction of GHS 750 million 2-year government bonds',
          content: 'The Bank of Ghana announces the auction of 2-year government bonds with a target amount of GHS 750 million. The auction will be conducted on December 5, 2025, with settlement on December 8, 2025.',
          publishDate: '2025-11-28T09:00:00Z',
          effectiveDate: '2025-11-28',
          auctionDate: '2025-12-05',
          isImportant: true,
          status: 'UPCOMING',
        },
        {
          id: '5',
          title: 'Regulatory Notice: Changes to Auction Procedures',
          type: 'REGULATORY_NOTICE',
          summary: 'Important updates to Treasury auction participation requirements',
          content: 'The Bank of Ghana announces important changes to the Treasury auction participation requirements, including updated KYC procedures and minimum bid amounts for retail investors.',
          publishDate: '2025-11-05T11:00:00Z',
          effectiveDate: '2025-11-15',
          isImportant: true,
          status: 'ACTIVE',
        },
        {
          id: '6',
          title: '364-Day Treasury Bill Auction - December 12, 2025',
          type: 'AUCTION_ANNOUNCEMENT',
          summary: 'Bank of Ghana announces auction of GHS 600 million 364-day Treasury bills',
          content: 'The Bank of Ghana announces the auction of 364-day Treasury bills with a target amount of GHS 600 million. The auction will be conducted on December 12, 2025, with settlement on December 15, 2025.',
          publishDate: '2025-12-05T09:00:00Z',
          effectiveDate: '2025-12-05',
          auctionDate: '2025-12-12',
          isImportant: false,
          status: 'UPCOMING',
        },
        {
          id: '7',
          title: '3-Year Government Bond Auction Results - November 7, 2025',
          type: 'RESULT_NOTICE',
          summary: 'Results of the 3-year government bond auction conducted on November 7, 2025',
          content: 'The Bank of Ghana announces the results of the 3-year government bond auction held on November 7, 2025. The auction was fully subscribed with a total bid amount of GHS 500 million.',
          publishDate: '2025-11-08T16:00:00Z',
          auctionDate: '2025-11-07',
          isImportant: false,
          status: 'ACTIVE',
        },
        {
          id: '8',
          title: 'New TreasuryDirect Platform Launch',
          type: 'REGULATORY_NOTICE',
          summary: 'Introduction of the new digital platform for Treasury securities trading',
          content: 'The Bank of Ghana announces the launch of the new TreasuryDirect platform, enabling investors to participate in Treasury auctions and trade securities online.',
          publishDate: '2025-10-15T10:00:00Z',
          effectiveDate: '2025-11-01',
          isImportant: true,
          status: 'ACTIVE',
        },
      ];
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesType = !filterType || announcement.type === filterType;
    const matchesSearch = !searchTerm || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AUCTION_ANNOUNCEMENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'RESULT_NOTICE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CALENDAR_UPDATE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'REGULATORY_NOTICE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AUCTION_ANNOUNCEMENT':
        return <Megaphone className="h-4 w-4" />;
      case 'RESULT_NOTICE':
        return <TrendingUp className="h-4 w-4" />;
      case 'CALENDAR_UPDATE':
        return <Calendar className="h-4 w-4" />;
      case 'REGULATORY_NOTICE':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
              Auction Announcements
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up">
              Official announcements and notices from the Bank of Ghana
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Important Notice */}
        <AnimatedCard className="p-6 border border-red-200 bg-red-50 dark:bg-red-900/10 mb-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Important Announcements
              </h3>
              <p className="text-sm text-muted-foreground">
                Stay informed about critical auction updates, regulatory changes, and market notices that may affect your investments.
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="AUCTION_ANNOUNCEMENT">Auction Announcements</option>
              <option value="RESULT_NOTICE">Result Notices</option>
              <option value="CALENDAR_UPDATE">Calendar Updates</option>
              <option value="REGULATORY_NOTICE">Regulatory Notices</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {paginatedAnnouncements.length} of {filteredAnnouncements.length} announcements
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        ) : paginatedAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No announcements found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedAnnouncements.map((announcement, index) => (
              <AnimatedCard 
                key={announcement.id} 
                delay={index * 50} 
                className={`p-6 border ${
                  announcement.isImportant ? 'border-red-200 bg-red-50/50 dark:bg-red-900/5' : 'border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    announcement.isImportant 
                      ? 'bg-red-100 dark:bg-red-900/20' 
                      : 'bg-muted'
                  }`}>
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {announcement.title}
                          </h3>
                          {announcement.isImportant && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {announcement.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                        {announcement.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                        {announcement.status}
                      </span>
                      {announcement.auctionDate && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                          Auction: {formatDate(announcement.auctionDate)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Published: {formatDate(announcement.publishDate)}</span>
                        </div>
                        {announcement.effectiveDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Effective: {formatDate(announcement.effectiveDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {announcement.fileUrl && (
                          <AnimatedButton variant="outline" className="text-sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </AnimatedButton>
                        )}
                        <AnimatedButton 
                          variant="primary" 
                          className="text-sm"
                          onClick={() => setSelectedAnnouncement(announcement)}
                        >
                          Read More
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
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
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {selectedAnnouncement.title}
                </h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
                <p>{selectedAnnouncement.content}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Published: {formatDate(selectedAnnouncement.publishDate)}
                </div>
                <div className="flex items-center gap-3">
                  {selectedAnnouncement.fileUrl && (
                    <AnimatedButton variant="outline" className="text-sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download PDF
                    </AnimatedButton>
                  )}
                  <AnimatedButton 
                    variant="primary" 
                    className="text-sm"
                    onClick={() => setSelectedAnnouncement(null)}
                  >
                    Close
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
