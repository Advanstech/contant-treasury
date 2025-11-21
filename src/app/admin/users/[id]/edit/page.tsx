'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  Briefcase,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Ban,
  UserCheck
} from 'lucide-react';
import adminApi, { adminUsersApi, AdminUser, UpdateUserDto } from '@/lib/admin-api';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const [formData, setFormData] = React.useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    status: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    isKycVerified: false,
  });

  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Fetch user details
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => adminUsersApi.getById(userId),
    enabled: !!userId,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserDto) => adminUsersApi.update(userId, data),
    onSuccess: (updatedUser) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'stats'] });
      setHasChanges(false);
      setFormData(prev => ({ ...prev, ...updatedUser }));
    },
    onError: (error: any) => {
      toast.error('Failed to update user', {
        description: error.response?.data?.message || 'An error occurred'
      });
    },
  });

  // Suspend user mutation
  const suspendUserMutation = useMutation({
    mutationFn: (reason: string) => adminUsersApi.suspend(userId, reason),
    onSuccess: () => {
      toast.success('User suspended successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
    },
    onError: (error: any) => {
      toast.error('Failed to suspend user', {
        description: error.response?.data?.message
      });
    },
  });

  // Unsuspend user mutation
  const unsuspendUserMutation = useMutation({
    mutationFn: () => adminUsersApi.unsuspend(userId),
    onSuccess: () => {
      toast.success('User unsuspended successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
    },
    onError: (error: any) => {
      toast.error('Failed to unsuspend user', {
        description: error.response?.data?.message
      });
    },
  });

  // Initialize form data when user is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.status || '',
        isEmailVerified: user.isEmailVerified || false,
        isPhoneVerified: user.isPhoneVerified || false,
        isKycVerified: user.isKycVerified || false,
      });
    }
  }, [user]);

  // Handle form changes
  const handleInputChange = (field: keyof UpdateUserDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserMutation.mutateAsync(formData);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle suspend
  const handleSuspend = () => {
    const reason = prompt('Enter reason for suspension:');
    if (reason) {
      suspendUserMutation.mutate(reason);
    }
  };

  // Handle unsuspend
  const handleUnsuspend = () => {
    unsuspendUserMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're trying to edit doesn't exist.</p>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
            <p className="text-muted-foreground mt-1">
              Manage user information and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/users/kyc?user=${userId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Complete KYC
          </Link>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                {user.role}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.status === 'ACTIVE' ? 'text-green-500 bg-green-500/10' :
                user.status === 'SUSPENDED' ? 'text-red-500 bg-red-500/10' :
                'text-yellow-500 bg-yellow-500/10'
              }`}>
                {user.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.isKycVerified ? 'text-green-500 bg-green-500/10' :
                'text-yellow-500 bg-yellow-500/10'
              }`}>
                KYC: {user.isKycVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="PRIMARY_DEALER">Primary Dealer</option>
                  <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="ANALYST">Analyst</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Verification Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {user.isEmailVerified ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEmailVerified}
                    onChange={(e) => handleInputChange('isEmailVerified', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Verified</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {user.isPhoneVerified ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPhoneVerified}
                    onChange={(e) => handleInputChange('isPhoneVerified', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Verified</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">KYC Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {user.isKycVerified ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isKycVerified}
                    onChange={(e) => handleInputChange('isKycVerified', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Verified</span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Account Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.status === 'ACTIVE' ? (
                <button
                  onClick={handleSuspend}
                  disabled={suspendUserMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  {suspendUserMutation.isPending ? 'Suspending...' : 'Suspend User'}
                </button>
              ) : user.status === 'SUSPENDED' ? (
                <button
                  onClick={handleUnsuspend}
                  disabled={unsuspendUserMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  {unsuspendUserMutation.isPending ? 'Unsuspending...' : 'Unsuspend User'}
                </button>
              ) : null}
              
              <Link
                href={`/admin/users/activity/${userId}`}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Activity
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Metadata */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="font-mono text-foreground">{user.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Type</label>
            <p className="text-foreground">{user.accountType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created Date</label>
            <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Login</label>
            <p className="text-foreground">
              {user.lastLoginAt 
                ? new Date(user.lastLoginAt).toLocaleDateString()
                : 'Never'
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Profile Completion</label>
            <p className="text-foreground">{user.profileCompletion}%</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">CSD Account</label>
            <p className="text-foreground">{user.csdAccountNumber || 'Not created'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
