'use client';

import { Shield, Lock, CheckCircle, Award, Users, FileCheck, Eye, Server, Smartphone, AlertTriangle, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Security() {
  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: '256-bit SSL Encryption',
      description: 'Military-grade encryption protects all data transmissions between your device and our servers.',
      details: 'Bank-level security standards'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account with 2FA via SMS or authenticator apps.',
      details: 'Optional but highly recommended'
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: 'Secure Data Centers',
      description: 'Your data is stored in highly secure, SOC 2 compliant data centers with 24/7 monitoring.',
      details: 'Enterprise-grade infrastructure'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Privacy Protection',
      description: 'We never share your personal information with third parties without your explicit consent.',
      details: 'GDPR and Data Protection Act compliant'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Device Management',
      description: 'Monitor and control which devices have access to your account with instant notifications.',
      details: 'Real-time security alerts'
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: 'Regular Security Audits',
      description: 'Independent security firms regularly audit our systems to ensure maximum protection.',
      details: 'Quarterly penetration testing'
    }
  ];

  const complianceItems = [
    {
      icon: <Award className="h-5 w-5" />,
      title: 'Bank of Ghana Licensed',
      description: 'Fully licensed and regulated by the Bank of Ghana under the Securities Industry Act, 2016 (Act 929).'
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: 'SEC Registered',
      description: 'Registered with the Securities and Exchange Commission of Ghana as a licensed investment platform.'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'AML/KYC Compliant',
      description: 'Full compliance with Anti-Money Laundering and Know Your Customer regulations.'
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      title: 'Data Protection Act',
      description: 'Compliant with Ghana\'s Data Protection Act, 2012 (Act 843) for data privacy and security.'
    }
  ];

  const guarantees = [
    {
      title: 'Government Guaranteed',
      description: 'All treasury securities are backed by the full faith and credit of the Government of Ghana.',
      icon: <Crown className="h-8 w-8 text-primary" />
    },
    {
      title: 'Principal Protection',
      description: 'Your initial investment amount is protected and guaranteed at maturity.',
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: 'Interest Assurance',
      description: 'Fixed interest rates ensure predictable returns regardless of market conditions.',
      icon: <CheckCircle className="h-8 w-8 text-primary" />
    }
  ];

  const tips = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'Use Strong Passwords',
      description: 'Create unique passwords with a mix of letters, numbers, and symbols.'
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: 'Enable 2FA',
      description: 'Activate two-factor authentication for an extra layer of security.'
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Beware of Phishing',
      description: 'Never share your login details via email or suspicious links.'
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: 'Monitor Your Account',
      description: 'Regularly check your account activity and report suspicious transactions.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Bank-Level Security & Government Backing</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Security & <span className="text-primary">Trust</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your security is our top priority. We protect your investments and personal information 
              with industry-leading security measures and government guarantees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <Link href="/register">
                  Invest Securely
                  <Shield className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/why-choose-constant-treasury">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  {guarantee.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{guarantee.title}</h3>
                  <p className="text-muted-foreground">{guarantee.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Advanced Security Features
            </h2>
            <p className="text-lg text-muted-foreground">
              We employ multiple layers of security to protect your investments and personal information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-primary font-medium">
                    {feature.details}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Fully Regulated & Compliant
              </h2>
              <p className="text-lg text-muted-foreground">
                We operate under strict regulatory oversight to ensure your investments are protected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Keep Your Account Secure
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these best practices to protect your investment account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <Card key={index} className="group hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                        <p className="text-muted-foreground text-sm">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-8">Trusted by Leading Institutions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-muted-foreground">Bank of Ghana</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-muted-foreground">SEC Ghana</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-muted-foreground">Ghana Stock Exchange</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-muted-foreground">Financial Stability Council</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Invest with Complete Peace of Mind
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Ghanaians who trust Constant Treasury for secure, government-backed investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group" asChild>
              <Link href="/register">
                Start Secure Investing
                <Shield className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/support">
                Contact Security Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
