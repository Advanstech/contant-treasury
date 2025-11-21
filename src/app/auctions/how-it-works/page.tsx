import React from 'react';
import { Metadata } from 'next';
import { Calendar, TrendingUp, Users, Shield, Clock, DollarSign, FileText, Award, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Auction Works (Participating) | Constant Treasury',
  description: 'Learn how to participate in Bank of Ghana Treasury auctions - complete guide for Ghana investors',
};

export default function HowAuctionWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-orange-500/10 py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">BoG Treasury Auctions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              How Treasury Auctions Work in Ghana
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your complete guide to participating in Bank of Ghana Treasury Bill and Bond auctions
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/auctions/upcoming"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View Upcoming Auctions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 border border-border bg-background hover:bg-accent px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Open Account
                <Users className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ghana Context */}
      <section className="py-16 border-b border-border">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                Ghana Treasury Market Context
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-orange-500">Why Invest in Ghana Treasuries?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Risk-free investment backed by Government of Ghana</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Competitive yields compared to traditional savings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Liquidity through secondary market trading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Regular income stream for bonds</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-orange-500">Key Market Participants</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Bank of Ghana:</strong> Auction conductor and regulator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Primary Dealers:</strong> Authorized market makers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Ghana CSD:</strong> Central securities depository</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Investors:</strong> Individuals and institutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Process */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">The Auction Process</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Auction Announcement
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The Bank of Ghana announces upcoming Treasury auctions through official notices, typically 
                    issued weekly. These announcements include:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Security type (91-day, 182-day, 364-day T-Bills, or Bonds)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>Target amount to be raised</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Bidding deadline (usually 11:00 AM on auction day)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span>Settlement date (typically T+2)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Bid Submission
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Investors submit bids through authorized Primary Dealers like Constant Capital. 
                    There are two types of bids:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-500 mb-2">Competitive Bids</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Specify your desired yield/price</li>
                        <li>• Subject to allocation based on auction results</li>
                        <li>• Lower yields have higher allocation priority</li>
                        <li>• Minimum bid: GHS 1,000</li>
                      </ul>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-500 mb-2">Non-Competitive Bids</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Accept the auction-determined yield</li>
                        <li>• Guaranteed allocation up to limit</li>
                        <li>• Priority allocation over competitive bids</li>
                        <li>• Maximum: GHS 500,000 per investor</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Auction Results & Allocation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    After the bidding deadline, the Bank of Ghana determines the auction results:
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-500">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Marginal Rate Determination</p>
                        <p className="text-xs text-muted-foreground">The highest yield at which the target amount can be raised</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-500">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Pro-Rata Allocation</p>
                        <p className="text-xs text-muted-foreground">Competitive bids below marginal rate get proportional allocation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-500">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Results Announcement</p>
                        <p className="text-xs text-muted-foreground">Published by BoG on the same day (usually after 2:00 PM)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Settlement & CSD Registration
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Successful bids are settled through the Ghana Central Securities Depository:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-blue-500">T+0</span>
                      </div>
                      <p className="text-sm font-medium">Auction Day</p>
                      <p className="text-xs text-muted-foreground">Results announced</p>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-orange-500">T+1</span>
                      </div>
                      <p className="text-sm font-medium">Next Day</p>
                      <p className="text-xs text-muted-foreground">Payment processing</p>
                    </div>
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-green-500">T+2</span>
                      </div>
                      <p className="text-sm font-medium">Settlement</p>
                      <p className="text-xs text-muted-foreground">Securities credited to CSD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Requirements for Participation</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Individual Investors
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Valid Ghanaian ID (Passport, Driver's License, or Voter ID)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Completed KYC verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Active CSD account (we'll help you open one)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Bank account for funding and settlement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Minimum investment: GHS 1,000</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  Corporate/Institutional Investors
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Valid business registration documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Board resolution authorizing investments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Signatory IDs and authority documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Corporate bank account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tax Identification Number (TIN)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tips for Successful Auction Participation</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                <h3 className="text-lg font-semibold mb-4 text-green-500 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Best Practices
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Submit bids early to avoid last-minute system issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Monitor market rates for competitive bidding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Consider non-competitive bids for guaranteed allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Maintain sufficient funds in your account before auction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <span>Track auction results and settlement dates</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
                <h3 className="text-lg font-semibold mb-4 text-orange-500 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Common Pitfalls to Avoid
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Bidding yields significantly above market rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Insufficient funds leading to failed settlement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Missing bid submission deadlines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Not understanding the pro-rata allocation mechanism</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Forgetting to consider settlement timing in cash planning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-orange-500/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Participate in Treasury Auctions?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Ghana investors earning competitive returns through government securities
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
              >
                Start Investing Today
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-border bg-background hover:bg-accent px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                Talk to an Expert
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
