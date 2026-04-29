# Chess Online

Play chess with friends or AI. Built with Next.js 16 App Router.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Features

- **Play vs AI** - Challenge the computer
- **Local Game** - Play on the same device  
- **Multiplayer** - Play online with friends (Firebase auth)
- **Login/Signup** - Account system

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 6
- Tailwind CSS 4
- Firebase (Auth + Realtime DB)
- chess.js + js-chess-engine
- Biome (formatting)

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | Format check |

## Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx            # Home
├── vs-ai/page.tsx     # Play vs AI
├── board/page.tsx      # Local game
├── [slug]/page.tsx    # Multiplayer
├── login/             # Auth pages
├── loading.tsx       # Loading state
├── error.tsx         # Error boundary
├── robots.ts         # SEO
└── sitemap.ts       # SEO

components/           # React components
├── chessboard/       # Chess board UI
└── ui/              # UI components

lib/                 # Utilities
└── firebase.js      # Firebase config
```

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## License

MIT