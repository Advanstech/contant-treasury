// TreasuryDirect Ghana - Development Logger
// Comprehensive logging for development and debugging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
  userId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context, data } = entry;
    const contextStr = context ? `[${context}]` : '';
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}${dataStr}`;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context,
    };

    // Add user ID if available
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (userId) entry.userId = userId;
    }

    return entry;
  }

  private log(entry: LogEntry) {
    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);
      
      switch (entry.level) {
        case 'debug':
          console.debug(`🔍 ${formatted}`);
          break;
        case 'info':
          console.info(`ℹ️ ${formatted}`);
          break;
        case 'warn':
          console.warn(`⚠️ ${formatted}`);
          break;
        case 'error':
          console.error(`❌ ${formatted}`);
          break;
      }
    }

    // Save to localStorage for persistence
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const recentLogs = this.logs.slice(-100); // Save last 100 logs
        localStorage.setItem('td_logs', JSON.stringify(recentLogs));
      } catch (error) {
        console.warn('Failed to save logs to localStorage:', error);
      }
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('td_logs');
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load logs from localStorage:', error);
      }
    }
  }

  // Public logging methods
  debug(message: string, data?: any, context?: string) {
    this.log(this.createLogEntry('debug', message, data, context));
  }

  info(message: string, data?: any, context?: string) {
    this.log(this.createLogEntry('info', message, data, context));
  }

  warn(message: string, data?: any, context?: string) {
    this.log(this.createLogEntry('warn', message, data, context));
  }

  error(message: string, data?: any, context?: string) {
    this.log(this.createLogEntry('error', message, data, context));
  }

  // Specialized logging methods
  api(method: string, url: string, status?: number, data?: any, error?: any) {
    const message = `API ${method} ${url}${status ? ` - ${status}` : ''}`;
    const logData = { method, url, status, data, error };
    
    if (error || (status && status >= 400)) {
      this.error(message, logData, 'API');
    } else {
      this.info(message, logData, 'API');
    }
  }

  auth(action: string, data?: any, error?: any) {
    const message = `Auth ${action}`;
    
    if (error) {
      this.error(message, { action, data, error }, 'AUTH');
    } else {
      this.info(message, { action, data }, 'AUTH');
    }
  }

  user(action: string, data?: any) {
    this.info(`User ${action}`, data, 'USER');
  }

  navigation(from: string, to: string) {
    this.debug(`Navigation: ${from} → ${to}`, { from, to }, 'NAV');
  }

  performance(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric} = ${value}${unit}`, { metric, value, unit }, 'PERF');
  }

  // Utility methods
  getLogs(level?: LogLevel, context?: string, limit?: number): LogEntry[] {
    let filtered = this.logs;

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (context) {
      filtered = filtered.filter(log => log.context === context);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('td_logs');
    }
  }

  exportLogs(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      logs: this.logs,
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Initialize logger
  init() {
    this.loadFromStorage();
    this.info('Logger initialized', { environment: process.env.NODE_ENV }, 'SYSTEM');
  }
}

// Create singleton instance
const logger = new Logger();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  logger.init();
}

export default logger;
