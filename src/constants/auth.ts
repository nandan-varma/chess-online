/**
 * Authentication constants
 */

export const AUTH_CONSTANTS = {
  SESSION_STORAGE_KEY: 'chess_auth_session',
  THEME_STORAGE_KEY: 'chess_theme',
  PREFERENCES_STORAGE_KEY: 'chess_preferences',
} as const

export const PASSWORD_RULES = {
  MIN_LENGTH: 6,
  REQUIRE_UPPERCASE: false,
  REQUIRE_NUMBERS: false,
  REQUIRE_SPECIAL: false,
} as const

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  WEAK_PASSWORD: 'Password is too weak',
  INVALID_EMAIL: 'Invalid email format',
  USER_NOT_FOUND: 'User not found',
  PERMISSION_DENIED: 'Permission denied',
  NETWORK_ERROR: 'Network connection error',
} as const
