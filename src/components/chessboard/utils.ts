import type { Piece, Position, Square } from './types';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

/**
 * Parse FEN string to position object
 */
export function fenToPosition(fen: string): Position {
  if (fen === 'start') {
    fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }

  const position: Position = {};
  const fenParts = fen.split(' ');
  const rows = (fenParts[0] ?? '').split('/');

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    const row = rows[rank] ?? '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i] ?? '';

      if (char >= '1' && char <= '8') {
        file += Number.parseInt(char, 10);
      } else if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const pieceType = char.toLowerCase();
        const square = `${FILES[file]}${8 - rank}` as Square;
        position[square] = `${color}${pieceType.toUpperCase()}` as Piece;
        file++;
      }
    }
  }

  return position;
}

/**
 * Get all squares in order based on orientation
 */
export function getSquares(orientation: 'white' | 'black'): Square[] {
  const squares: Square[] = [];
  const ranks = orientation === 'white' ? [...RANKS].reverse() : [...RANKS];
  const files = orientation === 'white' ? FILES : [...FILES].reverse();

  for (const rank of ranks) {
    for (const file of files) {
      squares.push(`${file}${rank}` as Square);
    }
  }

  return squares;
}

/**
 * Check if square is light colored
 */
export function isLightSquare(square: Square): boolean {
  const file = square.charCodeAt(0) - 97;
  const rank = Number.parseInt(square[1] ?? '1', 10) - 1;
  return (file + rank) % 2 !== 0;
}

/**
 * Convert square to coordinates
 */
export function squareToCoords(square: Square): { file: number; rank: number } {
  const file = square.charCodeAt(0) - 97;
  const rank = Number.parseInt(square[1] ?? '1', 10) - 1;
  return { file, rank };
}

/**
 * Convert coordinates to square
 */
export function coordsToSquare(file: number, rank: number): Square {
  return `${FILES[file]}${rank + 1}` as Square;
}
