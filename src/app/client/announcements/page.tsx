'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Download, 
  ExternalLink,
  Filter,
  Search,
  Clock
} from 'lucide-react';
import announcementsData from '@/data/bog-announcements.json';

interface BogAnnouncement {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  summary: string;
  content: string;
  attachmentUrl: string;
}

export default function AnnouncementsPage() {
  const [announcements] = useState<BogAnnouncement[]>(announcementsData.announcements);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<BogAnnouncement | null>(null);

  const categories = [
    { value: 'all', label: 'All Announcements', color: 'bg-gray-100 text-gray-800' },
    { value: 'AUCTION_NOTICE', label: 'Auction Notices', color: 'bg-blue-100 text-blue-800' },
    { value: 'AUCTION_RESULTS', label: 'Auction Results', color: 'bg-green-100 text-green-800' },
    { value: 'POLICY', label: 'Policy Updates', color: 'bg-purple-100 text-purple-800' },
    { value: 'GENERAL', label: 'General', color: 'bg-gray-100 text-gray-800' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AUCTION_NOTICE':
        return <Calendar className="w-4 h-4" />;
      case 'AUCTION_RESULTS':
        return <TrendingUp className="w-4 h-4" />;
      case 'POLICY':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : categories[0].color;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      timeZone: 'Africa/Accra',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      timeZone: 'Africa/Accra',
      dateStyle: 'medium',
    });
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BOG Announcements</h1>
          <p className="text-gray-600">
            Stay updated with the latest Bank of Ghana treasury securities announcements and auction results
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search announcements..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.value
                      ? category.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category.value)}
                  <span className="ml-2">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(announcement.category)}`}>
                      {getCategoryIcon(announcement.category)}
                      {categories.find(c => c.value === announcement.category)?.label}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(announcement.publishDate)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {announcement.summary}
                  </p>
                </div>
                <div className="ml-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Published on {formatDateTime(announcement.publishDate)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(announcement.attachmentUrl, '_blank');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedAnnouncements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No announcements are available at this time'
              }
            </p>
          </div>
        )}

        {/* Announcement Detail Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedAnnouncement.category)}`}>
                        {getCategoryIcon(selectedAnnouncement.category)}
                        {categories.find(c => c.value === selectedAnnouncement.category)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(selectedAnnouncement.publishDate)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAnnouncement.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedAnnouncement.content}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Official Document</h4>
                      <p className="text-sm text-gray-600">
                        Download the original Bank of Ghana announcement PDF
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(selectedAnnouncement.attachmentUrl, '_blank')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
