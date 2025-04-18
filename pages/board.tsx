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
    greySquare(square);
    setSquareStyles({});
    moves.forEach((move: VerboseMove) => greySquare(move.to));
  };

  interface SquareStyles {
    [key: string]: {
      background: string;
      borderRadius: string;
    };
  }

  const greySquare = (square: Square): void => {
    setSquareStyles((prevStyles: SquareStyles) => ({
      ...prevStyles,
      [square]: {
        background: 'radial-gradient(circle, white 36%, transparent 40%)',
        borderRadius: '50%'
      }
    }));
  };

  const handleResetClick = () => {
    setSquareStyles({});
    game.reset();
    setFen(game.fen());
  };

  const handleUndoClick = () => {
    setSquareStyles({});
    setUndoneMove(game.undo() as Move | null);
    setFen(game.fen());
  };

  const handleRedoClick = () => {
    setSquareStyles({});
    if (undoneMove) {
      handleMove(undoneMove);
      setUndoneMove(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <title>Chess</title>
      <div className="flex justify-center items-center h-10vh space-x-4">
        <Button onClick={handleResetClick}>
          <FontAwesomeIcon icon={faRotate} />
        </Button>
        <Button onClick={handleUndoClick}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </Button>
        <Button onClick={handleRedoClick}>
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
      </div>
      <div className="flex justify-center items-center h-80vh">
        <ChessBoardLogic
          fen={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={(square: string) => onMouseOverSquare(square as Square)}
          onDrop={(move) => {
            const isPromotion = (move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && game.get(move.sourceSquare as Square).type === 'p') ||
                                (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && game.get(move.sourceSquare as Square).type === 'p');
            if (isPromotion) {
              handlePromotion(move.sourceSquare as Square, move.targetSquare as Square);
            } else {
              handleMove({ from: move.sourceSquare as Square, to: move.targetSquare as Square });
            }
          }}
        />
      </div>
    </div>
  )
}