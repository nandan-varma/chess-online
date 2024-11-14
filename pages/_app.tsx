import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/NavBar'
import { Toaster } from "@/components/ui/sonner"


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}
