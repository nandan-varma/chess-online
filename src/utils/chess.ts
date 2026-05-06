/**
 * Chess-related utilities and helpers
 */

import { PIECE_VALUES } from '@/constants/game'

/**
 * Convert piece character to readable name
 */
export const getPieceName = (piece: string): string => {
  const names: Record<string, string> = {
    p: 'Pawn',
    n: 'Knight',
    b: 'Bishop',
    r: 'Rook',
    q: 'Queen',
    k: 'King',
  }
  return names[piece.toLowerCase()] || piece
}

/**
 * Get piece value for evaluation
 */
export const getPieceValue = (piece: string): number => {
  const value = PIECE_VALUES[piece.toUpperCase() as keyof typeof PIECE_VALUES]
  return value ?? 0
}

/**
 * Check if square is light or dark
 */
export const isLightSquare = (square: string): boolean => {
  const file = square.charCodeAt(0) - 97 // a-h to 0-7
  const rankChar = square.charAt(1)
  const rank = rankChar ? parseInt(rankChar) - 1 : -1 // 1-8 to 0-7
  return (file + rank) % 2 === 0
}

/**
 * Get square color
 */
export const getSquareColor = (square: string): 'light' | 'dark' => {
  return isLightSquare(square) ? 'light' : 'dark'
}

/**
 * Convert algebraic notation to coordinates
 */
export const algebraicToCoords = (square: string): [number, number] => {
  if (!square || square.length < 2) {
    throw new Error(`Invalid square: ${square}`)
  }
  const file = square.charCodeAt(0) - 97 // a=0, h=7
  const rankChar = square.charAt(1)
  if (!rankChar) throw new Error(`Invalid square format: ${square}`)
  const rank = 8 - parseInt(rankChar)
  return [rank, file]
}

/**
 * Convert coordinates to algebraic notation
 */
export const coordsToAlgebraic = (rank: number, file: number): string => {
  const fileChar = String.fromCharCode(97 + file) // 0-7 to a-h
  const rankChar = (8 - rank).toString() // 0-7 to 8-1
  return `${fileChar}${rankChar}`
}

/**
 * Calculate distance between two squares
 */
export const getSquareDistance = (from: string, to: string): number => {
  const [fromRank, fromFile] = algebraicToCoords(from)
  const [toRank, toFile] = algebraicToCoords(to)
  return Math.max(Math.abs(fromRank - toRank), Math.abs(fromFile - toFile))
}

/**
 * Check if move is diagonal
 */
export const isDiagonalMove = (from: string, to: string): boolean => {
  const [fromRank, fromFile] = algebraicToCoords(from)
  const [toRank, toFile] = algebraicToCoords(to)
  return Math.abs(fromRank - toRank) === Math.abs(fromFile - toFile)
}

/**
 * Check if move is orthogonal (horizontal or vertical)
 */
export const isOrthogonalMove = (from: string, to: string): boolean => {
  const [fromRank, fromFile] = algebraicToCoords(from)
  const [toRank, toFile] = algebraicToCoords(to)
  return fromRank === toRank || fromFile === toFile
}

/**
 * Check if move is knight-like (L-shaped)
 */
export const isKnightMove = (from: string, to: string): boolean => {
  const [fromRank, fromFile] = algebraicToCoords(from)
  const [toRank, toFile] = algebraicToCoords(to)
  const rankDiff = Math.abs(fromRank - toRank)
  const fileDiff = Math.abs(fromFile - toFile)
  return (rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2)
}

/**
 * Get all squares between two positions (for line-of-sight checks)
 */
export const getSquaresBetween = (from: string, to: string): string[] => {
  const [fromRank, fromFile] = algebraicToCoords(from)
  const [toRank, toFile] = algebraicToCoords(to)

  const rankStep = fromRank < toRank ? 1 : fromRank > toRank ? -1 : 0
  const fileStep = fromFile < toFile ? 1 : fromFile > toFile ? -1 : 0

  const squares: string[] = []
  let currentRank = fromRank + rankStep
  let currentFile = fromFile + fileStep

  while (
    currentRank !== toRank ||
    currentFile !== toFile
  ) {
    squares.push(coordsToAlgebraic(currentRank, currentFile))
    currentRank += rankStep
    currentFile += fileStep
  }

  return squares
}

/**
 * Format move as PGN notation (simple version)
 */
export const formatMoveAsNotation = (
  from: string,
  to: string,
  piece?: string
): string => {
  if (!piece) return `${from}${to}`

  const pieceName = getPieceName(piece)
  if (pieceName === 'Pawn') {
    return to // Pawns don't include piece letter
  }

  return `${pieceName[0]!}${from}${to}`
}
