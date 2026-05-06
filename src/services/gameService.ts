/**
 * Game Service - Business logic layer
 * Handles all game-related operations and Firebase interactions
 */

import { database } from '@/lib/firebase'
import { ref, get, set, update, push, child } from 'firebase/database'
import type { Game, Move, GameMode, AIDifficulty } from '@/types/game'

class GameService {
  /**
   * Create a new game
   */
  async createGame(params: {
    mode: GameMode
    difficulty?: AIDifficulty
    opponentId?: string
  }): Promise<Game> {
    const gameId = push(child(ref(database), 'games')).key
    if (!gameId) throw new Error('Failed to generate game ID')

    const game: Game = {
      id: gameId,
      mode: params.mode,
      status: 'pending',
      board: this.getInitialBoard(),
      turn: 'white',
      createdAt: new Date(),
      updatedAt: new Date(),
      moves: [],
      ...(params.mode === 'ai' && { difficulty: params.difficulty || 'medium' }),
      ...(params.mode === 'multiplayer' && {
        blackPlayer: { id: params.opponentId || '', name: 'Opponent' },
      }),
    }

    await set(ref(database, `games/${gameId}`), game)
    return game
  }

  /**
   * Get a game by ID
   */
  async getGame(id: string): Promise<Game> {
    const snapshot = await get(ref(database, `games/${id}`))
    if (!snapshot.exists()) {
      throw new Error('Game not found')
    }
    return snapshot.val() as Game
  }

  /**
   * Make a move in a game
   */
  async makeMove(
    gameId: string,
    move: { from: string; to: string; promotion?: string }
  ): Promise<Game> {
    const gameRef = ref(database, `games/${gameId}`)
    const snapshot = await get(gameRef)
    if (!snapshot.exists()) {
      throw new Error('Game not found')
    }

    const game = snapshot.val() as Game

    // Validate move (in production, use chess.js library)
    // Apply move to board
    const newMove: Move = {
      ...move,
      timestamp: new Date(),
      notation: this.getMoveNotation(move),
    }

    // Update game
    const updatedGame: Game = {
      ...game,
      moves: [...game.moves, newMove],
      turn: game.turn === 'white' ? 'black' : 'white',
      updatedAt: new Date(),
    }

    await update(gameRef, {
      moves: updatedGame.moves,
      turn: updatedGame.turn,
      updatedAt: updatedGame.updatedAt,
    })

    return updatedGame
  }

  /**
   * Resign from a game
   */
  async resignGame(gameId: string): Promise<Game> {
    const gameRef = ref(database, `games/${gameId}`)
    const snapshot = await get(gameRef)
    if (!snapshot.exists()) {
      throw new Error('Game not found')
    }

    const game = snapshot.val() as Game
    const updatedGame: Game = {
      ...game,
      status: 'completed',
      result: 'abandoned',
      updatedAt: new Date(),
    }

    await update(gameRef, {
      status: updatedGame.status,
      result: updatedGame.result,
      updatedAt: updatedGame.updatedAt,
    })

    return updatedGame
  }

  /**
   * Undo last move
   */
  async undoMove(gameId: string): Promise<Game> {
    const gameRef = ref(database, `games/${gameId}`)
    const snapshot = await get(gameRef)
    if (!snapshot.exists()) {
      throw new Error('Game not found')
    }

    const game = snapshot.val() as Game
    if (game.moves.length === 0) {
      throw new Error('No moves to undo')
    }

    const updatedMoves = game.moves.slice(0, -1)
    const updatedGame: Game = {
      ...game,
      moves: updatedMoves,
      turn: game.turn === 'white' ? 'black' : 'white',
      updatedAt: new Date(),
    }

    await update(gameRef, {
      moves: updatedMoves,
      turn: updatedGame.turn,
      updatedAt: updatedGame.updatedAt,
    })

    return updatedGame
  }

  /**
   * Helper: Get initial chess board state
   */
  private getInitialBoard(): string {
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  }

  /**
   * Helper: Get algebraic notation for a move
   */
  private getMoveNotation(move: { from: string; to: string }): string {
    return `${move.from}${move.to}`
  }
}

export const gameService = new GameService()
