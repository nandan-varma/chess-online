"use client"

import { useState } from 'react';
import { Chess } from 'chess.js';
import { Game } from 'js-chess-engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartMixed, faRotate, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChessGame() {
  const [fen, setFen] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState(new Game());
  const [squareStyles, setSquareStyles] = useState({});
  const [undoneMove, setUndoneMove] = useState(null);

  const handleMove = (move) => {
    if (isValidMove(move)) {
      game.move(move);
      setFen(game.fen());
      engine.move(move.from, move.to);
      setSquareStyles({});
      const aiMove = engine.aiMove();
      const aiMoveFormatted = formatMove(aiMove);
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

  const isValidMove = (move) => {
    return game.moves({ square: move.from, verbose: true }).some(obj => obj.to === move.to && obj.from === move.from);
  };

  const formatMove = (moveCoord) => {
    const from = Object.keys(moveCoord)[0].toLowerCase();
    const to = moveCoord[Object.keys(moveCoord)[0]].toLowerCase();
    return { from, to };
  };

  const handlePromotion = (sourceSquare, targetSquare) => {
    const promotionPiece = prompt('Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 'q');
    handleMove({ from: sourceSquare, to: targetSquare, promotion: promotionPiece });
  };

  const onMouseOverSquare = (square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) return;
    greySquare(square);
    setSquareStyles({});
    moves.forEach(move => greySquare(move.to));
  };

  const greySquare = (square) => {
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
    setUndoneMove(game.undo());
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
          <FontAwesomeIcon icon={faChartMixed} />
        </Button>
      </div>
      <div className="flex justify-center items-center h-80vh">
        <ChessBoardLogic
          fen={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onDrop={(move) => {
            const isPromotion = (move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && game.get(move.sourceSquare).type === 'p') ||
                                (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && game.get(move.sourceSquare).type === 'p');
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