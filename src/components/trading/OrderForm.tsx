'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Percent,
  Wallet
} from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-card';

interface OrderFormProps {
  security: {
    symbol: string;
    name: string;
    lastPrice: number;
    bid: number;
    ask: number;
    change: number;
    changePercent: number;
  };
  onSubmit: (order: {
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    quantity: number;
    price?: number;
    totalValue: number;
  }) => void;
  loading?: boolean;
}

export default function OrderForm({ security, onSubmit, loading = false }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [priceType, setPriceType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const isBuy = orderType === 'BUY';
  const isLimit = priceType === 'LIMIT';

  const totalValue = quantity && (isLimit && price ? 
    parseFloat(quantity) * parseFloat(price) : 
    quantity ? parseFloat(quantity) * (isBuy ? security.ask : security.bid) : 0
  ) || 0;

  const handleSubmit = () => {
    if (!quantity || parseFloat(quantity) <= 0) return;
    if (isLimit && (!price || parseFloat(price) <= 0)) return;

    onSubmit({
      type: orderType,
      orderType: priceType,
      quantity: parseFloat(quantity),
      price: isLimit && price ? parseFloat(price) : undefined,
      totalValue,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      {/* Security Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{security.name}</h3>
          <span className="text-sm text-muted-foreground">{security.symbol}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {security.lastPrice.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${
              security.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {security.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {formatPercent(security.changePercent)}
              </span>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-muted-foreground">Bid/Ask</div>
            <div className="font-medium">
              {security.bid.toFixed(2)} / {security.ask.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Order Type Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setOrderType('BUY')}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'BUY'
                ? 'bg-green-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderType('SELL')}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'SELL'
                ? 'bg-red-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Price Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPriceType('MARKET')}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              priceType === 'MARKET'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setPriceType('LIMIT')}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              priceType === 'LIMIT'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Price Input (for Limit Orders) */}
      {isLimit && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Limit Price
          </label>
          <div className="relative">
            <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Market:</span>
            <button
              onClick={() => setPriceType('MARKET')}
              className="text-xs text-primary hover:underline"
            >
              {isBuy ? security.ask.toFixed(2) : security.bid.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setQuantity('1000')}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            1K
          </button>
          <button
            onClick={() => setQuantity('10000')}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            10K
          </button>
          <button
            onClick={() => setQuantity('100000')}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            100K
          </button>
          <button
            onClick={() => setQuantity('1000000')}
            className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            1M
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Price:</span>
            <span className="font-medium">
              {isLimit && price ? price : 
               isBuy ? security.ask.toFixed(2) : security.bid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{quantity || '0'}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
            <span>Total Value:</span>
            <span>{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <AnimatedButton
        variant={isBuy ? 'primary' : 'secondary'}
        className={`w-full ${
          isBuy 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-red-600 hover:bg-red-700'
        }`}
        onClick={handleSubmit}
        disabled={loading || !quantity || (isLimit && !price)}
      >
        {loading ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            {isBuy ? 'Place Buy Order' : 'Place Sell Order'}
            {isBuy ? (
              <TrendingUp className="h-4 w-4 ml-2" />
            ) : (
              <TrendingDown className="h-4 w-4 ml-2" />
            )}
          </>
        )}
      </AnimatedButton>

      {/* Order Info */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        {isLimit ? 
          'Limit orders execute only at your specified price or better' :
          'Market orders execute immediately at the best available price'
        }
      </div>
    </div>
  );
}
