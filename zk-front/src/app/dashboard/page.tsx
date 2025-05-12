"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Gift, Coins, ChevronRight, Clock, Check, X } from "lucide-react"
import Link from "next/link"
import { detectRegion, Region } from "@/lib/regions"

export default function Dashboard() {
  // This is a placeholder for the actual region detection logic
  const [userRegion, setUserRegion] = useState<Region>("Unknown")
  const [verificationStatus] = useState("pending") // verified, pending, failed

  // Example data for pre sale and airdrop
  const presaleData = {
    available: true,
    tokenName: "ZKL",
    tokenPrice: "$0.50",
    minPurchase: "100 ZKD",
    endsIn: "3 days 14 hours",
  }

  const airdropData = {
    available: true,
    tokenAmount: "250 ZKD",
    tokenValue: "$212.50",
    eligibility: "Early community members",
    expiresIn: "7 days",
  }

  const nftDropData = {
    available: true,
    nftName: "ZK Avatar",
    description: "Unique zk-powered identity NFTs",
    supply: "1,000",
    claimEndsIn: "5 days",
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const region = detectRegion(lat, lon)
        setUserRegion(region)
      },
      () => setUserRegion("Unknown")
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-12 flex justify-center">
      <div className="container max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#453978] mb-2">Regional Access Dashboard</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[#453978]" />
            <span className="text-gray-600">Region:</span>
            <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs">
              {userRegion}
            </span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Based on your verified location, you have access to the following regional opportunities. Your privacy is
            protected through zero-knowledge proofs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {/* Presale Card */}
          <Card
              className={`p-6 pt-10 border-2 h-full flex flex-col justify-between ${
                presaleData.available ? "border-[#c1ff72]/40" : "border-gray-200"
              } relative overflow-hidden`}
            >
              {presaleData.available && (
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs m-2">
                    Available in your region
                  </span>
                </div>
              )}

              {/* Superior Content*/}
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
                    <Coins className="h-6 w-6 text-[#453978]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#453978]">Token Presale</h2>
                    <p className="text-gray-500 text-sm">Regional discounted price</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Token:</span>
                    <span className="font-medium">{presaleData.tokenName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Your Price:</span>
                    <span className="font-medium text-[#453978]">{presaleData.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Ends in:</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-[#453978]" />
                      <span className="text-sm font-medium">{presaleData.endsIn}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón en la parte inferior */}
              <Link href="/presale" className="block w-full mt-auto">
                <Button className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white">
                  <span>Buy Tokens</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </Card>
          {/* Airdrop Card */}
          <Card
            className={`p-6 pt-10 border-2 h-full flex flex-col justify-between ${
              airdropData.available ? "border-[#c1ff72]/40" : "border-gray-200"
            } relative overflow-hidden`}
          >
            {airdropData.available && (
              <div className="absolute top-0 right-0">
                <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs m-2">
                  Available in your region
                </span>
              </div>
            )}

            {/* Contenido superior */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
                  <Gift className="h-6 w-6 text-[#453978]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#453978]">Token Airdrop</h2>
                  <p className="text-gray-500 text-sm">Regional exclusive rewards</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">Token:</span>
                  <span className="font-medium">{presaleData.tokenName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-[#453978]">{airdropData.tokenAmount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-medium">{airdropData.tokenValue}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">Eligibility:</span>
                  <span className="text-sm">{airdropData.eligibility}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Expires in:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-[#453978]" />
                    <span className="text-sm font-medium">{airdropData.expiresIn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón en la parte inferior */}
            <Link href="/airdrop" className="block w-full mt-auto">
              <Button className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white">
                <span>Claim Airdrop</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
          {/* NFT Drop Card */}
          <Card
            className={`p-6 pt-10 border-2 h-full flex flex-col justify-between ${
              nftDropData.available ? "border-[#c1ff72]/40" : "border-gray-200"
            } relative overflow-hidden`}
          >
            {nftDropData.available && (
              <div className="absolute top-0 right-0">
                <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs m-2">
                  Available in your region
                </span>
              </div>
            )}

            {/* Contenido superior */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
                  <Gift className="h-6 w-6 text-[#453978]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#453978]">NFT Drop</h2>
                  <p className="text-gray-500 text-sm">{nftDropData.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">NFT:</span>
                  <span className="font-medium">{nftDropData.nftName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                  <span className="text-gray-600">Supply:</span>
                  <span className="font-medium text-[#453978]">{nftDropData.supply}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Claim ends in:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-[#453978]" />
                    <span className="text-sm font-medium">{nftDropData.claimEndsIn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón en la parte inferior */}
            <Link href="/nft" className="block w-full mt-auto">
              <Button className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white">
                <span>Claim NFT</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
