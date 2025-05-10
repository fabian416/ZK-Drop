"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { getPublicInputsForUSA } from "@/lib/publicInputs"

export default function Interface() {
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [proofGenerated, setProofGenerated] = useState(false)
  const [region, setRegion] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [qrData, setQrData] = useState<string | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setCoords({ lat, lon })

        if (lat < -20 && lat > -60 && lon < -50 && lon > -80) {
          setRegion("Argentina")
        } else if (lat > 24 && lat < 49 && lon > -125 && lon < -66) {
          setRegion("United States")
        } else {
          setRegion("Other Region")
        }
      },
      (err) => {
        console.error("Geolocation error", err)
        setRegion("Unknown")
      }
    )
  }, [])

  const generateProof = async () => {
    if (!coords) return
    setIsGeneratingProof(true)

    try {
      const publicInputs = await getPublicInputsForUSA()
      setQrData(JSON.stringify(publicInputs))
      setProofGenerated(true)
    } catch (err) {
      console.error("Error generating public inputs:", err)
    }

    setIsGeneratingProof(false)
  }

  return (
    <div className="container max-w-md px-4 py-8">
      <Card className="p-6 shadow-xl border-2 border-[#c1ff72]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#453978]">Early Access</h2>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-[#453978]" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#c1ff72] p-3 bg-[#f3f0fa]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-[#453978]">ZK Location Proof</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  proofGenerated
                    ? "bg-green-100 text-green-800"
                    : coords
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {proofGenerated ? "Verified" : coords ? "Location Detected" : "Requesting Location"}
              </span>
            </div>

            <p className="text-xs text-[#453978] mb-3">
              We detected your location using your browser. Generate a ZK proof to access exclusive pre-sales or airdrops in your region.
            </p>

            {coords && (
              <div className="bg-[#c1ff72]/20 rounded p-2 mb-3 text-sm">
                <div className="flex items-center text-[#453978] font-medium">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Region: {region}</span>
                </div>
              </div>
            )}

            <Button
              onClick={generateProof}
              disabled={isGeneratingProof || proofGenerated || !coords}
              variant="outline"
              className="w-full border-[#453978] text-[#453978] hover:bg-[#c1ff72]/30"
            >
              {isGeneratingProof ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#453978]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Proof...
                </span>
              ) : proofGenerated ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Proof Generated
                </span>
              ) : (
                <span>Generate ZK Proof</span>
              )}
            </Button>

            {qrData && (
              <div className="mt-4 flex justify-center">
                <QRCode value={qrData} size={180} />
              </div>
            )}
          </div>

          <Button
            className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white font-bold border border-[#c1ff72] shadow-[0_0_15px_rgba(193,255,114,0.5)]"
            disabled={!proofGenerated}
          >
            {proofGenerated ? "Claim Access" : "Verify to Claim Access"}
          </Button>
        </div>
      </Card>
    </div>
  )
}