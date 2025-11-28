'use client';

import { ArrowRight, LayoutDashboard, TrendingUp, FileText, Shield, Users, Settings, Bell, CreditCard, BarChart3, Clock, CheckCircle, Star, Lock, Smartphone, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Portal() {
  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: 'Investment Dashboard',
      description: 'Track your portfolio performance, view returns, and monitor all your investments in one place.',
      benefits: ['Real-time portfolio tracking', 'Performance analytics', 'Investment summary']
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Live Market Data',
      description: 'Access real-time market data, auction results, and current treasury rates.',
      benefits: ['Live auction results', 'Historical rate data', 'Market trends analysis']
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Digital Certificates',
      description: 'Receive and manage digital certificates for all your treasury investments.',
      benefits: ['Secure digital storage', 'Easy download access', 'Certificate verification']
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Easy Funding',
      description: 'Add funds instantly via bank transfer, mobile money, or other payment methods.',
      benefits: ['Multiple payment options', 'Instant fund confirmation', 'Auto-investment options']
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Investment Analytics',
      description: 'Detailed analytics and insights to optimize your investment strategy.',
      benefits: ['Return projections', 'Risk analysis', 'Investment recommendations']
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Advanced Security',
      description: 'Enterprise-grade security with 2FA, biometric login, and transaction monitoring.',
      benefits: ['Two-factor authentication', 'Biometric login options', 'Transaction alerts']
    }
  ];

  const testimonials = [
    {
      name: 'Akosua Boateng',
      role: 'Diaspora Investor',
      content: 'The client portal makes it so easy to manage my investments from the UK. I can track everything in real-time!',
      rating: 5
    },
    {
      name: 'Kwame Osei',
      role: 'Business Owner',
      content: 'Best investment platform I\'ve used. The dashboard is intuitive and the returns are excellent.',
      rating: 5
    },
    {
      name: 'Adwoa Mensah',
      role: 'First-time Investor',
      content: 'As a beginner, the portal guided me through everything. Now I\'m confident managing my own portfolio.',
      rating: 5
    }
  ];

  const stats = [
    { value: '₵2.5B+', label: 'Total Investments Managed', description: 'Through our secure portal' },
    { value: '160k+', label: 'Active Portal Users', description: 'Trusted by investors nationwide' },
    { value: '99.9%', label: 'Portal Uptime', description: 'Available when you need it' },
    { value: '24/7', label: 'Support Available', description: 'Help whenever you need it' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm mb-6">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span className="font-medium">Your Personal Investment Command Center</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Client <span className="text-primary">Portal</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Manage your treasury investments with confidence through our secure, intuitive client portal. 
              Track performance, access real-time data, and control your financial future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link href="/register">
                  Access Your Portal
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">
                  Take a Tour
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Portal Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage your treasury investments effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                See Your Portal in Action
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the intuitive interface designed for investors like you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="font-semibold">Investment Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bell className="h-4 w-4" />
                        <span>3 New</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
                          <div className="text-2xl font-bold text-primary">₵45,678.90</div>
                          <div className="text-sm text-green-600">+12.5% this month</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Active Investments</div>
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-sm text-muted-foreground">3 Treasury Bills, 5 Bonds</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Monthly Returns</div>
                          <div className="text-2xl font-bold text-green-600">₵2,345.67</div>
                          <div className="text-sm text-muted-foreground">Next payment: Dec 15</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Available to Invest</div>
                          <div className="text-2xl font-bold">₵10,000.00</div>
                          <div className="text-sm text-muted-foreground">Ready for next auction</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      Mobile Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access your portal from any device with our responsive design.
                    </p>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">iOS</div>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Android</div>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Web</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Security Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>256-bit encryption</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Two-factor auth</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Biometric login</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Real-time alerts</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied investors using our portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Getting Started is Easy
              </h2>
              <p className="text-lg text-muted-foreground">
                Access your portal in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">Register and complete KYC verification in minutes.</p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Fund Your Account</h3>
                <p className="text-muted-foreground">Add funds via bank transfer or mobile money.</p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Investing</h3>
                <p className="text-muted-foreground">Access your portal and begin investing in treasury securities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Access Your Portal?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of investors managing their treasury securities through our secure portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/support">
                Portal Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
