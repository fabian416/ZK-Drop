"use client"

import { useEffect } from "react"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"

export default function ConnectHandler() {
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  return null
}