"use client"

import dynamic from "next/dynamic"

const DynamicAppKitButton = dynamic(() => import("../components/AppKitButton"), { ssr: false })

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 flex justify-end bg-transparent my-2">
      <DynamicAppKitButton />
    </header>
  )
}