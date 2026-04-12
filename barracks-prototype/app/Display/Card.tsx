import Link from 'next/link'

interface CardProps {
    title: string
    totalLabel: string
    total: string
    recentLabel: string
    recent: string
    updated: string
    href: string
}

export default function Card({ title, totalLabel, total, recentLabel, recent, updated, href }: CardProps) {
    return (
        <Link href={href}>
            <div className="backdrop-blur-md bg-gray-900/70 border border-gray-600 rounded-2xl p-6 h-64 flex flex-col justify-between hover:bg-gray-800/80 hover:border-gray-500 transition-all cursor-pointer text-white">
                <div>
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <div className="space-y-2">
                        <p className="flex justify-between text-gray-300 text-lg">
                            <span>{totalLabel}</span>
                            <span>{total}</span>
                        </p>
                        <p className="flex justify-between text-gray-300 text-sm">
                            <span>{recentLabel}</span>
                            <span>{recent}</span>
                        </p>
                    </div>
                </div>
                <p className="text-gray-400 text-xs">{updated}</p>
            </div>
        </Link>
    )
}