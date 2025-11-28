'use client';

import { ArrowRight, User, Search, ShoppingCart, CreditCard, TrendingUp, FileText, CheckCircle, Clock, Shield, Users, HeadphonesIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: <User className="h-6 w-6" />,
      title: 'Create Your Account',
      description: 'Sign up in minutes with our secure registration process.',
      details: [
        'Complete KYC verification',
        'Choose your investment profile',
        'Set up your secure login'
      ],
      timeRequired: '5-10 minutes'
    },
    {
      number: 2,
      icon: <Search className="h-6 w-6" />,
      title: 'Browse Treasury Securities',
      description: 'Explore available government securities with competitive rates.',
      details: [
        'View current Treasury Bills',
        'Check Treasury Bond options',
        'Compare interest rates and terms'
      ],
      timeRequired: '2-5 minutes'
    },
    {
      number: 3,
      icon: <ShoppingCart className="h-6 w-6" />,
      title: 'Select Your Investment',
      description: 'Choose the securities that match your financial goals.',
      details: [
        'Select investment amount',
        'Choose investment period',
        'Review yield expectations'
      ],
      timeRequired: '3-5 minutes'
    },
    {
      number: 4,
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Fund Your Account',
      description: 'Add funds through various secure payment methods.',
      details: [
        'Bank transfer or mobile money',
        'Instant fund confirmation',
        'Secure payment processing'
      ],
      timeRequired: '1-3 minutes'
    },
    {
      number: 5,
      icon: <FileText className="h-6 w-6" />,
      title: 'Complete Investment',
      description: 'Finalize your investment and receive confirmation.',
      details: [
        'Review and confirm investment',
        'Receive digital certificate',
        'Start earning returns'
      ],
      timeRequired: '2 minutes'
    },
    {
      number: 6,
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Track & Manage',
      description: 'Monitor your investments and returns in real-time.',
      details: [
        'View portfolio performance',
        'Track interest payments',
        'Manage reinvestments'
      ],
      timeRequired: 'Ongoing'
    }
  ];

  const investmentTypes = [
    {
      title: '91-Day Treasury Bill',
      description: 'Short-term government security with quick returns',
      minAmount: '₵100',
      typicalReturn: '12-15% p.a.',
      duration: '91 days',
      bestFor: 'Emergency funds, short-term savings'
    },
    {
      title: '182-Day Treasury Bill',
      description: 'Medium-term investment with balanced returns',
      minAmount: '₵100',
      typicalReturn: '14-17% p.a.',
      duration: '182 days',
      bestFor: 'Medium-term goals, higher returns'
    },
    {
      title: '1-Year Treasury Bill',
      description: 'Annual investment with competitive returns',
      minAmount: '₵100',
      typicalReturn: '16-20% p.a.',
      duration: '1 year',
      bestFor: 'Annual planning, stable returns'
    },
    {
      title: '2-Year Treasury Bond',
      description: 'Long-term government bond with fixed returns',
      minAmount: '₵1,000',
      typicalReturn: '18-22% p.a.',
      duration: '2 years',
      bestFor: 'Long-term wealth building'
    },
    {
      title: '5-Year Treasury Bond',
      description: 'Extended term bond with higher yields',
      minAmount: '₵1,000',
      typicalReturn: '20-25% p.a.',
      duration: '5 years',
      bestFor: 'Retirement planning, children education'
    },
    {
      title: '10-Year Treasury Bond',
      description: 'Longest term government bond with maximum returns',
      minAmount: '₵1,000',
      typicalReturn: '22-28% p.a.',
      duration: '10 years',
      bestFor: 'Generational wealth, long-term security'
    }
  ];

  const faqs = [
    {
      question: 'What are Treasury Bills and Bonds?',
      answer: 'Treasury Bills and Bonds are debt instruments issued by the Government of Ghana to borrow money from the public. When you invest, you\'re essentially lending money to the government and earning interest in return.'
    },
    {
      question: 'How safe are government securities?',
      answer: 'Government securities are considered the safest investments in Ghana as they are backed by the full faith and credit of the Government of Ghana. They have virtually zero risk of default.'
    },
    {
      question: 'What\'s the minimum investment amount?',
      answer: 'You can start investing with as little as ₵100 for Treasury Bills. Treasury Bonds typically require a minimum of ₵1,000.'
    },
    {
      question: 'How do I receive my returns?',
      answer: 'Interest payments are automatically credited to your Constant Treasury account. You can choose to reinvest them or withdraw to your bank account.'
    },
    {
      question: 'Can I invest from outside Ghana?',
      answer: 'Yes! Our platform is diaspora-friendly. You can invest from anywhere in the world using international bank transfers or other supported payment methods.'
    },
    {
      question: 'Are there any fees?',
      answer: 'We charge a small transparent fee on transactions. There are no hidden charges, and we offer competitive rates compared to traditional banks.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Start Investing in Under 15 Minutes</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              How <span className="text-primary">Constant Treasury</span> Works
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our simple 6-step process makes investing in Ghana government securities easy, 
              secure, and accessible to everyone.
            </p>

            <Button size="lg" className="group" asChild>
              <Link href="/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple 6-Step Investment Process
            </h2>
            <p className="text-lg text-muted-foreground">
              From registration to earning returns, we\'ve made every step intuitive and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {step.icon}
                        </div>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{step.timeRequired}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Available Treasury Securities
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from a variety of government securities to match your investment goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentTypes.map((investment, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{investment.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{investment.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Investment:</span>
                      <span className="font-semibold">{investment.minAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Typical Return:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{investment.typicalReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="font-semibold">{investment.duration}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Best for:</div>
                      <div className="text-sm">{investment.bestFor}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Invest Through Constant Treasury?
              </h2>
              <p className="text-lg text-muted-foreground">
                We offer advantages that traditional banks and investment houses can\'t match.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Higher Returns</h3>
                  <p className="text-muted-foreground">Get better rates than traditional savings accounts with government-backed security.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Maximum Security</h3>
                  <p className="text-muted-foreground">Bank-level encryption and government guarantees protect your investments.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick & Easy</h3>
                  <p className="text-muted-foreground">Start investing in minutes with our intuitive online platform.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
                  <p className="text-muted-foreground">Get guidance from our investment specialists whenever you need it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Got questions? We have answers.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
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
            Join thousands of Ghanaians earning competitive returns through secure government investments.
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
