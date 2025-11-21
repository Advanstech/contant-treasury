'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Settings,
  Shield,
  Database,
  Activity,
  DollarSign,
  BarChart3,
  FileCheck,
  Upload,
  Download,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { AdminThemeProvider, useAdminTheme } from '@/contexts/AdminThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'ANALYST', 'PRIMARY_DEALER'],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'PRIMARY_DEALER'],
  },
  {
    name: 'Auctions',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'ADMIN', 'PRIMARY_DEALER'],
    children: [
      { name: 'Calendar', href: '/admin/auctions/issuance-calendar' },
      { name: 'Create Auction', href: '/admin/auctions/create' },
      { name: 'Results Entry', href: '/admin/auctions/results' },
      { name: 'All Auctions', href: '/admin/auctions' },
      { name: 'Repo Operations', href: '/admin/auctions/repo' },
      { name: 'Corporate Bonds', href: '/admin/auctions/corporate-bonds' },
    ],
  },
  {
    name: 'PD Submissions',
    href: '/admin/pd-submissions',
    icon: FileText,
    roles: ['SUPER_ADMIN', 'ADMIN', 'PRIMARY_DEALER'],
  },
  {
    name: 'Settlements',
    icon: DollarSign,
    roles: ['SUPER_ADMIN', 'ADMIN', 'PRIMARY_DEALER'],
    children: [
      { name: 'Instructions', href: '/admin/settlements' },
      { name: 'CSD Files', href: '/admin/settlements/csd-files' },
      { name: 'Confirmations', href: '/admin/settlements/confirmations' },
    ],
  },
  {
    name: 'Users & KYC',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN', 'COMPLIANCE_OFFICER'],
    children: [
      { name: 'User Management', href: '/admin/users' },
      { name: 'KYC Approvals', href: '/admin/users/kyc' },
      { name: 'CSD Accounts', href: '/admin/users/csd' },
    ],
  },
  {
    name: 'Trading',
    href: '/admin/trading',
    icon: TrendingUp,
    roles: ['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'PRIMARY_DEALER'],
  },
  {
    name: 'Reports',
    icon: FileCheck,
    roles: ['SUPER_ADMIN', 'ADMIN', 'COMPLIANCE_OFFICER', 'ANALYST'],
    children: [
      { name: 'Regulatory', href: '/admin/reports/regulatory' },
      { name: 'Audit Trail', href: '/admin/reports/audit' },
      { name: 'BoG API Logs', href: '/admin/reports/bog-logs' },
    ],
  },
  {
    name: 'System',
    icon: Database,
    roles: ['SUPER_ADMIN', 'DEVELOPER'],
    children: [
      { name: 'API Logs', href: '/admin/system/api-logs' },
      { name: 'Performance', href: '/admin/system/performance' },
      { name: 'Configuration', href: '/admin/system/config' },
    ],
  },
  {
    name: 'Transactions',
    href: '/admin/transactions',
    icon: Activity,
    roles: ['SUPER_ADMIN', 'ADMIN', 'COMPLIANCE_OFFICER'],
  },
  {
    name: 'Primary Dealer',
    href: '/primary-dealer',
    icon: Database,
    roles: ['SUPER_ADMIN', 'ADMIN', 'PRIMARY_DEALER'],
  },
  {
    name: 'Book Runner',
    href: '/book-runner',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN', 'BOOK_RUNNER'],
  },
  {
    name: 'Custodian',
    href: '/custodian',
    icon: Shield,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CUSTODIAN'],
  },
];

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'ANALYST', 'PRIMARY_DEALER', 'BOOK_RUNNER', 'CUSTODIAN', 'COMPLIANCE_OFFICER'] as const;

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, loading } = useAuth();
  const userRole = user?.role || 'USER';
  const { theme, toggleTheme } = useAdminTheme();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const hasAccess = (roles: string[]) => roles.includes(userRole);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading admin…
      </div>
    );
  }

  // Gate entire admin to allowed roles only
  if (!ADMIN_ROLES.includes(userRole as any)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <Shield className="w-10 h-10 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">403 – Unauthorized</h1>
        <p className="text-muted-foreground mb-6 text-center">You don’t have permission to access the Admin Dashboard.</p>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Return to site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[hsl(240,55%,10%)] border-r border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(25,95%,43%)] flex items-center justify-center shadow-lg shadow-[hsl(25,95%,53%)]/20 group-hover:shadow-[hsl(25,95%,53%)]/40 transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">Constant Treasury</h1>
                <p className="text-xs text-gray-400 font-medium">Admin Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navigation.map((item) => {
              if (!hasAccess(item.roles)) return null;

              const isActive = pathname === item.href;
              const isExpanded = expandedMenus.includes(item.name);

              if (item.children) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isChildActive
                                  ? 'bg-[hsl(25,95%,53%)] text-white font-medium'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[hsl(25,95%,53%)] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(25,95%,43%)] flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(25,95%,53%)] rounded-full animate-pulse" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/admin/system/config"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(25,95%,43%)] hover:from-[hsl(25,95%,48%)] hover:to-[hsl(25,95%,38%)] rounded-lg transition-all shadow-lg shadow-[hsl(25,95%,53%)]/20 hover:shadow-[hsl(25,95%,53%)]/40"
              title="Back to Main Site"
            >
              Return to Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 pb-12">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
