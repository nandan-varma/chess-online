/**
 * React Query & Providers Setup
 * Centralized configuration for all providers
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { ReactNode, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Create a stable QueryClient instance
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't refetch on window focus in development
        refetchOnWindowFocus: false,
        // Reasonable stale time - queries remain fresh for 1 minute
        staleTime: 1000 * 60,
        // Keep cached data for 5 minutes before garbage collection
        gcTime: 1000 * 60 * 5,
        // Retry failed requests once
        retry: 1,
        // Set reasonable timeout
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  })
}

/**
 * Global Providers Component
 * Wraps app with all necessary providers
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Create QueryClient once and reuse it
  const queryClient = useMemo(() => createQueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider>
          {children}
          {/* Show React Query Devtools in development */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ThemeProvider>
      </DndProvider>
    </QueryClientProvider>
  )
}

export default Providers
