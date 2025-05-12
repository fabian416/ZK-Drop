"use client"

import dynamic from "next/dynamic"

const DynamicAppKitButton = dynamic(() => import("../components/AppKitButton"), { ssr: false })

export default function Header() {
  return (
    <header className="w-full px-4 py-3 flex justify-end border-b border-[#453978]/10 bg-[#f8f7ff]">
      <DynamicAppKitButton />
    </header>
  )
}