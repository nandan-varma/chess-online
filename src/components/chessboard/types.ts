export type Square = string; // e.g., 'a1', 'e4', etc.
export type Piece =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK';
export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Position {
  [square: string]: Piece;
}

export interface ChessboardProps {
  id?: string;
  width?: number;
  position?: string | Position; // FEN string or position object
  fen?: string; // Alias for position (FEN string)
  orientation?: 'white' | 'black';
  draggable?: boolean;
  onDrop?: (move: { sourceSquare: Square; targetSquare: Square }) => void;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onMouseOverSquare?: (square: Square) => void;
  onMouseOutSquare?: (square: Square) => void;
  squareStyles?: Record<Square, React.CSSProperties>;
  boardStyle?: React.CSSProperties;
  lightSquareStyle?: React.CSSProperties;
  darkSquareStyle?: React.CSSProperties;
}

export interface SquareComponentProps {
  square: Square;
  piece: Piece | null;
  isLight: boolean;
  squareStyle?: React.CSSProperties;
  lightSquareStyle?: React.CSSProperties;
  darkSquareStyle?: React.CSSProperties;
  width: number;
  onSquareClick?: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
  onMouseOver?: (square: Square) => void;
  onMouseOut?: (square: Square) => void;
  onDragStart?: (square?: Square, piece?: Piece) => void;
  onDragOver?: (e: React.DragEvent, square: Square) => void;
  onDrop?: (e: React.DragEvent, square: Square) => void;
  draggable?: boolean;
}
