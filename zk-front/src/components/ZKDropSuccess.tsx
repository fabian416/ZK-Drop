import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export function ZKDropSuccess({ title, description, returnUrl, buttonLabel }: { title: string; description: string; returnUrl: string; buttonLabel?: string }) {
  return (
    <div className="text-center py-6">
      <div className="h-16 w-16 rounded-full bg-[#c1ff72] flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-[#453978]" />
      </div>
      <h2 className="text-xl font-bold text-[#453978] mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link href={returnUrl}>
        <Button className="bg-[#453978] hover:bg-[#453978]/90 text-white cursor-pointer">
          {buttonLabel || "Return to Dashboard"}
        </Button>
      </Link>
    </div>
  )
}