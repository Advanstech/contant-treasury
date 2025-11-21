'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Calendar,
  UserCheck,
  Shield,
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  Activity,
  LogIn,
  FileText,
  Settings,
  Mail,
  Phone,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import adminUsersApi from '@/lib/admin-api';

interface UserActivity {
  id: string;
  type: 'registration' | 'login' | 'kyc_submitted' | 'kyc_approved' | 'kyc_rejected' | 'suspended' | 'activated' | 'profile_updated';
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function UserActivityPage() {
  const params = useParams();
  const userId = params.id as string;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('ALL');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);

  // Fetch user activities
  const { data: activityData, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users', userId, 'activity', currentPage, searchQuery, selectedType],
    queryFn: () => adminUsersApi.getActivity(userId, {
      page: currentPage,
      limit: 20,
    }),
    enabled: !!userId,
  });

  // Fetch user details
  const { data: user } = useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => adminUsersApi.getById(userId),
    enabled: !!userId,
  });

  const activities = activityData?.activities || [];
  const totalActivities = activityData?.total || 0;
  const totalPages = Math.ceil(totalActivities / 20);

  // Filter activities based on search and type
  const filteredActivities = activities.filter((activity: UserActivity) => {
    const matchesSearch = searchQuery === '' || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'ALL' || activity.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'login': return <LogIn className="h-4 w-4 text-green-500" />;
      case 'kyc_submitted': return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'kyc_approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'kyc_rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'suspended': return <Ban className="h-4 w-4 text-red-500" />;
      case 'activated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'profile_updated': return <Settings className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'registration': return 'text-blue-500 bg-blue-500/10';
      case 'login': return 'text-green-500 bg-green-500/10';
      case 'kyc_submitted': return 'text-yellow-500 bg-yellow-500/10';
      case 'kyc_approved': return 'text-green-500 bg-green-500/10';
      case 'kyc_rejected': return 'text-red-500 bg-red-500/10';
      case 'suspended': return 'text-red-500 bg-red-500/10';
      case 'activated': return 'text-green-500 bg-green-500/10';
      case 'profile_updated': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleExportActivity = async () => {
    try {
      // This would need to be implemented in the API
      toast.info('Export functionality coming soon');
    } catch (error) {
      toast.error('Failed to export activity');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={`/admin/users/${userId}/edit`}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Activity</h1>
            <p className="text-muted-foreground mt-1">
              Monitor user actions and system events
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportActivity}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                  {user.role}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.status === 'ACTIVE' ? 'text-green-500 bg-green-500/10' :
                  'text-red-500 bg-red-500/10'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Activity Log</h2>
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
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-border">
            <div>
              <label className="block text-sm font-medium mb-2">Activity Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Activities</option>
                <option value="registration">Registration</option>
                <option value="login">Login</option>
                <option value="kyc_submitted">KYC Submitted</option>
                <option value="kyc_approved">KYC Approved</option>
                <option value="kyc_rejected">KYC Rejected</option>
                <option value="suspended">Suspended</option>
                <option value="activated">Activated</option>
                <option value="profile_updated">Profile Updated</option>
              </select>
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity found</p>
            </div>
          ) : (
            filteredActivities.map((activity: UserActivity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.type)}`}>
                      {formatActivityType(activity.type)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-foreground mb-2">{activity.description}</p>
                  {activity.ipAddress && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>IP: {activity.ipAddress}</span>
                      {activity.userAgent && (
                        <span className="truncate max-w-md">
                          {activity.userAgent}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalActivities)} of {totalActivities} activities
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
    </div>
  );
}
