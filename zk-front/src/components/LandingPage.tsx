"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import FeatureCard from "./FeatureCard"
import { detectRegion, Region } from "@/lib/regions"

export default function LandingPage() {
  const [region, setRegion] = useState<Region>("Unknown")
  const router = useRouter()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const detected = detectRegion(lat, lon)
        setRegion(detected)
      },
      () => setRegion("Unknown")
    )
  }, [])

  const handleConnect = () => {
    // Mocked for the hackaton
    router.push("/dashboard")
  }
  return (
    <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-[#453978]">ZK Drop</h1>
        <p className="mx-auto max-w-md text-lg text-gray-600">
          Unlock token presales and airdrops in your region with zero-knowledge location proofs.
        </p>
      </div>
  
      <Button
        onClick={handleConnect}
        size="lg"
        className="bg-[#453978] hover:bg-[#453978]/90 text-white font-bold border-2 border-[#c1ff72] shadow-[0_0_15px_rgba(193,255,114,0.5)]"
      >
        <Wallet className="mr-2 h-5 w-5" />
        Connect Wallet
      </Button>
  
      {/* Mostramos la región detectada */}
      <p className="text-sm text-gray-600">
        Your detected region:{" "}
        <span className="font-semibold text-[#453978]">{region}</span>
      </p>
  
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <FeatureCard
          title="Geolocated Airdrops"
          description="Claim exclusive token rewards based on your verified region — without revealing your exact location."
        />
        <FeatureCard
          title="Presales by Location"
          description="Access early token sales at local fair prices, adjusted for inflation or strategic targeting."
        />
        <FeatureCard
          title="ZK Privacy"
          description="Your GPS coordinates remain private thanks to zero-knowledge proofs. No surveillance, just access."
        />
      </div>
    </div>
  )
}