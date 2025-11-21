// Admin API - BoG Compliance & Management
// Connects admin dashboard to backend BoG compliance endpoints

import apiClient from './api';

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  accountType: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKycVerified: boolean;
  kycStatus: string;
  csdAccountNumber?: string;
  csdAccountStatus: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
  profileCompletion: number;
}

export interface UserStats {
  totalUsers: number;
  activeToday: number;
  pendingKYC: number;
  suspendedUsers: number;
  verifiedUsers: number;
  corporateUsers: number;
  individualUsers: number;
  recentRegistrations: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  kycStatus?: string;
  accountType?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'firstName' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isKycVerified?: boolean;
}

export const adminUsersApi = {
  // Get user statistics
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get('/api/v1/admin/users/stats');
    return response.data;
  },

  // Get all users with filtering and pagination
  getAll: async (params?: UserListParams): Promise<{ users: AdminUser[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/v1/admin/users', { params });
    return response.data;
  },

  // Get single user by ID
  getById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(`/api/v1/admin/users/${id}`);
    return response.data;
  },

  // Update user information
  update: async (id: string, data: UpdateUserDto): Promise<AdminUser> => {
    const response = await apiClient.patch(`/api/v1/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user (soft delete)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/users/${id}`);
  },

  // Suspend user
  suspend: async (id: string, reason?: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/suspend`, { reason });
    return response.data;
  },

  // Unsuspend user
  unsuspend: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/unsuspend`);
    return response.data;
  },

  // Verify user email
  verifyEmail: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/verify-email`);
    return response.data;
  },

  // Verify user phone
  verifyPhone: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/verify-phone`);
    return response.data;
  },

  // Approve KYC
  approveKyc: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/approve-kyc`);
    return response.data;
  },

  // Reject KYC
  rejectKyc: async (id: string, reason: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/reject-kyc`, { reason });
    return response.data;
  },

  // Get user activity log
  getActivity: async (id: string, params?: { page?: number; limit?: number }): Promise<{ activities: any[]; total: number }> => {
    const response = await apiClient.get(`/api/v1/admin/users/${id}/activity`, { params });
    return response.data;
  },

  // Export users to CSV
  export: async (params?: UserListParams): Promise<Blob> => {
    const response = await apiClient.get('/api/v1/admin/users/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // CSD Account Management
  getCsdAccounts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ users: AdminUser[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/v1/admin/users/csd', { params });
    return response.data;
  },

  getCsdStats: async (): Promise<{
    totalAccounts: number;
    activeAccounts: number;
    pendingAccounts: number;
    suspendedAccounts: number;
    recentRegistrations: number;
  }> => {
    const response = await apiClient.get('/api/v1/admin/users/csd/stats');
    return response.data;
  },

  updateCsdStatus: async (id: string, status: string, reason?: string): Promise<AdminUser> => {
    const response = await apiClient.patch(`/api/v1/admin/users/${id}/csd-status`, { status, reason });
    return response.data;
  },

  approveCsdAccount: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/approve-csd`);
    return response.data;
  },

  suspendCsdAccount: async (id: string, reason: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/suspend-csd`, { reason });
    return response.data;
  },

  activateCsdAccount: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.post(`/api/v1/admin/users/${id}/activate-csd`);
    return response.data;
  },

  generateCsdReport: async (params?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Blob> => {
    const response = await apiClient.get('/api/v1/admin/users/csd/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};

// ============================================================================
// ADMIN AUCTION MANAGEMENT
// ============================================================================

export interface CreateAuctionDto {
  auctionCode: string;
  auctionType: 'TREASURY_BILL' | 'TREASURY_BOND' | 'BOND';
  securityName: string;
  isin?: string;
  tenor: number;
  targetAmount: number;
  minimumBid: number;
  maximumBid?: number;
  biddingOpenDate: string;
  biddingCloseDate: string;
  settlementDate: string;
  description?: string;
  mode: 'MANUAL' | 'API';
}

export interface BulkAuctionUploadDto {
  file: File;
  mode: 'MANUAL' | 'API';
}

export interface AuctionResultDto {
  auctionId: string;
  clearingYield: number;
  amountAllocated: number;
  totalBids: number;
  acceptedBids: number;
  mode: 'MANUAL' | 'API';
}

export interface AdminAuction {
  id: string;
  auctionCode: string;
  auctionType: string;
  securityName: string;
  isin?: string;
  tenor: number;
  targetAmount: number;
  minimumBid: number;
  maximumBid?: number;
  biddingOpenDate: string;
  biddingCloseDate: string;
  settlementDate: string;
  phase: 'ANNOUNCED' | 'BIDDING' | 'CLOSED' | 'ALLOCATED' | 'SETTLED';
  clearingYield?: number;
  amountAllocated?: number;
  totalBids?: number;
  acceptedBids?: number;
  createdAt: string;
  updatedAt: string;
}

export const adminAuctionApi = {
  // Create single auction (manual or API mode)
  create: async (data: CreateAuctionDto): Promise<AdminAuction> => {
    const response = await apiClient.post('/api/v1/admin/auctions', data);
    return response.data;
  },

  // Bulk upload auction calendar (CSV)
  bulkUpload: async (file: File, mode: 'MANUAL' | 'API' = 'MANUAL'): Promise<{ count: number; auctions: AdminAuction[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    const response = await apiClient.post('/api/v1/admin/auctions/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Sync from BoG API
  syncFromBog: async (): Promise<{ count: number; auctions: AdminAuction[] }> => {
    const response = await apiClient.post('/api/v1/admin/auctions/sync-bog');
    return response.data;
  },

  // Get all auctions with filters
  getAll: async (params?: {
    phase?: string;
    auctionType?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: AdminAuction[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/v1/admin/auctions', { params });
    return response.data;
  },

  // Get single auction details
  getById: async (id: string): Promise<AdminAuction> => {
    const response = await apiClient.get(`/api/v1/admin/auctions/${id}`);
    return response.data;
  },

  // Update auction
  update: async (id: string, data: Partial<CreateAuctionDto>): Promise<AdminAuction> => {
    const response = await apiClient.put(`/api/v1/admin/auctions/${id}`, data);
    return response.data;
  },

  // Open auction for bidding
  open: async (id: string): Promise<AdminAuction> => {
    const response = await apiClient.post(`/api/v1/admin/auctions/${id}/open`);
    return response.data;
  },

  // Close auction bidding
  close: async (id: string): Promise<AdminAuction> => {
    const response = await apiClient.post(`/api/v1/admin/auctions/${id}/close`);
    return response.data;
  },

  // Enter auction results (manual or from BoG API)
  enterResults: async (id: string, data: { cutoffYield: number; weightedAvgYield: number }): Promise<AdminAuction> => {
    const response = await apiClient.post(`/api/v1/admin/auctions/${id}/results`, data);
    return response.data;
  },

  // Get auction bids
  getBids: async (id: string): Promise<{ auctionId: string; bids: any[]; totalBids: number; totalAmount: number }> => {
    const response = await apiClient.get(`/api/v1/admin/auctions/${id}/bids`);
    return response.data;
  },

  // Delete auction
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/auctions/${id}`);
  },
};

// ============================================================================
// ADMIN PD SUBMISSION MANAGEMENT
// ============================================================================

export interface PdSubmission {
  id: string;
  submissionCode: string;
  auctionId: string;
  auction?: AdminAuction;
  totalAmount: number;
  totalBids: number;
  competitiveBids: number;
  nonCompetitiveBids: number;
  status: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt?: string;
  bogResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePdSubmissionDto {
  auctionId: string;
  mode: 'MANUAL' | 'API';
}

export const adminPdSubmissionApi = {
  // Get all PD submissions
  getAll: async (params?: {
    auctionId?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ submissions: PdSubmission[]; total: number }> => {
    const response = await apiClient.get('/api/v1/admin/pd-submissions', { params });
    return response.data;
  },

  // Get single PD submission
  getById: async (id: string): Promise<PdSubmission> => {
    const response = await apiClient.get(`/api/v1/admin/pd-submissions/${id}`);
    return response.data;
  },

  // Create PD submission (aggregates client bids)
  create: async (data: CreatePdSubmissionDto): Promise<PdSubmission> => {
    const response = await apiClient.post('/api/v1/admin/pd-submissions', data);
    return response.data;
  },

  // Submit to BoG
  submitToBog: async (id: string): Promise<PdSubmission> => {
    const response = await apiClient.post(`/api/v1/admin/pd-submissions/${id}/submit`);
    return response.data;
  },

  // Get submission details with bids
  getWithBids: async (id: string): Promise<PdSubmission & { bids: any[] }> => {
    const response = await apiClient.get(`/api/v1/admin/pd-submissions/${id}/bids`);
    return response.data;
  },
};

// ============================================================================
// ADMIN SETTLEMENT MANAGEMENT
// ============================================================================

export interface SettlementBatch {
  id: string;
  batchCode: string;
  auctionId: string;
  auction?: AdminAuction;
  totalInstructions: number;
  totalAmount: number;
  status: 'PENDING' | 'GENERATED' | 'SENT' | 'CONFIRMED' | 'FAILED';
  csdFileGenerated: boolean;
  csdFilePath?: string;
  sentToCsdAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementInstruction {
  id: string;
  batchId: string;
  instructionCode: string;
  clientId: string;
  clientName: string;
  csdAccountNumber: string;
  securityIsin: string;
  quantity: number;
  amount: number;
  settlementDate: string;
  status: 'PENDING' | 'SENT' | 'CONFIRMED' | 'FAILED';
  createdAt: string;
}

export interface CreateSettlementInstructionDto {
  auctionId: string;
  mode: 'MANUAL' | 'API';
}

export const adminSettlementApi = {
  // Get all settlement batches
  getBatches: async (params?: {
    auctionId?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ batches: SettlementBatch[]; total: number }> => {
    const response = await apiClient.get('/api/v1/admin/settlements/batches', { params });
    return response.data;
  },

  // Get single batch
  getBatch: async (id: string): Promise<SettlementBatch> => {
    const response = await apiClient.get(`/api/v1/admin/settlements/batches/${id}`);
    return response.data;
  },

  // Get instructions for a batch
  getInstructions: async (batchId: string): Promise<SettlementInstruction[]> => {
    const response = await apiClient.get(`/api/v1/admin/settlements/batches/${batchId}/instructions`);
    return response.data;
  },

  // Create settlement batch
  createBatch: async (data: { allotmentIds: string[]; settlementDate: string }): Promise<any> => {
    const response = await apiClient.post('/api/v1/admin/settlements/batches', data);
    return response.data;
  },

  // Generate settlement instructions
  generateInstructions: async (data: CreateSettlementInstructionDto): Promise<SettlementBatch> => {
    const response = await apiClient.post('/api/v1/admin/settlements/generate', data);
    return response.data;
  },

  // Generate CSD CSV file
  generateCsdFile: async (batchId: string): Promise<{ filePath: string; downloadUrl: string }> => {
    const response = await apiClient.post(`/api/v1/admin/settlements/batches/${batchId}/generate-file`);
    return response.data;
  },

  // Download CSD file
  downloadCsdFile: async (batchId: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/v1/admin/settlements/batches/${batchId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Upload to CSD via SFTP
  uploadToCsd: async (batchId: string): Promise<SettlementBatch> => {
    const response = await apiClient.post(`/api/v1/admin/settlements/batches/${batchId}/upload`);
    return response.data;
  },

  // Confirm settlement
  confirmSettlement: async (batchId: string): Promise<SettlementBatch> => {
    const response = await apiClient.post(`/api/v1/admin/settlements/batches/${batchId}/confirm`);
    return response.data;
  },
};

// ============================================================================
// ADMIN KYC MANAGEMENT
// ============================================================================

export interface KycApplication {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    otherNames?: string;
    phone?: string;
    accountType: string;
    // Personal Information
    title?: string;
    maidenName?: string;
    mothersMaidenName?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    nationality?: string;
    residentialStatus?: string;
    countryOfOrigin?: string;
    countryOfResidence?: string;
    residentPermitNumber?: string;
    permitIssueDate?: string;
    permitExpiryDate?: string;
    occupation?: string;
    profession?: string;
    // Contact
    address?: string;
    city?: string;
    postalCode?: string;
    gpsAddress?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    workAddress?: string;
    workPhone?: string;
    emailAddress2?: string;
    // Emergency Contacts
    emergencyContactName1?: string;
    emergencyContactRelation1?: string;
    emergencyContactPhone1?: string;
    emergencyContactEmail1?: string;
    emergencyContactName2?: string;
    emergencyContactRelation2?: string;
    emergencyContactPhone2?: string;
    emergencyContactEmail2?: string;
    // Verification
    ghanaCardNumber?: string;
    tinNumber?: string;
    // Employment
    employmentStatus?: string;
    employerName?: string;
    yearsOfEmployment?: number;
    totalMonthlyIncome?: string;
    sourceOfFunds?: string;
    // Investment Profile
    investmentObjective?: string;
    riskTolerance?: string;
    investmentHorizon?: string;
    investmentKnowledge?: string;
    // Bank
    bankName?: string;
    bankBranch?: string;
    bankAccountNumber?: string;
    bankSortCode?: string;
    // Additional
    isPoliticallyExposed?: boolean;
    politicalExposureDetails?: string;
    isUSPerson?: boolean;
    taxResidency?: string;
    foreignTaxId?: string;
    // CSD
    csdAccountNumber?: string;
    csdAccountStatus?: string;
    csdRegistrationDate?: string;
    csdApplicationDate?: string;
    csdApprovalDate?: string;
  };
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED';
  documents: KycDocument[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycDocument {
  id: string;
  documentType: 'GHANA_CARD' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'PROOF_OF_ADDRESS' | 'TIN_CERTIFICATE' | 'COMPANY_REGISTRATION' | 'OTHER';
  fileName: string;
  fileUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  verifiedAt?: string;
}

export interface ReviewKycDto {
  status: 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED';
  reviewNotes?: string;
  documentsToReject?: string[];
}

export const adminKycApi = {
  // Get pending KYC applications
  getPending: async (params?: {
    accountType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: KycApplication[]; total: number }> => {
    try {
      const response = await apiClient.get('/api/v1/admin/kyc/pending', { params });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return { applications: [], total: 0 } as { applications: KycApplication[]; total: number };
      }
      throw error;
    }
  },

  // Get all KYC applications
  getAll: async (params?: {
    status?: string;
    accountType?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: KycApplication[]; total: number }> => {
    try {
      const response = await apiClient.get('/api/v1/admin/kyc', { params });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return { applications: [], total: 0 } as { applications: KycApplication[]; total: number };
      }
      throw error;
    }
  },

  // Get single KYC application
  getById: async (id: string): Promise<KycApplication> => {
    const response = await apiClient.get(`/api/v1/admin/kyc/${id}`);
    return response.data;
  },

  // Review KYC application
  review: async (id: string, data: ReviewKycDto): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/review`, data);
    return response.data;
  },

  // Approve KYC
  approve: async (id: string, notes?: string): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/approve`, { notes });
    return response.data;
  },

  // Reject KYC
  reject: async (id: string, notes: string): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/reject`, { notes });
    return response.data;
  },

  // Request more information
  requestMoreInfo: async (id: string, notes: string): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/request-info`, { notes });
    return response.data;
  },

  // Update user KYC information
  update: async (id: string, data: Partial<KycApplication['user']>): Promise<any> => {
    const response = await apiClient.patch(`/api/v1/admin/kyc/${id}`, data);
    return response.data;
  },

  // Create CSD account for user
  createCsdAccount: async (id: string): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/create-csd-account`);
    return response.data;
  },

  // Request CSD account creation
  requestCsdCreation: async (id: string): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${id}/request-csd-creation`);
    return response.data;
  },

  // Upload document for user KYC
  uploadDocument: async (userId: string, formData: FormData): Promise<{ fileUrl: string }> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${userId}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Complete KYC for user (admin fills all information)
  completeKYC: async (userId: string, kycData: any): Promise<KycApplication> => {
    const response = await apiClient.post(`/api/v1/admin/kyc/${userId}/complete`, kycData);
    return response.data;
  },

  // Delete document
  deleteDocument: async (userId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/kyc/${userId}/documents/${documentId}`);
  },

  // Get KYC statistics
  getStats: async (): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    underReview: number;
  }> => {
    const response = await apiClient.get('/api/v1/admin/kyc/stats');
    return response.data;
  },
};

// ============================================================================
// ADMIN ANALYTICS & REPORTING
// ============================================================================

export interface DashboardMetrics {
  totalAuctions: number;
  activeAuctions: number;
  totalBids: number;
  totalAmount: number;
  pendingKyc: number;
  activeUsers: number;
  aum: number;
  avgYield: number;
}

export interface AuctionMetrics {
  auctionId: string;
  auctionCode: string;
  totalBids: number;
  totalAmount: number;
  competitiveBids: number;
  nonCompetitiveBids: number;
  avgYield: number;
  clearingYield?: number;
  bidToTargetRatio: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  kycApprovalRate: number;
  byAccountType: Record<string, number>;
  byStatus: Record<string, number>;
}

export const adminAnalyticsApi = {
  // Get dashboard metrics
  getDashboardMetrics: async (period?: '7d' | '30d' | '90d' | '1y'): Promise<DashboardMetrics> => {
    try {
      const response = await apiClient.get('/api/v1/admin/analytics/dashboard', {
        params: { period },
      });
      return response.data;
    } catch (error: any) {
      // Fallback mock when endpoint not implemented yet
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return {
          totalAuctions: 0,
          activeAuctions: 0,
          totalBids: 0,
          totalAmount: 0,
          pendingKyc: 0,
          activeUsers: 0,
          aum: 0,
          avgYield: 0,
        } as DashboardMetrics;
      }
      throw error;
    }
  },

  // Get auction metrics
  getAuctionMetrics: async (auctionId: string): Promise<AuctionMetrics> => {
    try {
      const response = await apiClient.get(`/api/v1/admin/analytics/auctions/${auctionId}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return {
          auctionId,
          auctionCode: 'N/A',
          totalBids: 0,
          totalAmount: 0,
          competitiveBids: 0,
          nonCompetitiveBids: 0,
          avgYield: 0,
          bidToTargetRatio: 0,
        } as AuctionMetrics;
      }
      throw error;
    }
  },

  // Get user metrics
  getUserMetrics: async (period?: '7d' | '30d' | '90d' | '1y'): Promise<UserMetrics> => {
    try {
      const response = await apiClient.get('/api/v1/admin/analytics/users', {
        params: { period },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return {
          totalUsers: 0,
          activeUsers: 0,
          newUsersThisMonth: 0,
          kycApprovalRate: 0,
          byAccountType: {},
          byStatus: {},
        } as UserMetrics;
      }
      throw error;
    }
  },

  // Get auction volume trend
  getAuctionVolumeTrend: async (period?: '7d' | '30d' | '90d' | '1y'): Promise<{ date: string; volume: number; count: number }[]> => {
    try {
      const response = await apiClient.get('/api/v1/admin/analytics/auction-volume', {
        params: { period },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        // Provide a small mock trend for charts
        const now = new Date();
        const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
        const mock: { date: string; volume: number; count: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          mock.push({
            date: d.toISOString().slice(0, 10),
            volume: 0,
            count: 0,
          });
        }
        return mock;
      }
      throw error;
    }
  },

  // Export report
  exportReport: async (reportType: 'auctions' | 'bids' | 'settlements' | 'kyc', params?: any): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/api/v1/admin/reports/${reportType}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return new Blob([`No report available for ${reportType}`], { type: 'text/plain' });
      }
      throw error;
    }
  },
};

// ============================================================================
// ADMIN API LOGS
// ============================================================================

export interface BogApiLog {
  id: string;
  endpoint: string;
  method: string;
  requestPayload: any;
  responsePayload: any;
  statusCode: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
}

export const adminApiLogsApi = {
  // Get all API logs
  getAll: async (params?: {
    endpoint?: string;
    success?: boolean;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: BogApiLog[]; total: number }> => {
    const response = await apiClient.get('/api/v1/admin/api-logs', { params });
    return response.data;
  },

  // Get single log
  getById: async (id: string): Promise<BogApiLog> => {
    const response = await apiClient.get(`/api/v1/admin/api-logs/${id}`);
    return response.data;
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatAuctionPhase = (phase: string): string => {
  const phases: Record<string, string> = {
    ANNOUNCED: 'Announced',
    BIDDING: 'Bidding Open',
    CLOSED: 'Bidding Closed',
    ALLOCATED: 'Allocated',
    SETTLED: 'Settled',
  };
  return phases[phase] || phase;
};

export const formatSettlementStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    PENDING: 'Pending',
    GENERATED: 'File Generated',
    SENT: 'Sent to CSD',
    CONFIRMED: 'Confirmed',
    FAILED: 'Failed',
  };
  return statuses[status] || status;
};

export const formatKycStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    PENDING: 'Pending Review',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    MORE_INFO_REQUIRED: 'More Info Required',
  };
  return statuses[status] || status;
};

export default {
  auctions: adminAuctionApi,
  pdSubmissions: adminPdSubmissionApi,
  settlements: adminSettlementApi,
  kyc: adminKycApi,
  users: adminUsersApi,
  analytics: adminAnalyticsApi,
  apiLogs: adminApiLogsApi,
};
