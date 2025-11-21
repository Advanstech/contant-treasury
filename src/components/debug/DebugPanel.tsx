'use client';

import React, { useState, useEffect } from 'react';
import { Bug, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import logger from '@/lib/logger';

interface DebugPanelProps {
  visible?: boolean;
}

export default function DebugPanel({ visible = false }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isVisible) {
      refreshLogs();
    }
  }, [isVisible]);

  const refreshLogs = () => {
    const allLogs = logger.getLogs();
    setLogs(allLogs.slice(-50)); // Show last 50 logs
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const exportLogs = () => {
    const exportData = logger.exportLogs();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treasury-direct-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
        title="Show Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-96 bg-card border border-border rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-red-500" />
          <span className="font-semibold text-sm">Debug Panel</span>
          <span className="text-xs text-muted-foreground">({filteredLogs.length})</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
        >
          <option value="all">All Levels</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>
        
        <button
          onClick={refreshLogs}
          className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
        
        <button
          onClick={clearLogs}
          className="p-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Clear Logs"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        
        <button
          onClick={exportLogs}
          className="p-1 text-xs text-blue-500 hover:bg-blue-50 rounded transition-colors"
          title="Export Logs"
        >
          <Download className="h-3 w-3" />
        </button>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-muted-foreground text-xs py-4">
            No logs to display
          </p>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="p-2 bg-muted/30 rounded text-xs font-mono"
              >
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">{getLogIcon(log.level)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${getLogColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {log.context && (
                        <span className="text-blue-500 bg-blue-50 px-1 rounded">
                          {log.context}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground break-words">{log.message}</p>
                    {log.data && (
                      <details className="mt-1">
                        <summary className="text-muted-foreground cursor-pointer">
                          Data
                        </summary>
                        <pre className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
