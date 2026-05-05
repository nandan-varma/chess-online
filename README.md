# Chess Online

Play chess with friends or AI. Built with TanStack Start, React 19, and TypeScript.

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## ✨ Features

- **Play vs AI** - Challenge the computer with js-chess-engine
- **Local Game** - Play on the same device with a friend
- **Multiplayer** - Play online with friends using Firebase Realtime Database
- **Authentication** - Firebase Auth with email/password sign up
- **Real-time Sync** - Live game state synchronization across devices

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start/latest) - React framework with SSR support
- **Build Tool**: [Vite](https://vite.dev) - Next generation frontend tooling
- **React**: 19 - Latest React with improved performance
- **TypeScript**: 6 - Strict type checking
- **Styling**: Tailwind CSS 4 - Utility-first CSS
- **UI Components**: Radix UI + custom components
- **Database**: Firebase Realtime Database - Real-time game synchronization
- **Authentication**: Firebase Auth - Secure user management
- **Chess Engine**: 
  - [chess.js](https://github.com/jhlywa/chess.js) - Chess logic and validation
  - [js-chess-engine](https://github.com/bsaleh/js-chess-engine) - AI opponent
- **Drag & Drop**: react-dnd - Chess piece movement
- **Notifications**: Sonner - Toast notifications
- **Icons**: Lucide React + FontAwesome

## 📂 Project Structure

```
src/
├── app/                    # TanStack Router file-based routes
│   ├── __root.tsx         # Root layout
│   ├── index.tsx          # Home page
│   ├── vs-ai.tsx          # AI game
│   ├── board.tsx          # Local game
│   ├── $slug.tsx          # Multiplayer (dynamic route)
│   ├── login.tsx          # Authentication
│   ├── signup.tsx         # User registration
│   └── HomeClientCard.tsx # Client-side component for home
│
├── components/            # React components
│   ├── ChessBoard.tsx     # Main board component wrapper
│   ├── NavBar.tsx         # Navigation bar
│   ├── CopyToClipboard.tsx # Share game link
│   ├── chessboard/        # Chessboard UI components
│   │   ├── Chessboard.tsx
│   │   ├── Square.tsx
│   │   ├── pieces.tsx
│   │   ├── utils.ts
│   │   └── types.ts
│   ├── providers/         # Context providers
│   │   └── Providers.tsx  # Global providers setup
│   └── ui/                # UI component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── dropdown-menu.tsx
│       ├── sonner.tsx
│       └── ...
│
├── lib/                   # Utilities and services
│   ├── firebase.ts        # Firebase configuration
│   ├── theme.ts           # Theme management
│   └── utils.ts           # Helper functions
│
├── types/                 # TypeScript type definitions
│   └── index.ts          # Centralized types
│
├── styles/                # Global styles
│   └── globals.css       # Tailwind styles
│
├── main.tsx              # App entry point
├── router.tsx            # TanStack Router config
└── public/               # Static assets

```

## 🎮 Game Modes

### 1. **Play vs AI** (`/vs-ai`)
- Challenge the computer
- Adjustable difficulty levels via js-chess-engine
- Move undo/redo functionality
- Visual move indicators

### 2. **Local Game** (`/board`)
- Two-player chess on same device
- Full move history
- Undo/redo support
- Pawn promotion handling

### 3. **Multiplayer** (`/:gameId`)
- Real-time online play with friends
- Firebase Realtime Database synchronization
- Player authentication required
- Share game link with friends
- Color assignment (creator = white, joiner = black)

## 🔐 Authentication

- Firebase Authentication with email/password
- Protected multiplayer route
- Automatic redirect for unauthenticated users
- User session persistence

## 🎯 Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
VITE_PUBLIC_FIREBASE_API_KEY=
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=
VITE_PUBLIC_FIREBASE_DATABASE_URL=
VITE_PUBLIC_FIREBASE_PROJECT_ID=
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
VITE_PUBLIC_FIREBASE_APP_ID=
```

See `.env.example` for reference.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check code formatting |
| `pnpm lint:fix` | Auto-fix formatting issues |
| `pnpm typecheck` | TypeScript type checking |

## 🏗️ Architecture Highlights

### Type Safety
- Centralized type definitions in `src/types/`
- Strict TypeScript configuration
- Full type coverage across all components

### Component Organization
- Smart/Container components handle logic
- Presentational components focus on UI
- Proper separation of concerns

### Performance
- Vite fast HMR (Hot Module Replacement)
- React 19 optimized rendering
- Lazy loading routes with TanStack Router
- Memoized callbacks and components where needed

### Firebase Integration
- Singleton Firebase app instance
- Real-time listeners with proper cleanup
- Error handling and validation

### State Management
- React hooks for local state
- Firebase for persistent state
- No external state management needed

## 🚀 Deployment

### Vercel (Recommended)
```bash
pnpm install -g vercel
vercel
```

### Docker
```bash
docker build -t chess-online .
docker run -p 3000:3000 chess-online
```

### Build for Production
```bash
pnpm build
```

Output will be in `.output/` directory ready for deployment.

## 🔍 Development Tips

### Hot Reload
Changes are automatically reflected with Vite's HMR - no refresh needed!

### TypeScript Strict Mode
This project uses TypeScript strict mode. Address type errors for better code quality.

### Firebase Emulator (Optional)
For local Firebase testing, install the Firebase CLI and run:
```bash
firebase emulators:start
```

## 📚 Key Dependencies

### Core
- `@tanstack/react-router` - File-based routing
- `@tanstack/react-start` - SSR-ready React framework
- `vite` - Build tool and dev server
- `react` & `react-dom` - React library

### Game Logic
- `chess.js` - Chess move validation and FEN parsing
- `js-chess-engine` - AI engine
- `react-dnd` - Drag and drop support

### UI/UX
- `tailwindcss` - CSS utility framework
- `@radix-ui` - Accessible UI primitives
- `lucide-react` - Icon library
- `sonner` - Toast notifications

### Backend
- `firebase` - Auth and Realtime Database
- `nitro` - Server framework

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint:fix` to format code
4. Submit a pull request

## 📄 License

MIT

## 👤 Author

Nandan Varma

## 🐛 Known Limitations

- AI difficulty is fixed (can be enhanced)
- No game chat feature yet
- No tournament mode
- No game history/stats tracking

## 🎯 Future Enhancements

- [ ] Adjustable AI difficulty levels
- [ ] Game rating/ELO system
- [ ] Chat during multiplayer games
- [ ] Game history and analysis
- [ ] Mobile app (React Native)
- [ ] Tournament mode
- [ ] Time controls (blitz, rapid, classical)
- [ ] Openings database

## 📞 Support

For issues and feature requests, please create a GitHub issue.

---

**Migration Notes**: This project was migrated from Next.js to TanStack Start with enterprise-grade React and TypeScript best practices. See `MIGRATION_PLAN.md` for detailed migration information.
