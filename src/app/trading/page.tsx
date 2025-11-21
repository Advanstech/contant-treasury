'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tradingApi, { PlaceOrderRequest } from '@/lib/trading-api';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  ShoppingCart,
  Wallet,
} from 'lucide-react';

export default function TradingPage() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [selectedSecurity, setSelectedSecurity] = useState<any>(null);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Fetch market statistics
  const { data: marketStats } = useQuery({
    queryKey: ['market-statistics'],
    queryFn: () => tradingApi.getMarketStatistics(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user positions
  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => tradingApi.getPositions(token!),
    enabled: !!token,
  });

  // Fetch active orders
  const { data: activeOrders } = useQuery({
    queryKey: ['orders', 'active'],
    queryFn: () => tradingApi.getOrders({ status: 'OPEN' }, token!),
    enabled: !!token,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: PlaceOrderRequest) => tradingApi.placeOrder(data, token!),
    onSuccess: (data) => {
      toast.success('Order placed successfully!', {
        description: `Order ${data.order.orderNumber} has been submitted`,
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      // Reset form
      setQuantity('');
      setPrice('');
    },
    onError: (error: any) => {
      toast.error('Failed to place order', {
        description: error.message || 'An error occurred',
      });
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedSecurity) {
      toast.error('Please select a security');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      toast.error('Please enter a valid price');
      return;
    }

    const orderData: PlaceOrderRequest = {
      securityId: selectedSecurity.id,
      side: orderSide,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
      timeInForce: 'GTC',
    };

    placeOrderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Market Stats Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Volume</div>
                <div className="text-lg font-bold">
                  ₵{marketStats?.summary?.totalValue ? (marketStats.summary.totalValue / 1000000).toFixed(1) : '0'}M
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Advancers</div>
                <div className="text-lg font-bold text-green-500">
                  {marketStats?.breadth?.advancers || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Decliners</div>
                <div className="text-lg font-bold text-red-500">
                  {marketStats?.breadth?.decliners || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Trades</div>
                <div className="text-lg font-bold">
                  {marketStats?.summary?.totalTrades || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Entry Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Place Order</h2>
                <p className="text-sm text-muted-foreground">Buy or sell government securities</p>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderSide('BUY')}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    orderSide === 'BUY'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Buy
                  </div>
                </button>
                <button
                  onClick={() => setOrderSide('SELL')}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    orderSide === 'SELL'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowDownRight className="h-4 w-4" />
                    Sell
                  </div>
                </button>
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('MARKET')}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      orderType === 'MARKET'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setOrderType('LIMIT')}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      orderType === 'LIMIT'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Security Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2">Security</label>
                <select
                  value={selectedSecurity?.id || ''}
                  onChange={(e) => {
                    // This would be populated from securities list
                    setSelectedSecurity({ id: e.target.value });
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a security</option>
                  <option value="security-1">91-Day Treasury Bill</option>
                  <option value="security-2">182-Day Treasury Bill</option>
                  <option value="security-3">5-Year Treasury Bond</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Price (for limit orders) */}
              {orderType === 'LIMIT' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Order Summary */}
              {quantity && (orderType === 'MARKET' || price) && (
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold">{quantity}</span>
                  </div>
                  {orderType === 'LIMIT' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">₵{parseFloat(price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">₵{(parseFloat(quantity) * parseFloat(price)).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Fees (0.48%)</span>
                    <span className="font-semibold">
                      ₵{orderType === 'LIMIT' ? ((parseFloat(quantity) * parseFloat(price)) * 0.0048).toFixed(2) : '—'}
                    </span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  orderSide === 'BUY'
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {placeOrderMutation.isPending ? 'Placing Order...' : `Place ${orderSide} Order`}
              </button>
            </div>
          </div>

          {/* Market Overview & Active Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Orders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Orders</h2>
                <span className="text-sm text-muted-foreground">
                  {activeOrders?.length || 0} open orders
                </span>
              </div>

              {activeOrders && activeOrders.length > 0 ? (
                <div className="space-y-3">
                  {activeOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.side === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {order.side}
                        </div>
                        <div>
                          <div className="font-semibold">{order.security?.name || 'Security'}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.quantity} @ ₵{order.price?.toFixed(2) || 'Market'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{order.status}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.placedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No active orders</p>
                </div>
              )}
            </div>

            {/* Positions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Positions</h2>
                <span className="text-sm text-muted-foreground">
                  {positions?.length || 0} positions
                </span>
              </div>

              {positions && positions.length > 0 ? (
                <div className="space-y-3">
                  {positions.map((position: any) => (
                    <div
                      key={position.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{position.security?.name || 'Security'}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.quantity} units @ ₵{position.averageCost.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ₵{position.marketValue?.toFixed(2) || '—'}
                        </div>
                        <div className={`text-sm font-semibold ${
                          (position.unrealizedPnL || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {(position.unrealizedPnL || 0) >= 0 ? '+' : ''}
                          ₵{position.unrealizedPnL?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No positions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
