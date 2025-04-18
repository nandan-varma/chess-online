"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import 'firebase/database';
import 'firebase/auth';
// @ts-ignore
import { Chess, Square } from 'chess.js';
import ChessBoardLogic from '@/components/ChessBoard';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

// Add Chess.js specific types
interface ChessJsMove {
  from: string;
  to: string;
  promotion?: string;
  piece?: string;
  color?: string;
  flags?: string;
  san?: string;
  captured?: string;
  type?: string;
}

interface GameData {
  id: string;
  FEN: string;
  createdBy: string;
  opponent: string | null;
}

// Type for ChessBoard component props
interface ChessBoardMove {
  sourceSquare: string;
  targetSquare: string;
}

export default function ChessGame() {
  const db = firebase.database();
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<GameData | null>(null);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [color, setColor] = useState('b');
  const [userId, setUserId] = useState<string | null>(null);
  
  // Initialize ref with a default to avoid errors, but will be updated when slug is available
  const [ref, setRef] = useState<firebase.database.Reference | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUserId(user.uid);
      } else {
        toast("Please log in to play with friends.");
        router.push('/login');
      }
    });
  }, []);

  useEffect(() => {
    if (slug) {
      const gameRef = db.ref(`games/${slug}`);
      setRef(gameRef);
    }
  }, [slug, db]);

  useEffect(() => {
    if (slug && userId && ref) {
      ref.once('value', (snapshot) => {
        if (snapshot.exists()) {
          const gameData = snapshot.val() as GameData;
          setData(gameData);
          if (gameData.FEN) {
            setFen(gameData.FEN);
            game.load(gameData.FEN);
          }
          if (gameData.createdBy === userId) {
            setColor('w');
          }
          else {
            setColor('b');
            // Only update opponent ID if it hasn't been set yet
            if (!gameData.opponent) {
              ref.update({ opponent: userId });
              toast("You joined the game and ready to play.");
            }
          }
        } else {
          ref.set({ id: slug, FEN: fen, createdBy: userId, opponent: null });
          setColor('w');
          toast("Waiting for opponent to join the game.");
        }
      });
      
      // Set up listener for ongoing changes after initial setup
      ref.on('value', (snapshot) => {
        if (snapshot.exists()) {
          const gameData = snapshot.val() as GameData;
          setData(gameData);
          if (gameData.FEN) {
            setFen(gameData.FEN);
            game.load(gameData.FEN);
          }
        }
      });
    }
  }, [slug, userId, ref, game, fen]);

  useEffect(() => {
    if (data && ref) {
      ref.on('child_changed', (snapshot) => {
        setData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            [snapshot.key as keyof GameData]: snapshot.val(),
          };
        });
        if (snapshot.key === 'FEN' && snapshot.val()) {
          game.load(snapshot.val());
          setFen(game.fen());
        }
      });
    }
    
    return () => {
      if (ref) {
        ref.off('child_changed');
        ref.off('value');
      }
    };
  }, [data, ref, game]);

  const handleMove = (move: ChessMove) => {
    if (game.turn() === color) {
      if (game.moves({ square: move.from as Square, verbose: true }).some(obj => obj.to === move.to && obj.from === move.from)) {
        game.move(move);
        setSquareStyles({});
        if (ref && slug) {
          ref.set({ id: slug, FEN: game.fen(), createdBy: userId, opponent: data?.opponent });
        }
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
    }
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
    if (game.turn() !== color) return;
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
        borderRadius: '50%'
      }
    }));
  };

  const handleResetClick = () => {
    game.reset();
    setFen(game.fen());
    if (ref && slug) {
      ref.set({ id: slug, FEN: game.fen(), createdBy: userId, opponent: data?.opponent });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      <title>Chess</title>
      <div className="flex justify-center items-center h-10vh space-x-4">
      </div>
      <div className="flex justify-center items-center h-80vh">
        <ChessBoardLogic
          fen={fen}
          squareStyles={squareStyles}
          onMouseOverSquare={onMouseOverSquare}
          onDrop={(move) => {
            const isPromotion = (move.sourceSquare[1] === '7' && move.targetSquare[1] === '8' && game.get(move.sourceSquare as Square)?.type === 'p') ||
              (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1' && game.get(move.sourceSquare as Square)?.type === 'p');
            if (isPromotion) {
              handlePromotion(move.sourceSquare, move.targetSquare);
            } else {
              handleMove({ from: move.sourceSquare, to: move.targetSquare });
            }
          }}
        />
      </div>
      <div>
        {typeof slug === 'string' && <CopyToClipboard link={"/"+slug} />}
      </div>
    </div>
  )
}