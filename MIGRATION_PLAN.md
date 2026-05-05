# Chess Online: Next.js → TanStack Start Migration Plan

## 📊 Project Analysis

### Current Stack
- **Framework**: Next.js 16 (App Router)
- **Key Dependencies**: React 19, TypeScript 6, Firebase, chess.js, react-dnd
- **Build Tool**: Webpack (Next.js built-in)
- **Styling**: Tailwind CSS 4, Radix UI
- **Package Manager**: pnpm

### Current Routes
```
app/
├── page.tsx                 # Home (/)
├── vs-ai/page.tsx          # Play vs AI (/vs-ai)
├── board/page.tsx          # Local game (/board)
├── [slug]/page.tsx         # Multiplayer (/[slug])
├── login/page.tsx          # Login (/login)
├── signup/page.tsx         # Signup (/signup)
├── layout.tsx              # Root layout
├── loading.tsx             # Loading state
├── error.tsx               # Error boundary
├── robots.ts               # SEO
└── sitemap.ts              # SEO
```

### Key Components
- Chessboard UI component
- UI components (from Radix UI + custom components)
- Firebase integration (Auth + Realtime DB)
- Chess engine logic (chess.js, js-chess-engine)

---

## 🎯 Migration Strategy (Phase-Based)

### Phase 1: Setup & Scaffolding (1-2 hours)
- [ ] Remove Next.js and related config
- [ ] Install TanStack Start + dependencies
- [ ] Create Vite + TanStack Start configuration
- [ ] Update package.json scripts
- [ ] Set up TypeScript for Vite

### Phase 2: Core Structure (2-3 hours)
- [ ] Create `src/app/__root.tsx` (from `layout.tsx`)
- [ ] Create `src/app/index.tsx` (from `page.tsx`)
- [ ] Create `src/router.tsx` file
- [ ] Convert all routes (vs-ai, board, [slug], login, signup)
- [ ] Update component imports

### Phase 3: Feature Conversion (2-3 hours)
- [ ] Convert dynamic routes (`[slug]` → `$slug`)
- [ ] Remove Server Components (convert to Client Components + Server Functions)
- [ ] Update Link components (next/link → @tanstack/react-router)
- [ ] Replace next/image with Unpic (if used)
- [ ] Convert API routes to Server Routes

### Phase 4: Testing & Refinement (1-2 hours)
- [ ] Test all routes
- [ ] Verify Firebase integration
- [ ] Test chess engine functionality
- [ ] Verify authentication flow
- [ ] Performance testing

### Phase 5: Cleanup & Optimization (30 mins - 1 hour)
- [ ] Remove unused dependencies
- [ ] Update environment variables
- [ ] Update deployment config
- [ ] Documentation

---

## 📋 Step-by-Step Execution

### Step 1: Remove Next.js Dependencies
```bash
pnpm remove next @tailwindcss/postcss
rm -f postcss.config.js next.config.js
```

### Step 2: Install TanStack Start & Dependencies
```bash
pnpm add @tanstack/react-router @tanstack/react-start nitro vite @vitejs/plugin-react
pnpm add -D @tailwindcss/vite tailwindcss
pnpm add @unpic/react  # For image optimization (if needed)
```

### Step 3: Create Vite Configuration
Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'app',
      },
    }),
    viteReact(),
    nitro(),
  ],
})
```

### Step 4: Restructure Project
```bash
# Create new structure
mkdir -p src/app
mkdir -p src/components
mkdir -p src/lib

# Move files
mv app/* src/app/
mv components/* src/components/
mv lib/* src/lib/
mv public src/
mv styles src/
```

### Step 5: Update Layout & Root Route
Convert `layout.tsx` → `src/app/__root.tsx`:
```typescript
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import appCss from './globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Chess Online' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

### Step 6: Convert All Routes

| Current | New | Notes |
|---------|-----|-------|
| `app/page.tsx` | `src/app/index.tsx` | Add `createFileRoute('/')` wrapper |
| `app/vs-ai/page.tsx` | `src/app/vs-ai.tsx` | Add `createFileRoute('/vs-ai')` wrapper |
| `app/board/page.tsx` | `src/app/board.tsx` | Add `createFileRoute('/board')` wrapper |
| `app/[slug]/page.tsx` | `src/app/$slug.tsx` | Use `Route.useParams()` for slug |
| `app/login/page.tsx` | `src/app/login.tsx` | Add `createFileRoute('/login')` wrapper |
| `app/signup/page.tsx` | `src/app/signup.tsx` | Add `createFileRoute('/signup')` wrapper |

**Example conversion**:
```typescript
// Before (Next.js)
export default function Home() {
  return <div>...</div>
}

// After (TanStack Start)
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <div>...</div>
}
```

### Step 7: Create Router Configuration
Create `src/router.tsx`:
```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}
```

### Step 8: Update Link Components
```typescript
// Before
import Link from 'next/link'
<Link href="/vs-ai">Play vs AI</Link>

// After
import { Link } from '@tanstack/react-router'
<Link to="/vs-ai">Play vs AI</Link>
```

### Step 9: Convert Server Components & Actions
```typescript
// Before (Next.js Server Component)
export default async function Page({ params }) {
  const gameData = await fetchGame(params.slug)
  return <div>{gameData}</div>
}

// After (TanStack Start with loader)
import { createServerFn } from '@tanstack/react-start'

const fetchGameServerFn = createServerFn().handler(async (slug) => {
  return await fetchGame(slug)
})

export const Route = createFileRoute('/game/$slug')({
  loader: async ({ params }) => fetchGameServerFn({ data: params.slug }),
  component: Page,
})

function Page() {
  const gameData = Route.useLoaderData()
  return <div>{gameData}</div>
}
```

### Step 10: Update package.json Scripts
```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 🔄 Route Conversion Mapping

### Home Page
```typescript
// src/app/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { home-client } from './home-client'

export const Route = createFileRoute('/')({
  component: home-client,
})
```

### Dynamic Route (Multiplayer)
```typescript
// src/app/$slug.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug')({
  component: MultiplayerGame,
})

function MultiplayerGame() {
  const { slug } = Route.useParams()
  // Use slug for game logic
  return <div>Game: {slug}</div>
}
```

### Static Routes (vs-ai, board, login, signup)
```typescript
// src/app/vs-ai.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vs-ai')({
  component: VsAI,
})

function VsAI() {
  return <div>AI Game</div>
}
```

---

## 🛠️ Special Considerations for Chess Online

### 1. Firebase Integration
- ✅ No changes needed for Firebase imports
- ⚠️ Update auth flow to use Server Functions if needed
- ⚠️ Verify real-time DB subscriptions work in client components

### 2. Authentication
- Convert Next.js middleware to TanStack Router guards (if needed)
- Update login/signup flow
- Verify session management

### 3. Chess Engine
- ✅ chess.js and js-chess-engine work in client components
- ✅ Can be used directly in components (no changes)

### 4. react-dnd Integration
- ✅ Fully compatible with TanStack Start
- No changes needed

### 5. SEO (robots.ts, sitemap.ts)
- Move to `src/app/robots.ts` and `src/app/sitemap.ts`
- Might need adaptation for TanStack Start's server route approach

---

## 📦 Dependency Changes

### Removed
```
next
@tailwindcss/postcss
next-themes (migrate to manual theme management)
```

### Added
```
@tanstack/react-router
@tanstack/react-start
nitro
vite
@vitejs/plugin-react
@tailwindcss/vite
@unpic/react (optional, for next/image replacement)
```

### Unchanged
```
react, react-dom
typescript
tailwindcss
firebase
chess.js, js-chess-engine
react-dnd, react-dnd-html5-backend
lucide-react
radix-ui
sonner
class-variance-authority, clsx, tailwind-merge
```

---

## ✅ Checklist

### Pre-Migration
- [ ] Backup current project
- [ ] Create new git branch for migration
- [ ] Review all current routes and components
- [ ] Document Firebase integration details

### Migration Execution
- [ ] Remove Next.js and create Vite config
- [ ] Restructure directories (src/app, src/components, src/lib)
- [ ] Convert __root.tsx
- [ ] Convert index.tsx (home)
- [ ] Convert vs-ai.tsx
- [ ] Convert board.tsx
- [ ] Convert $slug.tsx (multiplayer)
- [ ] Convert login.tsx
- [ ] Convert signup.tsx
- [ ] Create router.tsx
- [ ] Update all Link components
- [ ] Update package.json scripts
- [ ] Test all routes locally

### Post-Migration
- [ ] Verify Firebase auth flow
- [ ] Test chess game functionality
- [ ] Test multiplayer features
- [ ] Performance check
- [ ] Deploy test build
- [ ] Update documentation (README.md)

---

## ⚠️ Potential Issues & Solutions

| Issue | Solution |
|-------|----------|
| Dynamic routes not generating | Run `vite build` to generate `routeTree.gen.ts` |
| Firebase not initializing | Ensure Firebase setup is in client component context |
| Theme switching not working | Manually implement theme toggle (next-themes dependent) |
| Images not loading | Consider using `<img>` tags or `@unpic/react` |
| API routes breaking | Convert to TanStack Start Server Routes |
| `useParams()` returning undefined | Ensure route file naming matches the pattern |

---

## 🚀 Estimated Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Setup | 1-2 hrs | Dependencies, config, structure |
| Phase 2: Core | 2-3 hrs | Root layout, routes, router |
| Phase 3: Features | 2-3 hrs | Route conversion, components |
| Phase 4: Testing | 1-2 hrs | Functionality, Firebase, chess |
| Phase 5: Cleanup | 30-60 min | Dependencies, docs, optimization |
| **Total** | **7-11 hrs** | Complete migration |

---

## 📚 Resources

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Guide](https://tanstack.com/router/latest/docs/framework/react/guide/overview)
- [Migration Guide Reference](https://tanstack.com/start/latest/docs/guide/migrate-from-next-js)
- [Vite Configuration](https://vite.dev/config/)

---

## 🎯 Next Steps

1. **Review this plan** and identify any chess-specific concerns
2. **Create git branch**: `git checkout -b migrate/tanstack-start`
3. **Execute Phase 1** to confirm setup works
4. **Incrementally migrate** routes and test thoroughly
5. **Verify all features** before merging to main

