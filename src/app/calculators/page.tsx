'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, PieChart, DollarSign, Percent } from 'lucide-react';

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<'yield' | 'returns' | 'compound'>('yield');

  // Yield Calculator State
  const [faceValue, setFaceValue] = useState<string>('10000');
  const [purchasePrice, setPurchasePrice] = useState<string>('9800');
  const [days, setDays] = useState<string>('91');

  // Returns Calculator State
  const [investmentAmount, setInvestmentAmount] = useState<string>('50000');
  const [interestRate, setInterestRate] = useState<string>('25');
  const [tenure, setTenure] = useState<string>('365');

  // Compound Calculator State
  const [principal, setPrincipal] = useState<string>('100000');
  const [annualRate, setAnnualRate] = useState<string>('24');
  const [years, setYears] = useState<string>('5');
  const [frequency, setFrequency] = useState<string>('4');

  // Yield Calculation
  const calculateYield = () => {
    const face = parseFloat(faceValue) || 0;
    const price = parseFloat(purchasePrice) || 0;
    const d = parseFloat(days) || 0;
    
    if (price === 0 || d === 0) return { discount: 0, yield: 0 };
    
    const discount = ((face - price) / price) * 100;
    const annualizedYield = ((face - price) / price) * (365 / d) * 100;
    
    return {
      discount: discount.toFixed(2),
      yield: annualizedYield.toFixed(2),
      profit: (face - price).toFixed(2)
    };
  };

  // Returns Calculation
  const calculateReturns = () => {
    const amount = parseFloat(investmentAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const days = parseFloat(tenure) || 0;
    
    const interest = (amount * rate * days) / (365 * 100);
    const total = amount + interest;
    
    return {
      interest: interest.toFixed(2),
      total: total.toFixed(2),
      effectiveRate: ((interest / amount) * 100).toFixed(2)
    };
  };

  // Compound Interest Calculation
  const calculateCompound = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(annualRate) / 100 || 0;
    const t = parseFloat(years) || 0;
    const n = parseFloat(frequency) || 1;
    
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    
    return {
      finalAmount: amount.toFixed(2),
      totalInterest: interest.toFixed(2),
      effectiveRate: ((interest / p) * 100).toFixed(2)
    };
  };

  const yieldResults = calculateYield();
  const returnsResults = calculateReturns();
  const compoundResults = calculateCompound();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Calculator className="h-4 w-4" />
              Investment Calculators
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Calculate Your Returns
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Plan your investments with our free financial calculators
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Calculator Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveCalculator('yield')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCalculator === 'yield'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              <Percent className="h-5 w-5" />
              Yield Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('returns')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCalculator === 'returns'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Returns Calculator
            </button>
            <button
              onClick={() => setActiveCalculator('compound')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCalculator === 'compound'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              <PieChart className="h-5 w-5" />
              Compound Interest
            </button>
          </div>

          {/* Yield Calculator */}
          {activeCalculator === 'yield' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Treasury Bill Yield</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Face Value (GHS)</label>
                    <input
                      type="number"
                      value={faceValue}
                      onChange={(e) => setFaceValue(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Price (GHS)</label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="9800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Days to Maturity</label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="91"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-6">Results</h3>
                <div className="space-y-6">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Discount Rate</p>
                    <p className="text-3xl font-bold text-primary">{yieldResults.discount}%</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Annualized Yield</p>
                    <p className="text-3xl font-bold text-primary">{yieldResults.yield}%</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Expected Profit</p>
                    <p className="text-3xl font-bold">GHS {yieldResults.profit}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Returns Calculator */}
          {activeCalculator === 'returns' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Investment Returns</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Amount (GHS)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="25"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Period (Days)</label>
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="365"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-6">Results</h3>
                <div className="space-y-6">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Interest Earned</p>
                    <p className="text-3xl font-bold text-primary">GHS {returnsResults.interest}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-3xl font-bold">GHS {returnsResults.total}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Effective Return</p>
                    <p className="text-3xl font-bold">{returnsResults.effectiveRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compound Interest Calculator */}
          {activeCalculator === 'compound' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Compound Interest</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Principal Amount (GHS)</label>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
                    <input
                      type="number"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="24"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Period (Years)</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="1">Annually</option>
                      <option value="2">Semi-Annually</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-6">Results</h3>
                <div className="space-y-6">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Final Amount</p>
                    <p className="text-3xl font-bold text-primary">GHS {compoundResults.finalAmount}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                    <p className="text-3xl font-bold">GHS {compoundResults.totalInterest}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                    <p className="text-3xl font-bold">{compoundResults.effectiveRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 bg-muted/50 border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> These calculators provide estimates for educational purposes only. 
              Actual returns may vary based on market conditions, fees, and other factors. 
              Consult with a financial advisor for personalized investment advice.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
