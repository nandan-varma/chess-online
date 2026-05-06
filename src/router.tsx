/**
 * TanStack Router configuration
 * Central router setup with all configuration options
 */

import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

/**
 * Create and configure the router instance
 */
export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
