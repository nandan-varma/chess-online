# Chess Online - Architecture Guide

## 📐 Project Architecture

The Chess Online application follows a layered architecture pattern with clear separation of concerns:

```
src/
├── app/                    # TanStack Router page components
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── theme/             # Theme provider
│   └── providers/         # Global providers
├── hooks/                 # Custom React hooks
├── services/              # Business logic layer
├── lib/                   # Utilities and configurations
├── utils/                 # Helper functions
├── constants/             # App-wide constants
└── types/                 # TypeScript type definitions
```

---

## 🎯 Core Concepts

### 1. **Services Layer** (`src/services/`)

Services encapsulate business logic and external integrations:

- **`authService`**: Firebase authentication
- **`gameService`**: Chess game operations
- **`validationService`**: Input validation
- **`errorService`**: Error handling and logging
- **`httpClient`**: HTTP requests

```typescript
// Usage example
import { authService } from '@/services'

const user = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})
```

### 2. **Custom Hooks** (`src/hooks/`)

React hooks provide component-level access to services:

- **`useAuth`**: User authentication (login, signup, logout)
- **`useGame`**: Game operations (create, move, resign)
- **`useTheme`**: Theme management
- **`useNotification`**: Toast notifications
- **`useAsync`**: Async operations
- **`useDebounce`**: Debouncing values

```typescript
// Usage in components
function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  
  return (
    <button onClick={() => login({ email, password })} disabled={isPending}>
      Login
    </button>
  )
}
```

### 3. **Types** (`src/types/`)

Centralized TypeScript definitions:

- **`auth.ts`**: User and authentication types
- **`game.ts`**: Game domain types
- **`index.ts`**: Common types (ChessMove, VerboseMove, etc.)

```typescript
// Type-safe operations
const move: ChessMove = { from: 'e2', to: 'e4' }
const game: Game = { id: 'game1', mode: 'ai', ... }
```

### 4. **Constants** (`src/constants/`)

App-wide configuration and constants:

- **`game.ts`**: Chess game constants
- **`auth.ts`**: Authentication constants

```typescript
import { GAME_CONSTANTS, AI_DIFFICULTY } from '@/constants'

const game = createGame(AI_DIFFICULTY.HARD)
```

### 5. **Utilities** (`src/utils/`)

Pure helper functions:

- **`string.ts`**: String manipulation
- **`chess.ts`**: Chess-specific utilities

```typescript
import { formatDate, getPieceName } from '@/utils'

const date = formatDate(new Date())
const name = getPieceName('Q') // 'Queen'
```

---

## 🔄 Data Flow

### Authentication Flow

```
Component
  ↓
useLogin hook
  ↓
React Query mutation
  ↓
authService.login()
  ↓
Firebase Auth
  ↓
User cache updated
  ↓
Component re-renders
```

### Game Flow

```
ChessBoard Component
  ↓
useMakeMove hook
  ↓
React Query mutation
  ↓
gameService.makeMove()
  ↓
Firebase Database
  ↓
Game cache updated
  ↓
Component re-renders with new board state
```

---

## 🛠️ Key Features

### Error Handling

```typescript
import { errorService, ValidationError } from '@/services'

try {
  await authService.login(credentials)
} catch (error) {
  const { code, message, statusCode } = errorService.handleError(error)
  userMessage = errorService.getUserMessage(error)
}
```

### Validation

```typescript
import { validationService } from '@/services'

const { valid, errors } = validationService.validateSignupCredentials(credentials)
if (!valid) {
  // Display error messages
}
```

### Notifications

```typescript
import { useNotification } from '@/hooks'

const { success, error } = useNotification()

success('Game created successfully!')
error('Failed to make move', {
  description: 'Invalid move',
  duration: 5000
})
```

### Logging

```typescript
import { logger } from '@/lib/logger'

logger.info('Game started', { gameId, mode })
logger.error('Move failed', { from, to, reason })

// Get logs
const allLogs = logger.getLogs()
const exported = logger.exportLogs()
```

### HTTP Client

```typescript
import { httpClient } from '@/lib/httpClient'

httpClient.setBaseURL('https://api.example.com')

const data = await httpClient.get('/games/123')
await httpClient.post('/games', { mode: 'ai' })
```

---

## 📦 React Query Integration

Services are designed to work seamlessly with React Query:

```typescript
// Query keys are organized by resource
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  detail: (id: string) => [...gameKeys.all, 'detail', id] as const,
}

// Automatic cache management
const { data: game } = useGame(gameId)
const createGame = useCreateGame() // Auto-invalidates lists
```

---

## 🎨 Component Structure

### Example: Game Page

```typescript
import { useGame, useNotification } from '@/hooks'
import { ChessBoard } from '@/components'

export function GamePage() {
  const { data: game, isLoading } = useGame(gameId)
  const { mutate: makeMove } = useMakeMove(gameId)
  const { success, error } = useNotification()

  const handleMove = (move) => {
    makeMove(move, {
      onSuccess: () => success('Move made!'),
      onError: () => error('Invalid move')
    })
  }

  if (isLoading) return <Loading />
  
  return (
    <ChessBoard 
      fen={game.board}
      onDrop={handleMove}
    />
  )
}
```

---

## 🚀 Best Practices

### 1. **Use Services for Business Logic**
- Don't fetch data directly in components
- Use services for Firebase, HTTP, validation

### 2. **Use Hooks for Components**
- Components should use custom hooks
- Hooks abstract service complexity

### 3. **Leverage React Query**
- Automatic caching
- Synchronization
- Error handling

### 4. **Type Everything**
- Use types from `@/types`
- Avoid `any` type

### 5. **Error Handling**
- Use `errorService` for consistent error handling
- Show user-friendly messages via `useNotification`

### 6. **Validation**
- Validate user input with `validationService`
- Validate on form submission and submission

---

## 📚 Common Patterns

### Creating a Custom Hook

```typescript
// src/hooks/useMyFeature.ts
import { useQuery } from '@tanstack/react-query'
import { myService } from '@/services'

const myKeys = {
  all: ['myfeature'] as const,
  detail: (id: string) => [...myKeys.all, id] as const,
}

export function useMyFeature(id: string) {
  return useQuery({
    queryKey: myKeys.detail(id),
    queryFn: () => myService.fetch(id),
  })
}
```

### Creating a Service

```typescript
// src/services/myService.ts
import { database } from '@/lib/firebase'
import { errorService } from './errorService'

class MyService {
  async fetch(id: string) {
    try {
      // Business logic
    } catch (error) {
      errorService.handleError(error)
      throw error
    }
  }
}

export const myService = new MyService()
```

### Using in Component

```typescript
import { useMyFeature } from '@/hooks'

export function MyComponent() {
  const { data, isLoading, error } = useMyFeature('123')

  if (error) return <Error />
  if (isLoading) return <Loading />

  return <div>{data}</div>
}
```

---

## 🔗 Import Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of:
import { useGame } from '../../../hooks/useGame'

// Use:
import { useGame } from '@/hooks'
```

---

## 🧪 Testing

Services can be tested independently:

```typescript
describe('authService', () => {
  it('should login user', async () => {
    const user = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(user).toBeDefined()
  })
})
```

---

## 📊 Project Metrics

- **Services**: 5 core services
- **Custom Hooks**: 8+ hooks
- **Type Definitions**: 20+ types
- **Constants**: Centralized configuration
- **Utils**: 15+ helper functions

---

## 🔄 Maintenance

### Adding a New Feature

1. Define types in `src/types/`
2. Create service in `src/services/`
3. Create hooks in `src/hooks/`
4. Build component using hooks
5. Add to exports in `index.ts` files

### Updating Existing Feature

1. Update type if needed
2. Update service logic
3. Services handle cache invalidation
4. Components automatically update

---

## 📖 Documentation

- **Firebase Setup**: See `src/lib/firebase.ts`
- **Theme Configuration**: See `src/components/theme/`
- **Router Configuration**: See `src/router.tsx`

---

**Last Updated**: May 5, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
