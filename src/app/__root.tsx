/**
 * Root layout component
 * Wraps all pages and provides global context/providers
 */

import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import type React from 'react'
import NavBar from '@/components/NavBar'
import Providers from '@/components/providers/providers'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'

/**
 * Root route configuration
 */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: 'Play chess online with friends or challenge the AI. Free online chess game with multiplayer support.',
      },
      {
        property: 'og:title',
        content: 'Chess Online - Play with Friends or AI',
      },
      {
        property: 'og:description',
        content: 'Play chess online with friends or challenge the AI. Free online chess game with multiplayer support.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    title: 'Chess Online - Play with Friends or AI',
  }),
  component: RootLayout,
})

/**
 * Root layout component
 * Provides global context and layout structure
 */
function RootLayout(): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <NavBar />
          <Outlet />
          <Toaster />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
