'use client';

import * as React from 'react';
import { SecuritiesTable } from '@/components/securities/SecuritiesTable';
import { YieldCurveChart } from '@/components/securities/YieldCurveChart';
import { SubscribeDialog } from '@/components/securities/SubscribeDialog';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

export default function SecuritiesPage() {
  const [open, setOpen] = React.useState(false);

  const marketStats = [
    { 
      label: 'Market Cap', 
      value: '₵125.4B', 
      change: '+2.4%', 
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />
    },
    { 
      label: 'Avg. Yield', 
      value: '24.5%', 
      change: '+0.8%', 
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5" />
    },
    { 
      label: 'Active Issues', 
      value: '47', 
      change: '+3', 
      trend: 'up',
      icon: <Activity className="h-5 w-5" />
    },
    { 
      label: 'Trading Volume', 
      value: '₵8.2B', 
      change: '-1.2%', 
      trend: 'down',
      icon: <TrendingDown className="h-5 w-5" />
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Market Stats Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {marketStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center ${
                  stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg font-bold">{stat.value}</span>
                    <span className={`text-xs font-semibold ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Government Securities</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Browse and subscribe to Treasury Bills and Bonds</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none rounded-lg border-2 border-border bg-card px-4 sm:px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
              Filter
            </button>
            <button 
              onClick={() => setOpen(true)} 
              className="flex-1 md:flex-none rounded-lg bg-primary px-4 sm:px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Securities Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SecuritiesTable />
          </div>
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <YieldCurveChart />
            
            {/* Quick Info Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <div className="font-semibold text-sm">Strong Demand</div>
                    <div className="text-xs text-muted-foreground">91-day T-Bills oversubscribed by 15%</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <div className="font-semibold text-sm">Yield Trends</div>
                    <div className="text-xs text-muted-foreground">Long-term bonds showing upward momentum</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <div className="font-semibold text-sm">Next Auction</div>
                    <div className="text-xs text-muted-foreground">Monday, 11:00 AM GMT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscribeDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
