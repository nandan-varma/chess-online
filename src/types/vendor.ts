/**
 * Type definitions for third-party libraries without TypeScript support
 */

declare module 'js-chess-engine' {
  /**
   * Move format: { from: to }
   * Example: { 'e2': 'e4' }
   */
  export type ChessEngineMove = Record<string, string>

  /**
   * Game class for tracking board state
   */
  export class Game {
    /**
     * Create a new Game instance
     * @param fen - Optional FEN string to initialize the board
     */
    constructor(fen?: string)

    /**
     * Get move history
     */
    getHistory(): ChessEngineMove[]

    /**
     * Get current game status
     */
    getStatus(): string

    /**
     * Get board state
     */
    getBoard(): Record<string, string>

    /**
     * Get available moves for a square
     */
    getAvailableMoves(square?: string): ChessEngineMove

    /**
     * Make a move - accepts either two parameters (from, to) or one move object
     */
    move(from: string | ChessEngineMove, to?: string): boolean

    /**
     * Reset the board
     */
    reset(): void

    /**
     * Undo the last move
     */
    undo(): void

    /**
     * Get AI move (no parameters needed)
     */
    aiMove(): ChessEngineMove
  }

  /**
   * Engine factory for AI evaluation
   */
  export function Engine(difficulty: number): {
    evaluate(board: Record<string, string>, depth: number): Record<string, string>
    aiMove(board: Record<string, string>, depth: number): ChessEngineMove
  }
}
