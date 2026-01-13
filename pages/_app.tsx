import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/NavBar'
import { Toaster } from "@/components/ui/sonner"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </DndProvider>
  )
}
