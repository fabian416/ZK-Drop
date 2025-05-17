import Link from "next/link"

const BackToDashboardButton = () => {
    return <div className="text-center mb-6">
    <Link href="/dashboard" className="inline-flex items-center text-[#453978] hover:underline">
        ← Back to Dashboard
    </Link>
 </div>
}

export default BackToDashboardButton;