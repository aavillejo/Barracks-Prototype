"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { User, Network, Package, UserRound } from 'lucide-react'
import Link from 'next/link'
import usersData from "@/app/data/users.json";

export default function Header() {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            const user = JSON.parse(stored);
            setCurrentUser(user);
            
            // Check if user is admin from users.json
            const userRecord = usersData.find((u: any) => u.username === user.username);
            setIsAdmin(userRecord?.isAdmin || false);
        }
    }, []);

    return (
        <header className="flex flex-row justify-between items-center p-4 bg-gray-800 sticky top-0 z-10">
            <div className="flex flex-row items-center gap-8">
                <Link href="/Display/LandingPage" aria-label="Go to Dashboard">
                    <img src="/barracks1200x700.png" alt="Logo" className="h-10 w-10 rounded-lg brightness-0 invert cursor-pointer" /> {/* Lowk can't make the invert trick work */}
                </Link>
                <Link href="/Records/CustomerRecords" className="flex flex-row gap-2">
                    <User style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Customer Records
                    </h2>
                </Link>
                <Link href="/Records/StaffRecords" className="flex flex-row gap-2">
                    <Network style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Staff Records
                    </h2>
                </Link>

                <Link href="/Records/InventoryPage" className="flex flex-row gap-2">
                    <Package style={{color: "white"}} />
                    <h2 className="text-white hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Inventory
                    </h2>
                </Link>

                {/* Admin Panel - only shows for admin users */}
                {currentUser && isAdmin && (
                    <h2 className="text-yellow-400 hover:scale-110 hover:font-bold transition-transform cursor-pointer">
                        Admin Panel
                    </h2>
                )}
            </div>

            <div className="flex flex-row items-center gap-2">
                {currentUser ? (
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-sm">
                            Welcome, {currentUser.name}
                        </span>
                        {isAdmin && (
                            <span className="rounded-full border border-emerald-300/50 bg-emerald-400/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                                Admin
                            </span>
                        )}
                    </div>
                ) : (
                    <Link href="/login">
                        <span className="text-white text-sm mr-2 hover:underline">Login</span>
                    </Link>
                )}
                <UserRound style={{color: "white"}} />
            </div>
        </header>
    );
}