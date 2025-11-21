import { API_BASE_URL } from './api';

// ============================================================================
// TRADING API CLIENT
// ============================================================================

export interface PlaceOrderRequest {
  securityId: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: 'GTC' | 'DAY' | 'IOC' | 'FOK';
  clientReference?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  securityId: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stopPrice?: number;
  filledQuantity: number;
  remainingQuantity: number;
  averagePrice?: number;
  status: 'PENDING' | 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED';
  timeInForce: string;
  placedAt: string;
  filledAt?: string;
  cancelledAt?: string;
  security?: any;
}

export interface Trade {
  id: string;
  tradeNumber: string;
  buyOrderId: string;
  sellOrderId: string;
  securityId: string;
  quantity: number;
  price: number;
  amount: number;
  buyerId: string;
  sellerId: string;
  status: 'EXECUTED' | 'SETTLED' | 'FAILED' | 'CANCELLED';
  settlementDate: string;
  tradeDate: string;
  commission: number;
  stampDuty: number;
  secFee: number;
  gseFee: number;
  totalFees: number;
  netAmount: number;
  security?: any;
  buyer?: any;
  seller?: any;
}

export interface Position {
  id: string;
  userId: string;
  securityId: string;
  type: 'LONG' | 'SHORT';
  quantity: number;
  averageCost: number;
  currentPrice?: number;
  marketValue?: number;
  unrealizedPnL?: number;
  realizedPnL: number;
  totalCost: number;
  availableQuantity: number;
  lockedQuantity: number;
  security?: any;
}

export interface MarketData {
  id: string;
  securityId: string;
  date: string;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  closePrice: number;
  lastPrice: number;
  bidPrice?: number;
  askPrice?: number;
  bidSize?: number;
  askSize?: number;
  spread?: number;
  volume: number;
  value: number;
  trades: number;
  vwap?: number;
  ytm?: number;
  security?: any;
}

const tradingApi = {
  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  /**
   * Place a new order
   */
  placeOrder: async (data: PlaceOrderRequest, token: string) => {
    const response = await fetch(`${API_BASE_URL}/trading/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to place order');
    }

    return response.json();
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/trading/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel order');
    }

    return response.json();
  },

  /**
   * Modify an order
   */
  modifyOrder: async (orderId: string, data: { quantity?: number; price?: number }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/trading/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to modify order');
    }

    return response.json();
  },

  /**
   * Get user orders
   */
  getOrders: async (filters: {
    status?: string;
    securityId?: string;
    side?: string;
    from?: string;
    to?: string;
  }, token: string): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.securityId) params.append('securityId', filters.securityId);
    if (filters.side) params.append('side', filters.side);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const response = await fetch(`${API_BASE_URL}/trading/orders?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  /**
   * Get order details
   */
  getOrderDetails: async (orderId: string, token: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/trading/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }

    return response.json();
  },

  // ============================================================================
  // TRADE MANAGEMENT
  // ============================================================================

  /**
   * Get user trades
   */
  getTrades: async (filters: {
    securityId?: string;
    from?: string;
    to?: string;
  }, token: string): Promise<Trade[]> => {
    const params = new URLSearchParams();
    if (filters.securityId) params.append('securityId', filters.securityId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const response = await fetch(`${API_BASE_URL}/trading/trades?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trades');
    }

    return response.json();
  },

  /**
   * Get trade details
   */
  getTradeDetails: async (tradeId: string, token: string): Promise<Trade> => {
    const response = await fetch(`${API_BASE_URL}/trading/trades/${tradeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trade details');
    }

    return response.json();
  },

  // ============================================================================
  // POSITION MANAGEMENT
  // ============================================================================

  /**
   * Get all positions
   */
  getPositions: async (token: string): Promise<Position[]> => {
    const response = await fetch(`${API_BASE_URL}/trading/positions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }

    return response.json();
  },

  /**
   * Get position details
   */
  getPosition: async (securityId: string, token: string): Promise<Position> => {
    const response = await fetch(`${API_BASE_URL}/trading/positions/${securityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch position');
    }

    return response.json();
  },

  /**
   * Get position summary with P&L
   */
  getPositionSummary: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/trading/positions-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch position summary');
    }

    return response.json();
  },

  /**
   * Get portfolio value
   */
  getPortfolioValue: async (token: string): Promise<{ portfolioValue: number }> => {
    const response = await fetch(`${API_BASE_URL}/trading/portfolio/value`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio value');
    }

    return response.json();
  },

  // ============================================================================
  // MARKET DATA
  // ============================================================================

  /**
   * Get current price
   */
  getCurrentPrice: async (securityId: string) => {
    const response = await fetch(`${API_BASE_URL}/market-data/${securityId}/price`);

    if (!response.ok) {
      throw new Error('Failed to fetch current price');
    }

    return response.json();
  },

  /**
   * Get market data
   */
  getMarketData: async (securityId: string, date?: string): Promise<MarketData> => {
    const params = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/market-data/${securityId}${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    return response.json();
  },

  /**
   * Get historical data
   */
  getHistoricalData: async (securityId: string, from: string, to: string): Promise<MarketData[]> => {
    const response = await fetch(
      `${API_BASE_URL}/market-data/${securityId}/history?from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }

    return response.json();
  },

  /**
   * Get orderbook
   */
  getOrderBook: async (securityId: string) => {
    const response = await fetch(`${API_BASE_URL}/market-data/${securityId}/orderbook`);

    if (!response.ok) {
      throw new Error('Failed to fetch orderbook');
    }

    return response.json();
  },

  /**
   * Get recent trades
   */
  getRecentTrades: async (securityId: string, limit: number = 20) => {
    const response = await fetch(`${API_BASE_URL}/market-data/${securityId}/trades?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch recent trades');
    }

    return response.json();
  },

  /**
   * Get price history for charts
   */
  getPriceHistory: async (securityId: string, days: number = 30) => {
    const response = await fetch(`${API_BASE_URL}/market-data/${securityId}/price-history?days=${days}`);

    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }

    return response.json();
  },

  /**
   * Get yield curve
   */
  getYieldCurve: async () => {
    const response = await fetch(`${API_BASE_URL}/market-data/yield-curve`);

    if (!response.ok) {
      throw new Error('Failed to fetch yield curve');
    }

    return response.json();
  },

  /**
   * Get market statistics
   */
  getMarketStatistics: async (date?: string) => {
    const params = date ? `?date=${date}` : '';
    const response = await fetch(`${API_BASE_URL}/market-data/statistics${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch market statistics');
    }

    return response.json();
  },
};

export default tradingApi;
