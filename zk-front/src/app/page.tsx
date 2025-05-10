"use client"

import { ThemeProvider } from "@/components/ui/theme-provider"
import LandingPage from "@/components/LandingPage"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7ff]">
        <LandingPage />
      </main>
    </ThemeProvider>
  )
}