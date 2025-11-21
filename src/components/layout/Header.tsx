'use client';

import Link from 'next/link';
import { ChevronDown, TrendingUp, Wallet, BarChart3, LogIn, User, LogOut, Menu, X, Settings, Shield, Bell, CreditCard, HelpCircle, FileText, Award, Activity, Zap, ArrowUpRight, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: Log user role
  useEffect(() => {
    if (user) {
      console.log('Header - User Role:', user.role);
      console.log('Header - Full User:', user);
    }
  }, [user]);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-bold text-primary-foreground text-sm">CT</span>
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:inline">
              Constant Treasury
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Public Navigation - Always Visible */}
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
          >
            Home
          </Link>
          
          {/* Auctions Dropdown - Ghana Treasury Market */}
          <div className="relative group">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md flex items-center gap-1">
              Auctions
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {/* Auctions Dropdown */}
            <div className="absolute left-0 top-full mt-2 w-96 rounded-xl border border-border bg-popover shadow-2xl transform origin-top opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto z-50 max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="px-3 py-2 border-b border-border mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">BoG Treasury Auctions</p>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/auctions/issuance-calendar"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Issuance Calendar</p>
                      <p className="text-xs text-muted-foreground">Quarterly Treasury securities schedule</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/announcements"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover/item:bg-orange-500/20 transition-colors">
                      <Activity className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Auction Announcements</p>
                      <p className="text-xs text-muted-foreground">Latest BoG auction notices</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/upcoming"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center group-hover/item:bg-green-500/20 transition-colors">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Upcoming Auctions</p>
                      <p className="text-xs text-muted-foreground">Scheduled Treasury auctions</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/t-bills"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover/item:bg-purple-500/20 transition-colors">
                      <FileText className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Treasury Bills</p>
                      <p className="text-xs text-muted-foreground">91-day, 182-day & 364-day T-Bills</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/government-bonds"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                      <Award className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Government Bonds</p>
                      <p className="text-xs text-muted-foreground">2-year, 3-year, 5-year & 10-year bonds</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/results"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover/item:bg-cyan-500/20 transition-colors">
                      <BarChart3 className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Auction Results</p>
                      <p className="text-xs text-muted-foreground">Historical auction outcomes</p>
                    </div>
                  </Link>
                  <Link
                    href="/auctions/how-it-works"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover/item:bg-emerald-500/20 transition-colors">
                      <HelpCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">How Auction Works (Participating)</p>
                      <p className="text-xs text-muted-foreground">Learn Ghana auction process</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Dropdown - Secondary Market */}
          {mounted && isAuthenticated && (
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md flex items-center gap-1 transition-colors">
                Trading
                <ChevronDown className="h-3 w-3" />
              </button>
              
              {/* Trading Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-border bg-popover shadow-2xl transform origin-top opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto z-50">
                <div className="p-4">
                  <div className="px-3 py-2 border-b border-border mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary Market Trading</p>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/trading/dashboard"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                    >
                      <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Trading Dashboard</p>
                        <p className="text-xs text-muted-foreground">Market overview & analytics</p>
                      </div>
                    </Link>
                    <Link
                      href="/trading/orderbook"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                    >
                      <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center group-hover/item:bg-green-500/20 transition-colors">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order Book</p>
                        <p className="text-xs text-muted-foreground">Live market depth & orders</p>
                      </div>
                    </Link>
                    <Link
                      href="/trading/portfolio"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                    >
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover/item:bg-purple-500/20 transition-colors">
                        <Wallet className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">My Portfolio</p>
                        <p className="text-xs text-muted-foreground">Holdings & performance</p>
                      </div>
                    </Link>
                    <Link
                      href="/trading/orders"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                    >
                      <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover/item:bg-orange-500/20 transition-colors">
                        <Zap className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order History</p>
                        <p className="text-xs text-muted-foreground">Trade execution history</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Investor Relations Dropdown - Inspired by MoF Ghana */}
          <div className="relative group">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md flex items-center gap-1">
              Investor Relations
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {/* Investor Relations Dropdown */}
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-popover shadow-2xl transform origin-top opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto z-50">
              <div className="p-3">
                <div className="px-3 py-2 border-b border-border mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/investor-presentations"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <Award className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Investor Presentations</p>
                      <p className="text-xs text-muted-foreground">Learn about investing</p>
                    </div>
                  </Link>
                  <Link
                    href="/reports"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Reports & Publications</p>
                      <p className="text-xs text-muted-foreground">Annual & quarterly reports</p>
                    </div>
                  </Link>
                  <Link
                    href="/market-data"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <BarChart3 className="h-4 w-4 text-cyan-500" />
                    <div>
                      <p className="font-medium">Market Data</p>
                      <p className="text-xs text-muted-foreground">Yield curves & rates</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <Link 
            href="/about" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
          >
            Contact
          </Link>
          
                  </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Authentication Actions */}
          {mounted && !loading && (
            <>
              {isAuthenticated ? (
                /* Authenticated User Actions */
                <div className="flex items-center gap-2">
                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {user?.firstName || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    
                    {/* User Dropdown - Enhanced */}
                    <div className="absolute right-0 top-full mt-2 w-80 max-h-[calc(100vh-100px)] overflow-y-auto rounded-xl border border-border bg-popover shadow-2xl transform origin-top-right opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto z-50">
                      <div className="p-1">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-xl">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                {user?.firstName && user?.lastName 
                                  ? `${user.firstName} ${user.lastName}`
                                  : user?.email || 'User'
                                }
                                {user?.isKycVerified && (
                                  <Shield className="h-3.5 w-3.5 text-green-500" />
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {user?.email}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  <Award className="h-3 w-3" />
                                  {user?.accountType || 'Individual'}
                                </span>
                                {user?.status === 'ACTIVE' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                    <Activity className="h-3 w-3" />
                                    Active
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-popover"></div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 p-3 border-b border-border">
                          <div className="px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <Wallet className="h-3.5 w-3.5" />
                              Portfolio Value
                            </div>
                            <p className="text-sm font-bold text-foreground">₵0.00</p>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <TrendingUp className="h-3.5 w-3.5" />
                              Total Return
                            </div>
                            <p className="text-sm font-bold text-green-500">+0.00%</p>
                          </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="py-1">
                          {/* Account Section */}
                          <div className="px-2 py-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Account</p>
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                                <BarChart3 className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Dashboard</p>
                                <p className="text-xs text-muted-foreground">Overview & analytics</p>
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                          <Link
                            href="/portfolio"
                            className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center group-hover/item:bg-green-500/20 transition-colors">
                                <Wallet className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <p className="font-medium">Portfolio</p>
                                <p className="text-xs text-muted-foreground">Holdings & performance</p>
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                          <Link
                            href="/securities"
                            className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover/item:bg-blue-500/20 transition-colors">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium">Securities</p>
                                <p className="text-xs text-muted-foreground">Browse & invest</p>
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>

                          {/* Admin Section - Only for privileged users */}
                          {user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.role === 'DEVELOPER' || user.role === 'ANALYST' || user.role === 'PRIMARY_DEALER' || user.role === 'COMPLIANCE_OFFICER') && (
                            <>
                              <div className="px-2 py-2 mt-2 border-t border-border">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Administration</p>
                              </div>
                              <Link
                                href="/admin"
                                className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover/item:bg-orange-500/30 transition-colors">
                                    <Shield className="h-4 w-4 text-orange-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-orange-500">Admin Dashboard</p>
                                    <p className="text-xs text-muted-foreground">BoG Compliance & Management</p>
                                  </div>
                                </div>
                                <Zap className="h-4 w-4 text-orange-500" />
                              </Link>
                            </>
                          )}

                          {/* Settings Section */}
                          <div className="px-2 py-2 mt-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Settings</p>
                          </div>
                          <Link
                            href="/profile"
                            className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover/item:bg-purple-500/20 transition-colors">
                                <User className="h-4 w-4 text-purple-500" />
                              </div>
                              <div>
                                <p className="font-medium">Profile</p>
                                <p className="text-xs text-muted-foreground">Personal information</p>
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center justify-between gap-3 px-3 py-3 mx-2 rounded-lg text-sm transition-all hover:bg-accent hover:text-accent-foreground group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover/item:bg-orange-500/20 transition-colors">
                                <Settings className="h-4 w-4 text-orange-500" />
                              </div>
                              <div>
                                <p className="font-medium">Settings</p>
                                <p className="text-xs text-muted-foreground">Preferences & security</p>
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </Link>

                          {/* Quick Actions */}
                          <div className="px-2 py-2 mt-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Quick Actions</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 px-2">
                            <Link
                              href="/faq"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                              <HelpCircle className="h-4 w-4" />
                              Help Center
                            </Link>
                            <Link
                              href="/guides"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                              <FileText className="h-4 w-4" />
                              Guides
                            </Link>
                          </div>
                        </div>

                        {/* Sign Out */}
                        <div className="p-2 border-t border-border">
                          <button
                            onClick={() => logout()}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-destructive/10 text-destructive group/logout"
                          >
                            <LogOut className="h-4 w-4 group-hover/logout:rotate-12 transition-transform" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Non-authenticated User Actions */
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container px-4 py-4 space-y-3">
            {/* Public Navigation */}
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Home
            </Link>
            
            {/* Mobile Auctions Section */}
            <div className="border-t border-border pt-3 mt-3">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">BoG Treasury Auctions</p>
            </div>
            <Link 
              href="/auctions/issuance-calendar" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Calendar className="h-5 w-5" />
              Issuance Calendar
            </Link>
            <Link 
              href="/auctions/announcements" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Activity className="h-5 w-5" />
              Auction Announcements
            </Link>
            <Link 
              href="/auctions/upcoming" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              Upcoming Auctions
            </Link>
            <Link 
              href="/auctions/t-bills" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5" />
              Treasury Bills
            </Link>
            <Link 
              href="/auctions/government-bonds" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Award className="h-5 w-5" />
              Government Bonds
            </Link>
            <Link 
              href="/auctions/results" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              Auction Results
            </Link>
            <Link 
              href="/auctions/how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              How Auction Works (Participating)
            </Link>

            {/* Mobile Trading Section - Only for authenticated users */}
            {mounted && isAuthenticated && (
              <>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary Market Trading</p>
                </div>
                <Link 
                  href="/trading/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  Trading Dashboard
                </Link>
                <Link 
                  href="/trading/orderbook" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <TrendingUp className="h-5 w-5" />
                  Order Book
                </Link>
                <Link 
                  href="/trading/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Wallet className="h-5 w-5" />
                  My Portfolio
                </Link>
                <Link 
                  href="/trading/orders" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Zap className="h-5 w-5" />
                  Order History
                </Link>
              </>
            )}
            
            {/* Mobile Investor Relations Section */}
            <div className="border-t border-border pt-3 mt-3">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Investor Relations</p>
            </div>
            <Link 
              href="/investor-presentations" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Award className="h-5 w-5" />
              Investor Presentations
            </Link>
            <Link 
              href="/reports" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5" />
              Reports & Publications
            </Link>
            <Link 
              href="/market-data" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              Market Data
            </Link>
            
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Contact
            </Link>

            {/* Authenticated Trading Portal */}
            {mounted && isAuthenticated && (
              <>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trading Portal</p>
                </div>
                <Link 
                  href="/securities" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <TrendingUp className="h-5 w-5" />
                  Browse Securities
                </Link>
                <Link 
                  href="/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Wallet className="h-5 w-5" />
                  My Portfolio
                </Link>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  Trading Dashboard
                </Link>
                <Link 
                  href="/orders" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Zap className="h-5 w-5" />
                  Order History
                </Link>
              </>
            )}

            {/* Mobile Auth Actions */}
            {mounted && !loading && (
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-foreground">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email || 'User'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.accountType || 'Individual'} Account
                      </p>
                    </div>
                    <Link 
                      href="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-semibold text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 text-base font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Open Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
