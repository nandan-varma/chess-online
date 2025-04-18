"use client"

import { useState } from 'react';
// @ts-ignore
import { Chess, Square } from 'chess.js';
// @ts-ignore
import { Game } from 'js-chess-engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define interfaces for moves and chess piece
interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

interface ChessPiece {
  type: string;
  color: string;
}

// Helper function for delaying execution
const sleep = (seconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

export default function ChessGame() {
  const [fen, setFen] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState(new Game());
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [undoneMove, setUndoneMove] = useState<ChessMove | null>(null);

  const handleMove = async (move: ChessMove) => {
    if (isValidMove(move)) {
      game.move(move);
      setFen(game.fen());
      engine.move(move.from, move.to);
      setSquareStyles({});
      const aiMove = engine.aiMove();
      const aiMoveFormatted = formatMove(aiMove);
      await sleep(4);
      game.move(aiMoveFormatted);
      setFen(game.fen());
      if (game.isCheckmate()) {
        toast("You lost!", {
          description: "Checkmate.",
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

  const isValidMove = (move: ChessMove) => {
    return (game.moves({ square: move.from as Square, verbose: true }) as Array<{ from: string; to: string }>).some(obj => obj.to === move.to && obj.from === move.from);
  };

  const formatMove = (moveCoord: Record<string, string>): ChessMove => {
    const from = Object.keys(moveCoord)[0].toLowerCase();
    const to = moveCoord[Object.keys(moveCoord)[0]].toLowerCase();
    return { from, to };
  };

  const handlePromotion = (sourceSquare: string, targetSquare: string) => {
    const promotionPiece = prompt('Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 'q');
    handleMove({ from: sourceSquare, to: targetSquare, promotion: promotionPiece || 'q' });
  };

  const onMouseOverSquare = (square: string) => {
    const moves = game.moves({ square: square as Square, verbose: true });
    if (moves.length === 0) return;
    greySquare(square);
    setSquareStyles({});
    moves.forEach(move => greySquare(move.to));
  };

  const greySquare = (square: string) => {
    setSquareStyles((prevStyles) => ({
      ...prevStyles,
      [square]: {
        background: 'radial-gradient(circle, white 36%, transparent 40%)',
        borderRadius: '50%',
      },
    }));
  };

  const handleResetClick = () => {
    game.reset();
    setFen(game.fen());
    setEngine(new Game(game.fen()));
  };

  const handleUndoClick = () => {
    game.undo();
    // Cast the result to ChessMove or null as we know this is what undo returns
    setUndoneMove(game.undo() as ChessMove | null);
    setFen(game.fen());
    setEngine(new Game(game.fen()));
  };

  const handleRedoClick = () => {
    if (undoneMove) {
      handleMove(undoneMove);
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
        <Button>
          <FontAwesomeIcon icon={faRotateRight} />
        </Button>
      </div>
      <div className="flex justify-center items-center h-80vh">
        <ChessBoardLogic
          fen={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onDrop={(move) => {
            // Add null check for piece with optional chaining
            const piece = game.get(move.sourceSquare as Square);
            const isPromotion = piece && 
              ((move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && piece.type === 'p') ||
              (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && piece.type === 'p'));
              
            if (isPromotion) {
              handlePromotion(move.sourceSquare, move.targetSquare);
            } else {
              handleMove({ from: move.sourceSquare, to: move.targetSquare });
            }
          }}
        />
      </div>
    </div>
  );
}