import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Game } from 'js-chess-engine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from "@/components/ui/button";

const Chessboard = dynamic(
  () => import('chessboardjsx'),
  { ssr: false }
)

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
      setSquareStyles({});
    }
  };

  const isValidMove = (move) => {
    return game.moves({ square: move.from, verbose: true }).some(obj => obj.to === move.to && obj.from === move.from);
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
    setUndoneMove(game.undo());
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
  )
}