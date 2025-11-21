'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UserProfile, RegisterDto, LoginDto } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import logger from '@/lib/logger';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    logger.info('AuthProvider mounted', {}, 'AUTH');
    loadUser();
  }, []);

  const loadUser = async () => {
    const startTime = Date.now();
    
    try {
      const storedToken = localStorage.getItem('accessToken');
      logger.debug('Loading user profile', { hasToken: !!storedToken }, 'AUTH');
      
      if (storedToken) {
        setToken(storedToken);
        const profile = await authApi.getProfile(storedToken);
        setUser(profile);
        
        logger.auth('Profile loaded', {
          userId: profile.id,
          email: profile.email,
          accountType: profile.accountType,
          status: profile.status,
          duration: `${Date.now() - startTime}ms`,
        });
        
        // Store user ID for logging
        localStorage.setItem('userId', profile.id);
      } else {
        logger.debug('No token found, user not logged in', {}, 'AUTH');
        setToken(null);
      }
    } catch (error: any) {
      logger.auth('Profile load failed', {
        error: error.message,
        response: error.response?.data,
        duration: `${Date.now() - startTime}ms`,
      }, error);
      
      // Clear tokens on any error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      setUser(null);
    } finally {
      setLoading(false);
      logger.performance('Auth context load', Date.now() - startTime);
    }
  };

  const login = async (data: LoginDto) => {
    const startTime = Date.now();
    
    try {
      console.log('🔑 [AuthContext] Login attempt starting...', { email: data.email, timestamp: new Date().toISOString() });
      logger.auth('Login attempt', { email: data.email });
      
      console.log('🔑 [AuthContext] Calling authApi.login...');
      const { accessToken, refreshToken } = await authApi.login(data);
      console.log('🔑 [AuthContext] Tokens received:', { 
        hasAccessToken: !!accessToken, 
        accessTokenLength: accessToken?.length,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken?.length
      });
      
      console.log('🔑 [AuthContext] Storing tokens in localStorage...');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      console.log('🔑 [AuthContext] Tokens stored successfully');
      
      console.log('🔑 [AuthContext] Fetching user profile...');
      const profile = await authApi.getProfile(accessToken);
      console.log('🔑 [AuthContext] Profile received:', {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        accountType: profile.accountType
      });
      setUser(profile);
      
      // Store user ID for logging
      localStorage.setItem('userId', profile.id);
      
      const duration = Date.now() - startTime;
      console.log('✅✅✅ [AuthContext] Login successful!', {
        userId: profile.id,
        email: profile.email,
        role: profile.role,
        accountType: profile.accountType,
        duration: `${duration}ms`,
      });
      
      logger.auth('Login successful', {
        userId: profile.id,
        email: profile.email,
        accountType: profile.accountType,
        duration: `${duration}ms`,
      });
      
      toast.success('Welcome back!');
      console.log('🔑 [AuthContext] Redirecting to /portfolio...');
      router.push('/portfolio');
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('❌❌❌ [AuthContext] Login failed!', {
        email: data.email,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        response: error.response?.data,
        duration: `${duration}ms`,
      });
      
      logger.auth('Login failed', {
        email: data.email,
        error: error.message,
        response: error.response?.data,
        duration: `${duration}ms`,
      }, error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('❌ [AuthContext] Showing error toast:', errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    const startTime = Date.now();
    
    try {
      logger.auth('Registration attempt', {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        accountType: data.accountType,
      });
      
      const response = await authApi.register(data);
      const { accessToken, refreshToken, message } = response;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      const profile = await authApi.getProfile();
      setUser(profile);
      
      // Store user ID for logging
      localStorage.setItem('userId', profile.id);
      
      logger.auth('Registration successful', {
        userId: profile.id,
        email: profile.email,
        accountType: profile.accountType,
        duration: `${Date.now() - startTime}ms`,
      });
      
      // Show the success message from the backend
      toast.success(message || 'Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      logger.auth('Registration failed', {
        email: data.email,
        accountType: data.accountType,
        error: error.message,
        response: error.response?.data,
        duration: `${Date.now() - startTime}ms`,
      }, error);
      
      // Clear any partial data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      setUser(null);
      
      // Show user-friendly error
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    const startTime = Date.now();
    
    try {
      logger.auth('Logout attempt', { userId: user?.id });
      
      await authApi.logout();
      
      logger.auth('Logout successful', {
        userId: user?.id,
        duration: `${Date.now() - startTime}ms`,
      });
    } catch (error: any) {
      logger.auth('Logout failed', {
        userId: user?.id,
        error: error.message,
        response: error.response?.data,
      }, error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const startTime = Date.now();
    
    try {
      logger.auth('Profile update attempt', { userId: user?.id });
      
      const updatedProfile = await authApi.updateProfile(data);
      setUser(updatedProfile);
      
      logger.auth('Profile updated successfully', {
        userId: updatedProfile.id,
        duration: `${Date.now() - startTime}ms`,
      });
    } catch (error: any) {
      logger.auth('Profile update failed', {
        userId: user?.id,
        error: error.message,
        response: error.response?.data,
        duration: `${Date.now() - startTime}ms`,
      }, error);
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
