/**
 * Logger service - Centralized logging and debugging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogData {
  [key: string]: string | number | boolean | Record<string, unknown> | Error
}

interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: LogData
  source?: string
}

class LoggerService {
  private logs: LogEntry[] = []
  private maxLogs = 500
  private minLevel: LogLevel = LogLevel.DEBUG
  private isDev = process.env.NODE_ENV === 'development'

  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  /**
   * Add log entry
   */
  private addLog(level: LogLevel, message: string, data?: LogData, source?: string): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source,
    }

    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (this.isDev) {
      this.logToConsole(entry)
    }
  }

  /**
   * Log to browser console
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.level}${entry.source ? ` - ${entry.source}` : ''}]`
    const style: Record<LogLevel, string> = {
      DEBUG: 'color: #888',
      INFO: 'color: #0066cc',
      WARN: 'color: #ff9900',
      ERROR: 'color: #cc0000',
    }

    console.log(`%c${prefix} ${entry.message}`, style[entry.level], entry.data)
  }

  /**
   * Debug log
   */
  debug(message: string, data?: LogData, source?: string): void {
    this.addLog(LogLevel.DEBUG, message, data, source)
  }

  /**
   * Info log
   */
  info(message: string, data?: LogData, source?: string): void {
    this.addLog(LogLevel.INFO, message, data, source)
  }

  /**
   * Warning log
   */
  warn(message: string, data?: LogData, source?: string): void {
    this.addLog(LogLevel.WARN, message, data, source)
  }

  /**
   * Error log
   */
  error(message: string, data?: LogData, source?: string): void {
    this.addLog(LogLevel.ERROR, message, data, source)
  }

  /**
   * Get all logs
   */
  getLogs(level?: LogLevel): readonly LogEntry[] {
    if (!level) return [...this.logs]
    return this.logs.filter((log) => log.level === level)
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Performance timing
   */
  time(label: string): () => void {
    const start = performance.now()
    return () => {
      const end = performance.now()
      this.debug(`${label} took ${(end - start).toFixed(2)}ms`)
    }
  }
}

export const logger = new LoggerService()
