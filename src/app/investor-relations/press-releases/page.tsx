'use client';

import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Download, 
  Calendar, 
  Filter,
  Search,
  Eye,
  Share2,
  ExternalLink,
  TrendingUp,
  Building2,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface PressRelease {
  id: string;
  title: string;
  category: 'COMPANY_NEWS' | 'PRODUCT' | 'PARTNERSHIP' | 'FINANCIAL' | 'REGULATORY' | 'AWARDS' | 'APPOINTMENTS';
  publishDate: string;
  author: string;
  summary: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  downloadUrl?: string;
  externalUrl?: string;
  views: number;
  readTime: number;
}

interface NewsFilter {
  category: string;
  year: string;
  featured: string;
  search: string;
}

export default function PressReleasesPage() {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<NewsFilter>({
    category: '',
    year: '',
    featured: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    setLoading(true);
    try {
      // Mock press releases data
      const mockReleases: PressRelease[] = [
        {
          id: '1',
          title: 'Constant Treasury Achieves Record ₵2.5B Assets Under Management',
          category: 'FINANCIAL',
          publishDate: '2025-11-15',
          author: 'Investor Relations Team',
          summary: 'Constant Treasury announces milestone achievement of ₵2.5 billion in assets under management, solidifying position as Ghana\'s leading digital trading platform.',
          content: 'Constant Treasury, Ghana\'s premier digital platform for government securities trading, today announced a significant milestone with assets under management (AUM) reaching ₵2.5 billion. This achievement represents a 45% year-over-year growth and demonstrates the platform\'s strong market position and investor confidence.',
          imageUrl: '/api/placeholder/600/400',
          tags: ['AUM', 'Growth', 'Milestone', 'Digital Trading'],
          featured: true,
          downloadUrl: '#',
          views: 2540,
          readTime: 3
        },
        {
          id: '2',
          title: 'Partnership with Ghana Commercial Bank Enhances Treasury Market Access',
          category: 'PARTNERSHIP',
          publishDate: '2025-11-10',
          author: 'Business Development',
          summary: 'Strategic partnership with Ghana Commercial Bank to provide seamless integration for corporate and institutional clients accessing treasury markets.',
          content: 'Constant Treasury has announced a strategic partnership with Ghana Commercial Bank (GCB) to enhance market access for corporate and institutional clients. This integration will provide GCB clients with direct access to government securities through Constant Treasury\'s digital platform.',
          tags: ['Partnership', 'GCB', 'Banking', 'Integration'],
          featured: true,
          downloadUrl: '#',
          views: 1890,
          readTime: 4
        },
        {
          id: '3',
          title: 'Launch of Mobile Trading App Revolutionizes Treasury Market Access',
          category: 'PRODUCT',
          publishDate: '2025-11-05',
          author: 'Product Team',
          summary: 'New mobile application enables on-the-go trading of government securities with advanced features and real-time market data.',
          content: 'Constant Treasury has launched its revolutionary mobile trading application, bringing the full power of Ghana\'s treasury markets to investors\' fingertips. The app features real-time market data, advanced charting, and instant trade execution capabilities.',
          tags: ['Mobile App', 'Trading', 'Innovation', 'Technology'],
          featured: true,
          downloadUrl: '#',
          views: 3120,
          readTime: 3
        },
        {
          id: '4',
          title: 'SEC Ghana Approves Constant Treasury\'s Enhanced Risk Management Framework',
          category: 'REGULATORY',
          publishDate: '2025-10-28',
          author: 'Compliance Team',
          summary: 'Securities and Exchange Commission Ghana grants approval for Constant Treasury\'s comprehensive risk management and compliance framework.',
          content: 'The Securities and Exchange Commission (SEC) Ghana has approved Constant Treasury\'s enhanced risk management framework, setting new standards for digital trading platforms in the country. The approval follows rigorous review of the platform\'s security measures and investor protection protocols.',
          tags: ['SEC', 'Compliance', 'Risk Management', 'Regulation'],
          featured: false,
          downloadUrl: '#',
          views: 1450,
          readTime: 5
        },
        {
          id: '5',
          title: 'Constant Treasury Wins Fintech Innovation Award 2025',
          category: 'AWARDS',
          publishDate: '2025-10-20',
          author: 'Marketing Team',
          summary: 'Recognized for excellence in financial technology innovation at the Ghana Fintech Awards 2025.',
          content: 'Constant Treasury has been honored with the prestigious Fintech Innovation Award at the Ghana Fintech Awards 2025. The award recognizes the platform\'s groundbreaking approach to democratizing access to government securities trading.',
          tags: ['Awards', 'Innovation', 'Fintech', 'Recognition'],
          featured: false,
          downloadUrl: '#',
          views: 980,
          readTime: 2
        },
        {
          id: '6',
          title: 'Appointment of New Chief Technology Officer to Drive Digital Innovation',
          category: 'APPOINTMENTS',
          publishDate: '2025-10-15',
          author: 'HR Team',
          summary: 'Technology industry veteran joins executive team to lead digital transformation and platform enhancement initiatives.',
          content: 'Constant Treasury announces the appointment of Dr. Kwame Asante as Chief Technology Officer. Dr. Asante brings over 15 years of experience in financial technology and will lead the company\'s digital transformation initiatives.',
          tags: ['Appointment', 'Leadership', 'Technology', 'Executive'],
          featured: false,
          downloadUrl: '#',
          views: 760,
          readTime: 3
        },
        {
          id: '7',
          title: 'Q3 2025 Results Show 45% Revenue Growth to ₵125 Million',
          category: 'FINANCIAL',
          publishDate: '2025-10-30',
          author: 'Investor Relations Team',
          summary: 'Strong third quarter performance driven by increased user adoption and trading volume growth across all segments.',
          content: 'Constant Treasury reported strong Q3 2025 financial results with revenue reaching ₵125 million, representing 45% year-over-year growth. The performance was driven by significant user adoption and increased trading volumes across both retail and institutional segments.',
          tags: ['Q3 Results', 'Revenue', 'Growth', 'Financial Performance'],
          featured: true,
          downloadUrl: '#',
          views: 2100,
          readTime: 4
        },
        {
          id: '8',
          title: 'Expansion to Secondary Market Trading Receives BoG Approval',
          category: 'REGULATORY',
          publishDate: '2025-09-25',
          author: 'Regulatory Affairs',
          summary: 'Bank of Ghana grants approval for Constant Treasury to expand into secondary market trading of government securities.',
          content: 'The Bank of Ghana has granted regulatory approval for Constant Treasury to expand its services to include secondary market trading of government securities. This expansion will provide investors with enhanced liquidity and trading opportunities.',
          tags: ['BoG', 'Secondary Market', 'Regulation', 'Expansion'],
          featured: false,
          downloadUrl: '#',
          views: 1680,
          readTime: 3
        },
        {
          id: '9',
          title: 'New Educational Platform Launches to Promote Financial Literacy',
          category: 'PRODUCT',
          publishDate: '2025-09-20',
          author: 'Education Team',
          summary: 'Comprehensive educational platform launched to help investors understand treasury markets and make informed investment decisions.',
          content: 'Constant Treasury has launched a comprehensive educational platform designed to promote financial literacy and help investors make informed decisions in the treasury markets. The platform includes tutorials, webinars, and market analysis resources.',
          tags: ['Education', 'Financial Literacy', 'Investors', 'Resources'],
          featured: false,
          downloadUrl: '#',
          views: 890,
          readTime: 3
        },
        {
          id: '10',
          title: 'Partnership with University of Ghana Promotes Fintech Education',
          category: 'PARTNERSHIP',
          publishDate: '2025-09-15',
          author: 'Corporate Social Responsibility',
          summary: 'Collaboration with University of Ghana to support fintech education and research programs for the next generation of financial professionals.',
          content: 'Constant Treasury has announced a strategic partnership with the University of Ghana to support fintech education and research programs. The collaboration includes scholarships, internships, and joint research initiatives.',
          tags: ['Education Partnership', 'University of Ghana', 'CSR', 'Fintech Education'],
          featured: false,
          downloadUrl: '#',
          views: 650,
          readTime: 2
        }
      ];
      setReleases(mockReleases);
    } catch (error) {
      console.error('Failed to fetch press releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReleases = releases.filter(release => {
    const matchesCategory = !filters.category || release.category === filters.category;
    const matchesYear = !filters.year || new Date(release.publishDate).getFullYear().toString() === filters.year;
    const matchesFeatured = !filters.featured || 
      (filters.featured === 'featured' && release.featured) ||
      (filters.featured === 'regular' && !release.featured);
    const matchesSearch = !filters.search || 
      release.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      release.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
      release.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesCategory && matchesYear && matchesFeatured && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReleases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReleases = filteredReleases.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'COMPANY_NEWS': return 'Company News';
      case 'PRODUCT': return 'Product';
      case 'PARTNERSHIP': return 'Partnership';
      case 'FINANCIAL': return 'Financial';
      case 'REGULATORY': return 'Regulatory';
      case 'AWARDS': return 'Awards';
      case 'APPOINTMENTS': return 'Appointments';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPANY_NEWS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PRODUCT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PARTNERSHIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'FINANCIAL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'REGULATORY': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'AWARDS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'APPOINTMENTS': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'COMPANY_NEWS': return <Building2 className="h-4 w-4" />;
      case 'PRODUCT': return <TrendingUp className="h-4 w-4" />;
      case 'PARTNERSHIP': return <Users className="h-4 w-4" />;
      case 'FINANCIAL': return <TrendingUp className="h-4 w-4" />;
      case 'REGULATORY': return <Award className="h-4 w-4" />;
      case 'AWARDS': return <Award className="h-4 w-4" />;
      case 'APPOINTMENTS': return <Users className="h-4 w-4" />;
      default: return <Newspaper className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (release: PressRelease) => {
    console.log('Downloading press release:', release.title);
  };

  const handleShare = (release: PressRelease) => {
    console.log('Sharing press release:', release.title);
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: release.title,
        text: release.summary,
        url: window.location.href
      });
    }
  };

  const categories = [...new Set(releases.map(r => r.category))];
  const years = [...new Set(releases.map(r => new Date(r.publishDate).getFullYear()))].sort((a, b) => b - a);

  const featuredReleases = releases.filter(r => r.featured).slice(0, 3);
  const totalViews = releases.reduce((sum, r) => sum + r.views, 0);
  const averageReadTime = Math.round(releases.reduce((sum, r) => sum + r.readTime, 0) / releases.length);

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
                Press Releases & News
              </h1>
              <p className="text-muted-foreground">
                Stay updated with our latest announcements, partnerships, and company news
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Subscribe to Updates
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Releases */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured News</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredReleases.map((release, index) => (
              <AnimatedCard 
                key={release.id}
                className="overflow-hidden border border-border hover:shadow-xl transition-shadow"
                delay={index * 100}
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Newspaper className="h-16 w-16 text-primary/50" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(release.category)}`}>
                      {getCategoryIcon(release.category)}
                      {getCategoryLabel(release.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatShortDate(release.publishDate)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {release.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {release.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {release.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {release.readTime} min read
                      </span>
                    </div>
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedRelease(release)}
                    >
                      Read More
                    </AnimatedButton>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* News Statistics */}
      <div className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedCard className="p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Releases</p>
                  <p className="text-2xl font-bold text-foreground">{releases.length}</p>
                  <p className="text-sm text-muted-foreground">This year</p>
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
                  <p className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+25% this month</p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border border-border" delay={200}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Read Time</p>
                  <p className="text-2xl font-bold text-foreground">{averageReadTime} min</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border border-border" delay={300}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Topics covered</p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/30 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search news..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{getCategoryLabel(category)}</option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={filters.featured}
              onChange={(e) => setFilters({...filters, featured: e.target.value})}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All News</option>
              <option value="featured">Featured Only</option>
              <option value="regular">Regular News</option>
            </select>
            <AnimatedButton 
              variant="outline" 
              onClick={() => setFilters({category: '', year: '', featured: '', search: ''})}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            All News ({filteredReleases.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading press releases...</p>
          </div>
        ) : paginatedReleases.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No news found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new announcements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReleases.map((release, index) => (
              <AnimatedCard 
                key={release.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 50}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(release.category)}`}>
                    {getCategoryIcon(release.category)}
                    {getCategoryLabel(release.category)}
                  </span>
                  {release.featured && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {release.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {release.summary}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatShortDate(release.publishDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {release.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {release.readTime} min
                  </div>
                </div>

                {release.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {release.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedRelease(release)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Read
                  </AnimatedButton>
                  {release.downloadUrl && (
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(release)}
                    >
                      <Download className="h-3 w-3" />
                    </AnimatedButton>
                  )}
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShare(release)}
                  >
                    <Share2 className="h-3 w-3" />
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-accent border border-border'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-border rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Press Release Detail Modal */}
      {selectedRelease && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl border border-border max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(selectedRelease.category)}`}>
                      {getCategoryIcon(selectedRelease.category)}
                      {getCategoryLabel(selectedRelease.category)}
                    </span>
                    {selectedRelease.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {selectedRelease.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {selectedRelease.author}</span>
                    <span>{formatDate(selectedRelease.publishDate)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedRelease.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {selectedRelease.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRelease(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-lg text-muted-foreground mb-6">
                  {selectedRelease.summary}
                </p>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed mb-4">
                    {selectedRelease.content}
                  </p>
                </div>
              </div>

              {selectedRelease.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRelease.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Published on {formatDate(selectedRelease.publishDate)}
                </div>
                <div className="flex items-center gap-3">
                  <AnimatedButton variant="outline" onClick={() => setSelectedRelease(null)}>
                    Close
                  </AnimatedButton>
                  {selectedRelease.downloadUrl && (
                    <AnimatedButton variant="outline" onClick={() => handleDownload(selectedRelease)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </AnimatedButton>
                  )}
                  <AnimatedButton variant="primary" onClick={() => handleShare(selectedRelease)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
