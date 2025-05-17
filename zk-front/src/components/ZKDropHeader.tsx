// components/ZKDropHeader.tsx
import { Gift, Coins } from "lucide-react"

export default function ZKDropHeader({ title, region, subtitle }: { title: string; region: string; subtitle: string }) {
  return (
    <div className="flex items-center mb-6 justify-center">
      <div className="h-12 w-12 rounded-full bg-[#453978]/10 flex items-center justify-center mr-4">
        {title.includes("NFT") ? <Gift className="h-6 w-6 text-[#453978]" /> : <Coins className="h-6 w-6 text-[#453978]" />}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#453978]">{title}</h1>
        <div className="flex items-center">
          <span className="bg-[#c1ff72] text-[#453978] font-medium mr-2 rounded-full px-2 py-1 text-xs">
            {region}
          </span>
          <span className="text-sm text-gray-500">{subtitle}</span>
        </div>
      </div>
    </div>
  )
}