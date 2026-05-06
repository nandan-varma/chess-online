/**
 * Game domain types - Complete, minimal, and optimized
 */

// Game modes and status
export type GameMode = 'ai' | 'local' | 'multiplayer';
export type PlayerColor = 'w' | 'b';
export type GameStatus = 'pending' | 'active' | 'completed' | 'abandoned';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

// Chess move types
export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface VerboseMove {
  color: 'w' | 'b';
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
  captured?: string;
  promotion?: string;
}

// Chess piece and board types
export type ChessPiece =
  | 'K'
  | 'Q'
  | 'R'
  | 'B'
  | 'N'
  | 'P'
  | 'k'
  | 'q'
  | 'r'
  | 'b'
  | 'n'
  | 'p';
export type ChessSquare = string & { readonly __brand: 'ChessSquare' };
export type ChessBoard = Record<ChessSquare, ChessPiece>;

// JS Chess Engine types
export interface GameMoveDictionary {
  [from: string]: string;
}

export interface ChessEngineGame {
  getHistory(): GameMoveDictionary[];
  getStatus(): string;
  getBoard(): ChessBoard;
  getAvailableMoves(square?: ChessSquare): GameMoveDictionary;
  move(from: ChessSquare, to: ChessSquare): boolean;
  reset(): void;
  undo(): void;
}

export interface ChessEngineConstructor {
  new (): ChessEngineGame;
}

export interface EngineModule {
  Game: ChessEngineConstructor;
}

export type EngineDifficulty = 1 | 2 | 3 | 4 | 5;

export interface MoveEvaluation {
  move: GameMoveDictionary;
  score: number;
  mate?: number;
}

// Chess.js types
export interface ChessJsMove {
  color: 'w' | 'b';
  from: string;
  to: string;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: ChessPiece;
  flags: string;
  san: string;
  lan: string;
}

export interface ChessJsGame {
  fen(): string;
  moves(options?: {
    verbose: boolean;
    square?: string;
  }): ChessJsMove[] | string[];
  move(
    move: string | { from: string; to: string; promotion?: string }
  ): ChessJsMove | null;
  undo(): ChessJsMove | null;
  ascii(): string;
  turn(): 'w' | 'b';
  in_check(): boolean;
  in_checkmate(): boolean;
  in_draw(): boolean;
  in_stalemate(): boolean;
  game_over(): boolean;
  reset(): void;
}

// Type guards and utilities
export const isChessJsMove = (move: unknown): move is ChessJsMove => {
  return (
    typeof move === 'object' &&
    move !== null &&
    'color' in move &&
    'from' in move &&
    'to' in move &&
    'piece' in move
  );
};

export const isGameMoveDictionary = (
  obj: unknown
): obj is GameMoveDictionary => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

export const createChessSquare = (square: string): ChessSquare => {
  const valid = /^[a-h][1-8]$/.test(square);
  if (!valid) throw new Error(`Invalid chess square: ${square}`);
  return square as ChessSquare;
};

export const isValidChessSquare = (square: string): square is ChessSquare => {
  return /^[a-h][1-8]$/.test(square);
};

/**
 * Game entity - represents a single chess game
 */
export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  board: string;
  turn: PlayerColor;
  createdAt: Date;
  updatedAt: Date;
  whitePlayer?: {
    id: string;
    name: string;
  };
  blackPlayer?: {
    id: string;
    name: string;
  };
  moves: Move[];
  result?: 'white-wins' | 'black-wins' | 'draw' | 'abandoned';
}

/**
 * Game data - legacy format for Firebase storage
 */
export interface GameData {
  id: string;
  FEN: string;
  createdBy: string;
  opponent: string | null;
}

/**
 * Move - represents a single chess move
 */
export interface Move {
  from: string;
  to: string;
  promotion?: string;
  timestamp: Date;
  notation: string;
}
