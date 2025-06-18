"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublicInputsForUSA } from "@/lib/publicInputs"
import { useWriteContract } from "wagmi"
import presaleContract from "@/lib/abis/PreSaleMock.json"
import ZKDropHeader from "@/components/ZKDropHeader"
import { ZKDropInfoBlocks } from "@/components/ZKDropInfoBlocks"
import { ZKDropQRCode } from "@/components/ZKDropQRCode"
import { ZKPassportStep } from "@/components/ZKPassportStep"
import { ZKDropTxButton } from "@/components/ZKDropTxButton"
import { ZKDropSuccess } from "@/components/ZKDropSuccess"

export default function Presale() {
  const [amount, setAmount] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isPurchased, setIsPurchased] = useState(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [identity, setIdentity] = useState(false)
  const [proof, setProof] = useState<unknown>(null)

  const { writeContract, data, isPending, isSuccess, isError, error } = useWriteContract()

  const presaleData = {
    tokenName: "ZKL",
    tokenPrice: 0.5,
    minPurchase: 100,
    endsIn: "3 days 14 hours",
    region: "North America"
  }

  const handlePurchase = async () => {
    if (!identity) return setShowIdentity(true)

    try {
      const publicInputs = await getPublicInputsForUSA()
      setQrData(JSON.stringify(publicInputs))
      setShowQr(true)
    } catch (err) {
      console.error("Failed to generate public inputs:", err)
      alert("Failed to generate ZK inputs.")
    }
  }

  const handleSubmitProof = async (receivedProof: unknown) => {
    setProof(receivedProof)
    setShowQr(false)
  }

  const handleSendTransaction = async () => {
    if (!proof) return alert("No proof available to submit.")

    setIsPurchasing(true)
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS as `0x${string}`,
        abi: presaleContract,
        functionName: "buy"
      })
      console.log("Transaction hash:", data)
    } catch (err) {
      console.error("Error sending transaction:", err)
      alert("Failed to purchase tokens on-chain.")
    } finally {
      setIsPurchasing(false)
    }
  }

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Transaction successful, hash:", data)
      setIsPurchased(true)
    }
    if (isError) {
      console.error("Transaction error:", error)
      alert("Transaction failed: " + error?.message)
    }
  }, [isSuccess, isError, data, error])

  const calculateTotal = () => {
    const numAmount = Number.parseFloat(amount) || 0
    return (numAmount * presaleData.tokenPrice).toFixed(2)
  }

  const isAmountValid = Number.parseFloat(amount) >= presaleData.minPurchase

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-12 flex justify-center">
      <ZKPassportStep showIdentity={showIdentity} setShowIdentity={setShowIdentity} setIdentity={setIdentity} />
      <div className="container max-w-lg px-4">
        <div className="text-center mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-[#453978] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <ZKDropHeader title="Token Presale" region={presaleData.region} subtitle="Regional Price" />
        <Card className="p-6 border-2 border-[#c1ff72]/40 mx-auto">
          {!isPurchased ? (
            <>
              <ZKDropInfoBlocks>
                <div className="p-3 rounded-lg bg-[#f0eeff] border border-[#453978]/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[#453978] font-medium">Your Price:</span>
                    <span className="text-[#453978] font-bold text-lg">${presaleData.tokenPrice}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Purchase</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={`Min: ${presaleData.minPurchase} ZKD`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">ZKD</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {presaleData.minPurchase} ZKD</span>
                  </div>
                </div>
                {isAmountValid && (
                  <div className="p-3 rounded-lg bg-[#c1ff72]/20 border border-[#c1ff72]/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-bold text-[#453978]">${calculateTotal()}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-700">
                    This special price is only available to verified users in your region. Your privacy is protected through zero-knowledge proofs.
                  </p>
                </div>
              </ZKDropInfoBlocks>

              {!showQr && !proof ? (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing || !isAmountValid}
                  className={`w-full py-2 rounded-lg text-white ${
                    isPurchasing || !isAmountValid ? "bg-[#453978]/50 cursor-not-allowed" : "bg-[#453978] hover:bg-[#453978]/90"
                  }`}
                >
                  {isPurchasing ? "Processing..." : identity ? "Generate Proof" : "Verify Identity before purchasing"}
                </button>
              ) : showQr ? (
                <ZKDropQRCode />
              ) : (
                <ZKDropTxButton
                  onClick={handleSendTransaction}
                  isProcessing={isPending || isPurchasing}
                  label="Complete Purchase On-Chain"
                />
              )}
            </>
          ) : (
            <ZKDropSuccess
              title="Purchase Successful!"
              description={`You have successfully purchased ${amount} ZKD tokens at the regional discounted price.`}
              returnUrl="/dashboard"
            />
          )}
        </Card>
      </div>
    </div>
  )
}