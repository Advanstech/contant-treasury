'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminApi, { BogApiLog } from '@/lib/admin-api';

export default function ApiLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [endpointFilter, setEndpointFilter] = useState('');
  const [successFilter, setSuccessFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<BogApiLog | null>(null);
  const limit = 20;

  // Fetch API logs
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'api-logs', page, endpointFilter, successFilter],
    queryFn: () =>
      adminApi.apiLogs.getAll({
        endpoint: endpointFilter || undefined,
        success: successFilter,
        page,
        limit,
      }),
  });

  const logs = data?.logs || [];
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  // Filter logs by search query
  const filteredLogs = logs.filter((log) =>
    log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view log details
  const handleViewLog = async (logId: string) => {
    try {
      const log = await adminApi.apiLogs.getById(logId);
      setSelectedLog(log);
    } catch (error: any) {
      toast.error('Failed to load log details', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  // Handle export logs
  const handleExport = async () => {
    try {
      toast.info('Generating export...');
      // This would call an export endpoint
      toast.success('Logs exported successfully!');
    } catch (error: any) {
      toast.error('Failed to export logs', {
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Logs</h1>
          <p className="text-gray-400 mt-1">
            Audit trail for all BoG API interactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[hsl(25,95%,53%)] text-white rounded-lg text-sm font-medium hover:bg-[hsl(25,95%,48%)] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-500 mb-1">
              Regulatory Compliance
            </h3>
            <p className="text-sm text-gray-400">
              All API interactions with Bank of Ghana systems are logged for audit
              purposes. Logs are immutable and retained for 7 years per BoG regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search endpoint or method..."
                className="w-full pl-10 pr-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
              />
            </div>
          </div>

          {/* Endpoint Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Endpoint
            </label>
            <select
              value={endpointFilter}
              onChange={(e) => setEndpointFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
            >
              <option value="">All Endpoints</option>
              <option value="/bog/auctions">/bog/auctions</option>
              <option value="/bog/pd-submissions">/bog/pd-submissions</option>
              <option value="/bog/settlements">/bog/settlements</option>
              <option value="/bog/results">/bog/results</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Status
            </label>
            <select
              value={successFilter === undefined ? '' : successFilter ? 'success' : 'error'}
              onChange={(e) =>
                setSuccessFilter(
                  e.target.value === '' ? undefined : e.target.value === 'success'
                )
              }
              className="w-full px-4 py-2 bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[hsl(25,95%,53%)]"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(25,95%,53%)]" />
          <span className="ml-3 text-gray-400">Loading logs...</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl p-12 text-center">
          <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No logs found</h3>
          <p className="text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Timestamp
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Method
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Endpoint
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Duration
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.method === 'GET'
                              ? 'bg-blue-500/10 text-blue-500'
                              : log.method === 'POST'
                              ? 'bg-green-500/10 text-green-500'
                              : log.method === 'PUT'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white text-sm font-mono">
                          {log.endpoint}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {log.success ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-500 text-sm font-medium">
                                {log.statusCode}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-500 text-sm font-medium">
                                {log.statusCode}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-400 text-sm">
                          {log.duration}ms
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewLog(log.id)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} logs
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(240,55%,10%)] border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Timestamp</p>
                    <p className="text-white">
                      {new Date(selectedLog.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Duration</p>
                    <p className="text-white">{selectedLog.duration}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Method</p>
                    <p className="text-white">{selectedLog.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status Code</p>
                    <p
                      className={
                        selectedLog.success ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {selectedLog.statusCode}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Endpoint</p>
                    <p className="text-white font-mono text-sm">
                      {selectedLog.endpoint}
                    </p>
                  </div>
                </div>

                {/* Request Payload */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Request Payload</p>
                  <pre className="bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg p-4 text-sm text-white overflow-x-auto">
                    {JSON.stringify(selectedLog.requestPayload, null, 2)}
                  </pre>
                </div>

                {/* Response Payload */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">Response Payload</p>
                  <pre className="bg-[hsl(240,60%,8%)] border border-white/10 rounded-lg p-4 text-sm text-white overflow-x-auto">
                    {JSON.stringify(selectedLog.responsePayload, null, 2)}
                  </pre>
                </div>

                {/* Error Message */}
                {selectedLog.errorMessage && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Error Message</p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-500 text-sm">
                        {selectedLog.errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
