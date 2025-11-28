'use client';

import { ArrowRight, BarChart2, Shield, Globe, Clock, TrendingUp, Users, Award, LineChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: 'High Returns',
      description: 'Competitive interest rates on government securities'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Secure Investments',
      description: 'Backed by the Government of Ghana'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Grow Your Wealth',
      description: 'Long-term investment opportunities'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Flexible Terms',
      description: 'Investments from 91 days to 10+ years'
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Diaspora Friendly',
      description: 'Invest from anywhere in the world'
    }
  ];

  const stats = [
    { value: '160k+', label: 'Active Users' },
    { value: '₵2.5B+', label: 'Assets Under Management' },
    { value: '24.5%', label: 'Average Annual Return' },
    { value: '99.9%', label: 'Platform Uptime' }
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Top Banner */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-6">
              <span className="text-muted-foreground truncate">Get Free ₵50 - Start Trading Now!</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                Get Free Support
              </Link>
              <Link href="/portal" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Split Layout */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-foreground font-medium line-clamp-1">Transform Your Life • Free Demo Account — Practice Risk-Free!</span>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  The Premier Platform For{' '}
                  <span className="text-primary">Secure & Real-Time</span>{' '}
                  Trading Growth
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                  Gain insights, access powerful tools, and trade with confidence on one of the most trusted platforms in the industry.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center rounded-lg bg-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <span>Start Investing Now</span>
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/securities"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-card px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:border-primary/50"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Content - Stats & Visual */}
            <div className="relative">
              <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini Chart Visualization */}
                <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm font-medium">GHS/USD</span>
                    <span className="text-xs sm:text-sm text-green-500 font-semibold">+2.34%</span>
                  </div>
                  <div className="h-24 sm:h-32 flex items-end justify-between gap-0.5 sm:gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all hover:from-primary hover:to-primary/70"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 sm:mt-3 text-xs text-muted-foreground text-center">
                    Real-time market data • 23,314.75
                  </div>
                </div>

                {/* User Avatars */}
                <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-card bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-semibold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-card bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                      +
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <div className="font-semibold">160k+</div>
                    <div className="text-muted-foreground">Active Users</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <Link href="/why-choose-constant-treasury">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl mb-3 sm:mb-4 hover:text-primary transition-colors cursor-pointer">
                Why Choose Constant Treasury?
              </h2>
            </Link>
            <p className="text-base sm:text-lg text-muted-foreground">
              We make investing in government securities simple, secure, and rewarding.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link 
                key={index}
                href="/why-choose-constant-treasury"
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 block"
              >
                <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/20 group-hover:ring-primary/40">
                  {feature.icon}
                </div>
                <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                <div className="absolute -right-8 -bottom-8 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/10"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 sm:py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-foreground/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-background/30 rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground md:text-5xl mb-4 sm:mb-6">
            Ready to start investing?
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-8 sm:mb-10">
            Join thousands of Ghanaians and the diaspora building wealth through secure investments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center rounded-lg bg-background px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-lg font-bold text-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl w-full sm:w-auto"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 sm:h-6 w-5 sm:w-6 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/securities"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-foreground/30 bg-transparent px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-lg font-bold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground/50 w-full sm:w-auto"
            >
              View Securities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}