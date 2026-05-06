import type React from 'react';

/**
 * UI Component Types
 * Types used for rendering and UI components
 */

// Chess board styling
export interface SquareStyles {
  [key: string]: React.CSSProperties;
}

// Chess board component props
export interface ChessBoardProps {
  fen: string;
  squareStyles?: SquareStyles;
  onMouseOverSquare?: (square: string) => void;
  onMouseOutSquare?: (square: string) => void;
  onDrop: (move: { sourceSquare: string; targetSquare: string }) => void;
  width?: number;
  position?: string;
  orientation?: 'white' | 'black';
  draggable?: boolean;
  onSquareClick?: (square: string) => void;
  onSquareRightClick?: (square: string) => void;
}
