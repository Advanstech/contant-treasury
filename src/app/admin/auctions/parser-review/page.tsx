'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react';

interface StagedAuction {
  id: string;
  tenderNumber: string;
  securityType: string;
  purpose?: string;
  rates: string;
  announcementDate: string;
  bidSubmissionDeadline: string;
  settlementDate: string;
  auctionDate?: string;
  bidTypes: {
    competitive: boolean;
    nonCompetitive: boolean;
  };
  eligibility: {
    participants: string[];
    isInterbankOnly: boolean;
    customerBidsAllowed: boolean;
  };
  secondaryMarketTrading: boolean;
  additionalTerms?: string[];
  importantNotes?: string[];
  source: string;
  extractedAt: string;
  confidence: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function AuctionParserReviewPage() {
  const [stagedAuctions, setStagedAuctions] = useState<StagedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<StagedAuction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchStagedAuctions();
  }, []);

  const fetchStagedAuctions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/auctions/parser/staged`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Mock data for demonstration
        const mockStagedAuctions: StagedAuction[] = [
          {
            id: 'stage_1234567890_abc123',
            tenderNumber: '665',
            securityType: '273-DAY BOG BILL',
            purpose: 'Long-term sterilization',
            rates: 'COMPETITIVE',
            announcementDate: '2022-07-22',
            bidSubmissionDeadline: '2022-07-25T14:00:00',
            settlementDate: '2022-07-25',
            bidTypes: {
              competitive: true,
              nonCompetitive: false,
            },
            eligibility: {
              participants: ['All banks'],
              isInterbankOnly: true,
              customerBidsAllowed: false,
            },
            secondaryMarketTrading: true,
            importantNotes: [
              'The 273-DAY BoG Bill is for the interbank market, available only to banks.',
              'Banks should not submit bids for their customers; customer bids should be directed to Treasury bills and bonds.',
            ],
            source: 'BOG Website',
            extractedAt: '2022-07-22T10:30:00',
            confidence: 0.95,
            status: 'PENDING_REVIEW',
            createdAt: '2022-07-22T10:30:00',
          },
          {
            id: 'stage_1234567891_def456',
            tenderNumber: '666',
            securityType: '91-DAY TREASURY BILL',
            purpose: 'Government financing',
            rates: 'BOTH',
            announcementDate: '2022-07-23',
            bidSubmissionDeadline: '2022-07-26T14:00:00',
            settlementDate: '2022-07-28',
            bidTypes: {
              competitive: true,
              nonCompetitive: true,
            },
            eligibility: {
              participants: ['All banks', 'Primary dealers', 'General public'],
              isInterbankOnly: false,
              customerBidsAllowed: true,
            },
            secondaryMarketTrading: true,
            source: 'Email Notification',
            extractedAt: '2022-07-23T09:15:00',
            confidence: 0.88,
            status: 'PENDING_REVIEW',
            createdAt: '2022-07-23T09:15:00',
          },
        ];
        setStagedAuctions(mockStagedAuctions);
      }
    } catch (error) {
      console.error('Error fetching staged auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = stagedAuctions.filter((auction) => {
    const matchesSearch = auction.tenderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.securityType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || auction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'bg-yellow-600/10 text-yellow-600 border border-yellow-600/20';
      case 'APPROVED':
        return 'bg-green-600/10 text-green-600 border border-green-600/20';
      case 'REJECTED':
        return 'bg-red-600/10 text-red-600 border border-red-600/20';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApprove = async (auctionId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/auctions/parser/approve`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stagedId: auctionId }),
        }
      );
      
      if (response.ok) {
        // Update local state
        setStagedAuctions(prev => 
          prev.map(auction => 
            auction.id === auctionId 
              ? { ...auction, status: 'APPROVED', reviewedAt: new Date().toISOString() }
              : auction
          )
        );
      }
    } catch (error) {
      console.error('Error approving auction:', error);
    }
  };

  const handleReject = async (auctionId: string, reason: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/auctions/parser/reject`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stagedId: auctionId, reason }),
        }
      );
      
      if (response.ok) {
        // Update local state
        setStagedAuctions(prev => 
          prev.map(auction => 
            auction.id === auctionId 
              ? { ...auction, status: 'REJECTED', rejectionReason: reason, reviewedAt: new Date().toISOString() }
              : auction
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting auction:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDetailsModal = () => {
    if (!selectedAuction) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Auction Details - {selectedAuction.tenderNumber}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Tender Number</label>
                  <p className="text-foreground font-medium">{selectedAuction.tenderNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Security Type</label>
                  <p className="text-foreground font-medium">{selectedAuction.securityType}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Purpose</label>
                  <p className="text-foreground font-medium">{selectedAuction.purpose || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Rates</label>
                  <p className="text-foreground font-medium">{selectedAuction.rates}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Confidence Score</label>
                  <p className={`font-medium ${getConfidenceColor(selectedAuction.confidence)}`}>
                    {(selectedAuction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Source</label>
                  <p className="text-foreground font-medium">{selectedAuction.source}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Announcement Date</label>
                  <p className="text-foreground font-medium">{formatDate(selectedAuction.announcementDate)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Bid Submission Deadline</label>
                  <p className="text-foreground font-medium">{formatDate(selectedAuction.bidSubmissionDeadline)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Settlement Date</label>
                  <p className="text-foreground font-medium">{formatDate(selectedAuction.settlementDate)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Auction Date</label>
                  <p className="text-foreground font-medium">
                    {selectedAuction.auctionDate ? formatDate(selectedAuction.auctionDate) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bid Types */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Bid Types</h3>
              <div className="flex gap-4">
                <div className={`px-3 py-1 rounded-lg border ${
                  selectedAuction.bidTypes.competitive 
                    ? 'bg-green-600/10 text-green-600 border-green-600/20' 
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  Competitive Bids
                </div>
                <div className={`px-3 py-1 rounded-lg border ${
                  selectedAuction.bidTypes.nonCompetitive 
                    ? 'bg-green-600/10 text-green-600 border-green-600/20' 
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  Non-Competitive Bids
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Eligibility</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">Participants</label>
                  <p className="text-foreground font-medium">{selectedAuction.eligibility.participants.join(', ')}</p>
                </div>
                <div className="flex gap-4">
                  <div className={`px-3 py-1 rounded-lg border ${
                    selectedAuction.eligibility.isInterbankOnly 
                      ? 'bg-orange-600/10 text-orange-600 border-orange-600/20' 
                      : 'bg-green-600/10 text-green-600 border-green-600/20'
                  }`}>
                    {selectedAuction.eligibility.isInterbankOnly ? 'Interbank Only' : 'Public Market'}
                  </div>
                  <div className={`px-3 py-1 rounded-lg border ${
                    selectedAuction.eligibility.customerBidsAllowed 
                      ? 'bg-green-600/10 text-green-600 border-green-600/20' 
                      : 'bg-red-600/10 text-red-600 border-red-600/20'
                  }`}>
                    Customer Bids {selectedAuction.eligibility.customerBidsAllowed ? 'Allowed' : 'Not Allowed'}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            {selectedAuction.importantNotes && selectedAuction.importantNotes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Important Notes</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedAuction.importantNotes.map((note, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {selectedAuction.status === 'PENDING_REVIEW' && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => handleApprove(selectedAuction.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve & Create Auction
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Please provide rejection reason:');
                    if (reason) {
                      handleReject(selectedAuction.id, reason);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auction Parser Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve parsed auction announcements from BoG
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStagedAuctions}
            disabled={loading}
            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-600/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-foreground">
                {stagedAuctions.filter(a => a.status === 'PENDING_REVIEW').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground">
                {stagedAuctions.filter(a => a.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-foreground">
                {stagedAuctions.filter(a => a.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <p className="text-2xl font-bold text-foreground">
                {stagedAuctions.length > 0 
                  ? (stagedAuctions.reduce((sum, a) => sum + a.confidence, 0) / stagedAuctions.length * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tender number or security type..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          >
            <option value="">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
              }}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Staged Auctions Table */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading staged auctions...</p>
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No staged auctions found
          </h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter 
              ? 'Try adjusting your filters' 
              : 'No auction announcements have been parsed yet'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tender #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Security</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Extracted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAuctions.map((auction) => (
                  <tr key={auction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-foreground font-mono text-sm font-medium">
                        {auction.tenderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-foreground text-sm font-medium">{auction.securityType}</p>
                        <p className="text-muted-foreground text-xs">{auction.purpose}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{auction.source}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getConfidenceColor(auction.confidence)}`}>
                          {(auction.confidence * 100).toFixed(1)}%
                        </span>
                        {auction.confidence < 0.8 && (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(auction.extractedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(auction.status)}`}>
                        {auction.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAuction(auction);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {auction.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleApprove(auction.id)}
                              className="p-2 hover:bg-green-600/10 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Please provide rejection reason:');
                                if (reason) {
                                  handleReject(auction.id, reason);
                                }
                              }}
                              className="p-2 hover:bg-red-600/10 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && renderDetailsModal()}
    </div>
  );
}
