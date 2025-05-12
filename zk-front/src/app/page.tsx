"use client"

import { ThemeProvider } from "@/components/ui/theme-provider"
import LandingPage from "@/components/LandingPage"
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
})

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ParticleBackground />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LandingPage />
      </main>
    </ThemeProvider>
  )
}