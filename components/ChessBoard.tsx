import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore - Import Chessboard dynamically to avoid SSR issues with DOM-dependent code
const Chessboard = dynamic(() => import('chessboardjsx'), { ssr: false });

interface ChessBoardProps {
  fen: string;
  squareStyles?: Record<string, React.CSSProperties>;
  onMouseOverSquare?: (square: string) => void;
  onDrop: (move: { sourceSquare: string; targetSquare: string }) => void;
  width?: number;
  position?: string;
  orientation?: 'white' | 'black';
  draggable?: boolean;
  onSquareClick?: (square: string) => void;
  onSquareRightClick?: (square: string) => void;
  onMouseOutSquare?: (square: string) => void;
}

export default function ChessBoardLogic({
  fen,
  squareStyles = {},
  onMouseOverSquare = () => {},
  onDrop,
  width = 560,
  ...props
}: ChessBoardProps) {
  // Provide a safe fallback for fen if it's undefined
  const safefen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  
  return (
    <div className="flex justify-center">
      <div>
        <Chessboard
          id="chessboard"
          width={width}
          position={safefen}
          onDrop={onDrop}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={() => {}}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          lightSquareStyle={{ backgroundColor: '#f0d9b5' }}
          darkSquareStyle={{ backgroundColor: '#b58863' }}
          {...props}
        />
      </div>
    </div>
  );
}