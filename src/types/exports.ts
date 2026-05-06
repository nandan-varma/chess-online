/**
 * Types export - Centralized TypeScript type definitions
 */

export type {
  ChessMove,
  VerboseMove,
  SquareStyles,
  GameData,
  ChessBoardProps,
  AuthContextType,
  GameStatus,
  PlayerColor,
} from './index'

export type { User, AuthState, LoginCredentials, SignupCredentials } from './auth'
export type { Game, Move, GameMode, PlayerColor as GamePlayerColor, GameStatus as GameGameStatus, AIDifficulty, ApiResponse, PaginationInfo, ListResponse } from './game'
