'use client';

import { useState, useEffect } from 'react';
import { Calendar, Grid, List, Filter, ChevronLeft, ChevronRight, Download, FileText, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface Auction {
  id: string;
  auctionCode: string;
  securityType: string;
  securityName: string;
  auctionType: string;
  status: string;
  targetAmount: number;
  auctionDate: string;
  settlementDate: string;
  announcementDate?: string;
  issueDate?: string;
  maturityDate?: string;
  highRate?: number;
  investmentRate?: number;
  cusip?: string;
  isReopening?: boolean;
  originalIssueDate?: string;
}

interface IssuanceCalendar {
  id: string;
  title: string;
  period: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: string;
}

type ViewMode = 'calendar' | 'list';
type TabType = 'upcoming' | 'reopenings' | 'results' | 'calendar' | 'issuance-calendar';

export default function AuctionCalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [issuanceCalendars, setIssuanceCalendars] = useState<IssuanceCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchAuctions();
    fetchIssuanceCalendars();
  }, []);

  const fetchAuctions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auctions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Mock data for demonstration
        const mockAuctions: Auction[] = [
          {
            id: '1',
            auctionCode: 'GH-TB-91D-2025-11',
            securityType: 'TREASURY_BILL',
            securityName: '91-Day Treasury Bill',
            auctionType: 'COMPETITIVE',
            status: 'OPEN',
            targetAmount: 500000000,
            auctionDate: '2025-11-24',
            settlementDate: '2025-11-28',
            announcementDate: '2025-11-20',
            issueDate: '2025-11-28',
            maturityDate: '2026-02-19',
            cusip: 'GH0012345678',
          },
          {
            id: '2',
            auctionCode: 'GH-TB-182D-2025-11',
            securityType: 'TREASURY_BILL',
            securityName: '182-Day Treasury Bill',
            auctionType: 'COMPETITIVE',
            status: 'OPEN',
            targetAmount: 400000000,
            auctionDate: '2025-11-25',
            settlementDate: '2025-11-28',
            announcementDate: '2025-11-20',
            issueDate: '2025-11-28',
            maturityDate: '2026-05-21',
            cusip: 'GH0012345679',
          },
          {
            id: '3',
            auctionCode: 'GH-TN-2Y-2025-10-R',
            securityType: 'TREASURY_NOTE',
            securityName: '2-Year Treasury Note',
            auctionType: 'COMPETITIVE',
            status: 'OPEN',
            targetAmount: 750000000,
            auctionDate: '2025-11-24',
            settlementDate: '2025-12-01',
            announcementDate: '2025-11-20',
            issueDate: '2025-12-01',
            maturityDate: '2027-10-31',
            cusip: 'GH0012345680',
            isReopening: true,
            originalIssueDate: '2025-10-30',
          },
        ];
        setAuctions(mockAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssuanceCalendars = async () => {
    try {
      // Mock issuance calendars
      const mockCalendars: IssuanceCalendar[] = [
        {
          id: '1',
          title: '2025 Oct - Dec Issuance Calendar',
          period: 'Q4 2025',
          fileUrl: '/files/issuance-calendar-q4-2025.pdf',
          uploadDate: '2025-09-25',
          fileSize: '2.4 MB',
        },
        {
          id: '2',
          title: '2025 Jul - Sep Issuance Calendar',
          period: 'Q3 2025',
          fileUrl: '/files/issuance-calendar-q3-2025.pdf',
          uploadDate: '2025-06-25',
          fileSize: '2.1 MB',
        },
        {
          id: '3',
          title: '2025 Apr - Jun Issuance Calendar',
          period: 'Q2 2025',
          fileUrl: '/files/issuance-calendar-q2-2025.pdf',
          uploadDate: '2025-03-25',
          fileSize: '2.3 MB',
        },
      ];
      setIssuanceCalendars(mockCalendars);
    } catch (error) {
      console.error('Error fetching issuance calendars:', error);
    }
  };

  const filteredAuctions = auctions.filter((auction) => {
    if (filterStatus && auction.status !== filterStatus) return false;
    if (filterType && auction.securityType !== filterType) return false;
    return true;
  });

  const getUpcomingAuctions = () => {
    return filteredAuctions.filter(auction => 
      auction.status === 'OPEN' || auction.status === 'ANNOUNCED'
    );
  };

  const getReopeningAuctions = () => {
    return filteredAuctions.filter(auction => auction.isReopening);
  };

  const getPastAuctions = () => {
    return filteredAuctions.filter(auction => 
      auction.status === 'CLOSED' || auction.status === 'SETTLED'
    );
  };

  const getAuctionsForDate = (date: Date) => {
    return filteredAuctions.filter((auction) => {
      const auctionDate = new Date(auction.auctionDate);
      return (
        auctionDate.getDate() === date.getDate() &&
        auctionDate.getMonth() === date.getMonth() &&
        auctionDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRate = (rate: number) => {
    return `${rate.toFixed(3)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-600/10 text-green-600 border border-green-600/20';
      case 'CLOSED':
        return 'bg-muted text-muted-foreground border border-border';
      case 'PENDING':
        return 'bg-yellow-600/10 text-yellow-600 border border-yellow-600/20';
      case 'SETTLED':
        return 'bg-blue-600/10 text-blue-600 border border-blue-600/20';
      case 'ANNOUNCED':
        return 'bg-purple-600/10 text-purple-600 border border-purple-600/20';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderUpcomingAuctions = () => (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Auctions
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Scheduled auction announcements and dates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Term</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CUSIP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Offering Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Announcement Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Auction Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {getUpcomingAuctions().length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No upcoming auctions scheduled
                  </td>
                </tr>
              ) : (
                getUpcomingAuctions().map((auction) => (
                  <tr key={auction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{auction.securityName}</p>
                        <p className="text-xs text-muted-foreground">{auction.auctionType.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-muted-foreground">{auction.cusip}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{formatCurrency(auction.targetAmount)}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {auction.announcementDate ? new Date(auction.announcementDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(auction.auctionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {auction.issueDate ? new Date(auction.issueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReopenings = () => (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Treasury Reopenings Schedule
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Previously issued securities being reopened for additional auction
          </p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Understanding Reopenings</h4>
          <p className="text-sm text-muted-foreground mb-3">
            A security reopening is when the government issues additional amounts of an existing security rather than creating a new one. This maintains liquidity and efficiency in the market.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-foreground text-sm mb-2">2-Year Treasury Note</h5>
              <p className="text-xs text-muted-foreground">
                Reopened one month after original issuance and reopened a second time two months after original issuance.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-foreground text-sm mb-2">3-Year Treasury Note</h5>
              <p className="text-xs text-muted-foreground">
                Reopened one month after original issuance and reopened a second time two months after original issuance.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Issue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reopening</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Auction Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {getReopeningAuctions().length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No scheduled reopenings
                  </td>
                </tr>
              ) : (
                getReopeningAuctions().map((auction) => (
                  <tr key={auction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-muted-foreground">{auction.securityName}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {auction.originalIssueDate ? new Date(auction.originalIssueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(auction.auctionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-mono text-muted-foreground">{auction.auctionCode}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(auction.status)}`}>
                        {auction.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Auction Results
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Results from the 20 most recently auctioned securities
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Bills
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-card hover:text-foreground hover:border-border transition-colors">
            Notes
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-card hover:text-foreground hover:border-border transition-colors">
            Bonds
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Security Term</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CUSIP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Maturity Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">High Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Investment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {getPastAuctions().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No auction results available
                  </td>
                </tr>
              ) : (
                getPastAuctions().map((auction) => (
                  <tr key={auction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-muted-foreground">{auction.securityName}</td>
                    <td className="px-4 py-4 text-sm font-mono text-muted-foreground">{auction.cusip}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {auction.issueDate ? new Date(auction.issueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {auction.maturityDate ? new Date(auction.maturityDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      {auction.highRate ? formatRate(auction.highRate) : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      {auction.investmentRate ? formatRate(auction.investmentRate) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIssuanceCalendar = () => (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Issuance Calendar Downloads
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Download quarterly issuance calendars in PDF format
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issuanceCalendars.map((calendar) => (
            <div key={calendar.id} className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{calendar.fileSize}</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">{calendar.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{calendar.period}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Uploaded: {new Date(calendar.uploadDate).toLocaleDateString()}
              </p>
              <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => {
    if (activeTab === 'calendar') {
      return (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={previousMonth} 
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextMonth} 
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium text-muted-foreground text-sm py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }
              
              const dayAuctions = getAuctionsForDate(date);
              const isToday =
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              const getAuctionStatusColor = (status: string) => {
                switch (status) {
                  case 'OPEN':
                    return 'bg-green-600/20 text-green-600 border border-green-600/30';
                  case 'CLOSED':
                    return 'bg-muted/50 text-muted-foreground border border-border/50';
                  case 'PENDING':
                    return 'bg-yellow-600/20 text-yellow-600 border border-yellow-600/30';
                  case 'SETTLED':
                    return 'bg-blue-600/20 text-blue-600 border border-blue-600/30';
                  case 'ANNOUNCED':
                    return 'bg-purple-600/20 text-purple-600 border border-purple-600/30';
                  default:
                    return 'bg-muted/50 text-muted-foreground border border-border/50';
                }
              };

              return (
                <div
                  key={index}
                  className={`aspect-square border rounded-lg p-2 transition-all ${
                    isToday 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-border/80'
                  } ${
                    dayAuctions.length > 0 
                      ? 'cursor-pointer hover:bg-muted/50 hover:shadow-sm' 
                      : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary' : 'text-foreground'
                  }`}>
                    {date.getDate()}
                  </div>
                  {dayAuctions.slice(0, 2).map((auction) => (
                    <div
                      key={auction.id}
                      className={`text-xs rounded px-1 py-0.5 mb-1 truncate border ${getAuctionStatusColor(auction.status)}`}
                      title={`${auction.auctionCode} - ${auction.status}`}
                    >
                      {auction.auctionCode}
                    </div>
                  ))}
                  {dayAuctions.length > 2 && (
                    <div className="text-xs text-muted-foreground font-medium">
                      +{dayAuctions.length - 2} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-600/20 border border-green-600/30" />
                <span className="text-muted-foreground">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-600/20 border border-purple-600/30" />
                <span className="text-muted-foreground">Announced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-600/20 border border-yellow-600/30" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600/20 border border-blue-600/30" />
                <span className="text-muted-foreground">Settled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted/50 border border-border/50" />
                <span className="text-muted-foreground">Closed</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auction Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage upcoming auction schedules and results
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'calendar' && (
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="w-4 h-4" />
                Calendar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-xl p-1">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Upcoming Auctions
          </button>
          <button
            onClick={() => setActiveTab('reopenings')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'reopenings'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Reopenings
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setActiveTab('issuance-calendar')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'issuance-calendar'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Issuance Calendar
          </button>
        </div>
      </div>

      {/* Filters (show for relevant tabs) */}
      {(activeTab === 'upcoming' || activeTab === 'results') && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="PENDING">Pending</option>
              <option value="SETTLED">Settled</option>
              <option value="ANNOUNCED">Announced</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            >
              <option value="">All Types</option>
              <option value="TREASURY_BILL">Treasury Bill</option>
              <option value="TREASURY_NOTE">Treasury Note</option>
              <option value="TREASURY_BOND">Treasury Bond</option>
            </select>
            {(filterStatus || filterType) && (
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterType('');
                }}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading auctions...</p>
        </div>
      ) : (
        <>
          {activeTab === 'upcoming' && renderUpcomingAuctions()}
          {activeTab === 'reopenings' && renderReopenings()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'calendar' && renderCalendarView()}
          {activeTab === 'issuance-calendar' && renderIssuanceCalendar()}
        </>
      )}
    </div>
  );
}
