'use client';

import Link from 'next/link';
import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, TrendingUp, Wallet, Clock, Award, Sun, Moon, Monitor, Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { PageTitle, SectionTitle, CardTitle } from '@/components/ui/PageTitle';

export default function DashboardPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Calculate KYC completion percentage
  const calculateKYCProgress = () => {
    if (!user) return 0;
    
    const requiredFields = [
      'title', 'firstName', 'lastName', 'maritalStatus', 'dateOfBirth', 
      'placeOfBirth', 'nationality', 'residentialStatus', 'mothersMaidenName',
      'phone', 'email', 'address', 'city', 'ghanaCardNumber', 'tinNumber',
      'occupation', 'employmentSector', 'annualIncome', 'sourceOfFunds',
      'bankName', 'accountNumber', 'accountType'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = user[field as keyof typeof user];
      return value && value.toString().trim() !== '';
    });
    
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  const getKYCStatus = () => {
    const progress = calculateKYCProgress();
    
    if (user?.isKycVerified) {
      return { status: 'Verified', color: 'text-green-500', bgColor: 'bg-green-500/10', icon: CheckCircle };
    } else if (progress === 100) {
      return { status: 'Submitted', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', icon: AlertCircle };
    } else if (progress > 50) {
      return { status: 'In Progress', color: 'text-blue-500', bgColor: 'bg-blue-500/10', icon: Shield };
    } else {
      return { status: 'Not Started', color: 'text-gray-500', bgColor: 'bg-gray-500/10', icon: AlertCircle };
    }
  };

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <SectionTitle subtitle="Here's your investment overview">
            Welcome back, {user.firstName}! 👋
          </SectionTitle>
        </div>

        {/* KYC Progress Card */}
        <div className="mb-8 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-lg ${getKYCStatus().bgColor} flex items-center justify-center`}>
                  {(() => {
                    const Icon = getKYCStatus().icon;
                    return <Icon className={`h-6 w-6 ${getKYCStatus().color}`} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">KYC Verification</h3>
                  <p className={`text-sm font-medium ${getKYCStatus().color}`}>
                    Status: {getKYCStatus().status}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Completion Progress</span>
                  <span className="text-sm font-semibold text-primary">{calculateKYCProgress()}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculateKYCProgress()}%` }}
                  />
                </div>
              </div>

              {!user.isKycVerified && (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/profile?tab=kyc" 
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {calculateKYCProgress() > 0 ? 'Continue KYC' : 'Start KYC Verification'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {calculateKYCProgress() > 0 && (
                    <Link 
                      href="/profile" 
                      className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              )}

              {user.isKycVerified && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Your KYC is verified and you can start trading
                </div>
              )}
            </div>

            <div className="text-right ml-6">
              <p className="text-sm text-muted-foreground mb-2">Account Type</p>
              <p className="text-2xl font-bold">{user.accountType}</p>
              <p className="text-sm text-muted-foreground mt-1">Role: {user.role}</p>
              <p className="text-sm text-muted-foreground mt-1">Status: {user.status}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Portfolio Value</h3>
            <p className="text-2xl font-bold">GHS 0.00</p>
            <p className="text-xs text-muted-foreground mt-2">Start investing to see your portfolio grow</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Returns</h3>
            <p className="text-2xl font-bold">GHS 0.00</p>
            <p className="text-xs text-green-500 mt-2">+0.00%</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Active Investments</h3>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-2">No active investments yet</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Average Yield</h3>
            <p className="text-2xl font-bold">0.00%</p>
            <p className="text-xs text-muted-foreground mt-2">Current market: up to 24.5%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/securities" className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">Browse Securities</div>
                <div className="text-xs text-muted-foreground">View available T-Bills & Bonds</div>
              </div>
            </Link>

            <Link href="/portfolio" className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">View Portfolio</div>
                <div className="text-xs text-muted-foreground">Check your holdings & performance</div>
              </div>
            </Link>

            <Link href="/securities?tab=auctions" className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">Open Auctions</div>
                <div className="text-xs text-muted-foreground">Participate in live auctions</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-transparent p-6">
          <h3 className="text-lg font-bold mb-4">Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                user.isKycVerified ? 'bg-green-500' : 'bg-muted'
              }`}>
                {user.isKycVerified ? (
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">1</span>
                )}
              </div>
              <div>
                <div className="font-semibold">Complete KYC Verification</div>
                <div className="text-sm text-muted-foreground">Upload your Ghana Card and verify your identity</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-muted-foreground">2</span>
              </div>
              <div>
                <div className="font-semibold">Fund Your Account</div>
                <div className="text-sm text-muted-foreground">Add funds via Mobile Money or Bank Transfer</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-muted-foreground">3</span>
              </div>
              <div>
                <div className="font-semibold">Make Your First Investment</div>
                <div className="text-sm text-muted-foreground">Browse securities and place your first bid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
