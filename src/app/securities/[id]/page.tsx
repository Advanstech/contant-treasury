'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tradingApi, { PlaceOrderRequest } from '@/lib/trading-api';
import { toast } from 'sonner';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function SecurityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const securityId = params.id as string;

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Fetch market data
  const { data: marketData } = useQuery({
    queryKey: ['market-data', securityId],
    queryFn: () => tradingApi.getMarketData(securityId),
    refetchInterval: 5000,
  });

  // Fetch orderbook
  const { data: orderbook } = useQuery({
    queryKey: ['orderbook', securityId],
    queryFn: () => tradingApi.getOrderBook(securityId),
    refetchInterval: 3000,
  });

  // Fetch recent trades
  const { data: recentTrades } = useQuery({
    queryKey: ['recent-trades', securityId],
    queryFn: () => tradingApi.getRecentTrades(securityId),
    refetchInterval: 5000,
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (data: PlaceOrderRequest) => tradingApi.placeOrder(data, token!),
    onSuccess: (data) => {
      toast.success('Order placed successfully!', {
        description: `Order ${data.order.orderNumber} has been submitted`,
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderbook', securityId] });
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
    if (!user) {
      toast.error('Please login to trade');
      router.push('/login');
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
      securityId,
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
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Securities
        </button>

        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {marketData?.security?.name || 'Loading...'}
              </h1>
              <p className="text-muted-foreground">
                {marketData?.security?.type} • Maturity: {marketData?.security?.maturityDate ? new Date(marketData.security.maturityDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ₵{marketData?.currentPrice?.toFixed(2) || '—'}
              </div>
              <div className={`text-sm font-semibold ${
                (marketData?.priceChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(marketData?.priceChange || 0) >= 0 ? '+' : ''}
                {marketData?.priceChange?.toFixed(2) || '0.00'} ({marketData?.priceChangePercent?.toFixed(2) || '0.00'}%)
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Volume</p>
              <p className="text-lg font-bold">{marketData?.volume?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">High</p>
              <p className="text-lg font-bold">₵{marketData?.high?.toFixed(2) || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low</p>
              <p className="text-lg font-bold">₵{marketData?.low?.toFixed(2) || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Yield</p>
              <p className="text-lg font-bold">{marketData?.security?.currentYield?.toFixed(2) || '—'}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Entry */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Place Order</h2>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setOrderSide('BUY')}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    orderSide === 'BUY'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
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
                      ? 'bg-destructive text-white shadow-lg shadow-destructive/30'
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
              <div className="mb-4">
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

              {/* Quantity */}
              <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="bg-muted rounded-lg p-4 mb-4 space-y-2">
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
                        <span className="font-bold">₵{(parseFloat(quantity) * parseFloat(price)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'
                    : 'bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {placeOrderMutation.isPending ? 'Placing Order...' : `Place ${orderSide} Order`}
              </button>
            </div>
          </div>

          {/* Market Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orderbook */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Order Book</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Bids */}
                <div>
                  <h3 className="text-sm font-semibold text-green-500 mb-3">Bids (Buy)</h3>
                  <div className="space-y-2">
                    {orderbook?.bids?.slice(0, 10).map((bid: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-mono">₵{bid.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">{bid.quantity}</span>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No bids</p>}
                  </div>
                </div>

                {/* Asks */}
                <div>
                  <h3 className="text-sm font-semibold text-red-500 mb-3">Asks (Sell)</h3>
                  <div className="space-y-2">
                    {orderbook?.asks?.slice(0, 10).map((ask: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-mono">₵{ask.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">{ask.quantity}</span>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No asks</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
              <div className="space-y-3">
                {recentTrades && recentTrades.length > 0 ? (
                  recentTrades.slice(0, 15).map((trade: any) => (
                    <div key={trade.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(trade.executedAt).toLocaleTimeString()}
                      </span>
                      <span className={`font-semibold ${
                        trade.side === 'BUY' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {trade.side}
                      </span>
                      <span className="font-mono">₵{trade.price.toFixed(2)}</span>
                      <span className="text-muted-foreground">{trade.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent trades</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
