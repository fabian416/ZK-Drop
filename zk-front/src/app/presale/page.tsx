"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Coins, Info, Check } from "lucide-react"
import Link from "next/link"
import { getPublicInputsForUSA } from "@/lib/publicInputs"
import QRCode from "react-qr-code"
import presaleContract from "@/lib/abis/PreSale.json"
import { useWriteContract } from "wagmi"
import ZKPassportModal from "@/components/ZkPassport"

export default function Presale() {
  const [amount, setAmount] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPurchasing, setIsPurchasing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPurchased, setIsPurchased] = useState(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [identity, setIdentity] = useState(false)
  const [proof, setProof] = useState<any>(null)

  const { writeContract, data, isPending, isSuccess, isError, error } = useWriteContract();
  
  // Mocked data for presale
  const presaleData = {
    tokenName: "ZKL",
    tokenPrice: 0.50,
    minPurchase: 100,
    endsIn: "3 days 14 hours",
    region: "South America",
  }


  const handlePurchase = async () => {
    if (!identity) {
      setShowIdentity(true)
      return
    }
    
    try {
      const publicInputs = await getPublicInputsForUSA()
      setQrData(JSON.stringify(publicInputs))
      setShowQr(true)
    } catch (err) {
      alert("Failed to generate public inputs.")
      console.error(err)
    }
  }

  const handleSubmitProof = async (receivedProof: any) => {
    setProof(receivedProof)
    setShowQr(false)
  }

  const handleSendTransaction = async () => {
    if (!proof) {
      alert("No proof available to submit.");
      return;
    }
  
    setIsPurchasing(true);
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS as `0x${string}`,
        abi: presaleContract.abi,
        functionName: "buyWithUsdt",
        args: [Number.parseFloat(amount)]
      });
  
      console.log("Transaction hash:", data);
    } catch (err) {
      console.error("Error sending transaction:", err);
      alert("Failed to purchase tokens on-chain.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Check the transaction status
  useEffect(() => {
    if (isSuccess && data) {
      console.log("Transaction successful, hash:", data);
      setIsPurchased(true);
    }
    if (isError) {
      console.error("Transaction error:", error);
      alert("Transaction failed: " + error?.message);
    }
  }, [isSuccess, isError, data, error]);

  const handleVerifyIdentity = async () => {
    setShowIdentity(true)
  }

  const calculateTotal = () => {
    const numAmount = Number.parseFloat(amount) || 0
    return (numAmount * presaleData.tokenPrice).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-12 flex justify-center">
      {showIdentity && (
        <ZKPassportModal
          open={showIdentity}
          onClose={() => setShowIdentity(false)}
          setIdentity={setIdentity}
        />
      )}
      <div className="container max-w-lg px-4">
        <div className="text-center mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-[#453978] hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
  
        <Card className="p-6 border-2 border-[#c1ff72]/40 mx-auto">
          <div className="flex items-center mb-6 justify-center">
            <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
              <Coins className="h-6 w-6 text-[#453978]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#453978]">Token Presale</h1>
              <div className="flex items-center">
                <span className="bg-[#c1ff72] text-[#453978] font-medium mr-2 rounded-full px-2 py-1 text-xs">
                  {presaleData.region}
                </span>
                <span className="text-sm text-gray-500">Regional Price</span>
              </div>
            </div>
          </div>
  
          {!isPurchased ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="p-3 rounded-lg bg-[#f0eeff] border border-[#453978]/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[#453978] font-medium">Your Price:</span>
                    <div className="flex items-center">
                      <span className="text-[#453978] font-bold text-lg">${presaleData.tokenPrice}</span>
                    </div>
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
  
                {amount && Number.parseFloat(amount) >= presaleData.minPurchase && (
                  <div className="p-3 rounded-lg bg-[#c1ff72]/20 border border-[#c1ff72]/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-bold text-[#453978]">${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    </div>
                  </div>
                )}
  
                <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    This special price is only available to verified users in your region. Your privacy is protected
                    through zero-knowledge proofs.
                  </p>
                </div>
              </div>
  
              {/* Purchase Button */}
              {!showQr && !proof ? (
                <Button
                  onClick={handlePurchase}
                  disabled={isPurchasing || !amount || Number.parseFloat(amount) < presaleData.minPurchase}
                  className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white"
                >
                  {isPurchasing ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : !identity ? (
                    <span>Verify Identity before purchasing</span>
                  ) : (
                    <span>Generate Proof</span>
                  )}
                </Button>
              ) : showQr ? (
                <Button
                  onClick={() => handleSubmitProof({ proof: "mock-proof-data" })}
                  className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white"
                >
                  I've generated my proof
                </Button>
              ) : (
                <Button
                  onClick={handleSendTransaction}
                  disabled={isPending || isPurchasing}
                  className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white"
                >
                  {(isPending || isPurchasing) ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Complete Purchase On-Chain</span>
                  )}
                </Button>
              )}
  
              {/* QR code with public inputs */}
              {showQr && qrData && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code with your ZK mobile app to generate the proof.
                  </p>
                  <div className="inline-block p-4 bg-white rounded-lg border shadow">
                    <QRCode value={qrData} size={200} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="h-16 w-16 rounded-full bg-[#c1ff72] flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-[#453978]" />
              </div>
              <h2 className="text-xl font-bold text-[#453978] mb-2">Purchase Successful!</h2>
              <p className="text-gray-600 mb-6">
                You have successfully purchased {amount} ZKD tokens at the regional discounted price.
              </p>
              <Link href="/dashboard">
                <Button className="bg-[#453978] hover:bg-[#453978]/90 text-white">Return to Dashboard</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}