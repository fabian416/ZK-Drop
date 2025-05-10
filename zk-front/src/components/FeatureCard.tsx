import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow border-2 border-[#c1ff72]/30 hover:border-[#c1ff72]/70">
      <h3 className="mb-2 text-xl font-bold text-[#453978]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  )
}
