'use client';

import { Shield, TrendingUp, Users, Award, Target, Globe2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { PageTitle, SectionTitle, CardTitle } from '@/components/ui/PageTitle';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Security First',
      description: 'Bank-level security with end-to-end encryption protecting your investments'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Transparency',
      description: 'Clear, honest communication about yields, risks, and market conditions'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Customer Focus',
      description: 'Dedicated support team available to guide your investment journey'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Excellence',
      description: 'Committed to delivering world-class investment platform experience'
    }
  ];

  const milestones = [
    { year: '2024', title: 'Platform Launch', description: 'Ghana\'s first digital treasury securities platform goes live' },
    { year: '2024', title: '10,000+ Users', description: 'Rapid adoption by retail and institutional investors' },
    { year: '2024', title: '₵500M+ AUM', description: 'Assets under management milestone reached' },
    { year: '2025', title: 'Regional Expansion', description: 'Expanding to serve West African markets' }
  ];

  const team = [
    { role: 'Technology Partner', name: 'Constant Capital Ghana', description: 'SEC-licensed broker-dealer providing platform infrastructure' },
    { role: 'Regulatory', name: 'Bank of Ghana', description: 'Oversight and compliance framework' },
    { role: 'Settlement', name: 'Ghana Stock Exchange', description: 'Securities settlement and clearing services' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Target className="h-4 w-4" />
              About Constant Treasury
            </div>
            <PageTitle className="mb-6 text-center">
              Democratizing Access to Government Securities
            </PageTitle>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're building Ghana's first fully digital platform for treasury securities, making it simple for everyone to invest in government-backed instruments.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle className="mb-6">
                Our Mission
              </SectionTitle>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To provide every Ghanaian—at home and in the diaspora—with seamless access to secure, government-backed investment opportunities that build wealth and support national development.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Accessible Investing</div>
                    <div className="text-sm text-muted-foreground">Start with as little as ₵100 - no minimum balance required</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Real-Time Trading</div>
                    <div className="text-sm text-muted-foreground">Execute trades instantly with live market data and pricing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Full Transparency</div>
                    <div className="text-sm text-muted-foreground">Track your portfolio, yields, and returns in real-time</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">160k+</div>
                      <div className="text-sm text-muted-foreground">Active Investors</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">₵2.5B+</div>
                      <div className="text-sm text-muted-foreground">Assets Under Management</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">24.5%</div>
                      <div className="text-sm text-muted-foreground">Average Annual Return</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones in building Ghana's premier treasury platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2"></div>
                    )}
                  </div>
                  <div className="pb-8 flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Working with Ghana's leading financial institutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((partner, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-primary mb-2">{partner.role}</div>
                <h3 className="text-xl font-bold mb-3">{partner.name}</h3>
                <p className="text-sm text-muted-foreground">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Ghanaians building wealth through secure government securities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Open Free Account
              </Link>
              <Link
                href="/securities"
                className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-card px-8 py-4 text-base font-semibold text-foreground hover:bg-accent transition-colors"
              >
                View Securities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
