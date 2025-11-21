'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('totalInvestment');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Fetch dashboard metrics
  const { data: dashboardData, isLoading: isLoadingDashboard, refetch } = useQuery({
    queryKey: ['admin', 'analytics', 'dashboard', timeRange],
    queryFn: () => adminApi.analytics.getDashboardMetrics(timeRange as any),
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch user metrics
  const { data: userMetrics, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin', 'analytics', 'users', timeRange],
    queryFn: () => adminApi.analytics.getUserMetrics(timeRange as any),
  });

  // Fetch auction volume trend
  const { data: volumeTrend, isLoading: isLoadingVolume } = useQuery({
    queryKey: ['admin', 'analytics', 'volume', timeRange],
    queryFn: () => adminApi.analytics.getAuctionVolumeTrend(timeRange as any),
  });

  const isLoading = isLoadingDashboard || isLoadingUsers || isLoadingVolume;

  // Build KPI metrics from dashboard data
  const kpiMetrics = dashboardData ? [
    {
      name: 'Total AUM',
      value: dashboardData.aum,
      trend: 'up',
      changePercentage: 12.5,
    },
    {
      name: 'Active Users',
      value: dashboardData.activeUsers,
      trend: 'up',
      changePercentage: 8.2,
    },
    {
      name: 'Avg Yield',
      value: dashboardData.avgYield,
      trend: 'up',
      changePercentage: 0.8,
    },
    {
      name: 'Total Auctions',
      value: dashboardData.totalAuctions,
      trend: 'up',
      changePercentage: 5.3,
    },
  ] : [];

  // Format auction metrics
  const auctionMetrics = volumeTrend?.volumeTrend?.map((item) => ({
    period: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    totalVolume: item.totalAmount,
    auctionCount: item.totalBids,
  })) || [];

  // Comprehensive mock data for Ghana Treasury Securities
  const securityDistribution = [
    { securityName: '91-Day T-Bill', percentage: 45, totalAmount: 450000000, color: '#3b82f6' },
    { securityName: '182-Day T-Bill', percentage: 30, totalAmount: 300000000, color: '#10b981' },
    { securityName: '364-Day T-Bill', percentage: 15, totalAmount: 150000000, color: '#f59e0b' },
    { securityName: '2-Year Bond', percentage: 7, totalAmount: 70000000, color: '#8b5cf6' },
    { securityName: '5-Year Bond', percentage: 3, totalAmount: 30000000, color: '#ef4444' },
  ];

  const topInvestors = [
    { investorName: 'Bank of Ghana', totalInvestment: 250000000, tradeCount: 45, avgYield: 18.5, rank: 1 },
    { investorName: 'Ecobank Ghana', totalInvestment: 180000000, tradeCount: 38, avgYield: 19.2, rank: 2 },
    { investorName: 'Standard Chartered', totalInvestment: 150000000, tradeCount: 32, avgYield: 18.8, rank: 3 },
    { investorName: 'GCB Bank Ltd', totalInvestment: 120000000, tradeCount: 28, avgYield: 19.5, rank: 4 },
    { investorName: 'Absa Bank Ghana', totalInvestment: 95000000, tradeCount: 25, avgYield: 18.3, rank: 5 },
    { investorName: 'CAL Bank Ltd', totalInvestment: 85000000, tradeCount: 22, avgYield: 19.1, rank: 6 },
    { investorName: 'Fidelity Bank Ghana', totalInvestment: 72000000, tradeCount: 20, avgYield: 18.7, rank: 7 },
    { investorName: 'Zenith Bank Ghana', totalInvestment: 68000000, tradeCount: 19, avgYield: 19.3, rank: 8 },
    { investorName: 'Access Bank Ghana', totalInvestment: 55000000, tradeCount: 17, avgYield: 18.9, rank: 9 },
    { investorName: 'UBA Ghana', totalInvestment: 48000000, tradeCount: 15, avgYield: 19.0, rank: 10 },
    { investorName: 'GTBank Ghana', totalInvestment: 42000000, tradeCount: 14, avgYield: 18.6, rank: 11 },
    { investorName: 'Stanbic Bank Ghana', totalInvestment: 38000000, tradeCount: 13, avgYield: 19.4, rank: 12 },
  ];

  const additionalMetrics = {
    avgSettlementDays: 2,
    newInvestors: userMetrics?.newUsersThisMonth || 156,
    newInvestorsChange: 18,
    upcomingAuctions: dashboardData?.activeAuctions || 3,
    upcomingAuctionsVolume: dashboardData?.totalAmount || 850000000,
  };

  // Enhanced auction volume data with realistic trends
  const enhancedAuctionMetrics = [
    { period: 'Oct 1', totalVolume: 280000000, auctionCount: 4, avgYield: 18.2 },
    { period: 'Oct 8', totalVolume: 320000000, auctionCount: 5, avgYield: 18.5 },
    { period: 'Oct 15', totalVolume: 295000000, auctionCount: 4, avgYield: 18.3 },
    { period: 'Oct 22', totalVolume: 340000000, auctionCount: 6, avgYield: 18.7 },
    { period: 'Oct 29', totalVolume: 380000000, auctionCount: 5, avgYield: 19.1 },
    { period: 'Nov 5', totalVolume: 425000000, auctionCount: 7, avgYield: 19.3 },
    { period: 'Nov 12', totalVolume: 450000000, auctionCount: 6, avgYield: 19.5 },
    { period: 'Nov 19', totalVolume: 410000000, auctionCount: 5, avgYield: 19.2 },
  ];

  // Yield curve data for Ghana Treasury Securities
  const yieldCurveData = [
    { maturity: '3M', yield: 18.2, bid: 18.1, ask: 18.3 },
    { maturity: '6M', yield: 18.5, bid: 18.4, ask: 18.6 },
    { maturity: '12M', yield: 19.1, bid: 19.0, ask: 19.2 },
    { maturity: '2Y', yield: 19.8, bid: 19.7, ask: 19.9 },
    { maturity: '3Y', yield: 20.3, bid: 20.2, ask: 20.4 },
    { maturity: '5Y', yield: 21.2, bid: 21.1, ask: 21.3 },
    { maturity: '7Y', yield: 21.8, bid: 21.7, ask: 21.9 },
    { maturity: '10Y', yield: 22.5, bid: 22.4, ask: 22.6 },
  ];

  // Market activity heatmap data
  const marketActivityData = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex],
    hours: Array.from({ length: 24 }, (_, hourIndex) => ({
      hour: hourIndex,
      activity: Math.random() * 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    })),
  }));

  // Pagination and sorting logic for top investors
  const sortedInvestors = useMemo(() => {
    const sorted = [...topInvestors].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    return sorted;
  }, [topInvestors, sortBy, sortOrder]);

  const paginatedInvestors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedInvestors.slice(startIndex, endIndex);
  }, [sortedInvestors, currentPage]);

  const totalPages = Math.ceil(topInvestors.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Custom tooltip components for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: {entry.name.includes('Volume') || entry.name.includes('Amount') 
                ? `GHS ${(entry.value / 1000000).toFixed(1)}M`
                : entry.name.includes('Yield') || entry.name.includes('Rate')
                ? `${entry.value.toFixed(2)}%`
                : entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const YieldTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle export
  const handleExport = async () => {
    try {
      toast.info('Generating report...');
      const blob = await adminApi.analytics.exportReport('auctions');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      toast.error('Failed to export report', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading analytics...</span>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric: any) => (
          <div
            key={metric.name}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">
              {typeof metric.value === 'number' 
                ? metric.name.includes('Rate') || metric.name.includes('Yield')
                  ? `${metric.value.toFixed(1)}%`
                  : metric.name.includes('AUM') || metric.name.includes('Investment')
                  ? `GHS ${(metric.value / 1000000).toFixed(1)}M`
                  : metric.value.toLocaleString()
                : metric.value
              }
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={metric.trend === 'up' ? 'text-green-600' : 'text-destructive'}
              >
                {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage?.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auction Volume Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Auction Volume Trend</h2>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={enhancedAuctionMetrics}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 60%, 20%)" />
              <XAxis 
                dataKey="period" 
                stroke="hsl(240, 60%, 60%)"
                tick={{ fill: 'hsl(240, 60%, 60%)', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(240, 60%, 60%)"
                tick={{ fill: 'hsl(240, 60%, 60%)', fontSize: 12 }}
                tickFormatter={(value) => `GHS ${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(240, 60%, 60%)"
                tick={{ fill: 'hsl(240, 60%, 60%)', fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalVolume"
                stroke="hsl(25, 95%, 53%)"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                name="Volume"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgYield"
                stroke="hsl(142, 76%, 45%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(142, 76%, 45%)', r: 4 }}
                name="Avg Yield"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Security Distribution */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Security Mix</h2>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={securityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="percentage"
              >
                {securityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'hsl(240, 60%, 8%)',
                  border: '1px solid hsl(240, 60%, 20%)',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => (
                  <span style={{ color: 'hsl(240, 60%, 60%)' }}>
                    {entry.payload.securityName}
                  </span>
                )}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {securityDistribution.map((item, index) => (
              <div key={item.securityName} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.securityName}</span>
                </div>
                <div className="text-right">
                  <span className="text-foreground font-medium">{item.percentage.toFixed(1)}%</span>
                  <p className="text-xs text-muted-foreground">GHS {(item.totalAmount / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yield Curve Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Yield Curve</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yieldCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 60%, 20%)" />
              <XAxis 
                dataKey="maturity" 
                stroke="hsl(240, 60%, 60%)"
                tick={{ fill: 'hsl(240, 60%, 60%)', fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(240, 60%, 60%)"
                tick={{ fill: 'hsl(240, 60%, 60%)', fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<YieldTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="yield"
                stroke="hsl(25, 95%, 53%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(25, 95%, 53%)', r: 5 }}
                name="Mid Yield"
              />
              <Line
                type="monotone"
                dataKey="bid"
                stroke="hsl(142, 76%, 45%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(142, 76%, 45%)', r: 3 }}
                name="Bid"
              />
              <Line
                type="monotone"
                dataKey="ask"
                stroke="hsl(0, 72%, 51%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(0, 72%, 51%)', r: 3 }}
                name="Ask"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Activity Heatmap */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Market Activity</h2>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
              <div key={day} className="text-center">
                <div className="text-muted-foreground mb-1">{day}</div>
                {Array.from({ length: 24 }, (_, hourIndex) => {
                  const activity = Math.random() * 100;
                  const intensity = activity > 75 ? 'high' : activity > 50 ? 'medium' : activity > 25 ? 'low' : 'minimal';
                  const colors = {
                    high: 'bg-green-600',
                    medium: 'bg-green-500',
                    low: 'bg-green-400',
                    minimal: 'bg-green-300/20',
                  };
                  return (
                    <div
                      key={hourIndex}
                      className={`w-3 h-3 rounded-sm mb-0.5 ${colors[intensity]}`}
                      title={`${hourIndex}:00 - ${activity.toFixed(0)}% activity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-300/20 rounded-sm" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-sm" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm" />
              <span>Peak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Investors with Pagination */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Top Investors</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Rank
                </th>
                <th 
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('investorName')}
                >
                  <div className="flex items-center gap-1">
                    Investor
                    {sortBy === 'investorName' && (
                      sortOrder === 'asc' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('totalInvestment')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Total Investment
                    {sortBy === 'totalInvestment' && (
                      sortOrder === 'asc' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('tradeCount')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Trades
                    {sortBy === 'tradeCount' && (
                      sortOrder === 'asc' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-3 px-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('avgYield')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    Avg Yield
                    {sortBy === 'avgYield' && (
                      sortOrder === 'asc' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvestors.map((investor: any, index: number) => (
                <tr
                  key={investor.investorName}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : index === 1
                          ? 'bg-gray-400/20 text-gray-400'
                          : index === 2
                          ? 'bg-orange-500/20 text-orange-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-foreground font-medium">{investor.investorName}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-foreground font-medium">GHS {(investor.totalInvestment / 1000000).toFixed(2)}M</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-muted-foreground">{investor.tradeCount}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-green-600 font-medium">{investor.avgYield?.toFixed(2)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, topInvestors.length)} of {topInvestors.length} investors
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Settlement Time</p>
              <p className="text-2xl font-bold text-foreground">
                {additionalMetrics.avgSettlementDays ? `T+${additionalMetrics.avgSettlementDays}` : 'T+2'}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Average time from auction to settlement
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New Investors ({timeRange})</p>
              <p className="text-2xl font-bold text-foreground">
                {additionalMetrics.newInvestors || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {additionalMetrics.newInvestorsChange > 0 ? (
              <span className="text-green-600">+{additionalMetrics.newInvestorsChange}%</span>
            ) : (
              <span className="text-destructive">{additionalMetrics.newInvestorsChange}%</span>
            )} from previous period
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Auctions</p>
              <p className="text-2xl font-bold text-foreground">
                {additionalMetrics.upcomingAuctions || 0}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Next 7 days • GHS {((additionalMetrics.upcomingAuctionsVolume || 0) / 1000000).toFixed(1)}M total
          </p>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
