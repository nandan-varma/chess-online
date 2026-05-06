# Custom Chessboard Component

A modern, performant chessboard component built from scratch with React and TypeScript. This replaces the `chessboardjsx` library with a custom implementation following current best practices.

## Features

- ✅ **Drag and drop** piece movement
- ✅ **FEN string support** for board position
- ✅ **Customizable styling** for squares and board
- ✅ **Event handlers** for clicks, hover, and drag events
- ✅ **Orientation support** (white or black at bottom)
- ✅ **SVG chess pieces** with high-quality vector graphics
- ✅ **TypeScript** with full type safety
- ✅ **Optimized rendering** with proper memoization
- ✅ **Responsive** - works with any board size
- ✅ **Zero external dependencies** (except React)

## Structure

```
components/chessboard/
├── Chessboard.tsx    # Main chessboard component
├── Square.tsx        # Individual square component
├── pieces.tsx        # Chess piece SVG graphics
├── types.ts          # TypeScript type definitions
├── utils.ts          # Utility functions (FEN parsing, coordinates)
└── index.ts          # Barrel export
```

## Usage

```tsx
import Chessboard from '@/components/chessboard';

function MyChessGame() {
  const [fen, setFen] = useState('start');

  const handleDrop = (move: { sourceSquare: string; targetSquare: string }) => {
    // Handle the move
    console.log(`Move from ${move.sourceSquare} to ${move.targetSquare}`);
  };

  return (
    <Chessboard
      position={fen}
      onDrop={handleDrop}
      width={600}
      orientation="white"
    />
  );
}
```

## Props

### ChessboardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `string \| Position` | Required | FEN string or position object |
| `width` | `number` | `560` | Board width in pixels |
| `orientation` | `'white' \| 'black'` | `'white'` | Which side is at the bottom |
| `draggable` | `boolean` | `true` | Enable/disable piece dragging |
| `onDrop` | `(move) => void` | - | Called when a piece is dropped |
| `onSquareClick` | `(square) => void` | - | Called when a square is clicked |
| `onSquareRightClick` | `(square) => void` | - | Called on right-click |
| `onMouseOverSquare` | `(square) => void` | - | Called on mouse hover |
| `onMouseOutSquare` | `(square) => void` | - | Called when mouse leaves square |
| `squareStyles` | `Record<string, CSSProperties>` | `{}` | Custom styles per square |
| `boardStyle` | `CSSProperties` | `{}` | Custom board container style |
| `lightSquareStyle` | `CSSProperties` | `{}` | Custom light square style |
| `darkSquareStyle` | `CSSProperties` | `{}` | Custom dark square style |
| `id` | `string` | `'chessboard'` | DOM id attribute |

## Examples

### Basic Board

```tsx
<Chessboard position="start" width={500} />
```

### With Custom Styling

```tsx
<Chessboard
  position={fen}
  squareStyles={{
    e4: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    d5: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
  }}
  lightSquareStyle={{ backgroundColor: '#f0d9b5' }}
  darkSquareStyle={{ backgroundColor: '#b58863' }}
/>
```

### With Move Validation

```tsx
function ChessGame() {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [squareStyles, setSquareStyles] = useState({});

  const highlightSquare = (square: string) => {
    const moves = game.moves({ square, verbose: true });
    const highlights = {};
    
    moves.forEach(move => {
      highlights[move.to] = {
        background: 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    
    setSquareStyles(highlights);
  };

  const handleDrop = (move) => {
    const result = game.move({
      from: move.sourceSquare,
      to: move.targetSquare,
      promotion: 'q'
    });
    
    if (result) {
      setFen(game.fen());
      setSquareStyles({});
    }
  };

  return (
    <Chessboard
      position={fen}
      onDrop={handleDrop}
      onMouseOverSquare={highlightSquare}
      squareStyles={squareStyles}
    />
  );
}
```

## FEN String Support

The component accepts standard FEN notation:

```tsx
// Starting position
<Chessboard position="start" />

// Or explicit FEN
<Chessboard position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />

// Custom position
<Chessboard position="8/8/8/4k3/8/8/4K3/8 w - - 0 1" />
```

## Position Object

You can also pass a position object directly:

```tsx
const position = {
  e4: 'wP',  // white pawn on e4
  e5: 'bP',  // black pawn on e5
  e1: 'wK',  // white king on e1
  e8: 'bK',  // black king on e8
};

<Chessboard position={position} />
```

### Piece Notation

- Prefix: `w` (white) or `b` (black)
- Piece: `P` (pawn), `N` (knight), `B` (bishop), `R` (rook), `Q` (queen), `K` (king)
- Examples: `wP`, `bN`, `wQ`, etc.

## Technical Details

### Performance

- Components use proper memoization to prevent unnecessary re-renders
- SVG pieces are inlined for optimal performance
- Drag and drop uses native HTML5 API
- No external dependencies beyond React

### Browser Compatibility

- Works with all modern browsers
- Uses standard HTML5 drag and drop API
- CSS Grid for layout
- No polyfills needed for modern browsers

### TypeScript

Full TypeScript support with exported types:

```tsx
import { 
  ChessboardProps, 
  Position, 
  Piece, 
  Square 
} from '@/components/chessboard';
```

## Migration from chessboardjsx

The API is largely compatible with `chessboardjsx`. Key differences:

1. No need for dynamic imports - works with SSR out of the box
2. More predictable prop handling
3. Better TypeScript support
4. Cleaner SVG pieces

### Before

```tsx
import dynamic from 'next/dynamic';
const Chessboard = dynamic(() => import('chessboardjsx'), { ssr: false });
```

### After

```tsx
import Chessboard from '@/components/chessboard';
// Works with SSR, no dynamic import needed!
```

## Contributing

To modify or extend the component:

1. **pieces.tsx** - Add/modify SVG piece graphics
2. **utils.ts** - Add utility functions for coordinates, FEN parsing, etc.
3. **types.ts** - Update TypeScript definitions
4. **Square.tsx** - Modify individual square behavior
5. **Chessboard.tsx** - Modify board-level logic

## License

Part of the chess-online project.
