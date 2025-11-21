'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  FileText,
  Video,
  Presentation,
  BarChart3,
  Users,
  ArrowRight,
  Play,
  ExternalLink,
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface Presentation {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'investor' | 'educational' | 'webinar' | 'tutorial';
  format: 'pdf' | 'video' | 'slides';
  duration?: string;
  fileSize?: string;
  thumbnail?: string;
  views: number;
  downloads: number;
}

export default function InvestorPresentationsPage() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'investor' | 'educational' | 'webinar' | 'tutorial'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'pdf' | 'video' | 'slides'>('all');

  // Mock presentations data
  const presentations: Presentation[] = [
    {
      id: '1',
      title: 'Introduction to Ghana Treasury Securities',
      description: 'Learn the fundamentals of investing in Bank of Ghana Treasury Bills and Government Bonds',
      date: '2024-11-15',
      category: 'educational',
      format: 'video',
      duration: '25 min',
      views: 1250,
      downloads: 0,
    },
    {
      id: '2',
      title: 'How to Participate in BoG Auctions',
      description: 'Step-by-step guide to bidding in primary market Treasury auctions',
      date: '2024-11-10',
      category: 'tutorial',
      format: 'pdf',
      fileSize: '2.4 MB',
      views: 890,
      downloads: 456,
    },
    {
      id: '3',
      title: 'Understanding Yield Curves and Interest Rates',
      description: 'Deep dive into Ghana yield curves, interest rate trends, and market dynamics',
      date: '2024-11-05',
      category: 'investor',
      format: 'slides',
      fileSize: '5.1 MB',
      views: 2100,
      downloads: 780,
    },
    {
      id: '4',
      title: 'Q4 2024 Treasury Market Outlook',
      description: 'Quarterly investor presentation covering market trends and investment opportunities',
      date: '2024-10-30',
      category: 'investor',
      format: 'pdf',
      fileSize: '8.3 MB',
      views: 3450,
      downloads: 1200,
    },
    {
      id: '5',
      title: 'Risk Management in Fixed Income Investing',
      description: 'Webinar on managing interest rate risk, credit risk, and portfolio diversification',
      date: '2024-10-20',
      category: 'webinar',
      format: 'video',
      duration: '45 min',
      views: 1890,
      downloads: 0,
    },
    {
      id: '6',
      title: 'Secondary Market Trading Strategies',
      description: 'Advanced strategies for trading Treasury securities in the secondary market',
      date: '2024-10-10',
      category: 'educational',
      format: 'slides',
      fileSize: '3.7 MB',
      views: 1560,
      downloads: 620,
    },
  ];

  const filteredPresentations = presentations.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesFormat = formatFilter === 'all' || p.format === formatFilter;
    return matchesCategory && matchesFormat;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'investor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'educational': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'webinar': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'tutorial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'slides': return <Presentation className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Investor Presentations</h1>
              <p className="text-muted-foreground">Educational resources to help you understand Ghana Treasury investing</p>
            </div>
            <Award className="h-12 w-12 text-primary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold text-foreground">{presentations.length}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {presentations.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold text-foreground">
                  {presentations.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Video Content</p>
                <p className="text-2xl font-bold text-foreground">
                  {presentations.filter(p => p.format === 'video').length}
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Filters */}
        <AnimatedCard className="p-6 border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="investor">Investor Presentations</option>
                <option value="educational">Educational Content</option>
                <option value="webinar">Webinars</option>
                <option value="tutorial">Tutorials</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF Documents</option>
                <option value="video">Videos</option>
                <option value="slides">Slide Decks</option>
              </select>
            </div>
          </div>
        </AnimatedCard>

        {/* Presentations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresentations.map((presentation, index) => (
            <AnimatedCard 
              key={presentation.id}
              className="border border-border overflow-hidden hover:shadow-lg transition-shadow"
              delay={index * 100}
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  {getFormatIcon(presentation.format)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(presentation.category)}`}>
                    {presentation.category.charAt(0).toUpperCase() + presentation.category.slice(1)}
                  </span>
                  {presentation.duration && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {presentation.duration}
                    </span>
                  )}
                  {presentation.fileSize && (
                    <span className="text-xs text-muted-foreground">
                      {presentation.fileSize}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{presentation.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{presentation.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(presentation.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {presentation.views}
                    </span>
                    {presentation.downloads > 0 && (
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {presentation.downloads}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {presentation.format === 'video' ? (
                    <AnimatedButton variant="primary" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton variant="primary" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </AnimatedButton>
                  )}
                  <AnimatedButton variant="outline">
                    <Eye className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* CTA Section */}
        <AnimatedCard className="mt-12 p-8 border border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Need Personalized Guidance?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our investment advisors are here to help you understand Ghana Treasury securities and build a portfolio that meets your goals.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <AnimatedButton variant="primary">
                  Contact an Advisor
                  <ArrowRight className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
              <Link href="/auctions">
                <AnimatedButton variant="outline">
                  View Live Auctions
                  <ExternalLink className="h-4 w-4 ml-2" />
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
