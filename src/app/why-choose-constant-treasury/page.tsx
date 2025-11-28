'use client';

import { ArrowRight, BarChart2, Shield, TrendingUp, Clock, Globe, Users, Award, CheckCircle, Star, Lock, DollarSign, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WhyChooseConstantTreasury() {
  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: 'High Returns',
      description: 'Earn competitive interest rates on government securities, typically outperforming traditional savings accounts.',
      benefits: ['Above-market rates', 'Guaranteed returns', 'Regular interest payments']
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Secure Investments',
      description: 'All investments are backed by the full faith and credit of the Government of Ghana.',
      benefits: ['Government guaranteed', 'Risk-free principal', 'Bank of Ghana regulated']
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Grow Your Wealth',
      description: 'Build long-term wealth through systematic investment plans and compound growth.',
      benefits: ['Compound interest', 'Flexible investment amounts', 'Automatic reinvestment']
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Flexible Terms',
      description: 'Choose investment periods that match your financial goals, from 91 days to 10+ years.',
      benefits: ['91-day Treasury Bills', '182-day Treasury Bills', '1-10 Year Treasury Bonds']
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Diaspora Friendly',
      description: 'Invest from anywhere in the world with our secure online platform.',
      benefits: ['Global access', 'Multi-currency support', 'International transfers']
    }
  ];

  const stats = [
    { value: '160k+', label: 'Active Users', description: 'Trusted by thousands of investors' },
    { value: '₵2.5B+', label: 'Assets Under Management', description: 'Managing billions in investments' },
    { value: '24.5%', label: 'Average Annual Return', description: 'Consistently delivering strong returns' },
    { value: '99.9%', label: 'Platform Uptime', description: 'Reliable and always available' }
  ];

  const testimonials = [
    {
      name: 'Ama Mensah',
      role: 'Diaspora Investor',
      content: 'Constant Treasury has made it so easy to invest in Ghana\'s development while earning great returns from the UK.',
      rating: 5
    },
    {
      name: 'Kwame Asante',
      role: 'Local Business Owner',
      content: 'The platform is secure and user-friendly. I\'ve been able to grow my business reserves effectively.',
      rating: 5
    },
    {
      name: 'Adjoa Serwaa',
      role: 'First-time Investor',
      content: 'As someone new to investing, the guidance and support have been exceptional. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-medium">Ghana\'s Premier Treasury Investment Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Why Choose <span className="text-primary">Constant Treasury?</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We make investing in Ghana government securities simple, secure, and rewarding. 
              Join thousands of Ghanaians building wealth through trusted government-backed investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link href="/register">
                  Start Investing Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">
                  Learn How It Works
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
              Platform Benefits
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover why thousands of investors trust Constant Treasury for their government securities investments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Investors Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied investors who have chosen Constant Treasury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-current" />
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

      {/* Security Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Bank-Level Security
              </h2>
              <p className="text-lg text-muted-foreground">
                Your investments and personal information are protected with industry-leading security measures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">256-bit Encryption</h3>
                <p className="text-muted-foreground">Military-grade encryption protects all your data and transactions.</p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bank of Ghana Regulated</h3>
                <p className="text-muted-foreground">Fully licensed and regulated by the Bank of Ghana.</p>
              </div>

              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Government Backed</h3>
                <p className="text-muted-foreground">All investments are guaranteed by the Government of Ghana.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Ghanaians and diaspora investors building wealth through secure government securities.
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
                <HeadphonesIcon className="mr-2 h-5 w-5" />
                Talk to Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
