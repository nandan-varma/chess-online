import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SquareComponent from './Square';
import type { ChessboardProps, Position, Square } from './types';
import { fenToPosition, getSquares, isLightSquare } from './utils';

function Chessboard({
  id = 'chessboard',
  width = 560,
  position,
  fen,
  orientation = 'white',
  draggable = true,
  onDrop,
  onSquareClick,
  onSquareRightClick,
  onMouseOverSquare,
  onMouseOutSquare,
  squareStyles = {},
  boardStyle = {},
  lightSquareStyle = {},
  darkSquareStyle = {},
}: ChessboardProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [boardWidth, setBoardWidth] = useState(width || 560);

  // Handle responsive board width
  useEffect(() => {
    if (width) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const updateWidth = (): void => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setBoardWidth(Math.min(containerWidth, 800));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [width]);

  // Support both 'position' and 'fen' props
  const positionValue =
    position ||
    fen ||
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Parse position
  const parsedPosition: Position = useMemo(() => {
    if (typeof positionValue === 'string') {
      return fenToPosition(positionValue);
    }
    return positionValue;
  }, [positionValue]);

  // Get all squares in correct order
  const squares = useMemo(() => getSquares(orientation), [orientation]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    // Drag start handler - can be used for visual feedback if needed
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent, targetSquare: Square) => {
      e.preventDefault();
      const sourceSquare = e.dataTransfer.getData('text/plain') as Square;

      if (sourceSquare && sourceSquare !== targetSquare && onDrop) {
        onDrop({
          sourceSquare,
          targetSquare,
        });
      }

      setSelectedSquare(null);
    },
    [onDrop]
  );

  // Handle square click for click-to-move
  const handleSquareClickInternal = useCallback(
    (square: Square) => {
      const piece = parsedPosition[square];

      // If there's a selected square and we're clicking a different square, try to move
      if (selectedSquare && selectedSquare !== square) {
        if (onDrop) {
          onDrop({
            sourceSquare: selectedSquare,
            targetSquare: square,
          });
        }
        setSelectedSquare(null);
      }
      // If clicking the same square, deselect it
      else if (selectedSquare === square) {
        setSelectedSquare(null);
      }
      // If there's a piece on this square, select it
      else if (piece) {
        setSelectedSquare(square);
      }

      // Also call the user's onSquareClick if provided
      onSquareClick?.(square);
    },
    [selectedSquare, parsedPosition, onDrop, onSquareClick]
  );

  const displayWidth = width || boardWidth;

  const containerStyle: React.CSSProperties = {
    width: displayWidth,
    height: displayWidth,
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    ...boardStyle,
  };

  return (
    <div ref={containerRef} className="flex justify-center w-full h-full">
      <div id={id} style={containerStyle}>
        {squares.map((square) => {
          const piece = parsedPosition[square] || null;
          const isLight = isLightSquare(square);
          let customSquareStyle = squareStyles[square];

          // Add selection highlight
          if (selectedSquare === square) {
            customSquareStyle = {
              ...customSquareStyle,
              backgroundColor: 'rgba(255, 255, 0, 0.4)',
              boxShadow: 'inset 0 0 0 3px rgba(255, 255, 0, 0.6)',
            };
          }

          return (
            <SquareComponent
              key={square}
              square={square}
              piece={piece}
              isLight={isLight}
              squareStyle={customSquareStyle}
              lightSquareStyle={lightSquareStyle}
              darkSquareStyle={darkSquareStyle}
              width={displayWidth}
              onSquareClick={handleSquareClickInternal}
              onSquareRightClick={onSquareRightClick}
              onMouseOver={onMouseOverSquare}
              onMouseOut={onMouseOutSquare}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggable={draggable}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Chessboard;
