/**
 * Local chess game page
 * Two-player chess game on the same device
 */

'use client';

import {
  faRotate,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createFileRoute } from '@tanstack/react-router';
import type { Square } from 'chess.js';
import { Chess } from 'chess.js';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import Chessboard from '@/components/chessboard';
import { Button } from '@/components/ui/button';
import type { ChessMove, SquareStyles, VerboseMove } from '@/types';

/**
 * Route configuration
 */
export const Route = createFileRoute('/board')({
  component: LocalBoard,
  head: () => ({
    meta: [
      {
        title: 'Local Game - Chess Online',
      },
      {
        name: 'description',
        content: 'Play chess locally on the same device with a friend.',
      },
    ],
  }),
});

/**
 * Local board game component
 */
function LocalBoard() {
  const [fen, setFen] = useState('start');
  const [game] = useState(() => new Chess());
  const [squareStyles, setSquareStyles] = useState<SquareStyles>({});
  const [undoneMove, setUndoneMove] = useState<ChessMove | null>(null);

  /**
   * Validate if a move is legal
   */
  const isValidMove = useCallback(
    (move: ChessMove): boolean => {
      return game
        .moves({ square: move.from as Square, verbose: true })
        .some((obj) => obj.to === move.to && obj.from === move.from);
    },
    [game]
  );

  /**
   * Handle move
   */
  const handleMove = useCallback(
    (move: ChessMove): void => {
      if (!isValidMove(move)) {
        toast.error('Invalid move!', {
          description: 'Please make a valid move.',
        });
        return;
      }

      game.move(move);
      setFen(game.fen());
      setSquareStyles({});

      // Check game state
      if (game.isCheckmate()) {
        toast.success('Checkmate!', { description: 'Game over.' });
      } else if (game.isDraw()) {
        toast.info('Draw!', { description: 'The game is a draw.' });
      } else if (game.isCheck()) {
        toast.warning('Check!', { description: 'King is in check.' });
      }
    },
    [isValidMove, game]
  );

  /**
   * Handle pawn promotion
   */
  const handlePromotion = useCallback(
    (sourceSquare: Square, targetSquare: Square): void => {
      const promotionPiece = prompt(
        'Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)',
        'q'
      );

      if (promotionPiece) {
        const move: ChessMove = {
          from: sourceSquare,
          to: targetSquare,
          promotion: promotionPiece,
        };
        handleMove(move);
      }
    },
    [handleMove]
  );

  /**
   * Show available moves on square hover
   */
  const onMouseOverSquare = useCallback(
    (square: Square): void => {
      const moves: VerboseMove[] = game.moves({ square, verbose: true });

      if (moves.length === 0) return;

      const newStyles: SquareStyles = {};
      newStyles[square] = {
        background:
          'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
        borderRadius: '50%',
      };

      moves.forEach((move: VerboseMove) => {
        newStyles[move.to] = {
          background:
            'radial-gradient(circle, rgba(0,0,0,0.2) 36%, transparent 40%)',
          borderRadius: '50%',
        };
      });

      setSquareStyles(newStyles);
    },
    [game]
  );

  /**
   * Clear square styles on mouse out
   */
  const onMouseOutSquare = useCallback((): void => {
    setSquareStyles({});
  }, []);

  /**
   * Reset game
   */
  const handleResetClick = useCallback(() => {
    setSquareStyles({});
    setUndoneMove(null);
    game.reset();
    setFen(game.fen());
    toast.info('Game reset');
  }, [game]);

  /**
   * Undo move
   */
  const handleUndoClick = useCallback(() => {
    setSquareStyles({});
    const move = game.undo();
    if (move) {
      setUndoneMove(move as ChessMove);
      setFen(game.fen());
      toast.info('Move undone');
    }
  }, [game]);

  /**
   * Redo move
   */
  const handleRedoClick = useCallback(() => {
    setSquareStyles({});
    if (undoneMove && isValidMove(undoneMove)) {
      handleMove(undoneMove);
      setUndoneMove(null);
      toast.info('Move redone');
    }
  }, [undoneMove, isValidMove, handleMove]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full px-2 py-3 sm:px-4 sm:py-4 shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-3">
          Local Game
        </h1>
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          <Button
            onClick={handleResetClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            title="Reset game"
          >
            <FontAwesomeIcon icon={faRotate} className="text-sm sm:text-base" />
          </Button>
          <Button
            onClick={handleUndoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            title="Undo move"
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className="text-sm sm:text-base"
            />
          </Button>
          <Button
            onClick={handleRedoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={!undoneMove}
            title="Redo move"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-sm sm:text-base"
            />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2 overflow-hidden">
        <div className="w-full aspect-square max-w-[90vmin]">
          <Chessboard
            fen={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={(square: string) =>
              onMouseOverSquare(square as Square)
            }
            onMouseOutSquare={onMouseOutSquare}
            onDrop={(move) => {
              const piece = game.get(move.sourceSquare as Square);
              const isPromotion =
                (move.sourceSquare[1] === '7' &&
                  move.targetSquare[1] === '8' &&
                  piece?.type === 'p') ||
                (move.sourceSquare[1] === '2' &&
                  move.targetSquare[1] === '1' &&
                  piece?.type === 'p');

              if (isPromotion) {
                handlePromotion(
                  move.sourceSquare as Square,
                  move.targetSquare as Square
                );
              } else {
                handleMove({
                  from: move.sourceSquare as Square,
                  to: move.targetSquare as Square,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
