"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { getPrivateInputs, getPublicInputsForArgentina, getPublicInputsForUSA } from "@/lib/publicInputs"
import { useWriteContract } from "wagmi"
import nftDropContract from "@/lib/abis/AirdropMockNFT.json"
import ZKDropHeader from "@/components/ZKDropHeader"
import { ZKDropInfoBlocks } from "@/components/ZKDropInfoBlocks"
import { ZKDropQRCode } from "@/components/ZKDropQRCode"
import { ZKPassportStep } from "@/components/ZKPassportStep"
import { ZKDropClaimButton } from "@/components/ZKDropClaimButton"
import { ZKDropTxButton } from "@/components/ZKDropTxButton"
import { ZKDropSuccess } from "@/components/ZKDropSuccess"
import BackToDashboardButton from "@/components/ZKBackToDashboardButton"


export default function NFTClaimPage() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [qrData, setQrData] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [identity, setIdentity] = useState(false)
  const [proof, setProof] = useState<any>(null)
  const [inputs, setInputs] = useState<any>(null)

  const { writeContract, data, isPending, isSuccess, isError, error } = useWriteContract()

  const nftData = {
    nftName: "ZK Avatar",
    description: "Exclusive identity-bound NFT",
    eligibility: "Early community members",
    expiresIn: "5 days",
    region: "North America"
  }



  const handleClaim = async () => {
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
      const inp = Object.values(inputs);
      setProof(proof.proof);
      setInputs(inp);
      console.log("✅ Backend proof:", proof.proof);
      console.log("✅ Backend inputs:", inp);
  
      setQrData(JSON.stringify(publicInputs))
      setShowQr(true)
    } catch (err) {
      console.error("Error generating proof or inputs:", err)
      alert("Could not generate ZK inputs or proof.")
    }
  }

  const handleSubmitProof = async (receivedProof: unknown) => {
    setShowQr(false);
  }

  const handleSendTransaction = async () => {
    if (!proof) return alert("No proof available to submit.")

      const loadFromPublic = async () => {
        const proofRes = await fetch('/proof.txt');
        const proofText = (await proofRes.text()).trim();
      
        const inputsRes = await fetch('/publicInputs.json');
        const publicInputs: string[] = await inputsRes.json();
      
        return { proofText, publicInputs };
      };
      
      const { proofText, publicInputs } = await loadFromPublic();
      console.log({proofText, publicInputs});
    setIsClaiming(true)
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NFT! as `0x${string}`,
        abi: nftDropContract,
        functionName: "airdrop",
        args: [proofText, publicInputs]
      })
      console.log("Transaction hash:", data)
    } catch (err) {
      console.error("Error sending transaction:", err)
      alert("Failed to claim NFT on-chain.")
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
        <ZKDropHeader title="NFT Drop" region={nftData.region} subtitle="Unique zk-powered identity NFTs" />
        <Card className="p-6 border-2 border-[#c1ff72]/40 mx-auto">
          {!isClaimed ? (
            <>
              <ZKDropInfoBlocks>
                <div className="p-4 rounded-lg bg-[#f0eeff] border border-[#453978]/20">
                  <div className="text-center">
                    <h2 className="text-lg text-[#453978] font-medium mb-1">Available to Claim</h2>
                    <div className="text-3xl font-bold text-[#453978] mb-1">{nftData.nftName}</div>
                    <div className="text-gray-500">{nftData.description}</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#c1ff72]/20 border border-[#c1ff72]/30">
                  <h3 className="font-medium text-[#453978] mb-1">Eligibility</h3>
                  <p className="text-sm text-gray-600">{nftData.eligibility}</p>
                </div>
                <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm text-blue-700">
                    This NFT is exclusively available to verified users in your region. Your privacy is protected through zero-knowledge proofs.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-700 font-medium">Expires in:</span>
                    <span className="text-yellow-700">{nftData.expiresIn}</span>
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
              ) : showQr ? (
                <ZKDropQRCode />
              ) : (
                <ZKDropTxButton
                  onClick={handleSendTransaction}
                  isProcessing={isPending || isClaiming}
                  label="Claim NFT On-Chain"
                />
              )}
            </>
          ) : (
            <ZKDropSuccess
              title="NFT Claimed!"
              description={`You have successfully claimed ${nftData.nftName} from the regional airdrop.`}
              returnUrl="/dashboard"
            />
          )}
        </Card>
      </div>
    </div>
  )
}