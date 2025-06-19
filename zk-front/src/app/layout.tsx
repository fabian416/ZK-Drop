import "./globals.css"
import type { Metadata } from "next"
import ContextProvider from "@/context"
import Header from "@/components/Header"
import { headers } from "next/headers"
import { RelaySessionProvider } from "@/contexts/RelaySessionContext"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "zkDrop",
  description: "Private airdrops and tokens by region",
  icons: {
    icon: "/favicon.ico",
  },

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
          <RelaySessionProvider>
            <Header /> 
            {children}
            <Toaster richColors position="top-right" duration={2000} />
          </RelaySessionProvider>
        </ContextProvider>
      </body>
    </html>
  )
}