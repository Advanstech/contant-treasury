'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { toast } from 'sonner';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [verifying, setVerifying] = React.useState(true);
  const [tokenValid, setTokenValid] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    password: '',
    confirmPassword: '',
  });

  // Verify token on mount
  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        setTokenValid(false);
        return;
      }

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await axios.post(`${API_URL}/auth/verify-reset-token`, { token });
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        toast.error('Invalid or expired reset link');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password: formData.password,
      });
      
      setResetSuccess(true);
      toast.success('Password reset successful!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center mb-8 group">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-bold text-primary-foreground text-lg">CT</span>
            </div>
            <span className="ml-3 text-xl font-bold text-foreground">
              Constant Treasury
            </span>
          </Link>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired. 
              Reset links are only valid for 1 hour.
            </p>

            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="block w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all"
              >
                Request New Reset Link
              </Link>
              <Link
                href="/login"
                className="block w-full bg-muted text-foreground font-bold py-3 rounded-lg hover:bg-muted/80 transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center mb-8 group">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-bold text-primary-foreground text-lg">CT</span>
            </div>
            <span className="ml-3 text-xl font-bold text-foreground">
              Constant Treasury
            </span>
          </Link>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all"
            >
              Continue to Sign In
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="text-xs text-muted-foreground mt-4">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center mb-8 group">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-bold text-primary-foreground text-lg">CT</span>
            </div>
            <span className="ml-3 text-xl font-bold text-foreground">
              Constant Treasury
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <PageTitle subtitle="Enter your new password below">
              Reset Your Password
            </PageTitle>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Lock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-500 mb-1">Password Requirements</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-foreground">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.password !== formData.confirmPassword}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
        <div className="max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Secure Your Account</h2>
          <p className="text-muted-foreground mb-6">
            Choose a strong, unique password to protect your investment account. 
            We recommend using a password manager to generate and store secure passwords.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Passwords are encrypted with industry-standard algorithms
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                We never store passwords in plain text
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Two-factor authentication available for extra security
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
