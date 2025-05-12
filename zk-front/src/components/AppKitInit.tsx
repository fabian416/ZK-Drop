"use client"

import { createAppKit } from "@reown/appkit/react"
import { wagmiAdapter, projectId, networks } from "@/config"
import { baseSepolia, base } from "@reown/appkit/networks"

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks:[baseSepolia, base],
  defaultNetwork: networks[0],
  metadata: {
    name: "ZK Drop",
    description: "Private airdrops and tokens by region",
    url: "https://zk-drop.vercel.app",
    icons: [],
  },
  features: {
    analytics: true,
  },
})

export default function AppKitInit() {
  return null // This component just initializes AppKit globally
}