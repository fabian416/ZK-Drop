"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/ui/theme-provider"
import LandingPage from "@/components/LandingPage"
import Interface from "@/components/Interface"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7ff]">
        {!walletConnected ? (
          <LandingPage onConnect={() => setWalletConnected(true)} />
        ) : (
          <Interface />
        )}
      </main>
    </ThemeProvider>
  )
}