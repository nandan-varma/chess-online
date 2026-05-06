/**
 * Comprehensive error handling types
 */

/**
 * Error type discriminator
 */
export type ErrorType =
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown'

/**
 * Base error context
 */
export interface ErrorContext {
  code: string
  message: string
  statusCode: number
  type: ErrorType
  timestamp: Date
  path?: string
  userId?: string
  details?: Record<string, string | number | boolean>
}

/**
 * Firebase Auth error with type safety
 */
export interface FirebaseAuthError {
  code: string
  message: string
  email?: string
}

/**
 * Database error response
 */
export interface DatabaseErrorResponse {
  error: string
  code: string
  details?: Record<string, unknown>
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    message: string
    code: string
    statusCode: number
    details?: Record<string, unknown>
  }
}

/**
 * Type guard for database errors
 */
export const isDatabaseError = (error: unknown): error is DatabaseErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    'code' in error &&
    typeof (error as Record<string, unknown>).error === 'string'
  )
}

/**
 * Type guard for API errors
 */
export const isApiError = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as Record<string, unknown>).error === 'object'
  )
}

/**
 * Type guard for Firebase Auth errors
 */
export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  )
}
