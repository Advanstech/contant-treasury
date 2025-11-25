'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
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
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Ban,
  UserPlus
} from 'lucide-react';
import adminApi, { adminUsersApi, AdminUser, UserStats, UserListParams } from '@/lib/admin-api';

export default function UserManagementDashboard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedKycStatus, setSelectedKycStatus] = React.useState('ALL');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = React.useState(false);

  // Fetch user statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: () => adminUsersApi.getStats(),
  });

  // Fetch users list with filters
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin', 'users', 'list', currentPage, searchQuery, selectedRole, selectedStatus, selectedKycStatus],
    queryFn: () => adminUsersApi.getAll({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      role: selectedRole !== 'ALL' ? selectedRole : undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      kycStatus: selectedKycStatus !== 'ALL' ? selectedKycStatus : undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
  });

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / 20);

  // Mutations
  const suspendUserMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => adminUsersApi.suspend(id, reason),
    onSuccess: () => {
      toast.success('User suspended successfully');
      refetchUsers();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to suspend user', {
        description: error.response?.data?.message
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (id: string) => adminUsersApi.verifyEmail(id),
    onSuccess: () => {
      toast.success('Email verified successfully');
      refetchUsers();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to verify email', {
        description: error.response?.data?.message
      });
    },
  });

  const approveKycMutation = useMutation({
    mutationFn: (id: string) => adminUsersApi.approveKyc(id),
    onSuccess: () => {
      toast.success('KYC approved successfully');
      refetchUsers();
      refetchStats();
    },
    onError: (error: any) => {
      toast.error('Failed to approve KYC', {
        description: error.response?.data?.message
      });
    },
  });

  // Event handlers
  const handleSuspendUser = (userId: string) => {
    const reason = prompt('Enter reason for suspension:');
    if (reason) {
      suspendUserMutation.mutate({ id: userId, reason });
    }
  };

  const handleVerifyEmail = (userId: string) => {
    verifyEmailMutation.mutate(userId);
  };

  const handleApproveKyc = (userId: string) => {
    approveKycMutation.mutate(userId);
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleExportUsers = async () => {
    try {
      const blob = await adminUsersApi.export({
        search: searchQuery || undefined,
        role: selectedRole !== 'ALL' ? selectedRole : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        kycStatus: selectedKycStatus !== 'ALL' ? selectedKycStatus : undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Users exported successfully');
    } catch (error: any) {
      toast.error('Failed to export users', {
        description: error.response?.data?.message
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'suspended': return 'text-red-500 bg-red-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-500 bg-green-500/10';
      case 'rejected': return 'text-red-500 bg-red-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'under_review': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, monitor activity, and oversee verification status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportUsers}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/admin/users/kyc"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            KYC Approvals
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.totalUsers || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.activeToday || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Active Today</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.pendingKYC || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Pending KYC</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Ban className="h-6 w-6 text-red-500" />
            </div>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {statsLoading ? '...' : stats?.suspendedUsers || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Suspended Users</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">User Directory</h2>
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
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => {
              refetchUsers();
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
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="PRIMARY_DEALER">Primary Dealer</option>
                <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">KYC Status</label>
              <select
                value={selectedKycStatus}
                onChange={(e) => setSelectedKycStatus(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All KYC Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">KYC</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
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
                          <p className="text-sm text-muted-foreground">{user.accountType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-foreground">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getKycStatusColor(user.kycStatus)}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{user.profileCompletion || 0}% complete</p>
                      </div>
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
                        {!user.isKycVerified && user.kycStatus === 'PENDING' && (
                          <button
                            onClick={() => handleApproveKyc(user.id)}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                            disabled={approveKycMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </button>
                        )}
                        {!user.isEmailVerified && (
                          <button
                            onClick={() => handleVerifyEmail(user.id)}
                            className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                            disabled={verifyEmailMutation.isPending}
                          >
                            <Mail className="h-4 w-4 text-blue-500" />
                          </button>
                        )}
                        {user.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            disabled={suspendUserMutation.isPending}
                          >
                            <Ban className="h-4 w-4 text-red-500" />
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
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
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
              <h3 className="text-lg font-bold text-foreground">User Details</h3>
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getKycStatusColor(selectedUser.kycStatus)}`}>
                      {selectedUser.kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-foreground">{selectedUser.accountType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                  <p className="text-foreground">{selectedUser.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Verified</label>
                  <p className="text-foreground">{selectedUser.isPhoneVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">KYC Verified</label>
                  <p className="text-foreground">{selectedUser.isKycVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Profile Completion</label>
                  <p className="text-foreground">{selectedUser.profileCompletion || 0}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CSD Account</label>
                  <p className="text-foreground">{selectedUser.csdAccountNumber || 'Not created'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CSD Status</label>
                  <p className="text-foreground">{selectedUser.csdAccountStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                  <p className="text-foreground">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p className="text-foreground">
                    {selectedUser.lastLoginAt 
                      ? new Date(selectedUser.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <Link
                  href={`/admin/users/${selectedUser.id}/edit`}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
                >
                  Edit User
                </Link>
                {!selectedUser.isKycVerified && (
                  <Link
                    href={`/admin/users/kyc?user=${selectedUser.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Complete KYC
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
