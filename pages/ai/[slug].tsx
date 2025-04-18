"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @ts-ignore
import { Chess, Square } from 'chess.js';
// @ts-ignore
import { Game } from 'js-chess-engine';
import ChessBoardLogic from '@/components/ChessBoard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export default function AIChessGame() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [fen, setFen] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState<Game | null>(null);
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [color, setColor] = useState('w');

  useEffect(() => {
    // Initialize engine once the component is mounted
    if (!engine) {
      setEngine(new Game());
    }
  }, [engine]);

  const handleMove = async (move: ChessMove) => {
    if (!engine) return;
    
    if (isValidMove(move)) {
      game.move(move);
      setFen(game.fen());
      
      try {
        engine.move(move.from, move.to);
        setSquareStyles({});
        
        if (game.isGameOver()) {
          if (game.isCheckmate()) {
            toast("You won!", {
              description: "Checkmate.",
            });
          } else if (game.isDraw()) {
            toast("Draw!", {
              description: "The game is a draw.",
            });
          }
          return;
        }
        
        // AI's turn
        await sleep(0.5);
        
        const aiMove = engine.aiMove();
        const aiMoveFormatted = formatMove(aiMove);
        
        if (aiMoveFormatted && isValidMove(aiMoveFormatted)) {
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
        }
      } catch (error) {
        console.error("Error in AI move:", error);
        toast("Error in AI move", {
          description: "Something went wrong with the AI's move.",
        });
      }
    } else {
      toast("Invalid move!", {
        description: "Please make a valid move.",
      });
    }
  };

  const isValidMove = (move: ChessMove): boolean => {
    return game.moves({ square: move.from as Square, verbose: true }).some(
      (obj: any) => obj.to === move.to && obj.from === move.from
    );
  };

  const formatMove = (moveCoord: Record<string, string>): ChessMove | null => {
    if (!moveCoord || Object.keys(moveCoord).length === 0) return null;
    
    const from = Object.keys(moveCoord)[0].toLowerCase();
    const to = moveCoord[Object.keys(moveCoord)[0]].toLowerCase();
    return { from, to };
  };

  const handlePromotion = (sourceSquare: string, targetSquare: string) => {
    const promotionPiece = prompt('Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 'q');
    handleMove({ 
      from: sourceSquare, 
      to: targetSquare, 
      promotion: promotionPiece || 'q'
    });
  };

  const onMouseOverSquare = (square: string) => {
    const moves = game.moves({ square: square as Square, verbose: true });
    if (moves.length === 0) return;
    
    greySquare(square);
    setSquareStyles({});
    moves.forEach((move: any) => greySquare(move.to));
  };

  const greySquare = (square: string) => {
    setSquareStyles((prevStyles) => ({
      ...prevStyles,
      [square]: {
        background: 'radial-gradient(circle, white 36%, transparent 40%)',
        borderRadius: '50%'
      }
    }));
  };

  const handleResetClick = () => {
    game.reset();
    setFen(game.fen());
    if (engine) {
      setEngine(new Game());
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <title>Chess vs AI</title>
      <div className="flex justify-center items-center h-10vh space-x-4">
        <Button onClick={handleResetClick}>Reset Game</Button>
      </div>
      <div className="flex justify-center items-center h-80vh">
        <ChessBoardLogic
          fen={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onDrop={(move) => {
            // Check if it's the player's turn
            if (game.turn() !== color) {
              toast("Wait for your turn!", {
                description: "AI is thinking...",
              });
              return;
            }
            
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