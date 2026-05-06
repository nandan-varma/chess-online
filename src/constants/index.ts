/**
 * Centralized constants - All configuration in one place
 */

// Authentication
export const AUTH = {
  SESSION_STORAGE_KEY: 'chess_auth_session',
  THEME_STORAGE_KEY: 'chess_theme',
  PREFERENCES_STORAGE_KEY: 'chess_preferences',
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  WEAK_PASSWORD: 'Password is too weak',
  INVALID_EMAIL: 'Invalid email format',
  USER_NOT_FOUND: 'User not found',
  PERMISSION_DENIED: 'Permission denied',
  NETWORK_ERROR: 'Network connection error',
} as const;

// Game
export const GAME = {
  INITIAL_FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  BOARD_SIZE: 8,
  MIN_PLAYERS: 2,
  MOVE_ANIMATION_DURATION: 300, // milliseconds
} as const;

export const AI_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const GAME_MODES = {
  AI: 'ai',
  LOCAL: 'local',
  MULTIPLAYER: 'multiplayer',
} as const;

export const GAME_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const;

export const PIECE_VALUES = {
  P: 1, // Pawn
  N: 3, // Knight
  B: 3, // Bishop
  R: 5, // Rook
  Q: 9, // Queen
  K: 0, // King (invaluable)
} as const;

// UI
export const UI = {
  BOARD_LIGHT_SQUARE: '#f0d9b5',
  BOARD_DARK_SQUARE: '#b58863',
  BOARD_BORDER_RADIUS: '5px',
  BOARD_BOX_SHADOW: '0 5px 15px rgba(0, 0, 0, 0.5)',
} as const;
