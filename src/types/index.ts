/**
 * Type definitions for Chess Online application
 * Centralized types to avoid repetition and ensure type safety
 */

/**
 * Represents a chess move on the board
 */
export interface ChessMove {
  from: string
  to: string
  promotion?: string
}

/**
 * Verbose move information from chess.js
 */
export interface VerboseMove {
  color: 'w' | 'b'
  from: string
  to: string
  flags: string
  piece: string
  san: string
  captured?: string
  promotion?: string
}

/**
 * Square styling for visual feedback
 */
export interface SquareStyles {
  [key: string]: React.CSSProperties
}

/**
 * Game data stored in Firebase
 */
export interface GameData {
  id: string
  FEN: string
  createdBy: string
  opponent: string | null
}

/**
 * Chess board component props
 */
export interface ChessBoardProps {
  fen: string
  squareStyles?: SquareStyles
  onMouseOverSquare?: (square: string) => void
  onMouseOutSquare?: (square: string) => void
  onDrop: (move: { sourceSquare: string; targetSquare: string }) => void
  width?: number
  position?: string
  orientation?: 'white' | 'black'
  draggable?: boolean
  onSquareClick?: (square: string) => void
  onSquareRightClick?: (square: string) => void
}

/**
 * Authentication context type
 */
export interface AuthContextType {
  user: import('./auth').User | null
  loading: boolean
  error: Error | null
}

/**
 * Game state type
 */
export type GameStatus = 'playing' | 'checkmate' | 'draw' | 'check' | 'loading' | 'error'

/**
 * Player color type
 */
export type PlayerColor = 'w' | 'b'
