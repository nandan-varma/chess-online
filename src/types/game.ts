/**
 * Game domain types - Complete, minimal, and optimized
 */

export type GameMode = 'ai' | 'local' | 'multiplayer'
export type PlayerColor = 'white' | 'black'
export type GameStatus = 'pending' | 'active' | 'completed' | 'abandoned'

/**
 * Game entity - represents a single chess game
 */
export interface Game {
  id: string
  mode: GameMode
  status: GameStatus
  board: string
  turn: PlayerColor
  createdAt: Date
  updatedAt: Date
  whitePlayer?: {
    id: string
    name: string
  }
  blackPlayer?: {
    id: string
    name: string
  }
  moves: Move[]
  result?: 'white-wins' | 'black-wins' | 'draw' | 'abandoned'
}

/**
 * Move - represents a single chess move
 */
export interface Move {
  from: string
  to: string
  promotion?: string
  timestamp: Date
  notation: string
}

/**
 * AI difficulty levels
 */
export type AIDifficulty = 'easy' | 'medium' | 'hard'

/**
 * API response types
 */
export interface ApiResponse<T> {
  data: T
  error: string | null
  timestamp: Date
}

/**
 * Pagination info for list responses
 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo
}
