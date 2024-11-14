import dynamic from 'next/dynamic';

const Chessboard = dynamic(
    () => import('chessboardjsx'),
    { ssr: false }
)

export default function ChessBoardLogic({ fen, squareStyles, onMouseOverSquare, onDrop }) {
    return (
        <Chessboard
            position={fen}
            squareStyles={squareStyles}
            onMouseOverSquare={onMouseOverSquare}
            onDrop={onDrop}
            calcWidth={({ screenWidth, screenHeight }) => {
                if (screenWidth < 640) {
                    return screenWidth * 0.9; // Smaller size for mobile devices
                }
                return screenHeight * 0.8; // Default size for larger screens
            }}
        />
    );
}