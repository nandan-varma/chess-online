import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import SquareComponent from './Square';
import type { ChessboardProps, Position, Square } from './types';
import { fenToPosition, getSquares, isLightSquare } from './utils';

function Chessboard({
  id = 'chessboard',
  width = 560,
  position,
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
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Parse position
  const parsedPosition: Position = useMemo(() => {
    if (typeof position === 'string') {
      return fenToPosition(position);
    }
    return position;
  }, [position]);

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

  const containerStyle: React.CSSProperties = {
    width,
    height: width,
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
    borderRadius: '5px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    ...boardStyle,
  };

  return (
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
            width={width}
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
  );
}

export default Chessboard;
