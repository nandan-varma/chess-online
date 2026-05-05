/**
 * TanStack Router configuration
 * Central router setup with all configuration options
 */

import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

/**
 * Create and configure the router instance
 */
export function createAppRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadDelay: 50,
    defaultPreload: 'intent',
  })

  return router
}

// Export router instance
export const router = createAppRouter()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
