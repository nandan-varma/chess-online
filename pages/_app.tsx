import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="bgimage"
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "-50",
          backgroundSize: "cover",
        }}
      ></div>
      <Component {...pageProps} />
    </>
  )
}
