"use client"

import { useState } from 'react';
import { Chess, Square } from 'chess.js';
// @ts-ignore
import { Game } from 'js-chess-engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChessGame() {
  const [fen, setFen] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState(new Game());
  const [squareStyles, setSquareStyles] = useState({});
  const [undoneMove, setUndoneMove] = useState<Move | null>(null);

  interface Move {
    from: Square;
    to: Square;
    promotion?: string;
  }

  const handleMove = (move: Move): void => {
    if (isValidMove(move)) {
      game.move(move);
      setFen(game.fen());
      setSquareStyles({});
      if (game.isCheckmate()) {
        toast("Checkmate!", {
          description: "You won.",
        });
      } else if (game.isDraw()) {
        toast("Draw!", {
          description: "The game is a draw.",
        });
      }
    } else {
      toast("Invalid move!", {
        description: "Please make a valid move.",
      });
    }
  };

  const isValidMove = (move: Move): boolean => {
    return game.moves({ square: move.from, verbose: true }).some(obj => obj.to === move.to && obj.from === move.from);
  };

  interface PromotionMove extends Move {
    promotion: string;
  }

  const handlePromotion = (sourceSquare: Square, targetSquare: Square): void => {
    const promotionPiece: string | null = prompt('Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 'q');
    if (promotionPiece) {
      const move: PromotionMove = { from: sourceSquare, to: targetSquare, promotion: promotionPiece };
      handleMove(move);
    }
  };

  interface VerboseMove {
    color: string;
    from: Square;
    to: Square;
    flags: string;
    piece: string;
    san: string;
    captured?: string;
    promotion?: string;
  }

  const onMouseOverSquare = (square: Square): void => {
    const moves: VerboseMove[] = game.moves({ square, verbose: true });
    if (moves.length === 0) return;
    const newStyles: SquareStyles = {};
    newStyles[square] = {
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
      borderRadius: '50%'
    };
    moves.forEach((move: VerboseMove) => {
      newStyles[move.to] = {
        background: 'radial-gradient(circle, rgba(0,0,0,0.2) 36%, transparent 40%)',
        borderRadius: '50%'
      };
    });
    setSquareStyles(newStyles);
  };

  const onMouseOutSquare = (): void => {
    setSquareStyles({});
  };

  interface SquareStyles {
    [key: string]: {
      background: string;
      borderRadius: string;
    };
  }

  const handleResetClick = () => {
    setSquareStyles({});
    setUndoneMove(null);
    game.reset();
    setFen(game.fen());
  };

  const handleUndoClick = () => {
    setSquareStyles({});
    const move = game.undo();
    if (move) {
      setUndoneMove(move as Move);
      setFen(game.fen());
    }
  };

  const handleRedoClick = () => {
    setSquareStyles({});
    if (undoneMove) {
      handleMove(undoneMove);
      setUndoneMove(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with controls */}
      <div className="w-full px-2 py-3 sm:px-4 sm:py-4 shrink-0">
        <div className="flex justify-center items-center gap-2 sm:gap-3">
          <Button 
            onClick={handleResetClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
          >
            <FontAwesomeIcon icon={faRotate} className="text-sm sm:text-base" />
          </Button>
          <Button 
            onClick={handleUndoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-sm sm:text-base" />
          </Button>
          <Button 
            onClick={handleRedoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={!undoneMove}
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-sm sm:text-base" />
          </Button>
        </div>
      </div>
      
      {/* Chess board container */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2 overflow-hidden">
        <div className="w-full aspect-square max-w-[90vmin]">
          <ChessBoardLogic
            fen={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={(square: string) => onMouseOverSquare(square as Square)}
            onMouseOutSquare={onMouseOutSquare}
            onDrop={(move) => {
              const isPromotion = (move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && game.get(move.sourceSquare as Square)?.type === 'p') ||
                                  (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && game.get(move.sourceSquare as Square)?.type === 'p');
              if (isPromotion) {
                handlePromotion(move.sourceSquare as Square, move.targetSquare as Square);
              } else {
                handleMove({ from: move.sourceSquare as Square, to: move.targetSquare as Square });
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}