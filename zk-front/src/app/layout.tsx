import "./globals.css"
import type { Metadata } from "next"
import ContextProvider from "@/context"
import Header from "@/components/Header"
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
      <body className="bg-[#f8f7ff]">
        <ContextProvider cookies={cookies}>
          <Header /> 
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}