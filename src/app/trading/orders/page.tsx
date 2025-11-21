'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Filter,
  Search,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';
import { PDFGenerator } from '@/lib/pdf-generator';

interface Order {
  id: string;
  orderId: string;
  securityName: string;
  securityType: 'TREASURY_BILL' | 'GOVERNMENT_BOND';
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
  filledQuantity: number;
  averagePrice?: number;
  totalValue: number;
  status: 'PENDING' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  filledAt?: string;
  commission: number;
  fees: number;
  netValue: number;
  notes?: string;
}

interface OrderFilters {
  status: string;
  type: string;
  securityType: string;
  dateRange: string;
  searchTerm: string;
}

export default function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    status: '',
    type: '',
    securityType: '',
    dateRange: '',
    searchTerm: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const itemsPerPage = 20;

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderHistory();
    }
  }, [isAuthenticated]);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      // Mock order data
      const mockOrders: Order[] = [
        {
          id: '1',
          orderId: 'ORD-2025-001234',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-091',
          type: 'BUY',
          orderType: 'LIMIT',
          quantity: 100000,
          price: 98.75,
          filledQuantity: 100000,
          averagePrice: 98.74,
          totalValue: 9875000,
          status: 'FILLED',
          createdAt: '2025-11-19T10:30:00Z',
          updatedAt: '2025-11-19T10:32:15Z',
          filledAt: '2025-11-19T10:32:15Z',
          commission: 2468.75,
          fees: 500.00,
          netValue: 9872031.25,
        },
        {
          id: '2',
          orderId: 'ORD-2025-001233',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-182',
          type: 'SELL',
          orderType: 'MARKET',
          quantity: 50000,
          filledQuantity: 50000,
          averagePrice: 97.52,
          totalValue: 4876000,
          status: 'FILLED',
          createdAt: '2025-11-19T09:15:00Z',
          updatedAt: '2025-11-19T09:15:45Z',
          filledAt: '2025-11-19T09:15:45Z',
          commission: 1219.00,
          fees: 250.00,
          netValue: 4874531.00,
        },
        {
          id: '3',
          orderId: 'ORD-2025-001232',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-002',
          type: 'BUY',
          orderType: 'LIMIT',
          quantity: 30000,
          price: 101.20,
          filledQuantity: 15000,
          averagePrice: 101.20,
          totalValue: 3036000,
          status: 'PARTIALLY_FILLED',
          createdAt: '2025-11-18T14:45:00Z',
          updatedAt: '2025-11-18T14:50:30Z',
          commission: 759.00,
          fees: 150.00,
          netValue: 3035091.00,
          notes: 'Partial fill due to limited liquidity',
        },
        {
          id: '4',
          orderId: 'ORD-2025-001231',
          securityName: '3-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-003',
          type: 'BUY',
          orderType: 'LIMIT',
          quantity: 25000,
          price: 102.30,
          filledQuantity: 0,
          totalValue: 2557500,
          status: 'CANCELLED',
          createdAt: '2025-11-18T11:20:00Z',
          updatedAt: '2025-11-18T13:45:00Z',
          commission: 0,
          fees: 0,
          netValue: 0,
          notes: 'Cancelled by user',
        },
        {
          id: '5',
          orderId: 'ORD-2025-001230',
          securityName: '91-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-091',
          type: 'BUY',
          orderType: 'MARKET',
          quantity: 75000,
          filledQuantity: 75000,
          averagePrice: 98.73,
          totalValue: 7404750,
          status: 'FILLED',
          createdAt: '2025-11-17T16:30:00Z',
          updatedAt: '2025-11-17T16:30:25Z',
          filledAt: '2025-11-17T16:30:25Z',
          commission: 1851.19,
          fees: 375.00,
          netValue: 7402523.81,
        },
        {
          id: '6',
          orderId: 'ORD-2025-001229',
          securityName: '5-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-005',
          type: 'SELL',
          orderType: 'LIMIT',
          quantity: 20000,
          price: 103.80,
          filledQuantity: 0,
          totalValue: 2076000,
          status: 'PENDING',
          createdAt: '2025-11-17T14:15:00Z',
          updatedAt: '2025-11-17T14:15:00Z',
          commission: 0,
          fees: 0,
          netValue: 0,
        },
        {
          id: '7',
          orderId: 'ORD-2025-001228',
          securityName: '182-Day Treasury Bill',
          securityType: 'TREASURY_BILL',
          symbol: 'GHA-TB-182',
          type: 'BUY',
          orderType: 'LIMIT',
          quantity: 100000,
          price: 97.45,
          filledQuantity: 0,
          totalValue: 9745000,
          status: 'REJECTED',
          createdAt: '2025-11-16T10:45:00Z',
          updatedAt: '2025-11-16T10:45:30Z',
          commission: 0,
          fees: 0,
          netValue: 0,
          notes: 'Insufficient buying power',
        },
        {
          id: '8',
          orderId: 'ORD-2025-001227',
          securityName: '2-Year Government Bond',
          securityType: 'GOVERNMENT_BOND',
          symbol: 'GHA-BD-002',
          type: 'SELL',
          orderType: 'MARKET',
          quantity: 15000,
          filledQuantity: 15000,
          averagePrice: 101.28,
          totalValue: 1519200,
          status: 'FILLED',
          createdAt: '2025-11-15T13:20:00Z',
          updatedAt: '2025-11-15T13:20:40Z',
          filledAt: '2025-11-15T13:20:40Z',
          commission: 379.80,
          fees: 75.00,
          netValue: 1518745.20,
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesType = !filters.type || order.type === filters.type;
      const matchesSecurityType = !filters.securityType || order.securityType === filters.securityType;
      const matchesSearch = !filters.searchTerm || 
        order.orderId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.securityName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchesStatus && matchesType && matchesSecurityType && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'value':
          comparison = a.totalValue - b.totalValue;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILLED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PARTIALLY_FILLED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FILLED':
        return <CheckCircle className="h-3 w-3" />;
      case 'PARTIALLY_FILLED':
        return <Clock className="h-3 w-3" />;
      case 'PENDING':
        return <Clock className="h-3 w-3" />;
      case 'CANCELLED':
        return <XCircle className="h-3 w-3" />;
      case 'REJECTED':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleSort = (field: 'date' | 'value' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: 'date' | 'value' | 'status') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />;
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Mock order cancellation
      console.log('Cancelling order:', orderId);
      // Update order status in UI
      setOrders(prev => prev.map(order => 
        order.orderId === orderId 
          ? { ...order, status: 'CANCELLED', updatedAt: new Date().toISOString() }
          : order
      ));
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleDownloadTradeConfirmation = (order: Order) => {
    try {
      const pdfData = {
        orderId: order.orderId,
        securityName: order.securityName,
        type: order.type,
        orderType: order.orderType,
        quantity: order.quantity,
        price: order.price,
        averagePrice: order.averagePrice,
        totalValue: order.totalValue,
        commission: order.commission,
        fees: order.fees,
        netValue: order.netValue,
        status: order.status,
        createdAt: order.createdAt,
        filledAt: order.filledAt,
      };

      const pdf = PDFGenerator.generateTradeConfirmationPDF(pdfData);
      pdf.save(`${order.orderId}-Confirmation.pdf`);
    } catch (error) {
      console.error('Failed to generate trade confirmation PDF:', error);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        'Order ID', 'Security Name', 'Type', 'Order Type', 'Quantity', 'Price',
        'Total Value', 'Filled Quantity', 'Status', 'Created At', 'Updated At'
      ];
      
      const csvData = filteredAndSortedOrders.map(order => [
        order.orderId,
        order.securityName,
        order.type,
        order.orderType,
        order.quantity.toString(),
        order.price ? order.price.toFixed(2) : 'Market',
        order.totalValue.toString(),
        order.filledQuantity.toString(),
        order.status.replace('_', ' '),
        formatDateTime(order.createdAt),
        formatDateTime(order.updatedAt)
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Order History
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your order history
          </p>
          <Link href="/login">
            <AnimatedButton variant="primary">
              Sign In
            </AnimatedButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order History
              </h1>
              <p className="text-muted-foreground">
                Track your trading orders and execution history
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline" className="text-sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </AnimatedButton>
              <Link href="/trading/orderbook">
                <AnimatedButton variant="primary" className="text-sm">
                  Place New Order
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Filled Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'FILLED').length}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'PENDING' || o.status === 'PARTIALLY_FILLED').length}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.netValue, 0))}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="FILLED">Filled</option>
              <option value="PARTIALLY_FILLED">Partially Filled</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
            <select
              value={filters.securityType}
              onChange={(e) => setFilters({...filters, securityType: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Securities</option>
              <option value="TREASURY_BILL">Treasury Bills</option>
              <option value="GOVERNMENT_BOND">Government Bonds</option>
            </select>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Time</option>
              <option value="1d">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <AnimatedButton 
              variant="outline" 
              className="w-full"
              onClick={() => setFilters({status: '', type: '', securityType: '', dateRange: '', searchTerm: ''})}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>

        {/* Orders Table */}
        <AnimatedCard className="border border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Orders</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedOrders.length} of {filteredAndSortedOrders.length} orders
                </span>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading order history...</p>
              </div>
            ) : paginatedOrders.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No orders found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or place your first order.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Date & Time
                          {getSortIcon('date')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Security</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Price</th>
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('value')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Total Value
                          {getSortIcon('value')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Filled</th>
                      <th className="text-left py-3 px-4">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Status
                          {getSortIcon('status')}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order, index) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{formatDateTime(order.createdAt)}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated: {formatDateTime(order.updatedAt)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-foreground">{order.orderId}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{order.securityName}</p>
                            <p className="text-xs text-muted-foreground">{order.symbol}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.type === 'BUY' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {order.type}
                            </span>
                            <span className="text-xs text-muted-foreground">{order.orderType}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">{order.quantity.toLocaleString()}</p>
                            {order.filledQuantity !== order.quantity && (
                              <p className="text-xs text-muted-foreground">
                                Filled: {order.filledQuantity.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {order.price ? order.price.toFixed(2) : 'Market'}
                            </p>
                            {order.averagePrice && (
                              <p className="text-xs text-muted-foreground">
                                Avg: {order.averagePrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">
                            {formatCurrency(order.totalValue)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {((order.filledQuantity / order.quantity) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.filledQuantity.toLocaleString()} / {order.quantity.toLocaleString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <AnimatedButton 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </AnimatedButton>
                            <AnimatedButton 
                              variant="primary" 
                              className="text-xs"
                              onClick={() => handleDownloadTradeConfirmation(order)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Receipt
                            </AnimatedButton>
                            {order.status === 'PENDING' && (
                              <AnimatedButton 
                                variant="secondary" 
                                className="text-xs bg-red-600 hover:bg-red-700"
                                onClick={() => handleCancelOrder(order.orderId)}
                              >
                                Cancel
                              </AnimatedButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedCard>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background text-foreground hover:bg-accent border border-border'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Order Details - {selectedOrder.orderId}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Security</p>
                    <p className="font-medium">{selectedOrder.securityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Symbol</p>
                    <p className="font-medium">{selectedOrder.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Type</p>
                    <p className="font-medium">{selectedOrder.type} - {selectedOrder.orderType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedOrder.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filled Quantity</p>
                    <p className="font-medium">{selectedOrder.filledQuantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{selectedOrder.price ? selectedOrder.price.toFixed(2) : 'Market'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                    <p className="font-medium">{selectedOrder.averagePrice ? selectedOrder.averagePrice.toFixed(2) : 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Value</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.netValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.commission)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fees</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.fees)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.updatedAt)}</p>
                  </div>
                  {selectedOrder.filledAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Filled At</p>
                      <p className="font-medium">{formatDateTime(selectedOrder.filledAt)}</p>
                    </div>
                  )}
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm text-foreground bg-muted/50 rounded p-3">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedOrder.type === 'BUY' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedOrder.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedOrder.securityType === 'TREASURY_BILL'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {selectedOrder.securityType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatedButton variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download Receipt
                    </AnimatedButton>
                    <AnimatedButton 
                      variant="primary"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Close
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
