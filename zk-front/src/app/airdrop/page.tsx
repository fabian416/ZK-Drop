"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { getPrivateInputs, getPublicInputsForArgentina, getPublicInputsForUSA } from "@/lib/publicInputs"
import { useWriteContract } from "wagmi"
import airdropContract from "@/lib/abis/AirdropMock.json"
import ZKDropHeader from "@/components/ZKDropHeader"
import { ZKDropInfoBlocks } from "@/components/ZKDropInfoBlocks"
import { ZKDropQRCode } from "@/components/ZKDropQRCode"
import { ZKPassportStep } from "@/components/ZKPassportStep"
import { ZKDropClaimButton } from "@/components/ZKDropClaimButton"
import { ZKDropTxButton } from "@/components/ZKDropTxButton"
import { ZKDropSuccess } from "@/components/ZKDropSuccess"
import BackToDashboardButton from "@/components/ZKBackToDashboardButton"
import useCoordinates from "@/hooks/useCoordinates"

export default function Airdrop() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [identity, setIdentity] = useState(false)
  const [proof, setProof] = useState<unknown>(null)

  const { writeContract, data, isPending, isSuccess, isError, error } = useWriteContract()
  const { status } = useCoordinates();

  const airdropData = {
    tokenName: "NRH",
    tokenAmount: "250 NRH",
    tokenValue: "$212.50",
    eligibility: "Early community members",
    expiresIn: "7 days",
    region: "North America"
  }

  const handleClaim = async () => {
    if (!status) {
      setShowQr(true);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
  
      const lat = Math.round(position.coords.latitude * 1e6);
      const lon = Math.round(position.coords.longitude * 1e6);

      const privateInputs = await getPrivateInputs({ lat, lon });
      const publicInputs = await getPublicInputsForArgentina()
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/zk-proof/generate-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...publicInputs, ...privateInputs}),
      })
  
      if (!response.ok) throw new Error("Failed to get ZK proof from backend")
  
      const {proof, inputs} = await response.json()
  
      console.log("✅ Backend proof:", proof);
      console.log("✅ Backend inputs:", inputs);
    } catch (err) {
      console.error("Error generating proof or inputs:", err)
      alert("Could not generate ZK inputs or proof.")
    }
  }

  const handleSendTransaction = async () => {

    setIsClaiming(true)
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: airdropContract,
        functionName: "airdrop"
      })
      console.log("Transaction hash:", data)
    } catch (err) {
      console.error("Error sending transaction:", err)
      alert("Failed to claim airdrop on-chain.")
    } finally {
      setIsClaiming(false)
    }
  }

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Transaction successful, hash:", data)
      setIsClaimed(true)
    }
    if (isError) {
      console.error("Transaction error:", error)
      alert("Transaction failed: " + error?.message)
    }
  }, [isSuccess, isError, data, error])

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-12 flex justify-center">
      <ZKPassportStep showIdentity={showIdentity} setShowIdentity={setShowIdentity} setIdentity={setIdentity} />
      <div className="container max-w-lg px-4">
        <BackToDashboardButton />
        <ZKDropHeader title="Token Airdrop" region={airdropData.region} subtitle="Regional Exclusive" />
        <Card className="p-6 border-2 border-[#c1ff72]/40 mx-auto">
          {!isClaimed ? (
            <>
              <ZKDropInfoBlocks>
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
                  <p className="text-sm text-blue-700">
                    This airdrop is exclusively available to verified users in your region. Your privacy is protected through zero-knowledge proofs.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-700 font-medium">Expires in:</span>
                    <span className="text-yellow-700">{airdropData.expiresIn}</span>
                  </div>
                </div>
              </ZKDropInfoBlocks>

              {!showQr && !proof ? (
                <ZKDropClaimButton
                  identity={identity}
                  isProcessing={isClaiming}
                  onVerify={() => setShowIdentity(true)}
                  onClaim={handleClaim}
                  label="claiming"
                />
              ) : showQr && !status ? (
                <ZKDropQRCode />
              ) : (
                <ZKDropTxButton
                  onClick={handleSendTransaction}
                  isProcessing={isPending || isClaiming}
                  label="Claim Airdrop On-Chain"
                />
              )}
            </>
          ) : (
            <ZKDropSuccess
              title="Airdrop Claimed!"
              description={`You have successfully claimed ${airdropData.tokenAmount} tokens from the regional airdrop.`}
              returnUrl="/dashboard"
            />
          )}
        </Card>
      </div>
    </div>
  )
}
