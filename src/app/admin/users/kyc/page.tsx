'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Building,
  AlertCircle,
  Download,
  Filter,
  Loader2,
  MessageSquare,
  Edit2,
  Save,
  X,
  Search,
  Shield,
  Clock,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CreditCard,
  Upload,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';
import KYCCompletionPanel from '@/components/admin/kyc/KYCCompletionPanel';

export default function KycApprovalsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [requestInfoNotes, setRequestInfoNotes] = useState('');
  const [showRequestInfoModal, setShowRequestInfoModal] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editingData, setEditingData] = useState<any>({});
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [showCompleteKYCModal, setShowCompleteKYCModal] = useState<string | null>(null);
  const [kycStep, setKycStep] = useState(1);

  // Fetch KYC applications
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['admin', 'kyc', filter],
    queryFn: () => adminApi.kyc.getAll({ status: filter === 'ALL' ? undefined : filter }),
  });

  const kycApplications = applicationsData?.applications || [];

  // Calculate KYC completion percentage
  const calculateKYCProgress = (user: any) => {
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'ghanaCardNumber', 
      'tinNumber', 'phone', 'email', 'address', 'occupation'
    ];
    const filledFields = requiredFields.filter(field => {
      const value = user[field as keyof typeof user];
      return value && value.toString().trim() !== '';
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  // Get KYC status display
  const getKYCStatus = (user: any) => {
    const status = user?.kycStatus || 'PENDING';
    const statusMap = {
      PENDING: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', status: 'Pending Review', icon: Clock },
      UNDER_REVIEW: { color: 'text-blue-500', bgColor: 'bg-blue-500/10', status: 'Under Review', icon: Eye },
      APPROVED: { color: 'text-green-500', bgColor: 'bg-green-500/10', status: 'Approved', icon: CheckCircle },
      REJECTED: { color: 'text-red-500', bgColor: 'bg-red-500/10', status: 'Rejected', icon: XCircle },
      MORE_INFO_REQUIRED: { color: 'text-orange-500', bgColor: 'bg-orange-500/10', status: 'More Info Required', icon: MessageSquare },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.PENDING;
  };

  // Filter applications
  const filteredApplications = kycApplications.filter((application: any) => {
    const user = application.user;
    if (!user) return false;
    
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    
    return matchesSearch;
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      adminApi.kyc.approve(id, notes),
    onSuccess: (data) => {
      toast.success('KYC application approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      setShowRejectModal(null);
      setRejectReason('');
    },
    onError: (error: any) => {
      toast.error('Failed to approve application', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => 
      adminApi.kyc.reject(id, notes),
    onSuccess: (data) => {
      toast.success('KYC application rejected');
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      setShowRejectModal(null);
      setRejectReason('');
    },
    onError: (error: any) => {
      toast.error('Failed to reject application', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const requestInfoMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => 
      adminApi.kyc.requestMoreInfo(id, notes),
    onSuccess: (data) => {
      toast.success('Information request sent to user');
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      setShowRequestInfoModal(null);
      setRequestInfoNotes('');
    },
    onError: (error: any) => {
      toast.error('Failed to send information request', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Event handlers
  const handleApprove = (id: string) => {
    approveMutation.mutate({ id });
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({ id, notes: rejectReason });
  };

  const handleRequestInfo = (id: string) => {
    if (!requestInfoNotes.trim()) {
      toast.error('Please specify what information is needed');
      return;
    }
    requestInfoMutation.mutate({ id, notes: requestInfoNotes });
  };

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  // Handle file upload for admin
  const handleAdminFileUpload = async (file: File, userId: string, documentType: string) => {
    const uploadKey = `${userId}-${documentType}`;
    setUploadingFiles(prev => new Set(prev).add(uploadKey));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('documentType', documentType);
      
      const response = await adminApi.kyc.uploadDocument(userId, formData);
      toast.success('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
    } catch (error: any) {
      toast.error('Failed to upload document', {
        description: error.response?.data?.message || 'An error occurred',
      });
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };

  // Complete KYC for user
  const completeKYCMutation = useMutation({
    mutationFn: ({ userId, kycData }: { userId: string; kycData: any }) => 
      adminApi.kyc.completeKYC(userId, kycData),
    onSuccess: (data) => {
      toast.success('KYC completed successfully!', {
        description: `All required information has been filled for the user.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
      setShowCompleteKYCModal(null);
      setKycStep(1);
    },
    onError: (error: any) => {
      toast.error('Failed to complete KYC', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">KYC Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive KYC verification and user management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-foreground">
            {filteredApplications.filter(a => a.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Under Review</p>
          <p className="text-2xl font-bold text-foreground">
            {kycApplications.filter(a => a.status === 'UNDER_REVIEW').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-500">
            {kycApplications.filter(a => a.status === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-500">
            {kycApplications.filter(a => a.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground">No KYC applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application: any) => {
            const user = application.user;
            const kycStatus = getKYCStatus(user);
            const progress = calculateKYCProgress(user);
            const isExpanded = selectedUser === application.id;
            const isEditing = editingUser === user?.id;
            
            return (
              <div
                key={application.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header with Progress */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-lg ${kycStatus.bgColor} flex items-center justify-center flex-shrink-0`}>
                        {(() => {
                          const Icon = kycStatus.icon;
                          return <Icon className={`h-6 w-6 ${kycStatus.color}`} />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
                            {user?.accountType || 'N/A'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${kycStatus.bgColor} ${kycStatus.color}`}>
                            {kycStatus.status}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">KYC Completion</span>
                            <span className="text-xs font-semibold text-primary">{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user?.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user?.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {application.status === 'PENDING' || application.status === 'UNDER_REVIEW' ? (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            disabled={approveMutation.isPending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approveMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowRejectModal(application.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => setShowRequestInfoModal(application.id)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Request Info
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(isExpanded ? null : application.id)}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              View Details
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      {/* Personal/Company Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">
                          {application.user?.accountType === 'INDIVIDUAL'
                            ? 'Personal Information'
                            : 'Company Information'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {(application.user as any)?.ghanaCardNumber && (
                            <div>
                              <p className="text-muted-foreground mb-1">Ghana Card Number</p>
                              <p className="text-foreground font-mono">{(application.user as any).ghanaCardNumber}</p>
                            </div>
                          )}
                          {(application.user as any)?.tinNumber && (
                            <div>
                              <p className="text-muted-foreground mb-1">TIN</p>
                              <p className="text-foreground font-mono">{(application.user as any).tinNumber}</p>
                            </div>
                          )}
                          {(application.user as any)?.dateOfBirth && (
                            <div>
                              <p className="text-muted-foreground mb-1">Date of Birth</p>
                              <p className="text-foreground">{(application.user as any).dateOfBirth}</p>
                            </div>
                          )}
                          {(application.user as any)?.address && (
                            <div className="md:col-span-2">
                              <p className="text-muted-foreground mb-1">Address</p>
                              <p className="text-foreground">{(application.user as any).address}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          Submitted Documents
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {application.documents.map((doc: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-foreground">{doc.documentType || doc.type}</p>
                                  <p
                                    className={`text-xs ${
                                      doc.status === 'VERIFIED'
                                        ? 'text-green-500'
                                        : 'text-yellow-500'
                                    }`}
                                  >
                                    {doc.status}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleViewDocument(doc.fileUrl || doc.url || '#')}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      {application.status === 'PENDING' || application.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <button
                            onClick={() => handleApprove(application.id)}
                            disabled={approveMutation.isPending}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approveMutation.isPending ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Approve Application
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowRejectModal(application.id)}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject Application
                          </button>
                          <button
                            onClick={() => setShowRequestInfoModal(application.id)}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-5 h-5" />
                            Request More Info
                          </button>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground text-center">
                            This application has been {application.status.toLowerCase().replace('_', ' ')}
                            {application.reviewedAt && ` on ${new Date(application.reviewedAt).toLocaleString()}`}
                          </p>
                          {application.reviewNotes && (
                            <p className="text-sm text-muted-foreground text-center mt-2">
                              Notes: {application.reviewNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Reject KYC Application</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this application. The user will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={rejectMutation.isPending}
                className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {showRequestInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Request More Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Specify what additional information or documents are needed from the user.
            </p>
            <textarea
              value={requestInfoNotes}
              onChange={(e) => setRequestInfoNotes(e.target.value)}
              placeholder="Enter information request..."
              rows={4}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleRequestInfo(showRequestInfoModal)}
                disabled={requestInfoMutation.isPending}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {requestInfoMutation.isPending ? 'Sending...' : 'Send Request'}
              </button>
              <button
                onClick={() => {
                  setShowRequestInfoModal(null);
                  setRequestInfoNotes('');
                }}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Completion Slide-over Panel */}
      {showCompleteKYCModal && (
        <KYCCompletionPanel
          userId={showCompleteKYCModal!}
          userData={kycApplications.find(app => app.user?.id === showCompleteKYCModal)?.user}
          onClose={() => setShowCompleteKYCModal(null)}
          onComplete={() => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] });
            setShowCompleteKYCModal(null);
          }}
        />
      )}

      {/* Compliance Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-500 mb-1">
            KYC Compliance Requirements
          </p>
          <p className="text-sm text-muted-foreground">
            All approvals must comply with Ghana SEC KYC/AML regulations. Ensure all
            documents are verified and investor information is complete before approval.
          </p>
        </div>
      </div>
    </div>
  );
}
