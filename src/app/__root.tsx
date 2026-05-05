/**
 * Root layout component
 * Wraps all pages and provides global context/providers
 */

import { Outlet, createRootRoute } from '@tanstack/react-router'
import type React from 'react'
import NavBar from '@/components/NavBar'
import Providers from '@/components/providers/providers'
import { Toaster } from '@/components/ui/sonner'

/**
 * Root route configuration
 */
export const Route = createRootRoute({
  component: RootLayout,
})

/**
 * Root layout component
 * Provides global context and layout structure
 */
function RootLayout(): React.ReactElement {
  return (
    <>
      <Providers>
        <NavBar />
        <Outlet />
        <Toaster />
      </Providers>
    </>
  )
}
