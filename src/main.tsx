/**
 * Application entry point
 * Initializes React app with providers and router
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

// Initialize theme on app load
import { initializeTheme } from './lib/theme'
initializeTheme()

const rootElement = document.getElementById('root')

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!)
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
