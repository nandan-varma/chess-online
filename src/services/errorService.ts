/**
 * Error handling service - Centralized error management and logging
 */

import type { ErrorContext, ErrorType, FirebaseAuthError, DatabaseErrorResponse, ApiErrorResponse } from '@/types/errors'
import { isFirebaseAuthError, isDatabaseError, isApiError } from '@/types/errors'

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public type: ErrorType = 'unknown',
    public details?: Record<string, string | number | boolean>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fieldErrors?: Record<string, string>) {
    super('VALIDATION_ERROR', message, 400, 'validation', fieldErrors)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super('AUTH_ERROR', message, 401, 'authentication')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super('AUTHZ_ERROR', message, 403, 'authorization')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404, 'not_found')
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super('NETWORK_ERROR', message, 503, 'network')
    this.name = 'NetworkError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409, 'conflict')
    this.name = 'ConflictError'
  }
}

interface ErrorLog extends ErrorContext {
  stack?: string
}

class ErrorHandlingService {
  private errorLogs: ErrorLog[] = []
  private maxLogs = 100

  /**
   * Handle and log an error
   */
  handleError(
    error: Error | FirebaseAuthError | DatabaseErrorResponse | ApiErrorResponse | string,
    context?: Record<string, string | number | boolean>
  ): { code: string; message: string; statusCode: number; type: ErrorType } {
    const appError = this.normalizeError(error)
    this.logError(appError, context)
    this.sendToMonitoring(appError, context)

    return {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      type: appError.type,
    }
  }

  /**
   * Normalize various error types to AppError
   */
  private normalizeError(
    error: Error | FirebaseAuthError | DatabaseErrorResponse | ApiErrorResponse | string
  ): AppError {
    if (error instanceof AppError) {
      return error
    }

    if (typeof error === 'string') {
      return new AppError('UNKNOWN_ERROR', error, 500, 'unknown')
    }

    if (isFirebaseAuthError(error)) {
      return new AuthenticationError(error.message)
    }

    if (isDatabaseError(error)) {
      return new AppError(error.code, error.error, 500, 'server', error.details as Record<string, string | number | boolean>)
    }

    if (isApiError(error)) {
      return new AppError(
        error.error.code,
        error.error.message,
        error.error.statusCode,
        'server',
        error.error.details as Record<string, string | number | boolean>
      )
    }

    if (error instanceof Error) {
      return new AppError('INTERNAL_ERROR', error.message, 500, 'unknown')
    }

    return new AppError('UNKNOWN_ERROR', 'An unknown error occurred', 500, 'unknown')
  }

  /**
   * Log error locally
   */
  private logError(error: AppError, context?: Record<string, string | number | boolean>): void {
    const log: ErrorLog = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      type: error.type,
      timestamp: new Date(),
      stack: error.stack,
      details: error.details,
    }

    this.errorLogs.push(log)

    // Keep only recent logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorService]', log, context)
    }
  }

  /**
   * Send error to monitoring service (e.g., Sentry)
   */
  private sendToMonitoring(
    error: AppError,
    context?: Record<string, string | number | boolean>
  ): void {
    // TODO: Integrate with error tracking service like Sentry
    if (process.env.NODE_ENV === 'development') {
      console.debug('[ErrorMonitoring]', { error, context })
    }
  }

  /**
   * Get all logged errors
   */
  getErrorLogs(): readonly ErrorLog[] {
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
  getUserMessage(error: Error | FirebaseAuthError | DatabaseErrorResponse | ApiErrorResponse | string): string {
    const appError = this.normalizeError(error)

    const messages: Record<ErrorType, string> = {
      authentication: 'Authentication failed. Please try again.',
      authorization: 'You do not have permission to perform this action.',
      not_found: 'The resource you are looking for does not exist.',
      network: 'Network connection error. Please check your connection.',
      validation: 'Please check your input and try again.',
      conflict: appError.message,
      server: 'A server error occurred. Please try again later.',
      unknown: 'An unexpected error occurred. Please try again later.',
    }

    return messages[appError.type]
  }
}

export const errorService = new ErrorHandlingService()
