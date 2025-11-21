'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Plus, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Clock,
  Eye,
  Edit,
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface RepoAgreement {
  id: string;
  agreementNumber: string;
  borrowerName: string;
  lenderName: string;
  securityCode: string;
  principalAmount: number;
  repoRate: number;
  haircutPercent: number;
  collateralValue: number;
  startDate: string;
  maturityDate: string;
  term: 'OVERNIGHT' | 'TERM_7_DAYS' | 'TERM_14_DAYS' | 'TERM_30_DAYS' | 'TERM_60_DAYS' | 'TERM_90_DAYS' | 'CUSTOM';
  status: 'ACTIVE' | 'MATURED' | 'TERMINATED' | 'DEFAULTED';
  accruedInterest: number;
}

export default function RepoTradingPage() {
  const [repoAgreements, setRepoAgreements] = useState<RepoAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  useEffect(() => {
    fetchRepoAgreements();
  }, []);

  const fetchRepoAgreements = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/admin/repos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setRepoAgreements(data.repoAgreements || []);
      }
    } catch (error) {
      console.error('Error fetching repo agreements:', error);
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
      case 'ACTIVE': return 'text-green-500 bg-green-500/10';
      case 'MATURED': return 'text-blue-500 bg-blue-500/10';
      case 'TERMINATED': return 'text-orange-500 bg-orange-500/10';
      case 'DEFAULTED': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTermLabel = (term: string) => {
    switch (term) {
      case 'OVERNIGHT': return 'Overnight';
      case 'TERM_7_DAYS': return '7 Days';
      case 'TERM_14_DAYS': return '14 Days';
      case 'TERM_30_DAYS': return '30 Days';
      case 'TERM_60_DAYS': return '60 Days';
      case 'TERM_90_DAYS': return '90 Days';
      case 'CUSTOM': return 'Custom';
      default: return term;
    }
  };

  const filteredRepos = repoAgreements.filter(repo => {
    const matchesFilter = filter === 'ALL' || repo.status === filter;
    const matchesSearch = searchTerm === '' || 
      repo.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.securityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.lenderName.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-2xl font-bold text-foreground">Repo Trading</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage repurchase agreements and collateral positions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Positions
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Repo Agreement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {repoAgreements.filter(r => r.status === 'ACTIVE').length}
          </p>
          <p className="text-xs text-muted-foreground">Active Positions</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(repoAgreements.reduce((sum, r) => sum + r.principalAmount, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Total Exposure</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {repoAgreements.length > 0 ? formatPercent(repoAgreements.reduce((sum, r) => sum + r.repoRate, 0) / repoAgreements.length) : '0.00%'}
          </p>
          <p className="text-xs text-muted-foreground">Average Repo Rate</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Shield className="w-4 h-4 text-orange-500" />
            </div>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(repoAgreements.reduce((sum, r) => sum + r.collateralValue, 0))}
          </p>
          <p className="text-xs text-muted-foreground">Total Collateral</p>
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
            <option value="ACTIVE">Active</option>
            <option value="MATURED">Matured</option>
            <option value="TERMINATED">Terminated</option>
            <option value="DEFAULTED">Defaulted</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by agreement, security, or counterparty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Repo Agreements Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Agreement</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Counterparties</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Collateral</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Principal</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Repo Rate</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Haircut</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Term</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Maturity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepos.map((repo) => (
                <tr key={repo.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{repo.agreementNumber}</p>
                      <p className="text-xs text-muted-foreground">Started {new Date(repo.startDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{repo.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">Borrower</p>
                      <p className="text-sm font-medium text-foreground mt-1">{repo.lenderName}</p>
                      <p className="text-xs text-muted-foreground">Lender</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{repo.securityCode}</p>
                      <p className="text-xs text-muted-foreground">Value: {formatCurrency(repo.collateralValue)}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{formatCurrency(repo.principalAmount)}</td>
                  <td className="p-4 text-sm text-foreground">{formatPercent(repo.repoRate)}</td>
                  <td className="p-4 text-sm text-foreground">{formatPercent(repo.haircutPercent)}</td>
                  <td className="p-4 text-sm text-foreground">{getTermLabel(repo.term)}</td>
                  <td className="p-4 text-sm text-foreground">
                    {new Date(repo.maturityDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repo.status)}`}>
                      {repo.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRepo(repo.id)}
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
        
        {filteredRepos.length === 0 && (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No repo agreements found</p>
          </div>
        )}
      </div>
    </div>
  );
}
