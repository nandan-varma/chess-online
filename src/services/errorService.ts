/**
 * Error handling service - Centralized error management and logging
 */

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors?: Record<string, string>) {
    super('VALIDATION_ERROR', message, 400, errors)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super('AUTH_ERROR', message, 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super('AUTHZ_ERROR', message, 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super('NETWORK_ERROR', message, 503)
    this.name = 'NetworkError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
    this.name = 'ConflictError'
  }
}

interface ErrorLog {
  timestamp: Date
  code: string
  message: string
  statusCode: number
  stack?: string
  context?: unknown
}

class ErrorHandlingService {
  private errorLogs: ErrorLog[] = []
  private maxLogs = 100

  /**
   * Handle and log an error
   */
  handleError(
    error: unknown,
    context?: unknown
  ): { code: string; message: string; statusCode: number } {
    const appError = this.normalizeError(error)
    this.logError(appError, context)
    this.sendToMonitoring(appError, context)

    return {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
    }
  }

  /**
   * Normalize various error types to AppError
   */
  private normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error
    }

    if (error instanceof Error) {
      return new AppError(
        'INTERNAL_ERROR',
        error.message || 'An unknown error occurred',
        500,
        { originalError: error.message, stack: error.stack }
      )
    }

    if (typeof error === 'string') {
      return new AppError('UNKNOWN_ERROR', error, 500)
    }

    return new AppError(
      'UNKNOWN_ERROR',
      'An unknown error occurred',
      500,
      error
    )
  }

  /**
   * Log error locally
   */
  private logError(error: AppError, context?: unknown): void {
    const log: ErrorLog = {
      timestamp: new Date(),
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      context,
    }

    this.errorLogs.push(log)

    // Keep only recent logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorService]', log)
    }
  }

  /**
   * Send error to monitoring service (e.g., Sentry)
   */
  private sendToMonitoring(error: AppError, context?: unknown): void {
    // TODO: Integrate with error tracking service like Sentry
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.debug('[ErrorMonitoring]', { error, context })
    }
  }

  /**
   * Get all logged errors
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs]
  }

  /**
   * Clear error logs
   */
  clearErrorLogs(): void {
    this.errorLogs = []
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: unknown): string {
    const appError = this.normalizeError(error)

    const messages: Record<string, string> = {
      AUTH_ERROR: 'Authentication failed. Please try again.',
      AUTHZ_ERROR: 'You do not have permission to perform this action.',
      NOT_FOUND: 'The resource you are looking for does not exist.',
      NETWORK_ERROR: 'Network connection error. Please check your connection.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      CONFLICT: appError.message,
      INTERNAL_ERROR: 'An error occurred. Please try again later.',
      UNKNOWN_ERROR: 'An unexpected error occurred.',
    }

    return messages[appError.code] || appError.message
  }
}

export const errorService = new ErrorHandlingService()
