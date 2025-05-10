"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Gift, Coins, ChevronRight, Clock, Check, X } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  // Normalmente estos datos vendrían de una API o contrato
  const [userRegion, setUserRegion] = useState("Argentina")
  const [verificationStatus, setVerificationStatus] = useState("pending") // verified, pending, failed

  // Datos de ejemplo para presale y airdrop
  const presaleData = {
    available: true,
    tokenName: "ZKD",
    tokenPrice: "$0.85",
    publicPrice: "$1.20",
    discount: "29%",
    minPurchase: "100 ZKD",
    maxPurchase: "5,000 ZKD",
    endsIn: "3 days 14 hours",
  }

  const airdropData = {
    available: true,
    tokenAmount: "250 ZKD",
    tokenValue: "$212.50",
    eligibility: "Early community members in South America",
    expiresIn: "7 days",
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-12 flex justify-center">
      <div className="container max-w-4xl px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {/* Presale Card */}
          <Card
            className={`p-6 border-2 ${presaleData.available ? "border-[#c1ff72]/40" : "border-gray-200"} relative overflow-hidden`}
          >
            {presaleData.available && (
              <div className="absolute top-0 right-0">
                <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs m-2">
                  Available in your region
                </span>
              </div>
            )}

            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
                <Coins className="h-6 w-6 text-[#453978]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#453978]">Token Presale</h2>
                <p className="text-gray-500 text-sm">Regional discounted price</p>
              </div>
            </div>

            {presaleData.available ? (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Token:</span>
                    <span className="font-medium">{presaleData.tokenName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Your Price:</span>
                    <span className="font-medium text-[#453978]">{presaleData.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Public Price:</span>
                    <span className="font-medium text-gray-500 line-through">{presaleData.publicPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                    <span className="text-gray-600">Your Discount:</span>
                    <span className="inline-flex items-center rounded-full bg-[#c1ff72]/30 text-[#453978] font-medium px-3 py-1 text-xs">
                      {presaleData.discount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Ends in:</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-[#453978]" />
                      <span className="text-sm font-medium">{presaleData.endsIn}</span>
                    </div>
                  </div>
                </div>

                <Link href="/presale" className="block w-full">
                  <Button className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white">
                    <span>Buy Tokens</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <X className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Not Available</h3>
                <p className="text-gray-400 text-sm">Token presale is not available in your region at this time.</p>
              </div>
            )}
          </Card>

          {/* Airdrop Card */}
          <Card
            className={`p-6 border-2 ${airdropData.available ? "border-[#c1ff72]/40" : "border-gray-200"} relative overflow-hidden`}
          >
            {airdropData.available && (
              <div className="absolute top-0 right-0">
                <span className="inline-flex items-center rounded-full bg-[#c1ff72] text-[#453978] font-medium px-3 py-1 text-xs m-2">
                  Available in your region
                </span>
              </div>
            )}

            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
                <Gift className="h-6 w-6 text-[#453978]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#453978]">Token Airdrop</h2>
                <p className="text-gray-500 text-sm">Regional exclusive rewards</p>
              </div>
            </div>

            {airdropData.available ? (
              <>
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

                <Link href="/airdrop" className="block w-full">
                  <Button className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white">
                    <span>Claim Airdrop</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <X className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Not Available</h3>
                <p className="text-gray-400 text-sm">Token airdrop is not available in your region at this time.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Verification Status */}
        <div className="mt-8 p-4 rounded-lg bg-[#f0eeff] border border-[#453978]/20 mx-auto">
          <div className="flex items-center">
            {verificationStatus === "verified" ? (
              <>
                <div className="h-8 w-8 rounded-full bg-[#c1ff72] flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-[#453978]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#453978]">Location Verification Active</h3>
                  <p className="text-sm text-gray-600">
                    Your ZK proof is valid and your regional benefits are unlocked.
                  </p>
                </div>
              </>
            ) : verificationStatus === "pending" ? (
              <>
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-700">Verification Pending</h3>
                  <p className="text-sm text-gray-600">Your location verification is still pending.</p>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-700">Verification Failed</h3>
                  <p className="text-sm text-gray-600">Please try generating a new ZK proof.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
