"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Gift, Info, Check } from "lucide-react"
import Link from "next/link"
import { getPublicInputsForUSA } from "@/lib/publicInputs" // o getPublicInputsForUSA
import QRCode from "react-qr-code"
import ZKPassportModal from "@/components/ZkPassport"
import airdropContract from "@/lib/abis/MockedAirdropContract.json"
import { useWriteContract } from "wagmi"

export default function Airdrop() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClaiming, setIsClaiming] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClaimed, setIsClaimed] = useState(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [identity, setIdentity] = useState(false)
  const [proof, setProof] = useState<any>(null)

  const { writeContract, data, isPending, isSuccess, isError, error } = useWriteContract();

  // Mocked data for airdrop
  const airdropData = {
    tokenName: "NRH",
    tokenAmount: "250 NRH",
    tokenValue: "$212.50",
    eligibility: "Early community members",
    expiresIn: "7 days",
    region: "South America",
  }

  const handleClaim = async () => {
    try {
      const publicInputs = await getPublicInputsForUSA() // o Argentina
      setQrData(JSON.stringify(publicInputs))
      setShowQr(true)
    } catch (err) {
      console.error("Error generating public inputs:", err)
      alert("Could not generate ZK inputs.")
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
  
    setIsClaiming(true);
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: airdropContract.abi,
        functionName: "airdrop"
      });
  
      // The response from the transaction is usually a transaction hash
      console.log("Transaction hash:", data);
    } catch (err) {
      console.error("Error sending transaction:", err);
      alert("Failed to claim airdrop on-chain.");
    } finally {
      setIsClaiming(false);
    }
  };

  // Chech the transaction status
useEffect(() => {
  if (isSuccess && data) {
    console.log("Transaction successful, hash:", data);
    setIsClaimed(true);
  }
  if (isError) {
    console.error("Transaction error:", error);
    alert("Transaction failed: " + error?.message);
  }
}, [isSuccess, isError, data, error]);

  const handleVerifyIdentity = async () => {
    setShowIdentity(true)
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
              <Gift className="h-6 w-6 text-[#453978]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#453978]">Token Airdrop</h1>
              <div className="flex items-center">
                <span className="bg-[#c1ff72] text-[#453978] font-medium mr-2 rounded-full px-2 py-1 text-xs">
                  {airdropData.region}
                </span>
                <span className="text-sm text-gray-500">Regional Exclusive</span>
              </div>
            </div>
          </div>
  
          {!isClaimed ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-lg bg-[#f0eeff] border border-[#453978]/20">
                  <div className="text-center">
                    <h2 className="text-lg text-[#453978] font-medium mb-1">Available to Claim</h2>
                    <div className="text-3xl font-bold text-[#453978] mb-1">{airdropData.tokenAmount}</div>
                    <div className="text-gray-500">≈ {airdropData.tokenValue}</div>
                  </div>
                </div>
  
                <div className="p-3 rounded-lg bg-[#c1ff72]/20 border border-[#c1ff72]/30">
                  <h3 className="font-medium text-[#453978] mb-1">Eligibility</h3>
                  <p className="text-sm text-gray-600">{airdropData.eligibility}</p>
                </div>
  
                <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    This airdrop is exclusively available to verified users in your region. Your privacy is protected
                    through zero-knowledge proofs.
                  </p>
                </div>
  
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-700 font-medium">Expires in:</span>
                    <span className="text-yellow-700">{airdropData.expiresIn}</span>
                  </div>
                </div>
              </div>
  
              {/* Botón para generar QR o enviar transacción */}
              {!showQr && !proof ? (
                <Button
                  onClick={!identity ? handleVerifyIdentity : handleClaim}
                  disabled={isClaiming}
                  className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white"
                >
                  {isClaiming ? (
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
                    <span>Verify Identity before claiming</span>
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
                  disabled={isPending || isClaiming}
                  className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white"
                >
                  {(isPending || isClaiming) ? (
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
                    <span>Claim Airdrop On-Chain</span>
                  )}
                </Button>
              )}
  
              {/* Bloque QR con public inputs */}
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
              <h2 className="text-xl font-bold text-[#453978] mb-2">Airdrop Claimed!</h2>
              <p className="text-gray-600 mb-6">
                You have successfully claimed {airdropData.tokenAmount} tokens from the regional airdrop.
              </p>
              <Link href="/dashboard">
                <Button className="bg-[#453978] hover:bg-[#453978]/90 text-white">Return to Dashboard</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

