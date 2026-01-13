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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMove = async (move: ChessMove) => {
    if (isProcessing) return;
    
    if (isValidMove(move)) {
      setIsProcessing(true);
      setUndoneMove(null);
      
      try {
        // Make player's move
        game.move(move);
        setFen(game.fen());
        engine.move(move.from, move.to);
        setSquareStyles({});
        
        // Check if game ended after player's move
        if (game.isCheckmate()) {
          toast("You won!", {
            description: "Checkmate.",
          });
          setIsProcessing(false);
          return;
        } else if (game.isDraw()) {
          toast("Draw!", {
            description: "The game is a draw.",
          });
          setIsProcessing(false);
          return;
        }
        
        // Calculate AI move
        const aiMove = engine.aiMove();
        const aiMoveFormatted = formatMove(aiMove);
        
        // Wait before making AI move
        await sleep(0.3);
        
        // Make AI move
        game.move(aiMoveFormatted);
        setFen(game.fen());
        
        // Check game state after AI move
        if (game.isCheckmate()) {
          toast("You lost!", {
            description: "Checkmate.",
          });
        } else if (game.isDraw()) {
          toast("Draw!", {
            description: "The game is a draw.",
          });
        }
      } catch (error) {
        console.error('Move error:', error);
        toast("Error!", {
          description: "Failed to make move.",
        });
      } finally {
        setIsProcessing(false);
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
    if (isProcessing) return;
    const moves = game.moves({ square: square as Square, verbose: true });
    if (moves.length === 0) return;
    const newStyles: Record<string, React.CSSProperties> = {};
    newStyles[square] = {
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
      borderRadius: '50%'
    };
    moves.forEach(move => {
      newStyles[move.to] = {
        background: 'radial-gradient(circle, rgba(0,0,0,0.2) 36%, transparent 40%)',
        borderRadius: '50%'
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
    // Undo AI move
    const aiMove = game.undo();
    // Undo player move
    const playerMove = game.undo();
    
    if (playerMove) {
      setUndoneMove(playerMove as ChessMove);
      setFen(game.fen());
      setEngine(new Game(game.fen()));
    }
  };

  const handleRedoClick = () => {
    setSquareStyles({});
    if (undoneMove) {
      // Only make the player's move, not the AI move
      if (isValidMove(undoneMove)) {
        game.move(undoneMove);
        setFen(game.fen());
        engine.move(undoneMove.from, undoneMove.to);
        setUndoneMove(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white overflow-hidden">
      <title>Chess vs AI</title>
      
      {/* Header with controls */}
      <div className="w-full px-2 py-2 sm:px-4 sm:py-3">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-3">Play vs AI</h1>
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
            <FontAwesomeIcon icon={faRotateLeft} className="text-sm sm:text-base" />
          </Button>
          <Button 
            onClick={handleRedoClick}
            className="w-10 h-10 sm:w-12 sm:h-12"
            size="icon"
            disabled={isProcessing || !undoneMove}
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-sm sm:text-base" />
          </Button>
        </div>
      </div>
      
      {/* Chess board container */}
      <div className="flex-1 flex items-center justify-center px-2 pb-2 sm:px-4 sm:pb-4 overflow-hidden">
        <div className="w-full h-full max-w-[95vmin] max-h-[95vmin] sm:max-w-[90vmin] sm:max-h-[90vmin] aspect-square">
          <ChessBoardLogic
            fen={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onDrop={async (move) => {
              // Add null check for piece with optional chaining
              const piece = game.get(move.sourceSquare as Square);
              const isPromotion = piece && 
                ((move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && piece.type === 'p') ||
                (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && piece.type === 'p'));
                
              if (isPromotion) {
                handlePromotion(move.sourceSquare, move.targetSquare);
              } else {
                await handleMove({ from: move.sourceSquare, to: move.targetSquare });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}