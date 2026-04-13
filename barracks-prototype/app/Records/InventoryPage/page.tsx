"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../Display/Header";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    // LOAD from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("inventory");
        if (stored) {
            setItems(JSON.parse(stored));
        }
    }, []);

    // SAVE helper
    const saveData = (data: any[]) => {
        setItems(data);
        localStorage.setItem("inventory", JSON.stringify(data));
    };

    // CREATE
    const addItem = () => {
        if (!name) return;

        const newItem = {
            id: Date.now(),
            name,
            quantity,
            price
        };

        saveData([...items, newItem]); // spread operation ✅
        setName("");
        setQuantity(0);
        setPrice(0);
    };

    // DELETE
    const deleteItem = (id: number) => {
        const updated = items.filter(item => item.id !== id);
        saveData(updated);
    };

    return (
        <>
            <Header />

            <div className="p-8 min-h-screen flex flex-col items-center backdrop-blur-sm bg-black/20 text-white">
                <h1 className="text-3xl font-bold mb-6">Inventory Page</h1>

                {/* INPUTS */}
                <div className="mb-6 flex gap-2">
                    <input
                        placeholder="Item name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 text-black rounded"
                    />
                    <input
                        type="number"
                        placeholder="Qty"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="p-2 text-black rounded w-20"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="p-2 text-black rounded w-24"
                    />

                    <button
                        onClick={addItem}
                        className="bg-green-500 px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>

                {/* LIST */}
                <div className="w-full max-w-md">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between bg-white/10 p-3 mb-2 rounded"
                        >
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>₱{item.price}</p>
                            </div>

                            <button
                                onClick={() => deleteItem(item.id)}
                                className="text-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <Link href="/" className="mt-6 text-white/80 hover:text-white">
                    Go Back
                </Link>
            </div>
        </>
    );
}