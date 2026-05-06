/**
 * VS AI game page
 * Player vs Computer chess game with adjustable difficulty
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
import { Game } from 'js-chess-engine';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import Chessboard from '@/components/chessboard';
import { Button } from '@/components/ui/button';
import type { ChessMove, SquareStyles } from '@/types';

/**
 * Route configuration
 */
export const Route = createFileRoute('/vs-ai')({
  component: VsAIGame,
  head: () => ({
    meta: [
      {
        title: 'Play vs AI - Chess Online',
      },
      {
        name: 'description',
        content:
          'Challenge the AI in a game of chess. Various difficulty levels available.',
      },
    ],
  }),
});

/**
 * Sleep utility for AI delay
 */
const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

/**
 * Format move from engine format to standard notation
 */
const formatMove = (moveCoord: Record<string, string>): ChessMove => {
  const keys = Object.keys(moveCoord);
  const key = keys[0];
  if (!key) return { from: '', to: '' };
  const from = key.toLowerCase();
  const to = moveCoord[key]?.toLowerCase() ?? '';
  return { from, to };
};

/**
 * VS AI game component
 */
function VsAIGame() {
  const [fen, setFen] = useState('start');
  const [game] = useState(() => new Chess());
  const [engine, setEngine] = useState(() => new Game());
  const [squareStyles, setSquareStyles] = useState<SquareStyles>({});
  const [undoneMove, setUndoneMove] = useState<ChessMove | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Validate if a move is legal
   */
  const isValidMove = useCallback(
    (move: ChessMove): boolean => {
      return (
        game.moves({ square: move.from as Square, verbose: true }) as Array<{
          from: string;
          to: string;
        }>
      ).some((obj) => obj.to === move.to && obj.from === move.from);
    },
    [game]
  );

  /**
   * Handle player move
   */
  const handleMove = useCallback(
    async (move: ChessMove) => {
      if (isProcessing) return;

      if (!isValidMove(move)) {
        toast.error('Invalid move!', {
          description: 'Please make a valid move.',
        });
        return;
      }

      setIsProcessing(true);
      setUndoneMove(null);

      try {
        // Player move
        game.move(move);
        setFen(game.fen());
        engine.move(move.from, move.to);
        setSquareStyles({});

        // Check game state
        if (game.isCheckmate()) {
          toast.success('You won!', { description: 'Checkmate.' });
          setIsProcessing(false);
          return;
        }

        if (game.isDraw()) {
          toast.info('Draw!', { description: 'The game is a draw.' });
          setIsProcessing(false);
          return;
        }

        // AI move
        await sleep(0.3);

        const aiMove = engine.aiMove();
        const aiMoveFormatted = formatMove(aiMove);

        game.move(aiMoveFormatted);
        setFen(game.fen());

        // Check game state after AI move
        if (game.isCheckmate()) {
          toast.error('You lost!', { description: 'Checkmate.' });
        } else if (game.isDraw()) {
          toast.info('Draw!', { description: 'The game is a draw.' });
        } else if (game.isCheck()) {
          toast.warning('Check!', { description: 'Your king is in check.' });
        }
      } catch (error) {
        console.error('Move error:', error);
        toast.error('Error!', { description: 'Failed to make move.' });
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, isValidMove, game, engine]
  );

  /**
   * Handle pawn promotion
   */
  const handlePromotion = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      const promotionPiece = prompt(
        'Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)',
        'q'
      );

      handleMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionPiece || 'q',
      });
    },
    [handleMove]
  );

  /**
   * Show available moves on square hover
   */
  const onMouseOverSquare = useCallback(
    (square: string) => {
      if (isProcessing) return;

      const moves = game.moves({ square: square as Square, verbose: true });

      if (moves.length === 0) return;

      const newStyles: SquareStyles = {};
      newStyles[square] = {
        background:
          'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
        borderRadius: '50%',
      };

      moves.forEach((move) => {
        newStyles[move.to] = {
          background:
            'radial-gradient(circle, rgba(0,0,0,0.2) 36%, transparent 40%)',
          borderRadius: '50%',
        };
      });

      setSquareStyles(newStyles);
    },
    [isProcessing, game]
  );

  /**
   * Clear square styles on mouse out
   */
  const onMouseOutSquare = useCallback(() => {
    setSquareStyles({});
  }, []);

  /**
   * Reset the game
   */
  const handleResetClick = useCallback(() => {
    setSquareStyles({});
    setUndoneMove(null);
    setIsProcessing(false);
    game.reset();
    setFen(game.fen());
    setEngine(new Game());
  }, [game, engine]);

  /**
   * Undo last move
   */
  const handleUndoClick = useCallback(() => {
    setSquareStyles({});

    game.undo();
    game.undo();

    const playerMove = game.undo();
    if (playerMove) {
      setUndoneMove(playerMove as ChessMove);
      setFen(game.fen());
      setEngine(new Game(game.fen()));
    }
  }, [game, engine]);

  /**
   * Redo last move
   */
  const handleRedoClick = useCallback(() => {
    setSquareStyles({});
    if (undoneMove && isValidMove(undoneMove)) {
      game.move(undoneMove);
      setFen(game.fen());
      setEngine(new Game(game.fen()));
      setUndoneMove(null);
    }
  }, [undoneMove, isValidMove, game, engine]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full px-2 py-2 sm:px-4 sm:py-3 shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">
          Play vs AI
        </h1>
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          <Button
            onClick={handleResetClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={isProcessing}
            title="Reset game"
          >
            <FontAwesomeIcon icon={faRotate} className="text-sm sm:text-base" />
          </Button>
          <Button
            onClick={handleUndoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={isProcessing}
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
            disabled={isProcessing || !undoneMove}
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
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onDrop={async (move) => {
              const piece = game.get(move.sourceSquare as Square);
              const isPromotion =
                piece &&
                ((move.sourceSquare[1] === '7' &&
                  move.targetSquare[1] === '8' &&
                  piece.type === 'p') ||
                  (move.sourceSquare[1] === '2' &&
                    move.targetSquare[1] === '1' &&
                    piece.type === 'p'));

              if (isPromotion) {
                handlePromotion(move.sourceSquare, move.targetSquare);
              } else {
                await handleMove({
                  from: move.sourceSquare,
                  to: move.targetSquare,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
