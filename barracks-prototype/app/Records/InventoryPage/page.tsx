import Link from "next/link";
import Header from "../../Display/Header";

export default function InventoryPage() {
    return (
        <>
            <Header />
            <div className="p-8 min-h-screen flex flex-col items-center justify-center backdrop-blur-sm bg-black/20">
                <h1 className="text-3xl font-bold text-white mb-6">Inventory Page</h1>
                <Link href="/" className="text-white/80 hover:text-white"> Go Back </Link>
            </div>
        </>
    )
}