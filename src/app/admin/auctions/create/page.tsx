'use client';

import { useState } from 'react';
import { Calendar, DollarSign, FileText, Upload, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/admin-api';
import type { CreateAuctionDto } from '@/lib/admin-api';

export default function CreateAuctionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    securityType: 'TREASURY_BILL',
    securityCode: '',
    securityName: '',
    tenor: '91',
    biddingOpenDate: '',
    biddingCloseDate: '',
    settlementDate: '',
    minBidAmount: '100',
    maxBidAmount: '',
    targetAmount: '',
    description: '',
  });

  const [uploadMode, setUploadMode] = useState<'manual' | 'csv'>('manual');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create auction mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAuctionDto) => adminApi.auctions.create(data),
    onSuccess: (data) => {
      toast.success('Auction created successfully!', {
        description: `Auction ${data.auctionCode} has been scheduled.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'auctions'] });
      router.push('/admin/auctions');
    },
    onError: (error: any) => {
      toast.error('Failed to create auction', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.securityCode.trim()) {
      newErrors.securityCode = 'Security code is required';
    }
    if (!formData.securityName.trim()) {
      newErrors.securityName = 'Security name is required';
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    if (!formData.biddingOpenDate) {
      newErrors.biddingOpenDate = 'Bidding open date is required';
    }
    if (!formData.biddingCloseDate) {
      newErrors.biddingCloseDate = 'Bidding close date is required';
    }
    if (!formData.settlementDate) {
      newErrors.settlementDate = 'Settlement date is required';
    }

    // Validate date logic
    if (formData.biddingOpenDate && formData.biddingCloseDate) {
      if (new Date(formData.biddingCloseDate) <= new Date(formData.biddingOpenDate)) {
        newErrors.biddingCloseDate = 'Close date must be after open date';
      }
    }
    if (formData.biddingCloseDate && formData.settlementDate) {
      if (new Date(formData.settlementDate) <= new Date(formData.biddingCloseDate)) {
        newErrors.settlementDate = 'Settlement date must be after close date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    const auctionData: CreateAuctionDto = {
      auctionCode: formData.securityCode,
      auctionType: formData.securityType as any,
      securityName: formData.securityName,
      tenor: Number(formData.tenor),
      targetAmount: Number(formData.targetAmount),
      minimumBid: Number(formData.minBidAmount),
      maximumBid: formData.maxBidAmount ? Number(formData.maxBidAmount) : undefined,
      biddingOpenDate: formData.biddingOpenDate,
      biddingCloseDate: formData.biddingCloseDate,
      settlementDate: formData.settlementDate,
      description: formData.description || undefined,
      mode: 'MANUAL',
    };

    createMutation.mutate(auctionData);
  };

  // CSV upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => adminApi.auctions.bulkUpload(file, 'MANUAL'),
    onSuccess: (data) => {
      toast.success('Auctions uploaded successfully!', {
        description: `${data.count} auctions have been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'auctions'] });
      router.push('/admin/auctions');
    },
    onError: (error: any) => {
      toast.error('Failed to upload CSV', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Invalid file type', {
        description: 'Please upload a CSV file',
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const filledFields = Object.keys(formData).filter(key => formData[key as keyof typeof formData]).length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-8 px-6 lg:px-12 py-8">
        <div className="w-full min-w-0">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Admin
            </Link>
            <span>/</span>
            <Link href="/admin/auctions" className="hover:text-foreground transition-colors">
              Auctions
            </Link>
            <span>/</span>
            <span className="text-foreground">Create</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Auction</h1>
              <p className="text-muted-foreground">
                Schedule a new Treasury auction or upload auction calendar from Bank of Ghana
              </p>
            </div>
            <Link
              href="/admin/auctions"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Auctions
            </Link>
          </div>
        </div>

        {/* Mode Toggle - Enhanced */}
        <div className="mb-8">
          <div className="inline-flex gap-1 p-1 bg-muted/50 border border-border rounded-lg">
            <button
              onClick={() => setUploadMode('manual')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                uploadMode === 'manual'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <FileText className="w-4 h-4" />
              Manual Entry
            </button>
            <button
              onClick={() => setUploadMode('csv')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                uploadMode === 'csv'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <Upload className="w-4 h-4" />
              CSV Upload
            </button>
          </div>
        </div>

        {uploadMode === 'manual' ? (
          /* Manual Entry Form - Enhanced */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Indicator */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Form Progress</span>
                <span className="text-sm font-medium text-primary">
                  {filledFields} / {totalFields} fields
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(filledFields / totalFields) * 100}%` }}
                />
              </div>
            </div>

            {/* Security Details - Enhanced */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-8 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  Security Details
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Define the treasury security being auctioned</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Security Type
                    </label>
                    <select
                      value={formData.securityType}
                      onChange={(e) =>
                        setFormData({ ...formData, securityType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 pr-10 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="TREASURY_BILL">Treasury Bill</option>
                      <option value="TREASURY_BOND">Treasury Bond</option>
                      <option value="FIXED_RATE_BOND">Fixed Rate Bond</option>
                      <option value="SAVINGS_BOND">Savings Bond</option>
                    </select>
                  </div>
                  <div className="min-w-0 pr-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Tenor (Days)
                    </label>
                    <select
                      value={formData.tenor}
                      onChange={(e) => setFormData({ ...formData, tenor: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="91">91 Days</option>
                      <option value="182">182 Days</option>
                      <option value="364">364 Days</option>
                      <option value="730">2 Years (730 Days)</option>
                      <option value="1095">3 Years (1095 Days)</option>
                      <option value="1825">5 Years (1825 Days)</option>
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Auction Code <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.securityCode}
                      onChange={(e) => {
                        setFormData({ ...formData, securityCode: e.target.value });
                        if (errors.securityCode) setErrors({ ...errors, securityCode: '' });
                      }}
                      placeholder="e.g., AUC-2025-001"
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.securityCode ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.securityCode && (
                      <p className="text-destructive text-sm mt-1">{errors.securityCode}</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Security Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.securityName}
                      onChange={(e) => {
                        setFormData({ ...formData, securityName: e.target.value });
                        if (errors.securityName) setErrors({ ...errors, securityName: '' });
                      }}
                      placeholder="e.g., 91-Day Treasury Bill"
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.securityName ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.securityName && (
                      <p className="text-destructive text-sm mt-1">{errors.securityName}</p>
                    )}
                  </div>
                  <div className="min-w-0 md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Target Amount (GHS) <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => {
                        setFormData({ ...formData, targetAmount: e.target.value });
                        if (errors.targetAmount) setErrors({ ...errors, targetAmount: '' });
                      }}
                      placeholder="e.g., 1000000"
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.targetAmount ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.targetAmount && (
                      <p className="text-destructive text-sm mt-1">{errors.targetAmount}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Auction Schedule - Enhanced */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-8 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  Auction Schedule
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Set bidding and settlement dates</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Bidding Open Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.biddingOpenDate}
                      onChange={(e) => {
                        setFormData({ ...formData, biddingOpenDate: e.target.value });
                        if (errors.biddingOpenDate) setErrors({ ...errors, biddingOpenDate: '' });
                      }}
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.biddingOpenDate ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.biddingOpenDate && (
                      <p className="text-destructive text-sm mt-1">{errors.biddingOpenDate}</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Bidding Close Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.biddingCloseDate}
                      onChange={(e) => {
                        setFormData({ ...formData, biddingCloseDate: e.target.value });
                        if (errors.biddingCloseDate) setErrors({ ...errors, biddingCloseDate: '' });
                      }}
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.biddingCloseDate ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.biddingCloseDate && (
                      <p className="text-destructive text-sm mt-1">{errors.biddingCloseDate}</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Settlement Date <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.settlementDate}
                      onChange={(e) => {
                        setFormData({ ...formData, settlementDate: e.target.value });
                        if (errors.settlementDate) setErrors({ ...errors, settlementDate: '' });
                      }}
                      className={`w-full px-4 py-2.5 bg-card border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.settlementDate ? 'border-destructive' : 'border-border'
                      }`}
                    />
                    {errors.settlementDate && (
                      <p className="text-destructive text-sm mt-1">{errors.settlementDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Limits - Enhanced */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-8 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  Bid Limits
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Configure minimum and maximum bid amounts</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Minimum Bid Amount (GHS)
                    </label>
                    <input
                      type="number"
                      value={formData.minBidAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, minBidAmount: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Maximum Bid Amount (GHS)
                      <span className="text-muted-foreground ml-1">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxBidAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, maxBidAmount: e.target.value })
                      }
                      placeholder="No limit"
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description - Enhanced */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-muted/50 px-8 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Additional Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Optional notes or special instructions</p>
              </div>
              <div className="px-10 py-8">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Additional information about this auction..."
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Actions - Enhanced */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 px-6 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Auction...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Auction
                  </>
                )}
              </button>
              <Link
                href="/admin/auctions"
                className="px-8 py-3.5 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors border border-border"
              >
                Cancel
              </Link>
            </div>
          </form>
        ) : (
          /* CSV Upload - Enhanced */
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-12 text-center border-b border-border">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-lg">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Upload Auction Calendar
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Bulk upload multiple auction schedules from Bank of Ghana using a CSV file
              </p>
              <div className="max-w-sm mx-auto">
                <label className="block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    disabled={uploadMutation.isPending}
                    className="hidden"
                  />
                  <div className={`px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-3 shadow-md hover:shadow-lg ${
                    uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Choose CSV File
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-500 mb-2">CSV File Format</p>
                    <code className="text-xs text-muted-foreground block bg-background/50 p-3 rounded border border-border">
                      security_code,security_type,tenor,auction_date,settlement_date,issue_amount,min_bid,max_bid
                    </code>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">Bulk Upload</p>
                  <p className="text-xs text-muted-foreground">Upload multiple auctions at once</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">BoG Format</p>
                  <p className="text-xs text-muted-foreground">Compatible with Bank of Ghana exports</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">Auto-Validation</p>
                  <p className="text-xs text-muted-foreground">Automatic data validation and error checking</p>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        {/* Preview Section - Right Side */}
        <div className="hidden lg:block">
          <div className="sticky top-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Auction Preview</h3>
            <p className="text-sm text-muted-foreground">Preview will appear here as you fill the form</p>
          </div>
        </div>
      </div>
    </div>
  );
}
