/**
 * Chess engine types and definitions
 * Types for js-chess-engine library
 */

/**
 * Chess piece type
 */
export type ChessPiece = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p'

/**
 * Chess square notation (a1-h8)
 */
export type ChessSquare = string & { readonly __brand: 'ChessSquare' }

/**
 * Chess board state
 */
export type ChessBoard = Record<ChessSquare, ChessPiece>

/**
 * Game move dictionary format
 */
export interface GameMoveDictionary {
    [from: string]: string
}

/**
 * JS Chess Engine Game instance
 */
export interface ChessEngineGame {
    getHistory(): GameMoveDictionary[]
    getStatus(): string
    getBoard(): ChessBoard
    getAvailableMoves(square?: ChessSquare): GameMoveDictionary
    move(from: ChessSquare, to: ChessSquare): boolean
    reset(): void
    undo(): void
}

/**
 * JS Chess Engine constructor
 */
export interface ChessEngineConstructor {
    new(): ChessEngineGame
}

/**
 * Engine module type
 */
export interface EngineModule {
    Game: ChessEngineConstructor
}

/**
 * AI engine difficulty
 */
export type EngineDifficulty = 1 | 2 | 3 | 4 | 5

/**
 * AI move evaluation
 */
export interface MoveEvaluation {
    move: GameMoveDictionary
    score: number
    mate?: number
}

/**
 * Chess.js types
 */
export interface ChessJsMove {
    color: 'w' | 'b'
    from: string
    to: string
    piece: ChessPiece
    captured?: ChessPiece
    promotion?: ChessPiece
    flags: string
    san: string
    lan: string
}

export interface ChessJsGame {
    fen(): string
    moves(options?: { verbose: boolean; square?: string }): ChessJsMove[] | string[]
    move(move: string | { from: string; to: string; promotion?: string }): ChessJsMove | null
    undo(): ChessJsMove | null
    ascii(): string
    turn(): 'w' | 'b'
    in_check(): boolean
    in_checkmate(): boolean
    in_draw(): boolean
    in_stalemate(): boolean
    game_over(): boolean
    reset(): void
}

/**
 * Type guard for ChessJsMove
 */
export const isChessJsMove = (move: unknown): move is ChessJsMove => {
    return (
        typeof move === 'object' &&
        move !== null &&
        'color' in move &&
        'from' in move &&
        'to' in move &&
        'piece' in move
    )
}

/**
 * Type guard for GameMoveDictionary
 */
export const isGameMoveDictionary = (obj: unknown): obj is GameMoveDictionary => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Square type guard and creator
 */
export const createChessSquare = (square: string): ChessSquare => {
    const valid = /^[a-h][1-8]$/.test(square)
    if (!valid) throw new Error(`Invalid chess square: ${square}`)
    return square as ChessSquare
}

export const isValidChessSquare = (square: string): square is ChessSquare => {
    return /^[a-h][1-8]$/.test(square)
}
