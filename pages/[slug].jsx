import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import 'firebase/database';
import 'firebase/auth';
import { Chess } from 'chess.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ChessBoardLogic from '../components/ChessBoard';
import { Button } from "../components/ui/button";

const Chessboard = dynamic(
    () => import('chessboardjsx'),
    { ssr: false }
)

export default function ChessGame() {

    const db = firebase.database();
    const router = useRouter();
    const { slug } = router.query;
    const [data, setData] = useState(null);
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [squareStyles, setSquareStyles] = useState({});
    const [undoneMove, setUndoneMove] = useState(null);
    const ref = db.ref(`games/${slug}`);
    const [color, setColor] = useState('b');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUserId(user.uid);
            } else {
                router.push('/login');
            }
        });
    }, []);

    useEffect(() => {
        if (slug && userId) {
            ref.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const gameData = snapshot.val();
                    setData(gameData);
                    if (gameData.FEN) {
                        setFen(gameData.FEN);
                        game.load(gameData.FEN);
                    }
                    if (gameData.createdBy === userId) {
                        setColor('w');
                    }
                } else {
                    ref.set({ id: slug, FEN: fen, createdBy: userId });
                    setColor('w');
                }
            });
        }
    }, [slug, userId]);

    useEffect(() => {
        if (data) {
            ref.on('child_changed', (snapshot) => {
                setData((prevData) => ({
                    ...prevData,
                    [snapshot.key]: snapshot.val(),
                }));
                if (snapshot.val().FEN) {
                    game.load(snapshot.val().FEN);
                    setFen(game.fen());
                }
            });
        }
    }, [data, slug]);

    const handleMove = (move) => {
        if (game.turn() === color) {
            if (game.moves({ square: move.from, verbose: true }).some(obj => obj.to === move.to && obj.from === move.from)) {
                game.move(move);
                setSquareStyles({});
                ref.set({ id: slug, FEN: game.fen() });
            }
        }
    };

    const handlePromotion = (sourceSquare, targetSquare) => {
        const promotionPiece = prompt('Choose a promotion piece (queen: q, rook: r, bishop: b, knight: n)', 'q');
        handleMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotionPiece
        });
    };

    const onMouseOverSquare = (square) => {
        if (game.turn() !== color) return;
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
        game.reset();
        setFen(game.fen());
        ref.set({ id: slug, FEN: game.fen(), createdBy: userId });
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
            <title>Chess</title>
            <div className="flex justify-center items-center h-10vh space-x-4">
                <Button onClick={handleResetClick}>
                    <FontAwesomeIcon icon={faRotate} />
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