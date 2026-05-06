/**
 * Multiplayer chess game page
 * Real-time game using Firebase with dynamic game ID
 */

'use client'

import { Button } from '@/components/ui/button'
import ChessBoardLogic from '@/components/ChessBoard'
import CopyToClipboard from '@/components/CopyToClipboard'
import { auth, database } from '@/lib/firebase'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Square } from 'chess.js'
import { Chess } from 'chess.js'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import {
  get,
  off,
  onValue,
  ref,
  set,
  update,
  type DatabaseReference,
  type DataSnapshot,
} from 'firebase/database'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { ChessMove, GameData, PlayerColor, SquareStyles } from '@/types'

/**
 * Route configuration with path parameter
 */
export const Route = createFileRoute('/$slug')({
  component: MultiplayerGame,
  head: () => ({
    meta: [
      {
        title: 'Online Multiplayer - Chess Online',
      },
      {
        name: 'description',
        content: 'Play chess online with friends in real-time.',
      },
    ],
  }),
})

/**
 * Multiplayer game component
 */
function MultiplayerGame() {
  const navigate = useNavigate()
  const { slug } = Route.useParams()

  const [gameData, setGameData] = useState<GameData | null>(null)
  const [fen, setFen] = useState(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  )
  const [squareStyles, setSquareStyles] = useState<SquareStyles>({})
  const [color, setColor] = useState<PlayerColor>('w')
  const [userId, setUserId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const gameRef = useRef(new Chess())
  const gameDbRef = useRef<DatabaseReference | null>(null)

  /**
   * Initialize authentication
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid)
        setIsLoading(false)
      } else {
        toast.error('Please log in to play with friends.')
        navigate({ to: '/login' })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [navigate])

  /**
   * Initialize game data from Firebase
   */
  useEffect(() => {
    if (!slug || !userId || isInitialized) return

    const initializeGame = async () => {
      try {
        gameDbRef.current = ref(database, `games/${slug}`)

        const snapshot = await get(gameDbRef.current)

        if (snapshot.exists()) {
          const data = snapshot.val() as GameData
          setGameData(data)

          if (data.FEN) {
            gameRef.current.load(data.FEN)
            setFen(data.FEN)
          }

          // Determine player color
          if (data.createdBy === userId) {
            setColor('w')
          } else {
            setColor('b')
            if (!data.opponent) {
              await update(gameDbRef.current, { opponent: userId })
              toast.success(
                'You joined the game and are ready to play!'
              )
            }
          }
        } else {
          // Create new game
          const newGame: GameData = {
            id: slug,
            FEN: gameRef.current.fen(),
            createdBy: userId,
            opponent: null,
          }
          await set(gameDbRef.current, newGame)
          setGameData(newGame)
          setColor('w')
          toast.info('Waiting for opponent to join the game...')
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing game:', error)
        toast.error('Failed to initialize game')
        navigate({ to: '/' })
      }
    }

    initializeGame()
  }, [slug, userId, isInitialized, navigate])

  /**
   * Listen for game state changes in Firebase
   */
  useEffect(() => {
    if (!gameDbRef.current || !isInitialized) return

    const handleValueChange = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as GameData
        setGameData(data)

        if (data.FEN && data.FEN !== fen) {
          gameRef.current.load(data.FEN)
          setFen(data.FEN)
        }
      }
    }

    onValue(gameDbRef.current, handleValueChange)

    return () => {
      if (gameDbRef.current) {
        off(gameDbRef.current)
      }
    }
  }, [isInitialized, fen])

  /**
   * Handle move
   */
  const handleMove = useCallback(
    (move: ChessMove) => {
      if (gameRef.current.turn() !== color) {
        toast.warning("It's not your turn!")
        return
      }

      const moves = gameRef.current.moves({
        square: move.from as Square,
        verbose: true,
      })

      const isValidMove = moves.some(
        (m) => m.to === move.to && m.from === move.from
      )

      if (!isValidMove) {
        toast.error('Invalid move! Please make a valid move.')
        return
      }

      try {
        gameRef.current.move(move)
        setSquareStyles({})
        const newFen = gameRef.current.fen()
        setFen(newFen)

        // Update Firebase
        if (gameDbRef.current && gameData) {
          const updatedGame: GameData = {
            ...gameData,
            FEN: newFen,
          }
          set(gameDbRef.current, updatedGame)
        }

        // Check game state
        if (gameRef.current.isCheckmate()) {
          toast.success('Checkmate! You won!', {
            description: 'The game is over.',
          })
        } else if (gameRef.current.isDraw()) {
          toast.info('Draw!', {
            description: 'The game is a draw.',
          })
        } else if (gameRef.current.isCheck()) {
          toast.warning('Check!')
        }
      } catch (error) {
        console.error('Move error:', error)
        toast.error('Failed to make move')
      }
    },
    [color, gameData]
  )

  /**
   * Handle pawn promotion
   */
  const handlePromotion = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      const promotionPiece = prompt(
        'Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)',
        'q'
      )

      handleMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionPiece || 'q',
      })
    },
    [handleMove]
  )

  /**
   * Show available moves on square hover
   */
  const onMouseOverSquare = useCallback(
    (square: string) => {
      if (gameRef.current.turn() !== color) return

      const moves = gameRef.current.moves({
        square: square as Square,
        verbose: true,
      })

      if (moves.length === 0) return

      const newStyles: SquareStyles = {
        [square]: {
          background:
            'radial-gradient(circle, rgba(255,255,255,0.3) 36%, transparent 40%)',
          borderRadius: '50%',
        },
      }

      moves.forEach((move) => {
        newStyles[move.to] = {
          background:
            'radial-gradient(circle, rgba(0,0,0,0.2) 36%, transparent 40%)',
          borderRadius: '50%',
        }
      })

      setSquareStyles(newStyles)
    },
    [color]
  )

  /**
   * Clear square styles on mouse out
   */
  const onMouseOutSquare = useCallback(() => {
    setSquareStyles({})
  }, [])

  /**
   * Reset game
   */
  const handleResetClick = useCallback(() => {
    if (!gameDbRef.current || !gameData) return

    setSquareStyles({})
    gameRef.current.reset()
    const newFen = gameRef.current.fen()
    setFen(newFen)

    const updatedGame: GameData = {
      ...gameData,
      FEN: newFen,
    }

    set(gameDbRef.current, updatedGame)
    toast.info('Game has been reset')
  }, [gameData])

  if (isLoading || !userId || !isInitialized) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full px-2 py-2 sm:px-4 sm:py-3 shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-1 sm:mb-2">
          Online Multiplayer
        </h1>
        <div className="text-center text-xs sm:text-sm text-muted-foreground mb-1">
          {color === 'w' ? 'Playing as White' : 'Playing as Black'}
        </div>
        {gameData && !gameData.opponent && color === 'w' && (
          <div className="text-center">
            <p className="text-yellow-500 text-xs sm:text-sm animate-pulse">
              Waiting for opponent...
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2 overflow-hidden">
        <div className="w-full aspect-square max-w-[90vmin]">
          <ChessBoardLogic
            fen={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onDrop={(move) => {
              const piece = gameRef.current.get(
                move.sourceSquare as Square
              )
              const isPromotion =
                piece?.type === 'p' &&
                ((move.sourceSquare[1] === '7' &&
                  move.targetSquare[1] === '8') ||
                  (move.sourceSquare[1] === '2' &&
                    move.targetSquare[1] === '1'))

              if (isPromotion) {
                handlePromotion(move.sourceSquare, move.targetSquare)
              } else {
                handleMove({
                  from: move.sourceSquare,
                  to: move.targetSquare,
                })
              }
            }}
          />
        </div>
      </div>

      <div className="w-full px-2 py-2 sm:px-4 sm:py-3 shrink-0">
        <div className="flex flex-col items-center gap-2">
          <CopyToClipboard link={`/${slug}`} />
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
