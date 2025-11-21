'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tradingApi from '@/lib/trading-api';
import { toast } from 'sonner';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  X,
} from 'lucide-react';

type OrderStatus = 'all' | 'OPEN' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED';

export default function MyOrdersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => {
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      return tradingApi.getOrders(filters, token!);
    },
    enabled: !!token,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => tradingApi.cancelOrder(orderId, token!),
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error('Failed to cancel order', {
        description: error.message || 'An error occurred',
      });
    },
  });

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  // Filter orders by search query
  const filteredOrders = orders?.filter((order: any) =>
    order.security?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'FILLED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PARTIALLY_FILLED':
        return <AlertCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'PENDING':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'FILLED':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'PARTIALLY_FILLED':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your trading orders</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by security or order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Orders</option>
                <option value="OPEN">Open</option>
                <option value="PARTIALLY_FILLED">Partially Filled</option>
                <option value="FILLED">Filled</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Side Badge */}
                      <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        order.side === 'BUY'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {order.side === 'BUY' ? (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            BUY
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            SELL
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">
                          {order.security?.name || 'Security'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Order #{order.orderNumber}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <span className="ml-2 font-semibold">{order.type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="ml-2 font-semibold">{order.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="ml-2 font-semibold">
                              {order.price ? `₵${order.price.toFixed(2)}` : 'Market'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Filled:</span>
                            <span className="ml-2 font-semibold">
                              {order.filledQuantity || 0} / {order.quantity}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-muted-foreground">
                          Placed: {new Date(order.placedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-lg border font-semibold text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ')}
                    </div>

                    {/* Cancel Button */}
                    {(order.status === 'OPEN' || order.status === 'PARTIALLY_FILLED') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelOrderMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Start trading to see your orders here'}
            </p>
            <a
              href="/trading"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Trading
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
