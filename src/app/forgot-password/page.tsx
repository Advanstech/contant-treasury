'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { PageTitle } from '@/components/ui/PageTitle';
import { toast } from 'sonner';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
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

          {/* Success Message */}
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>
            </p>

            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 text-sm text-left">
              <p className="font-semibold mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Check your email inbox</li>
                <li>Click the password reset link</li>
                <li>Create a new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary hover:underline font-semibold"
              >
                try again
              </button>
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>

          {/* Header */}
          <div className="mb-8">
            <PageTitle subtitle="Enter your email address and we'll send you a link to reset your password">
              Forgot Password?
            </PageTitle>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-500 mb-1">Password Reset Instructions</p>
                <p className="text-muted-foreground">
                  We'll send you an email with a secure link to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
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

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
        <div className="max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Secure Password Reset</h2>
          <p className="text-muted-foreground mb-6">
            Your account security is our top priority. We use industry-standard encryption 
            and secure tokens to ensure your password reset is safe and protected.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Reset links expire after 1 hour
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                One-time use tokens for maximum security
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                Email notifications for all password changes
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
