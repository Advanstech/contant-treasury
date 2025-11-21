// TreasuryDirect Ghana - API Client
// Connects frontend to backend API

import axios, { AxiosInstance, AxiosError } from 'axios';
import logger from './logger';
// Helper: safe base64 decode for JWT payloads
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof window !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const startTime = Date.now();
    // Store start time as custom property
    (config as any).metadata = { startTime };
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
    
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
    }, 'API_REQUEST');
    
    return config;
  },
  (error) => {
    logger.error('API Request Error', error, 'API_REQUEST');
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);
    
    logger.api(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || 'UNKNOWN',
      response.status,
      {
        duration: `${duration}ms`,
        dataSize: JSON.stringify(response.data).length,
      }
    );
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const duration = Date.now() - (originalRequest?.metadata?.startTime || 0);

    logger.api(
      error.config?.method?.toUpperCase() || 'UNKNOWN',
      error.config?.url || 'UNKNOWN',
      error.response?.status,
      {
        duration: `${duration}ms`,
        error: error.message,
        response: error.response?.data,
      },
      error
    );

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      logger.info('Attempting token refresh', {}, 'API_AUTH');

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Create a new axios instance without the auth interceptor to avoid circular calls
          const refreshClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
            timeout: 30000,
          });

          const response = await refreshClient.post('/api/v1/auth/refresh', {});

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          logger.info('Token refresh successful', { newTokenLength: accessToken.length }, 'API_AUTH');

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        logger.error('Token refresh failed, clearing tokens and redirecting to login', refreshError, 'API_AUTH');
        
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  registrationNumber?: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  dateOfBirth?: string;
  ghanaCardNumber?: string;
  tinNumber?: string;
  bvnNumber?: string;
  accountType: 'INDIVIDUAL' | 'INSTITUTION' | 'CORPORATE' | 'CUSTODIAN';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  message?: string; // Optional success message from register
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  organizationName?: string;
  registrationNumber?: string;
  jobTitle?: string;
  department?: string;
  ghanaCardNumber?: string;
  tinNumber?: string;
  bvnNumber?: string;
  role: string;
  accountType: string;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isKycVerified: boolean;
  createdAt: string;
}

export const authApi = {
  register: async (data: RegisterDto): Promise<TokenResponse> => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<TokenResponse> => {
    console.log('🔐 [API] Login request starting...', {
      email: data.email,
      passwordLength: data.password?.length,
      baseURL: apiClient.defaults.baseURL,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await apiClient.post('/api/v1/auth/login', data);
      console.log('✅ [API] Login response received:', {
        status: response.status,
        hasData: !!response.data,
        hasAccessToken: !!response.data?.accessToken,
        hasRefreshToken: !!response.data?.refreshToken,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ [API] Login request failed:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        }
      });
      throw error;
    }
  },

  getProfile: async (tokenOverride?: string): Promise<UserProfile> => {
    const response = await apiClient.get('/api/v1/auth/me', {
      headers: tokenOverride
        ? { Authorization: `Bearer ${tokenOverride}` }
        : undefined,
    });
    let data: any = response.data;

    // Some backends may return a string (e.g., 'OK' or JSON as string). Normalize it.
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        // Not JSON; treat as invalid payload
        data = null;
      }
    }

    // Common API shapes: { data: {...} } or { user: {...} }
    if (data && typeof data === 'object') {
      if ('data' in data && data.data && typeof data.data === 'object') {
        data = data.data;
      } else if ('user' in data && data.user && typeof data.user === 'object') {
        data = data.user;
      }
    }

    // Basic validation to ensure we have a usable profile
    const validDirect = !!(data && typeof data === 'object' && (data as any).id && (data as any).email);
    if (validDirect) {
      return data as UserProfile;
    }

    // Fallback: derive minimal profile from access token if backend returns minimal/empty payloads
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const payload = accessToken ? decodeJwtPayload(accessToken) : null;
    if (payload) {
      const fallback: UserProfile = {
        id: payload.sub || payload.id || payload.userId || 'unknown',
        email: payload.email || payload.username || '',
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        phone: payload.phone || '',
        role: payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : 'USER'),
        accountType: payload.accountType || 'INDIVIDUAL',
        status: payload.status || 'ACTIVE',
        isEmailVerified: !!(payload.isEmailVerified ?? false),
        isPhoneVerified: !!(payload.isPhoneVerified ?? false),
        isKycVerified: !!(payload.isKycVerified ?? false),
        createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
      };
      if (fallback.email) {
        logger.info('Using JWT-derived profile as fallback', { hasEmail: true }, 'API');
        return fallback;
      }
    }

    throw new Error('Invalid profile response from /api/v1/auth/me');
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (): Promise<TokenResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post('/api/v1/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.patch('/api/v1/auth/profile', data);
    return response.data;
  },
};

// ============================================================================
// SECURITIES API
// ============================================================================

export interface Security {
  id: string;
  isin: string;
  securityType: 'TREASURY_BILL' | 'TREASURY_BOND';
  issueDate: string;
  maturityDate: string;
  tenor: number;
  couponRate: number;
  currentYield: number;
  issueSize: number;
  name: string;
  symbol: string;
  currency: string;
  status: string;
  tenorDays: number;
}

export const securitiesApi = {
  getAll: async (type?: string): Promise<Security[]> => {
    try {
      const response = await apiClient.get('/api/v1/securities', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      // Return mock data for development
      logger.warn('Failed to fetch securities, using mock data', { error, type }, 'API');
      
      const mockSecurities: Security[] = [
        {
          id: "1",
          isin: "GH0010134567",
          securityType: "TREASURY_BILL",
          issueDate: "2024-01-15",
          maturityDate: "2024-04-15",
          tenor: 91,
          couponRate: 0,
          currentYield: 28.5,
          issueSize: 500000000,
          name: "91-Day Treasury Bill",
          symbol: "GHTB91D",
          currency: "GHS",
          status: "ACTIVE",
          tenorDays: 91,
        },
        {
          id: "2",
          isin: "GH0010134568",
          securityType: "TREASURY_BILL",
          issueDate: "2024-01-15",
          maturityDate: "2024-07-15",
          tenor: 182,
          couponRate: 0,
          currentYield: 29.2,
          issueSize: 750000000,
          name: "182-Day Treasury Bill",
          symbol: "GHTB182D",
          currency: "GHS",
          status: "ACTIVE",
          tenorDays: 182,
        },
        {
          id: "3",
          isin: "GH0010134569",
          securityType: "TREASURY_BOND",
          issueDate: "2024-01-15",
          maturityDate: "2029-01-15",
          tenor: 1825,
          couponRate: 18.5,
          currentYield: 19.1,
          issueSize: 1000000000,
          name: "5-Year Treasury Bond",
          symbol: "GHTB5Y",
          currency: "GHS",
          status: "ACTIVE",
          tenorDays: 1825,
        },
      ];

      if (type && type !== 'ALL') {
        return mockSecurities.filter(s => s.securityType === type);
      }

      return mockSecurities;
    }
  },

  getById: async (id: string): Promise<Security> => {
    try {
      const response = await apiClient.get(`/api/v1/securities/${id}`);
      return response.data;
    } catch (error) {
      logger.warn('Failed to fetch security, using mock data', { error, id }, 'API');
      
      // Return mock data for development
      const mockSecurity: Security = {
        id: id,
        isin: "GH0010134567",
        securityType: "TREASURY_BILL",
        issueDate: "2024-01-15",
        maturityDate: "2024-04-15",
        tenor: 91,
        couponRate: 0,
        currentYield: 28.5,
        issueSize: 500000000,
        name: "91-Day Treasury Bill",
        symbol: "GHTB91D",
        currency: "GHS",
        status: "ACTIVE",
        tenorDays: 91,
      };

      return mockSecurity;
    }
  },
};

// Convenience exports for backward compatibility
export const getSecurities = securitiesApi.getAll;

// ============================================================================
// AUCTIONS API
// ============================================================================

export interface Auction {
  id: string;
  auctionCode: string;
  auctionType: 'TREASURY_BILL' | 'TREASURY_BOND';
  targetAmount: number;
  tenor: number;
  biddingOpenDate: string;
  biddingCloseDate: string;
  settlementDate: string;
  phase: string;
  clearingYield?: number;
  amountAllocated?: number;
}

export interface SubmitBidDto {
  bidType: 'COMPETITIVE' | 'NON_COMPETITIVE';
  amount: number;
  yield?: number;
  clientRef?: string;
}

export interface Bid {
  id: string;
  bidCode: string;
  bidType: string;
  amount: number;
  yield?: number;
  status: string;
  allocatedAmount?: number;
  allocatedYield?: number;
  submittedAt: string;
}

export const auctionsApi = {
  getAll: async (params?: {
    phase?: string;
    auctionType?: string;
    from?: string;
    to?: string;
  }): Promise<Auction[]> => {
    const response = await apiClient.get('/api/v1/auctions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Auction> => {
    const response = await apiClient.get(`/api/v1/auctions/${id}`);
    return response.data;
  },

  submitBid: async (auctionId: string, data: SubmitBidDto): Promise<Bid> => {
    const response = await apiClient.post(`/api/v1/auctions/${auctionId}/bids`, data);
    return response.data;
  },

  getBids: async (auctionId: string): Promise<Bid[]> => {
    const response = await apiClient.get(`/api/v1/auctions/${auctionId}/bids`);
    return response.data;
  },

  getResults: async (auctionId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/auctions/${auctionId}/results`);
    return response.data;
  },
};

// ============================================================================
// PORTFOLIO API
// ============================================================================

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  realizedPnL: number;
  returnYTD: number;
  holdings: Holding[];
}

export interface Holding {
  securityId: string;
  isin: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  unrealizedPnL: number;
  maturityDate: string;
}

export interface PerformanceMetrics {
  returnPct: number;
  sharpeRatio: number;
  duration: number;
  yield: number;
  var95: number;
}

export interface Transaction {
  id: string;
  type: string;
  securityId: string;
  amount: number;
  price: number;
  date: string;
}

export const portfolioApi = {
  get: async (): Promise<Portfolio> => {
    const response = await apiClient.get('/api/v1/portfolio');
    return response.data;
  },

  getHoldings: async (): Promise<Holding[]> => {
    const response = await apiClient.get('/api/v1/portfolio/holdings');
    return response.data;
  },

  getPerformance: async (period?: string): Promise<PerformanceMetrics> => {
    const response = await apiClient.get('/api/v1/portfolio/performance', {
      params: { period },
    });
    return response.data;
  },

  getTransactions: async (from?: string, to?: string): Promise<Transaction[]> => {
    const response = await apiClient.get('/api/v1/portfolio/transactions', {
      params: { from, to },
    });
    return response.data;
  },
};

// ============================================================================
// KYC API
// ============================================================================

export interface KYCDocument {
  id: string;
  documentType: string;
  status: string;
  uploadedAt: string;
  reviewedAt?: string;
}

export const kycApi = {
  uploadDocument: async (documentType: string, file: File): Promise<KYCDocument> => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await apiClient.post('/api/v1/kyc/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getDocuments: async (): Promise<KYCDocument[]> => {
    const response = await apiClient.get('/api/v1/kyc/documents');
    return response.data;
  },
};

// ============================================================================
// PAYMENTS API
// ============================================================================

export interface InitiatePaymentDto {
  amount: number;
  paymentMethod: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CARD';
  bankAccountId?: string;
  metadata?: any;
}

export interface PaymentResponse {
  paymentId: string;
  reference: string;
  status: string;
  paymentUrl?: string;
}

export const paymentsApi = {
  initiate: async (data: InitiatePaymentDto): Promise<PaymentResponse> => {
    const response = await apiClient.post('/api/v1/payments/initiate', data);
    return response.data;
  },

  getStatus: async (paymentId: string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/payments/${paymentId}/status`);
    return response.data;
  },

  getMethods: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/payments/methods');
    return response.data;
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDaysToMaturity = (maturityDate: string): number => {
  const now = new Date();
  const maturity = new Date(maturityDate);
  const diff = maturity.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default apiClient;
