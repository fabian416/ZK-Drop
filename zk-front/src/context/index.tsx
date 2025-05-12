"use client";

import { wagmiAdapter, projectId, networks } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { baseSepolia, base } from "viem/chains";

// Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks:[baseSepolia, base],
  defaultNetwork: networks[0], // ✅ base como red por defecto
  metadata: {
    name: "ZK Drop",
    description: "Private airdrops and tokens by region",
    url: "https://zk-drop-navy.vercel.app/",
    icons: [],
  },
  features: {
    analytics: true,
  },
});

const queryClient = new QueryClient();

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}