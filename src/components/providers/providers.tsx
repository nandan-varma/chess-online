/**
 * Global providers component
 * Wraps the application with necessary context providers
 */

'use client'

import type React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

/**
 * Props for Providers component
 */
interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Global providers component
 * Combines all necessary providers for the application
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  )
}

export default Providers
