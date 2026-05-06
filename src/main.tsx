console.log('[Test] Starting')

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import { initializeTheme } from './lib/theme'
import './styles/globals.css'

console.log('[Test] Imports complete')

initializeTheme()
console.log('[Test] Theme initialized')

console.log('[Test] Getting router...')
let router
try {
  router = getRouter()
  console.log('[Test] Router ready:', !!router)
} catch (err) {
  console.error('[Test] ERROR in getRouter:', err)
  if (err instanceof Error) {
    console.error('[Test] Error message:', err.message)
    console.error('[Test] Stack:', err.stack)
  }
  throw err
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
console.log('[Test] React root created')

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

console.log('[Test] Rendered')
