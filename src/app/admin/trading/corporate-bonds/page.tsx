'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Clock,
  Eye,
  Edit,
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';

interface CorporateBondIssue {
  id: string;
  securityCode: string;
  issuerName: string;
  issuerSector: string;
  issueSize: number;
  issuePrice: number;
  couponType: 'FIXED_RATE' | 'FLOATING_RATE' | 'ZERO_COUPON' | 'STEP_UP' | 'STEP_DOWN';
  couponRate?: number;
  frequency?: string;
  moodysRating?: string;
  spRating?: string;
  fitchRating?: string;
  localRating?: string;
  announcementDate: string;
  bookbuildingStart?: string;
  bookbuildingEnd?: string;
  pricingDate?: string;
  allocationDate?: string;
  listingDate?: string;
  status: 'UPCOMING' | 'BOOKBUILDING' | 'PRICED' | 'ALLOCATED' | 'LISTED' | 'TRADING' | 'MATURED' | 'CALLED' | 'DEFAULTED';
  isinCode?: string;
  listingVenue?: string;
  prospectusUrl?: string;
}

export default function CorporateBondsTradingPage() {
  const [bondIssues, setBondIssues] = useState<CorporateBondIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBond, setSelectedBond] = useState<string | null>(null);

  useEffect(() => {
    fetchCorporateBondIssues();
  }, []);

  const fetchCorporateBondIssues = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/corporate-bonds`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setBondIssues(data.bondIssues || []);
      }
    } catch (error) {
      console.error('Error fetching corporate bond issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'text-blue-500 bg-blue-500/10';
      case 'BOOKBUILDING': return 'text-green-500 bg-green-500/10';
      case 'PRICED': return 'text-purple-500 bg-purple-500/10';
      case 'ALLOCATED': return 'text-orange-500 bg-orange-500/10';
      case 'LISTED': return 'text-cyan-500 bg-cyan-500/10';
      case 'TRADING': return 'text-emerald-500 bg-emerald-500/10';
      case 'MATURED': return 'text-gray-500 bg-gray-500/10';
      case 'CALLED': return 'text-yellow-500 bg-yellow-500/10';
      case 'DEFAULTED': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getRatingColor = (rating?: string) => {
    if (!rating) return 'text-gray-500 bg-gray-500/10';
    
    const highRatings = ['AAA', 'AA+', 'AA', 'AA-'];
    const mediumRatings = ['A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-'];
    const lowRatings = ['BB+', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
    
    if (highRatings.includes(rating)) return 'text-green-500 bg-green-500/10';
    if (mediumRatings.includes(rating)) return 'text-yellow-500 bg-yellow-500/10';
    if (lowRatings.includes(rating)) return 'text-red-500 bg-red-500/10';
    return 'text-gray-500 bg-gray-500/10';
  };

  const getCouponTypeLabel = (type: string) => {
    switch (type) {
      case 'FIXED_RATE': return 'Fixed Rate';
      case 'FLOATING_RATE': return 'Floating Rate';
      case 'ZERO_COUPON': return 'Zero Coupon';
      case 'STEP_UP': return 'Step Up';
      case 'STEP_DOWN': return 'Step Down';
      default: return type;
    }
  };

  const filteredBonds = bondIssues.filter(bond => {
    const matchesFilter = filter === 'ALL' || bond.status === filter;
    const matchesSearch = searchTerm === '' || 
      bond.securityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bond.issuerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bond.isinCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Corporate Bonds</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage corporate bond issuances, bookbuilding, and allocations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Issues
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Bond Issue
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Building className="w-4 h-4 text-green-500" />
            </div>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {bondIssues.filter(b => b.status === 'BOOKBUILDING').length}
          </p>
          <p className="text-xs text-muted-foreground">Bookbuilding</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(bondIssues.reduce((sum, b) => sum + b.issueSize, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Total Issue Size</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Star className="w-4 h-4 text-purple-500" />
            </div>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {bondIssues.length > 0 ? formatPercent(bondIssues[0].couponRate || 0) : '0.00%'}
          </p>
          <p className="text-xs text-muted-foreground">Average Coupon</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <BarChart3 className="w-4 h-4 text-orange-500" />
            </div>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {bondIssues.filter(b => b.status === 'TRADING').length}
          </p>
          <p className="text-xs text-muted-foreground">Currently Trading</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="BOOKBUILDING">Bookbuilding</option>
            <option value="PRICED">Priced</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="LISTED">Listed</option>
            <option value="TRADING">Trading</option>
            <option value="MATURED">Matured</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by security, issuer, or ISIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Bond Issues Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Security</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Issuer</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Issue Size</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Coupon</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ratings</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bookbuilding</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBonds.map((bond) => (
                <tr key={bond.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{bond.securityCode}</p>
                      <p className="text-xs text-muted-foreground">{bond.isinCode || 'No ISIN'}</p>
                      {bond.listingVenue && (
                        <p className="text-xs text-muted-foreground">{bond.listingVenue}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{bond.issuerName}</p>
                      <p className="text-xs text-muted-foreground">{bond.issuerSector}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(bond.issueSize)}</p>
                      <p className="text-xs text-muted-foreground">@ {formatCurrency(bond.issuePrice)}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{getCouponTypeLabel(bond.couponType)}</p>
                      {bond.couponRate && (
                        <p className="text-xs text-muted-foreground">{formatPercent(bond.couponRate)}</p>
                      )}
                      {bond.frequency && (
                        <p className="text-xs text-muted-foreground">{bond.frequency}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {bond.localRating && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(bond.localRating)}`}>
                          {bond.localRating}
                        </span>
                      )}
                      {bond.moodysRating && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(bond.moodysRating)}`}>
                          M: {bond.moodysRating}
                        </span>
                      )}
                      {bond.spRating && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRatingColor(bond.spRating)}`}>
                          S&P: {bond.spRating}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {bond.bookbuildingStart && bond.bookbuildingEnd ? (
                      <div>
                        <p className="text-sm text-foreground">
                          {new Date(bond.bookbuildingStart).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          to {new Date(bond.bookbuildingEnd).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bond.status)}`}>
                      {bond.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {bond.prospectusUrl && (
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBond(bond.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBonds.length === 0 && (
          <div className="text-center py-8">
            <Building className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No corporate bond issues found</p>
          </div>
        )}
      </div>
    </div>
  );
}
