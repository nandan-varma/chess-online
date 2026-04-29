import type React from 'react';
import { PieceIcon } from './pieces';
import { Piece } from './types';
import type { SquareComponentProps } from './types';

function SquareComponent({
  square,
  piece,
  isLight,
  squareStyle,
  lightSquareStyle,
  darkSquareStyle,
  width,
  onSquareClick,
  onSquareRightClick,
  onMouseOver,
  onMouseOut,
  onDragStart,
  onDragOver,
  onDrop,
  draggable = true,
}: SquareComponentProps): React.ReactElement {
  const squareSize = width / 8;

  const defaultLightStyle: React.CSSProperties = {
    backgroundColor: '#f0d9b5',
  };

  const defaultDarkStyle: React.CSSProperties = {
    backgroundColor: '#b58863',
  };

  const baseSquareStyle: React.CSSProperties = {
    width: squareSize,
    height: squareSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: piece && draggable ? 'grab' : 'default',
    ...(isLight
      ? { ...defaultLightStyle, ...lightSquareStyle }
      : { ...defaultDarkStyle, ...darkSquareStyle }),
  };

  // Layer the custom square style on top (for move indicators, etc.)
  const overlayStyle = squareStyle
    ? {
        position: 'absolute' as const,
        width: '100%',
        height: '100%',
        pointerEvents: 'none' as const,
        background: squareStyle.background,
        borderRadius: squareStyle.borderRadius,
      }
    : {};

  const handleClick = () => {
    onSquareClick?.(square);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onSquareRightClick?.(square);
  };

  const handleMouseOver = () => {
    onMouseOver?.(square);
  };

  const handleMouseOut = () => {
    onMouseOut?.(square);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (piece && draggable && onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', square);
      onDragStart(square, piece);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(e, square);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, square);
  };

  return (
    <div
      style={baseSquareStyle}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-square={square}
      role="gridcell"
      aria-label={`${square}${piece ? `, ${piece}` : ''}`}
      tabIndex={0}
    >
      {/* Overlay for move indicators */}
      {squareStyle && <div style={overlayStyle} />}

      {piece && (
        <div
          draggable={draggable}
          onDragStart={handleDragStart}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: draggable ? 'grab' : 'default',
            position: 'relative',
            zIndex: 1,
          }}
          onDragCapture={(e) => {
            if (draggable) {
              e.currentTarget.style.cursor = 'grabbing';
            }
          }}
          onDragEnd={(e) => {
            if (draggable) {
              e.currentTarget.style.cursor = 'grab';
            }
          }}
        >
          <PieceIcon piece={piece} size={squareSize * 0.85} />
        </div>
      )}
    </div>
  );
}

export default SquareComponent;
