import { BookOpen, TrendingUp, PieChart, DollarSign, Clock, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GuidesPage() {
  const guides = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction to Government Securities',
          description: 'Learn the basics of Treasury Bills, Bonds, and Notes',
          readTime: '5 min read',
          href: '#intro'
        },
        {
          title: 'How to Open an Account',
          description: 'Step-by-step guide to registering on Constant Treasury',
          readTime: '3 min read',
          href: '#account'
        },
        {
          title: 'Making Your First Investment',
          description: 'Complete walkthrough of placing your first order',
          readTime: '7 min read',
          href: '#first-investment'
        }
      ]
    },
    {
      category: 'Investment Strategies',
      icon: Target,
      items: [
        {
          title: 'Building a Diversified Portfolio',
          description: 'Strategies for balancing risk and returns',
          readTime: '10 min read',
          href: '#diversification'
        },
        {
          title: 'Laddering Strategy',
          description: 'How to create a bond ladder for steady income',
          readTime: '8 min read',
          href: '#laddering'
        },
        {
          title: 'Reinvestment Strategies',
          description: 'Maximizing returns through smart reinvestment',
          readTime: '6 min read',
          href: '#reinvestment'
        }
      ]
    },
    {
      category: 'Understanding Returns',
      icon: TrendingUp,
      items: [
        {
          title: 'How Interest Rates Work',
          description: 'Understanding yields, coupons, and discount rates',
          readTime: '9 min read',
          href: '#interest-rates'
        },
        {
          title: 'Calculating Your Returns',
          description: 'Learn to calculate actual vs. nominal returns',
          readTime: '7 min read',
          href: '#calculating-returns'
        },
        {
          title: 'Tax Implications',
          description: 'Understanding tax treatment of government securities',
          readTime: '6 min read',
          href: '#taxes'
        }
      ]
    },
    {
      category: 'Risk Management',
      icon: PieChart,
      items: [
        {
          title: 'Understanding Investment Risk',
          description: 'Types of risk in government securities',
          readTime: '8 min read',
          href: '#risk-types'
        },
        {
          title: 'Liquidity Considerations',
          description: 'When and how to access your funds',
          readTime: '5 min read',
          href: '#liquidity'
        },
        {
          title: 'Market Timing',
          description: 'Best practices for entering and exiting positions',
          readTime: '7 min read',
          href: '#timing'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <BookOpen className="h-4 w-4" />
              Investment Guides
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Learn to Invest Smarter
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive guides to help you master government securities investing
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {guides.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">{section.category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((guide, guideIdx) => (
                    <Link
                      key={guideIdx}
                      href={guide.href}
                      className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">
                        {guide.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16 bg-muted/50 border border-border rounded-lg p-12 text-center">
            <DollarSign className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">More Guides Coming Soon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We're constantly adding new educational content to help you make informed investment decisions. 
              Check back regularly for updates.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
