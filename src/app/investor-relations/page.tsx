'use client';

import { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Scale, 
  Newspaper, 
  Users, 
  GraduationCap,
  Phone,
  ArrowRight,
  TrendingUp,
  Shield,
  Award,
  Globe,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface IRSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  features: string[];
  color: string;
}

export default function InvestorRelationsPage() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const irSections: IRSection[] = [
    {
      id: 'financial-reports',
      title: 'Financial Reports',
      description: 'Access our audited financial statements, quarterly results, and annual reports',
      icon: <FileText className="h-8 w-8" />,
      href: '/investor-relations/financial-reports',
      features: ['Annual Reports', 'Quarterly Results', 'Audited Financials', 'Management Discussion'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'regulatory-filings',
      title: 'Regulatory Filings',
      description: 'View BoG, SEC, and other regulatory compliance documents and disclosures',
      icon: <Scale className="h-8 w-8" />,
      href: '/investor-relations/regulatory-filings',
      features: ['BoG Filings', 'SEC Reports', 'Compliance Documents', 'Regulatory Updates'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'press-releases',
      title: 'Press Releases',
      description: 'Stay updated with our latest announcements, partnerships, and company news',
      icon: <Newspaper className="h-8 w-8" />,
      href: '/investor-relations/press-releases',
      features: ['Company News', 'Partnership Announcements', 'Product Launches', 'Media Coverage'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'corporate-governance',
      title: 'Corporate Governance',
      description: 'Learn about our leadership team, board structure, and governance policies',
      icon: <Users className="h-8 w-8" />,
      href: '/investor-relations/corporate-governance',
      features: ['Board of Directors', 'Leadership Team', 'Governance Policies', 'Committee Structure'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'investor-education',
      title: 'Investor Education',
      description: 'Educational resources about Ghana Treasury markets and digital trading',
      icon: <GraduationCap className="h-8 w-8" />,
      href: '/investor-relations/investor-education',
      features: ['Market Guides', 'Trading Tutorials', 'Risk Management', 'FAQs'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'contact-ir',
      title: 'Contact Investor Relations',
      description: 'Get in touch with our investor relations team for inquiries and support',
      icon: <Phone className="h-8 w-8" />,
      href: '/investor-relations/contact',
      features: ['Direct Contact', 'Investor Inquiries', 'Meeting Requests', 'Support Team'],
      color: 'from-red-500 to-red-600'
    }
  ];

  const keyMetrics = [
    {
      label: 'Assets Under Management',
      value: '₵2.5B+',
      change: '+15%',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      label: 'Active Users',
      value: '50,000+',
      change: '+25%',
      icon: <Users className="h-5 w-5" />
    },
    {
      label: 'Trading Volume',
      value: '₵10B+',
      change: '+30%',
      icon: <Building2 className="h-5 w-5" />
    },
    {
      label: 'Market Share',
      value: '35%',
      change: '+5%',
      icon: <Globe className="h-5 w-5" />
    }
  ];

  const upcomingEvents = [
    {
      date: '2025-12-15',
      title: 'Q4 2025 Earnings Call',
      type: 'Earnings',
      description: 'Join us for our quarterly earnings presentation and Q&A session'
    },
    {
      date: '2026-01-20',
      title: 'Annual General Meeting',
      type: 'AGM',
      description: 'Annual shareholder meeting and board elections'
    },
    {
      date: '2026-02-10',
      title: 'Investor Day 2026',
      type: 'Investor Event',
      description: 'Deep dive into our strategy and growth initiatives'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Investor Relations
                </h1>
                <p className="text-lg text-muted-foreground">
                  Constant Treasury - Ghana's Premier Digital Trading Platform
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Welcome to Constant Treasury's Investor Relations portal. We are committed to transparency 
              and providing our investors with comprehensive information about our operations, 
              financial performance, and strategic initiatives in Ghana's digital treasury market.
            </p>

            <div className="flex items-center gap-6">
              <AnimatedButton variant="primary" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Download Annual Report 2024
              </AnimatedButton>
              <AnimatedButton variant="outline" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contact IR Team
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <AnimatedCard 
              key={metric.label}
              className="p-6 border border-border hover:shadow-lg transition-shadow"
              delay={index * 100}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {metric.icon}
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </h3>
              <p className="text-sm text-muted-foreground">
                {metric.label}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Main IR Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Investor Information
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive investor resources including financial reports, 
            regulatory filings, and company information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {irSections.map((section, index) => (
            <AnimatedCard 
              key={section.id}
              className="group hover:shadow-xl transition-all duration-300 border border-border overflow-hidden"
              delay={index * 100}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className={`h-2 bg-gradient-to-r ${section.color}`} />
              
              <div className="p-6">
                <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {section.icon}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {section.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1 w-1 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link href={section.href}>
                  <AnimatedButton 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Explore {section.title}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </AnimatedButton>
                </Link>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us for upcoming investor events and announcements
              </p>
            </div>
            <AnimatedButton variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <AnimatedCard 
                key={index}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {event.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-border p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Quick Downloads
              </h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Annual Report 2024
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Q3 2025 Results
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Investor Presentation
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Regulatory
              </h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  BoG Compliance Report
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  SEC Filings
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Audit Reports
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Governance
              </h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Board Composition
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Committee Charters
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Code of Ethics
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact
              </h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  IR Team
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Media Inquiries
                </Link>
                <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  General Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
