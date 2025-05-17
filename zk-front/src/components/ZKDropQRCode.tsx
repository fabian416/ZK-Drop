import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"

export function ZKDropQRCode({ qrData, onSubmit }: { qrData: string; onSubmit: () => void }) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-4">
        Scan this QR code with your ZK mobile app to generate the proof.
      </p>
      <div className="inline-block p-4 bg-white rounded-lg border shadow">
        <QRCode value={qrData} size={200} />
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-[#453978] hover:bg-[#453978]/90 text-white cursor-pointer mt-2"
      >
        Use demo Proof
      </Button>
    </div>
  )
}