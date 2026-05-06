/**
 * Validation service - Input validation and sanitization
 */

import { EMAIL_PATTERN, PASSWORD_RULES } from '@/constants/auth'
import type { LoginCredentials, SignupCredentials } from '@/types/auth'

class ValidationService {
  /**
   * Validate email format
   */
  validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email) {
      return { valid: false, error: 'Email is required' }
    }
    if (!EMAIL_PATTERN.test(email)) {
      return { valid: false, error: 'Invalid email format' }
    }
    return { valid: true }
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password) {
      return { valid: false, error: 'Password is required' }
    }
    if (password.length < PASSWORD_RULES.MIN_LENGTH) {
      return {
        valid: false,
        error: `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`,
      }
    }
    return { valid: true }
  }

  /**
   * Validate login credentials
   */
  validateLoginCredentials(
    credentials: LoginCredentials
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    const emailValidation = this.validateEmail(credentials.email)
    if (!emailValidation.valid && emailValidation.error) {
      errors.email = emailValidation.error
    }

    const passwordValidation = this.validatePassword(credentials.password)
    if (!passwordValidation.valid && passwordValidation.error) {
      errors.password = passwordValidation.error
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * Validate signup credentials
   */
  validateSignupCredentials(
    credentials: SignupCredentials
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    const emailValidation = this.validateEmail(credentials.email)
    if (!emailValidation.valid && emailValidation.error) {
      errors.email = emailValidation.error
    }

    const passwordValidation = this.validatePassword(credentials.password)
    if (!passwordValidation.valid && passwordValidation.error) {
      errors.password = passwordValidation.error
    }

    if (
      credentials.displayName &&
      credentials.displayName.trim().length === 0
    ) {
      errors.displayName = 'Display name cannot be empty'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * Validate chess move format
   */
  validateMove(from: string, to: string): { valid: boolean; error?: string } {
    const movePattern = /^[a-h][1-8]$/

    if (!movePattern.test(from)) {
      return { valid: false, error: `Invalid source square: ${from}` }
    }

    if (!movePattern.test(to)) {
      return { valid: false, error: `Invalid target square: ${to}` }
    }

    if (from === to) {
      return { valid: false, error: 'Source and target squares must be different' }
    }

    return { valid: true }
  }

  /**
   * Sanitize string input
   */
  sanitizeString(input: string, maxLength = 255): string {
    return input.trim().slice(0, maxLength).replace(/[<>]/g, '')
  }

  /**
   * Validate display name
   */
  validateDisplayName(name: string): { valid: boolean; error?: string } {
    const sanitized = this.sanitizeString(name, 50)

    if (!sanitized) {
      return { valid: false, error: 'Display name cannot be empty' }
    }

    if (sanitized.length < 2) {
      return { valid: false, error: 'Display name must be at least 2 characters' }
    }

    if (!/^[a-zA-Z0-9_\s-]+$/.test(sanitized)) {
      return {
        valid: false,
        error: 'Display name can only contain letters, numbers, spaces, underscores, and hyphens',
      }
    }

    return { valid: true }
  }
}

export const validationService = new ValidationService()
