'use client';

import { useState } from 'react';
import { 
  GraduationCap, 
  Download, 
  Play, 
  BookOpen,
  FileText,
  Video,
  Headphones,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Target,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface EducationalResource {
  id: string;
  title: string;
  type: 'GUIDE' | 'TUTORIAL' | 'VIDEO' | 'WEBINAR' | 'FAQ' | 'CALCULATOR';
  category: 'BASICS' | 'TRADING' | 'RISK' | 'MARKET' | 'REGULATORY' | 'TOOLS';
  description: string;
  content: string;
  duration?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  downloadUrl?: string;
  externalUrl?: string;
  tags: string[];
  views: number;
  lastUpdated: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export default function InvestorEducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const resources: EducationalResource[] = [
    {
      id: '1',
      title: 'Understanding Ghana Treasury Bills',
      type: 'GUIDE',
      category: 'BASICS',
      description: 'Complete guide to Treasury Bills in Ghana - types, features, and benefits for investors.',
      content: 'Treasury Bills are short-term government securities issued by the Bank of Ghana on behalf of the Government of Ghana. They are considered one of the safest investment options in Ghana\'s financial markets.',
      difficulty: 'BEGINNER',
      downloadUrl: '#',
      tags: ['T-Bills', 'Government Securities', 'Investment Basics'],
      views: 3540,
      lastUpdated: '2025-11-01'
    },
    {
      id: '2',
      title: 'How to Buy Government Bonds on Constant Treasury',
      type: 'TUTORIAL',
      category: 'TRADING',
      description: 'Step-by-step tutorial on purchasing government bonds through our digital platform.',
      content: 'Learn the complete process of buying government bonds on Constant Treasury, from account setup to order execution and settlement.',
      duration: '15 min',
      difficulty: 'BEGINNER',
      downloadUrl: '#',
      tags: ['Trading', 'Bonds', 'Platform Tutorial'],
      views: 2890,
      lastUpdated: '2025-10-28'
    },
    {
      id: '3',
      title: 'Risk Management for Treasury Investors',
      type: 'GUIDE',
      category: 'RISK',
      description: 'Essential risk management strategies for investing in Ghana\'s treasury markets.',
      content: 'Understanding and managing risks associated with treasury investments, including interest rate risk, inflation risk, and liquidity risk.',
      difficulty: 'INTERMEDIATE',
      downloadUrl: '#',
      tags: ['Risk Management', 'Investment Strategy', 'Portfolio Management'],
      views: 1870,
      lastUpdated: '2025-10-25'
    },
    {
      id: '4',
      title: 'Introduction to Ghana\'s Financial Markets',
      type: 'VIDEO',
      category: 'MARKET',
      description: 'Video overview of Ghana\'s financial markets and the role of Constant Treasury.',
      content: 'Comprehensive video introduction to Ghana\'s financial ecosystem, including money markets, capital markets, and the regulatory framework.',
      duration: '25 min',
      difficulty: 'BEGINNER',
      externalUrl: '#',
      tags: ['Financial Markets', 'Ghana Economy', 'Market Overview'],
      views: 4200,
      lastUpdated: '2025-11-05'
    },
    {
      id: '5',
      title: 'Yield Calculation and Investment Returns',
      type: 'CALCULATOR',
      category: 'TOOLS',
      description: 'Interactive calculator for treasury investment yields and returns.',
      content: 'Calculate potential returns on treasury investments with our interactive yield calculator. Understand how yields are computed and what factors affect your returns.',
      difficulty: 'INTERMEDIATE',
      downloadUrl: '#',
      tags: ['Yield Calculator', 'Returns', 'Investment Tools'],
      views: 1560,
      lastUpdated: '2025-11-10'
    },
    {
      id: '6',
      title: 'Regulatory Framework for Treasury Trading',
      type: 'GUIDE',
      category: 'REGULATORY',
      description: 'Understanding BoG and SEC regulations governing treasury securities trading.',
      content: 'Detailed explanation of the regulatory framework established by the Bank of Ghana and Securities and Exchange Commission for treasury markets.',
      difficulty: 'ADVANCED',
      downloadUrl: '#',
      tags: ['Regulation', 'BoG', 'SEC', 'Compliance'],
      views: 980,
      lastUpdated: '2025-10-20'
    },
    {
      id: '7',
      title: 'Portfolio Diversification with Treasury Securities',
      type: 'WEBINAR',
      category: 'TRADING',
      description: 'Expert webinar on using treasury securities for portfolio diversification.',
      content: 'Learn how to effectively use treasury securities to diversify your investment portfolio and manage risk across different market conditions.',
      duration: '45 min',
      difficulty: 'INTERMEDIATE',
      externalUrl: '#',
      tags: ['Portfolio Management', 'Diversification', 'Investment Strategy'],
      views: 2100,
      lastUpdated: '2025-10-15'
    },
    {
      id: '8',
      title: 'Understanding Auction Mechanisms',
      type: 'TUTORIAL',
      category: 'MARKET',
      description: 'How treasury auctions work and how to participate effectively.',
      content: 'Detailed explanation of the auction process for treasury securities, including competitive and non-competitive bidding strategies.',
      difficulty: 'INTERMEDIATE',
      downloadUrl: '#',
      tags: ['Auctions', 'Bidding', 'Market Mechanics'],
      views: 1450,
      lastUpdated: '2025-11-08'
    },
    {
      id: '9',
      title: 'Tax Implications for Treasury Investors',
      type: 'GUIDE',
      category: 'REGULATORY',
      description: 'Understanding tax treatment of treasury investment returns in Ghana.',
      content: 'Comprehensive guide to tax implications for treasury investors, including withholding tax, capital gains tax, and tax planning strategies.',
      difficulty: 'ADVANCED',
      downloadUrl: '#',
      tags: ['Taxation', 'Investment Returns', 'Financial Planning'],
      views: 890,
      lastUpdated: '2025-10-12'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What are Treasury Bills and how do they work?',
      answer: 'Treasury Bills are short-term government securities issued by the Bank of Ghana with maturities of 91, 182, and 364 days. They are sold at a discount to face value and pay no periodic interest. The difference between the purchase price and face value represents the investor\'s return.',
      category: 'Basics',
      helpful: 145
    },
    {
      id: '2',
      question: 'How do I start investing in government securities?',
      answer: 'To start investing, you need to: 1) Open an account with Constant Treasury, 2) Complete KYC verification, 3) Fund your account, 4) Browse available securities, 5) Place your bid during auction periods, 6) Wait for allocation and settlement. Our platform guides you through each step.',
      category: 'Getting Started',
      helpful: 132
    },
    {
      id: '3',
      question: 'What is the minimum investment amount?',
      answer: 'The minimum investment amount for Treasury Bills is typically ₵1,000, while government bonds may require a minimum of ₵10,000. However, these amounts may vary based on specific auction requirements and current market conditions.',
      category: 'Investment Requirements',
      helpful: 98
    },
    {
      id: '4',
      question: 'Are government securities safe investments?',
      answer: 'Yes, government securities issued by the Government of Ghana are considered among the safest investments available. They are backed by the full faith and credit of the government, making them virtually risk-free in terms of default risk.',
      category: 'Risk',
      helpful: 167
    },
    {
      id: '5',
      question: 'How are yields calculated for Treasury Bills?',
      answer: 'Yield on Treasury Bills is calculated using the discount yield formula: Yield = [(Face Value - Purchase Price) / Purchase Price] × (365 / Days to Maturity) × 100. Our platform automatically calculates and displays yields for all available securities.',
      category: 'Calculations',
      helpful: 76
    },
    {
      id: '6',
      question: 'What is the difference between competitive and non-competitive bidding?',
      answer: 'In competitive bidding, you specify the yield/price you\'re willing to accept, and allocation depends on how your bid compares to the clearing yield. In non-competitive bidding, you accept the clearing yield determined at the auction and are guaranteed allocation up to a certain limit.',
      category: 'Bidding',
      helpful: 89
    },
    {
      id: '7',
      question: 'How long does it take to settle treasury transactions?',
      answer: 'Treasury transactions typically settle on T+1 (next business day) for Treasury Bills and T+2 or T+3 for government bonds, depending on the specific security and market conditions. Settlement means the securities are credited to your account and funds are debited.',
      category: 'Settlement',
      helpful: 65
    },
    {
      id: '8',
      question: 'Can I sell my treasury securities before maturity?',
      answer: 'Yes, you can sell treasury securities in the secondary market before maturity through our platform. The price you receive will depend on current market conditions, interest rates, and time remaining to maturity.',
      category: 'Trading',
      helpful: 112
    }
  ];

  const categories = [...new Set(resources.map(r => r.category))];
  const types = [...new Set(resources.map(r => r.type))];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'ALL' || resource.category === selectedCategory;
    const matchesType = selectedType === 'ALL' || resource.type === selectedType;
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GUIDE': return <BookOpen className="h-4 w-4" />;
      case 'TUTORIAL': return <GraduationCap className="h-4 w-4" />;
      case 'VIDEO': return <Video className="h-4 w-4" />;
      case 'WEBINAR': return <Headphones className="h-4 w-4" />;
      case 'FAQ': return <FileText className="h-4 w-4" />;
      case 'CALCULATOR': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GUIDE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'TUTORIAL': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'VIDEO': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'WEBINAR': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'FAQ': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'CALCULATOR': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleDownload = (resource: EducationalResource) => {
    console.log('Downloading resource:', resource.title);
  };

  const handleViewExternal = (resource: EducationalResource) => {
    console.log('Opening external resource:', resource.title);
  };

  const educationStats = {
    totalResources: resources.length,
    totalViews: resources.reduce((sum, r) => sum + r.views, 0),
    videoHours: '12',
    guidesCount: resources.filter(r => r.type === 'GUIDE').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/investor-relations" className="text-primary hover:text-primary/80 text-sm mb-2 inline-block">
                ← Back to Investor Relations
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Investor Education
              </h1>
              <p className="text-muted-foreground">
                Educational resources about Ghana Treasury markets and digital trading
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <GraduationCap className="h-4 w-4 mr-2" />
                Start Learning
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Education Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold text-foreground">{educationStats.totalResources}</p>
                <p className="text-sm text-muted-foreground">Educational materials</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{educationStats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600">+25% this month</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Video Content</p>
                <p className="text-2xl font-bold text-foreground">{educationStats.videoHours}h</p>
                <p className="text-sm text-muted-foreground">Learning videos</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comprehensive Guides</p>
                <p className="text-2xl font-bold text-foreground">{educationStats.guidesCount}</p>
                <p className="text-sm text-muted-foreground">In-depth guides</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <AnimatedButton 
              variant="outline" 
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedType('ALL');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Learning Resources</h2>
          <p className="text-muted-foreground">
            Explore our comprehensive collection of guides, tutorials, videos, and tools designed to help you master treasury investing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <AnimatedCard 
              key={resource.id}
              className="p-6 border border-border hover:shadow-lg transition-shadow"
              delay={index * 50}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                    {resource.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                {resource.duration && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.duration}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {resource.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {resource.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {resource.views.toLocaleString()} views
                </span>
                <span>
                  Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              {resource.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {resource.downloadUrl && (
                  <AnimatedButton 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </AnimatedButton>
                )}
                {resource.externalUrl ? (
                  <AnimatedButton 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => handleViewExternal(resource)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </AnimatedButton>
                ) : (
                  <AnimatedButton 
                    variant="primary" 
                    className="flex-1"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Read
                  </AnimatedButton>
                )}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about treasury investing and using Constant Treasury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <AnimatedCard 
                key={faq.id}
                className="border border-border overflow-hidden"
                delay={index * 50}
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
                
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 border-t border-border">
                    <p className="text-sm text-muted-foreground pt-4">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Category: {faq.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {faq.helpful} people found this helpful
                      </span>
                    </div>
                  </div>
                )}
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Recommended Learning Paths</h2>
          <p className="text-muted-foreground">
            Structured learning journeys designed for different experience levels and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard className="p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Beginner Investor Path
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your journey with the basics of treasury investing and platform navigation.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Understanding Treasury Securities
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Platform Tutorial
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                First Investment Guide
              </div>
            </div>
            <AnimatedButton variant="primary" className="w-full">
              Start Learning
            </AnimatedButton>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border hover:shadow-lg transition-shadow" delay={100}>
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Advanced Trading Path
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Master advanced trading strategies and market analysis techniques.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Advanced Bidding Strategies
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Yield Curve Analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Portfolio Optimization
              </div>
            </div>
            <AnimatedButton variant="primary" className="w-full">
              Explore Advanced Topics
            </AnimatedButton>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border hover:shadow-lg transition-shadow" delay={200}>
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Risk Management Path
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn comprehensive risk management strategies for treasury investments.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                Risk Assessment Tools
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                Diversification Strategies
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                Regulatory Compliance
              </div>
            </div>
            <AnimatedButton variant="primary" className="w-full">
              Learn Risk Management
            </AnimatedButton>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
