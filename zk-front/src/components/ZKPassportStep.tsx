"use client"

import ZKPassportModal from "@/components/ZkPassport"

export function ZKPassportStep({ showIdentity, setShowIdentity, setIdentity }: { showIdentity: boolean; setShowIdentity: (v: boolean) => void; setIdentity: (v: boolean) => void }) {
  return (
    showIdentity ? (
      <ZKPassportModal
        open={showIdentity}
        onClose={() => setShowIdentity(false)}
        setIdentity={setIdentity}
      />
    ) : null
  )
}