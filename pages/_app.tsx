import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="bgimage"
        style={{
          top: "0",
          left: "0",
          zIndex: "-50",
          backgroundSize: "cover",
        }}
      ></div>
      <Component {...pageProps} />
    </>
  )
}
