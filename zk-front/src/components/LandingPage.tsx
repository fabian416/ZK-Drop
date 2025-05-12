"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import dynamic from "next/dynamic"
import FeatureCard from "./FeatureCard"
import { detectRegion, Region } from "@/lib/regions"

export default function LandingPage() {
  const [region, setRegion] = useState<Region>("Unknown")
  const router = useRouter()
  const { isConnected } = useAccount()
  const DynamicAppKitButton = dynamic(() => import('@/components/AppKitButton'), { ssr: false })

  // Detect region with browser geolocalization
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

  // Redirect to dashboard if connected
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  return (
    <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-[#453978]">ZK Drop</h1>
        <p className="mx-auto max-w-md text-lg text-gray-600">
          Unlock token presales and airdrops in your region with zero-knowledge location proofs.
        </p>
      </div>

      <DynamicAppKitButton />

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