'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  Building, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Activity,
  FileText,
  Shield,
  Calendar,
  Eye,
  ArrowRight,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Download,
  RefreshCw,
  Ban,
  UserPlus,
  CheckSquare,
  XCircle,
  Users
} from 'lucide-react';
import adminApi, { adminUsersApi, AdminUser } from '@/lib/admin-api';

interface CsdStats {
  totalAccounts: number;
  activeAccounts: number;
  pendingAccounts: number;
  suspendedAccounts: number;
  recentRegistrations: number;
}

export default function CsdAccountManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = React.useState(false);

  // Fetch CSD statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'users', 'csd', 'stats'],
    queryFn: () => adminUsersApi.getCsdStats(),
  });

  // Fetch CSD accounts with filters
  const { data: csdData, isLoading: csdLoading, refetch: refetchCsd } = useQuery({
    queryKey: ['admin', 'users', 'csd', 'list', currentPage, searchQuery, selectedStatus],
    queryFn: () => adminUsersApi.getCsdAccounts({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    }),
  });

  const users = csdData?.users || [];
  const totalUsers = csdData?.total || 0;
  const totalPages = Math.ceil(totalUsers / 20);

  // Mutations
  const approveCsdMutation = useMutation({
    mutationFn: (id: string) => adminUsersApi.approveCsdAccount(id),
    onSuccess: () => {
      toast.success('CSD account approved successfully');
      refetchCsd();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to approve CSD account', {
        description: error.response?.data?.message
      });
    },
  });

  const suspendCsdMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminUsersApi.suspendCsdAccount(id, reason),
    onSuccess: () => {
      toast.success('CSD account suspended successfully');
      refetchCsd();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to suspend CSD account', {
        description: error.response?.data?.message
      });
    },
  });

  const activateCsdMutation = useMutation({
    mutationFn: (id: string) => adminUsersApi.activateCsdAccount(id),
    onSuccess: () => {
      toast.success('CSD account activated successfully');
      refetchCsd();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to activate CSD account', {
        description: error.response?.data?.message
      });
    },
  });

  // Event handlers
  const handleApproveCsd = (userId: string) => {
    approveCsdMutation.mutate(userId);
  };

  const handleSuspendCsd = (userId: string) => {
    const reason = prompt('Enter reason for CSD suspension:');
    if (reason) {
      suspendCsdMutation.mutate({ id: userId, reason });
    }
  };

  const handleActivateCsd = (userId: string) => {
    activateCsdMutation.mutate(userId);
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCreateCsdAccount = (userId: string) => {
    // Navigate to KYC page with user pre-selected for CSD creation
    window.location.href = `/admin/users/kyc?user=${userId}&action=create-csd`;
  };

  const handleExportCsdReport = async () => {
    try {
      const blob = await adminUsersApi.generateCsdReport({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `csd-accounts-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('CSD report exported successfully');
    } catch (error: any) {
      toast.error('Failed to export CSD report', {
        description: error.response?.data?.message
      });
    }
  };

  const getCsdStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'suspended': return 'text-red-500 bg-red-500/10';
      case 'rejected': return 'text-red-500 bg-red-500/10';
      case 'under_review': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCsdStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended': return <Ban className="h-4 w-4 text-red-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CSD Account Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage Central Securities Depository accounts and user securities holdings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsdReport}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <Link
            href="/admin/settlements/csd-files"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            CSD Files
          </Link>
        </div>
      </div>

      {/* CSD Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.totalAccounts || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Total CSD Accounts</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.activeAccounts || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Active Accounts</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.pendingAccounts || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Pending Approval</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Ban className="h-6 w-6 text-red-500" />
            </div>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.suspendedAccounts || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Suspended</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.recentRegistrations || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Recent (7 days)</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">CSD Account Directory</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user name, email, or CSD account number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => {
              refetchCsd();
              refetchStats();
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-border">
            <div>
              <label className="block text-sm font-medium mb-2">CSD Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* CSD Accounts Table */}
        <div className="overflow-x-auto">
          {csdLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No CSD accounts found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">CSD Account</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Registration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">KYC Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.accountType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-sm text-foreground">
                            {user.csdAccountNumber || 'Not created'}
                          </span>
                        </div>
                        {user.csdRegistrationDate && (
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(user.csdRegistrationDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getCsdStatusIcon(user.csdAccountStatus)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCsdStatusColor(user.csdAccountStatus)}`}>
                          {user.csdAccountStatus || 'NOT_STARTED'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-foreground">
                          {user.csdApplicationDate 
                            ? new Date(user.csdApplicationDate).toLocaleDateString()
                            : 'Not applied'
                          }
                        </p>
                        {user.csdApprovalDate && (
                          <p className="text-muted-foreground">
                            Approved: {new Date(user.csdApprovalDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isKycVerified ? 'text-green-500 bg-green-500/10' :
                        'text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {user.isKycVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        {!user.csdAccountNumber && user.isKycVerified && (
                          <button
                            onClick={() => handleCreateCsdAccount(user.id)}
                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Create CSD Account"
                          >
                            <UserPlus className="h-4 w-4 text-blue-500" />
                          </button>
                        )}
                        {user.csdAccountStatus === 'PENDING' && (
                          <button
                            onClick={() => handleApproveCsd(user.id)}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                            disabled={approveCsdMutation.isPending}
                            title="Approve CSD"
                          >
                            <CheckSquare className="h-4 w-4 text-green-500" />
                          </button>
                        )}
                        {user.csdAccountStatus === 'ACTIVE' && (
                          <button
                            onClick={() => handleSuspendCsd(user.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            disabled={suspendCsdMutation.isPending}
                            title="Suspend CSD"
                          >
                            <Ban className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                        {user.csdAccountStatus === 'SUSPENDED' && (
                          <button
                            onClick={() => handleActivateCsd(user.id)}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                            disabled={activateCsdMutation.isPending}
                            title="Activate CSD"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} CSD accounts
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">CSD Account Details</h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                      {selectedUser.role}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs font-medium">
                      {selectedUser.accountType}
                    </span>
                  </div>
                </div>
              </div>

              {/* CSD Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CSD Account Number</label>
                  <p className="font-mono text-foreground">
                    {selectedUser.csdAccountNumber || 'Not created'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CSD Status</label>
                  <div className="flex items-center gap-2">
                    {getCsdStatusIcon(selectedUser.csdAccountStatus)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCsdStatusColor(selectedUser.csdAccountStatus)}`}>
                      {selectedUser.csdAccountStatus || 'NOT_STARTED'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Application Date</label>
                  <p className="text-foreground">
                    {selectedUser.csdApplicationDate 
                      ? new Date(selectedUser.csdApplicationDate).toLocaleDateString()
                      : 'Not applied'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                  <p className="text-foreground">
                    {selectedUser.csdRegistrationDate 
                      ? new Date(selectedUser.csdRegistrationDate).toLocaleDateString()
                      : 'Not registered'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approval Date</label>
                  <p className="text-foreground">
                    {selectedUser.csdApprovalDate 
                      ? new Date(selectedUser.csdApprovalDate).toLocaleDateString()
                      : 'Not approved'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">KYC Status</label>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedUser.isKycVerified ? 'text-green-500 bg-green-500/10' :
                    'text-yellow-500 bg-yellow-500/10'
                  }`}>
                    {selectedUser.isKycVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-border">
                {!selectedUser.csdAccountNumber && selectedUser.isKycVerified && (
                  <button
                    onClick={() => handleCreateCsdAccount(selectedUser.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create CSD Account
                  </button>
                )}
                {selectedUser.csdAccountStatus === 'PENDING' && (
                  <button
                    onClick={() => handleApproveCsd(selectedUser.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Approve CSD Account
                  </button>
                )}
                <Link
                  href={`/admin/users/${selectedUser.id}/edit`}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
                >
                  Edit User
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
