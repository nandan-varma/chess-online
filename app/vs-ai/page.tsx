'use client';

import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from '@/components/ui/button';
import {
  faRotate,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { Chess, type Square } from 'chess.js';
// @ts-ignore
import { Engine, Game } from 'js-chess-engine';
import { useState } from 'react';
import { toast } from 'sonner';

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export default function VsAI() {
  const [fen, setFen] = useState('start');
  const [game] = useState(() => new Chess());
  const [engine, setEngine] = useState(() => new Game());
  const [squareStyles, setSquareStyles] = useState<
    Record<string, React.CSSProperties>
  >({});
  const [undoneMove, setUndoneMove] = useState<ChessMove | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isValidMove = (move: ChessMove) => {
    return (
      game.moves({ square: move.from as Square, verbose: true }) as Array<{
        from: string;
        to: string;
      }>
    ).some((obj) => obj.to === move.to && obj.from === move.from);
  };

  const handleMove = async (move: ChessMove) => {
    if (isProcessing) return;

    if (isValidMove(move)) {
      setIsProcessing(true);
      setUndoneMove(null);

      try {
        game.move(move);
        setFen(game.fen());
        engine.move(move.from, move.to);
        setSquareStyles({});

        if (game.isCheckmate()) {
          toast('You won!', { description: 'Checkmate.' });
          setIsProcessing(false);
          return;
        } else if (game.isDraw()) {
          toast('Draw!', { description: 'The game is a draw.' });
          setIsProcessing(false);
          return;
        }

        const aiMove = engine.aiMove();
        const aiMoveFormatted = formatMove(aiMove);

        await sleep(0.3);

        game.move(aiMoveFormatted);
        setFen(game.fen());

        if (game.isCheckmate()) {
          toast('You lost!', { description: 'Checkmate.' });
        } else if (game.isDraw()) {
          toast('Draw!', { description: 'The game is a draw.' });
        }
      } catch (error) {
        console.error('Move error:', error);
        toast('Error!', { description: 'Failed to make move.' });
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast('Invalid move!', { description: 'Please make a valid move.' });
    }
  };

  const formatMove = (moveCoord: Record<string, string>): ChessMove => {
    const keys = Object.keys(moveCoord);
    const key = keys[0];
    if (!key) return { from: '', to: '' };
    const from = key.toLowerCase();
    const to = moveCoord[key]?.toLowerCase() ?? '';
    return { from, to };
  };

  const handlePromotion = (sourceSquare: string, targetSquare: string) => {
    const promotionPiece = prompt(
      'Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)',
      'q'
    );
    handleMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionPiece || 'q',
    });
  };

  const onMouseOverSquare = (square: string) => {
    if (isProcessing) return;
    const moves = game.moves({ square: square as Square, verbose: true });
    if (moves.length === 0) return;
    const newStyles: Record<string, React.CSSProperties> = {};
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
  };

  const onMouseOutSquare = () => {
    setSquareStyles({});
  };

  const handleResetClick = () => {
    setSquareStyles({});
    setUndoneMove(null);
    setIsProcessing(false);
    game.reset();
    setFen(game.fen());
    setEngine(new Game());
  };

  const handleUndoClick = () => {
    setSquareStyles({});
    const oldEngine = new Engine();
    game.undo();
    game.undo();

    const playerMove = game.undo();
    if (playerMove) {
      setUndoneMove(playerMove as ChessMove);
      setFen(game.fen());
      setEngine(new Game(game.fen()));
    }
  };

  const handleRedoClick = () => {
    setSquareStyles({});
    if (undoneMove && isValidMove(undoneMove)) {
      game.move(undoneMove);
      setFen(game.fen());
      setEngine(new Game(game.fen()));
      setUndoneMove(null);
    }
  };

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
          >
            <FontAwesomeIcon icon={faRotate} className="text-sm sm:text-base" />
          </Button>
          <Button
            onClick={handleUndoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={isProcessing}
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
          <ChessBoardLogic
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
