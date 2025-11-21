"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import * as React from "react";

// Sample curve points (tenor in months)
const sampleData = [
  { tenor: "1M", yield: 23.9 },
  { tenor: "3M", yield: 24.6 },
  { tenor: "6M", yield: 25.4 },
  { tenor: "1Y", yield: 24.8 },
  { tenor: "2Y", yield: 23.2 },
  { tenor: "5Y", yield: 22.1 },
  { tenor: "7Y", yield: 21.8 },
];

export function YieldCurveChart({ data = sampleData }: { data?: { tenor: string; yield: number }[] }) {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-6">
      <div className="mb-4 text-lg font-bold text-foreground">Ghana Cedi Yield Curve</div>
      <div className="h-64 w-full min-h-[256px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="tenor" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tickFormatter={(v) => `${v}%`} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <Tooltip 
              formatter={(v: any) => [`${Number(v).toFixed(2)}%`, "Yield"]}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
