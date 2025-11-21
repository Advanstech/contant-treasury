'use client';

import { Calendar, Clock, ArrowRight, TrendingUp, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { PageTitle, SectionTitle, CardTitle } from '@/components/ui/PageTitle';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Ghana's Treasury Bill Market",
      excerpt: "A comprehensive guide to investing in Ghana's T-Bills, including rates, tenors, and strategies for maximizing returns.",
      author: "Constant Capital Research Team",
      date: "2025-11-08",
      readTime: "5 min read",
      category: "Investment Guide",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Q4 2024 Market Outlook: Government Securities",
      excerpt: "Analysis of market trends and expectations for Ghana's government securities market in the fourth quarter.",
      author: "Investment Analytics Team",
      date: "2025-11-05",
      readTime: "8 min read",
      category: "Market Analysis",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Digital Transformation in Ghana's Financial Markets",
      excerpt: "How technology is revolutionizing government securities trading and what it means for investors.",
      author: "Fintech Team",
      date: "2025-11-01",
      readTime: "6 min read",
      category: "Technology",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Risk Management Strategies for Bond Investors",
      excerpt: "Essential strategies for managing risk when investing in government bonds and treasury bills.",
      author: "Risk Management Team",
      date: "2025-10-28",
      readTime: "7 min read",
      category: "Risk Management",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Understanding Yield Curves and Investment Implications",
      excerpt: "Deep dive into yield curve analysis and how it affects your investment decisions in government securities.",
      author: "Fixed Income Team",
      date: "2025-10-25",
      readTime: "10 min read",
      category: "Education",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Central Bank Policy Impact on Treasury Securities",
      excerpt: "How Bank of Ghana policies influence treasury bill and bond yields, and what investors should watch for.",
      author: "Economic Research Team",
      date: "2025-10-22",
      readTime: "9 min read",
      category: "Economics",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["All", "Investment Guide", "Market Analysis", "Technology", "Risk Management", "Education", "Economics"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <PageTitle subtitle="Insights, analysis, and market updates from Constant Capital's experts">
              Market Insights & Research
            </PageTitle>
            <p className="text-lg text-muted-foreground mt-6">
              Stay informed with our latest research on Ghana's government securities market, 
              investment strategies, and financial market trends.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        <div className="mb-12">
          <SectionTitle>Featured Article</SectionTitle>
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-lg p-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {blogPosts[0].date}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    By {blogPosts[0].author}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                <Link 
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Featured Image</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-muted h-48 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Article Image</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>By {post.author.split(' ')[0]}</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-lg p-8 text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <SectionTitle>Stay Updated</SectionTitle>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest market insights and investment research delivered directly to your inbox.
            Join our community of informed investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
