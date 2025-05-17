import { Button } from "@/components/ui/button"

export function ZKDropClaimButton({ identity, isProcessing, onVerify, onClaim, label }: { identity: boolean; isProcessing: boolean; onVerify: () => void; onClaim: () => void; label?: string }) {
  return (
    <Button
      onClick={!identity ? onVerify : onClaim}
      disabled={isProcessing}
      className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white cursor-pointer"
    >
      {isProcessing ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : !identity ? (
        <span>Verify Identity before {label || "claiming"}</span>
      ) : (
        <span>Generate Proof</span>
      )}
    </Button>
  )
}