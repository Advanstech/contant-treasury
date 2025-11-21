'use client';

import { useState } from 'react';
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';

export default function CsdFilesPage() {
  const queryClient = useQueryClient();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  // Fetch settlement batches
  const { data: batchesData, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settlements', 'batches'],
    queryFn: () => adminApi.settlements.getBatches(),
  });

  const csdBatches = batchesData?.batches || [];

  // Calculate stats
  const stats = {
    pending: csdBatches.filter(b => b.status === 'PENDING').length,
    sent: csdBatches.filter(b => b.status === 'SENT').length,
    confirmed: csdBatches.filter(b => b.status === 'CONFIRMED').length,
    totalAmount: csdBatches.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  // Generate CSD file mutation
  const generateFileMutation = useMutation({
    mutationFn: (batchId: string) => adminApi.settlements.generateCsdFile(batchId),
    onSuccess: (data, batchId) => {
      toast.success('CSD file generated successfully!', {
        description: 'File is ready for download.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settlements'] });
    },
    onError: (error: any) => {
      toast.error('Failed to generate file', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const handleGenerateFile = async (batchId: string) => {
    generateFileMutation.mutate(batchId);
  };

  // Upload to CSD SFTP mutation
  const uploadMutation = useMutation({
    mutationFn: (batchId: string) => adminApi.settlements.uploadToCsd(batchId),
    onSuccess: (data, batchId) => {
      toast.success('File uploaded to CSD successfully!', {
        description: 'Settlement batch has been sent to Ghana CSD.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settlements'] });
    },
    onError: (error: any) => {
      toast.error('Failed to upload to CSD', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const handleUploadToSftp = async (batchId: string) => {
    uploadMutation.mutate(batchId);
  };

  // Download file
  const downloadMutation = useMutation({
    mutationFn: (batchId: string) => adminApi.settlements.downloadCsdFile(batchId),
    onSuccess: (blob, batchId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `csd-settlement-${batchId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('File downloaded successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to download file', {
        description: error.response?.data?.message || 'An error occurred',
      });
    },
  });

  const handleDownloadFile = async (batchId: string) => {
    downloadMutation.mutate(batchId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SENT':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'CONFIRMED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'SENT':
        return <Send className="w-4 h-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">CSD Settlement Files</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage settlement batch files for Ghana CSD
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 border border-border transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Pending Upload</p>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Sent to CSD</p>
          <p className="text-2xl font-bold text-foreground">{stats.sent}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-foreground">GHS {(stats.totalAmount / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Batch List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Settlement Batches</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading batches...</span>
          </div>
        ) : csdBatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No settlement batches found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {csdBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() =>
                setSelectedBatch(selectedBatch === batch.id ? null : batch.id)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {batch.batchCode}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {getStatusIcon(batch.status)}
                      {batch.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Auction: {batch.auction?.auctionCode || 'N/A'}</span>
                    <span>•</span>
                    <span>{batch.totalInstructions} instructions</span>
                    <span>•</span>
                    <span>GHS {(batch.totalAmount / 1000000).toFixed(2)}M</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {batch.status === 'PENDING' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateFile(batch.id);
                        }}
                        disabled={generateFileMutation.isPending || batch.csdFileGenerated}
                        className="px-3 py-2 bg-blue-600/10 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generateFileMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {batch.csdFileGenerated ? 'Generated' : 'Generate'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUploadToSftp(batch.id);
                        }}
                        disabled={uploadMutation.isPending || !batch.csdFileGenerated}
                        className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Upload to CSD
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile(batch.id);
                    }}
                    disabled={downloadMutation.isPending || !batch.csdFileGenerated}
                    className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedBatch === batch.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Created</p>
                      <p className="text-foreground">{new Date(batch.createdAt).toLocaleString()}</p>
                    </div>
                    {batch.sentToCsdAt && (
                      <div>
                        <p className="text-muted-foreground mb-1">Sent to CSD</p>
                        <p className="text-foreground">{new Date(batch.sentToCsdAt).toLocaleString()}</p>
                      </div>
                    )}
                    {batch.confirmedAt && (
                      <div>
                        <p className="text-muted-foreground mb-1">Confirmed</p>
                        <p className="text-foreground">{new Date(batch.confirmedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {batch.csdFilePath && (
                      <div>
                        <p className="text-muted-foreground mb-1">File Path</p>
                        <p className="text-foreground text-xs font-mono truncate">{batch.csdFilePath}</p>
                      </div>
                    )}
                  </div>

                  {/* CSV File Info */}
                  {batch.csdFileGenerated && (
                    <div className="bg-muted border border-border rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        CSD File Information
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• File format: CSV (Ghana CSD specification)</p>
                        <p>• Total instructions: {batch.totalInstructions}</p>
                        <p>• Total amount: GHS {batch.totalAmount.toLocaleString()}</p>
                        <p>• Status: {batch.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            ))}
          </div>
        )}
      </div>

      {/* SFTP Configuration */}
      <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">CSD SFTP Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">SFTP Host</p>
            <p className="text-white font-mono text-sm">sftp.csd.com.gh</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Connection Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-green-500 text-sm">Connected</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Last Upload</p>
            <p className="text-white text-sm">2025-11-10 16:25</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Batch Cutoff Time</p>
            <p className="text-white text-sm">4:20 PM daily</p>
          </div>
        </div>
      </div>
    </div>
  );
}
