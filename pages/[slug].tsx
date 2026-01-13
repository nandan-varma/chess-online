"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, database } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, onValue, off, get, update } from 'firebase/database';
// @ts-ignore
import { Chess, Square } from 'chess.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import ChessBoardLogic from '@/components/ChessBoard';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

interface GameData {
  id: string;
  FEN: string;
  createdBy: string;
  opponent: string | null;
}

export default function ChessGame() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [color, setColor] = useState<'w' | 'b'>('w');
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to maintain stable references
  const gameRef = useRef(new Chess());
  const gameDbRef = useRef<ReturnType<typeof ref> | null>(null);

  // Handle authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        toast.error("Please log in to play with friends.");
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Initialize game reference when slug and userId are available
  useEffect(() => {
    if (!slug || !userId || isInitialized) return;

    const gameId = typeof slug === 'string' ? slug : slug[0];
    gameDbRef.current = ref(database, `games/${gameId}`);

    // Initial game setup
    const initializeGame = async () => {
      try {
        const snapshot = await get(gameDbRef.current!);
        
        if (snapshot.exists()) {
          const data = snapshot.val() as GameData;
          setGameData(data);
          
          if (data.FEN) {
            gameRef.current.load(data.FEN);
            setFen(data.FEN);
          }
          
          if (data.createdBy === userId) {
            setColor('w');
          } else {
            setColor('b');
            // Only update opponent if not already set
            if (!data.opponent) {
              await update(gameDbRef.current!, { opponent: userId });
              toast.success("You joined the game and are ready to play!");
            }
          }
        } else {
          // Create new game
          const newGame: GameData = {
            id: gameId,
            FEN: gameRef.current.fen(),
            createdBy: userId,
            opponent: null
          };
          await set(gameDbRef.current!, newGame);
          setGameData(newGame);
          setColor('w');
          toast.info("Waiting for opponent to join the game...");
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing game:', error);
        toast.error("Failed to initialize game");
      }
    };

    initializeGame();
  }, [slug, userId, isInitialized]);

  // Listen for game updates
  useEffect(() => {
    if (!gameDbRef.current || !isInitialized) return;

    const handleValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as GameData;
        setGameData(data);
        
        if (data.FEN && data.FEN !== fen) {
          gameRef.current.load(data.FEN);
          setFen(data.FEN);
        }
      }
    };

    onValue(gameDbRef.current, handleValueChange);

    return () => {
      if (gameDbRef.current) {
        off(gameDbRef.current);
      }
    };
  }, [isInitialized, fen]);

  const handleMove = (move: ChessMove) => {
    if (gameRef.current.turn() !== color) {
      toast.warning("It's not your turn!");
      return;
    }

    const moves = gameRef.current.moves({ 
      square: move.from as Square, 
      verbose: true 
    });
    
    const isValidMove = moves.some(
      m => m.to === move.to && m.from === move.from
    );

    if (!isValidMove) {
      toast.error("Invalid move! Please make a valid move.");
      return;
    }

    try {
      gameRef.current.move(move);
      setSquareStyles({});
      const newFen = gameRef.current.fen();
      setFen(newFen);

      if (gameDbRef.current && gameData) {
        const updatedGame: GameData = {
          ...gameData,
          FEN: newFen
        };
        set(gameDbRef.current, updatedGame);
      }

      // Check game end conditions
      if (gameRef.current.isCheckmate()) {
        toast.success("Checkmate! You won!", {
          description: "The game is over."
        });
      } else if (gameRef.current.isDraw()) {
        toast.info("Draw!", {
          description: "The game is a draw."
        });
      } else if (gameRef.current.isCheck()) {
        toast.warning("Check!");
      }
    } catch (error) {
      console.error('Move error:', error);
      toast.error("Failed to make move");
    }
  };

  const handlePromotion = (sourceSquare: string, targetSquare: string) => {
    const promotionPiece = prompt(
      'Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 
      'q'
    );
    
    handleMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionPiece || 'q'
    });
  };

  const onMouseOverSquare = (square: string) => {
    if (gameRef.current.turn() !== color) return;
    
    const moves = gameRef.current.moves({ 
      square: square as Square, 
      verbose: true 
    });
    
    if (moves.length === 0) return;

    const newStyles: Record<string, React.CSSProperties> = {
      [square]: {
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
        borderRadius: '50%'
      }
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
    if (!gameDbRef.current || !gameData) return;

    setSquareStyles({});
    gameRef.current.reset();
    const newFen = gameRef.current.fen();
    setFen(newFen);

    const updatedGame: GameData = {
      ...gameData,
      FEN: newFen
    };
    
    set(gameDbRef.current, updatedGame);
    toast.info("Game has been reset");
  };

  if (!userId || !isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white overflow-hidden">
      <title>Chess Online</title>
      
      {/* Header with game info */}
      <div className="w-full px-2 py-2 sm:px-4 sm:py-3">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-1 sm:mb-2">Online Multiplayer</h1>
        <div className="text-center text-xs sm:text-sm text-gray-400 mb-1">
          {color === 'w' ? 'Playing as White' : 'Playing as Black'}
        </div>
        {gameData && !gameData.opponent && color === 'w' && (
          <div className="text-center">
            <p className="text-yellow-400 text-xs sm:text-sm">Waiting for opponent...</p>
          </div>
        )}
      </div>
      
      {/* Chess board container */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 overflow-hidden">
        <div className="w-full h-full max-w-[95vmin] max-h-[95vmin] sm:max-w-[90vmin] sm:max-h-[90vmin] aspect-square">
          <ChessBoardLogic
            fen={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onDrop={(move) => {
              const piece = gameRef.current.get(move.sourceSquare as Square);
              const isPromotion = piece?.type === 'p' && (
                (move.sourceSquare[1] === '7' && move.targetSquare[1] === '8') ||
                (move.sourceSquare[1] === '2' && move.targetSquare[1] === '1')
              );
              
              if (isPromotion) {
                handlePromotion(move.sourceSquare, move.targetSquare);
              } else {
                handleMove({ from: move.sourceSquare, to: move.targetSquare });
              }
            }}
          />
        </div>
      </div>
      
      {/* Share link section */}
      <div className="w-full px-2 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col items-center gap-2">
          {typeof slug === 'string' && <CopyToClipboard link={"/"+slug} />}
          <Button 
            onClick={handleResetClick}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
          >
            <FontAwesomeIcon icon={faRotate} className="mr-2" />
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  )
}