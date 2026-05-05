import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Chessboard from './chessboard/Chessboard';

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
  width,
  ...props
}: ChessBoardProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(width || 560);

  useEffect(() => {
    if (!width && containerRef.current) {
      const updateWidth = (): void => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          setBoardWidth(Math.min(containerWidth, 800));
        }
      };

      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, [width]);

  // Provide a safe fallback for fen if it's undefined
  const safefen =
    fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  return (
    <div ref={containerRef} className="flex justify-center w-full h-full">
      <div className="w-full h-full flex items-center justify-center">
        <Chessboard
          id="chessboard"
          width={width || boardWidth}
          position={safefen}
          onDrop={onDrop}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onMouseOutSquare={props.onMouseOutSquare || (() => {})}
          boardStyle={{
            borderRadius: '5px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
          }}
          lightSquareStyle={{ backgroundColor: '#f0d9b5' }}
          darkSquareStyle={{ backgroundColor: '#b58863' }}
          orientation={props.orientation}
          draggable={props.draggable}
          onSquareClick={props.onSquareClick}
          onSquareRightClick={props.onSquareRightClick}
        />
      </div>
    </div>
  );
}
