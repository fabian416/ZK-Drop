import "./globals.css"
import type { Metadata } from "next"
import ContextProvider from "@/context"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "ZK Drop",
  description: "Private airdrops and tokens by region",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersObj = await headers()
  const cookies = headersObj.get("cookie") || null

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}