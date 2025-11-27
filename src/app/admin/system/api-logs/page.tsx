'use client';

import { useState, useEffect } from 'react';
import { Activity, Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Clock, Globe, User, Calendar, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  requestSize: number;
  responseSize: number;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
  error?: string;
  payload?: string;
}

interface FilterState {
  dateRange: 'today' | '7days' | '30days' | 'custom';
  startDate?: string;
  endDate?: string;
  method: string;
  statusCode: string;
  status: string;
  search: string;
}

export default function ApiLogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    method: '',
    statusCode: '',
    status: '',
    search: ''
  });
  const [showPayload, setShowPayload] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  // Mock data generator
  const generateMockLogs = (): ApiLog[] => {
    const endpoints = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auctions',
      '/api/v1/bids',
      '/api/v1/portfolio',
      '/api/v1/kyc/submit',
      '/api/v1/admin/users',
      '/api/v1/admin/auctions/create'
    ];
    
    const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const statusCodes = [200, 201, 400, 401, 403, 404, 500, 502, 503];
    const statuses: Array<'SUCCESS' | 'ERROR' | 'TIMEOUT'> = ['SUCCESS', 'ERROR', 'TIMEOUT'];
    
    const mockLogs: ApiLog[] = [];
    const now = new Date();
    
    for (let i = 0; i < 150; i++) {
      const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      const status = statusCode >= 200 && statusCode < 400 ? 'SUCCESS' : 'ERROR';
      if (Math.random() < 0.05) status = 'TIMEOUT';
      
      const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      
      mockLogs.push({
        id: `log_${i + 1}`,
        timestamp: timestamp.toISOString(),
        method: methods[Math.floor(Math.random() * methods.length)],
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        statusCode,
        responseTime: Math.floor(Math.random() * 2000) + 50,
        userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 1000)}` : undefined,
        userEmail: Math.random() > 0.3 ? `user${Math.floor(Math.random() * 1000)}@example.com` : undefined,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        requestSize: Math.floor(Math.random() * 5000) + 100,
        responseSize: Math.floor(Math.random() * 10000) + 200,
        status,
        error: status === 'ERROR' ? 'Invalid authentication credentials' : undefined,
        payload: status === 'ERROR' ? '{"email":"test@example.com","password":"wrong"}' : undefined
      });
    }
    
    return mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const allLogs = generateMockLogs();
      let filteredLogs = allLogs;
      
      // Apply filters
      if (filters.method) {
        filteredLogs = filteredLogs.filter(log => log.method === filters.method);
      }
      
      if (filters.statusCode) {
        filteredLogs = filteredLogs.filter(log => log.statusCode.toString().startsWith(filters.statusCode));
      }
      
      if (filters.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filters.status);
      }
      
      if (filters.search) {
        filteredLogs = filteredLogs.filter(log => 
          log.endpoint.toLowerCase().includes(filters.search.toLowerCase()) ||
          log.userEmail?.toLowerCase().includes(filters.search.toLowerCase()) ||
          log.ipAddress.includes(filters.search)
        );
      }
      
      // Apply date filter
      const now = new Date();
      let startDate: Date;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
      
      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pagination.limit);
      
      setLogs(paginatedLogs);
      setPagination(prev => ({
        ...prev,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / prev.limit)
      }));
    } catch (error) {
      console.error('Error fetching API logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      'Timestamp,Method,Endpoint,Status Code,Response Time,User,IP Address,Status',
      ...logs.map(log => 
        `${log.timestamp},${log.method},${log.endpoint},${log.statusCode},${log.responseTime}ms,${log.userEmail || 'N/A'},${log.ipAddress},${log.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'POST': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'TIMEOUT': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Africa/Accra'
    });
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and analyze API requests and responses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPayload(!showPayload)}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            {showPayload ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPayload ? 'Hide' : 'Show'} Payload
          </button>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Method</label>
            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status Code</label>
            <select
              value={filters.statusCode}
              onChange={(e) => setFilters(prev => ({ ...prev, statusCode: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status Codes</option>
              <option value="2">2xx Success</option>
              <option value="4">4xx Client Error</option>
              <option value="5">5xx Server Error</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="ERROR">Error</option>
              <option value="TIMEOUT">Timeout</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Endpoint, email, IP..."
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP Address</th>
                {showPayload && <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Payload</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedLog(log)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-mono">
                    {log.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`text-sm font-medium ${
                        log.statusCode >= 200 && log.statusCode < 300 ? 'text-green-600' :
                        log.statusCode >= 300 && log.statusCode < 400 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {log.statusCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {log.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {log.userEmail || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">
                    {log.ipAddress}
                  </td>
                  {showPayload && (
                    <td className="px-6 py-4 text-sm text-foreground font-mono max-w-xs truncate">
                      {log.payload || 'N/A'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedLog(null)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">API Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="text-sm text-foreground">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Method</label>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(selectedLog.method)}`}>
                      {selectedLog.method}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endpoint</label>
                  <p className="text-sm text-foreground font-mono">{selectedLog.endpoint}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status Code</label>
                  <p className="text-sm text-foreground">{selectedLog.statusCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Response Time</label>
                  <p className="text-sm text-foreground">{selectedLog.responseTime}ms</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm text-foreground flex items-center gap-2">
                    {getStatusIcon(selectedLog.status)}
                    {selectedLog.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p className="text-sm text-foreground">{selectedLog.userEmail || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="text-sm text-foreground font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>
              
              {selectedLog.error && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Error</label>
                  <p className="text-sm text-red-600">{selectedLog.error}</p>
                </div>
              )}
              
              {selectedLog.payload && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request Payload</label>
                  <pre className="text-sm text-foreground bg-muted p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
