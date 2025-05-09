import { Card } from "@/components/ui/card"

export default function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
      <h3 className="mb-2 text-xl font-bold text-violet-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  )
}