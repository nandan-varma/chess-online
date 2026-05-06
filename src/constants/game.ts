/**
 * Game constants and configurations
 */

export const GAME_CONSTANTS = {
  INITIAL_FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  BOARD_SIZE: 8,
  MIN_PLAYERS: 2,
}

export const AI_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

export const GAME_MODES = {
  AI: 'ai',
  LOCAL: 'local',
  MULTIPLAYER: 'multiplayer',
} as const

export const GAME_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const

export const PIECE_VALUES = {
  P: 1, // Pawn
  N: 3, // Knight
  B: 3, // Bishop
  R: 5, // Rook
  Q: 9, // Queen
  K: 0, // King (invaluable)
} as const

export const MOVE_ANIMATION_DURATION = 300 // milliseconds
