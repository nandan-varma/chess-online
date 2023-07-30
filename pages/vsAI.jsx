import dynamic from 'next/dynamic';
import { use, useState } from 'react';
import { Chess } from 'chess.js';
import { Game, move, status, moves, aiMove, getFen } from 'js-chess-engine'
import {FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartMixed, faRotate, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons'
// import Chessboard from 'chessboardjsx';
const Chessboard = dynamic(
  () => import('chessboardjsx'),
  { ssr: false }
)

export default function ChessGame() {
  const [fen, setFen] = useState('start');
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState(new Game());
  const [squareStyles, setSquareStyles] = useState({});
  const [UnddoneMove, setUndoneMove] = useState(null)

  const handleMove = (move) => {
    if (game.moves({ square: move.from, verbose: true }).some(obj => obj.to == move.to && obj.from == move.from)) {
      game.move(move)
      setFen(game.fen());
      console.log(move)
      //   move = {from : move.from.toUpperCase(), to : move.to.toUpperCase()}
      engine.move(move.from, move.to)
      setSquareStyles({})
      const moveCoord = engine.aiMove();
      // console.log(moveCoord)
      move = { from: Object.keys(moveCoord)[0].toLowerCase(), to: moveCoord[Object.keys(moveCoord)[0]].toLowerCase() }
      game.move(move)
      setFen(game.fen());
    }
  }


  const handlePromotion = (sourceSquare, targetSquare) => {
    const promotionPiece = prompt('Choose a promotion piece (queen : q , rook : r, bishop : b, knight : n)', 'q');
    handleMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionPiece
    });
  }

  const onMouseOverSquare = (square, piece) => {
    var moves = game.moves({
      square: square,
      verbose: true
    })
    if (moves.length === 0) return
    greySquare(square)
    setSquareStyles({})
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
  }

  const greySquare = (square) => {
    setSquareStyles((prevStyles) => ({
      ...prevStyles,
      [square]: {
        background: 'radial-gradient(circle, white 36%, transparent 40%)',
        borderRadius: '50%'
      }
    }));
  }
  const handleResetClick = () => {
    game.reset();
    setFen(game.fen());
    setEngine(new Game(game.fen()))
  }
  const handleUndoClick = () => {
    game.undo()
    setUndoneMove(game.undo())
    setFen(game.fen());
    setEngine(new Game(game.fen()))
  }
  const handleRedoClick = () => {
    handleMove(UnddoneMove)
  }

  return (
    <div>
      <title>Chess</title>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" , height: "10vh"}}>
      <FontAwesomeIcon className='menu-icon' onClick={handleResetClick} icon={faRotate} />
      <FontAwesomeIcon className='menu-icon' onClick={handleUndoClick} icon={faRotateLeft} />
      {/* <FontAwesomeIcon className='menu-icon' onClick={handleRedoClick} icon={faRotateRight} /> */}
      <FontAwesomeIcon className='menu-icon' icon={faChartMixed} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" , color : "white" }}>
      <Chessboard 
      calcWidth={({ screenWidth, screenHeight }) => screenHeight * 0.8}
      boardStyle={{
        borderRadius: "5px",
        boxShadow: `0 5px 15px rgba(255, 255, 255, 0.5)`
      }}
        className={'chessboard'}
        position={fen}
        squareStyles={squareStyles}
        onMouseOverSquare={onMouseOverSquare}
        onDrop={(move) => {
          if (
            move.sourceSquare[1] === '7' &&
            move.targetSquare[1] === '8' &&
            game.get(move.sourceSquare).type === 'p'
          ) {
            handlePromotion(move.sourceSquare, move.targetSquare);
          } else if (
            move.sourceSquare[1] === '2' &&
            move.targetSquare[1] === '1' &&
            game.get(move.sourceSquare).type === 'p'
          ) {
            handlePromotion(move.sourceSquare, move.targetSquare);
          } else {
            handleMove({
              from: move.sourceSquare,
              to: move.targetSquare
            });
          }
        }}
      />
      </div>
    </div>
  )
}