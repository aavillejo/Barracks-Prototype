"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../Display/Header";

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
};

type InventoryForm = {
  name: string;
  quantity: string;
  price: string;
};

const emptyForm: InventoryForm = {
  name: "",
  quantity: "",
  price: "",
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "quantity-high" | "price-high">("name-asc");
  const [formData, setFormData] = useState<InventoryForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) {
      setItems(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const persistItems = (updatedItems: InventoryItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("inventory", JSON.stringify(updatedItems));
  };

  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "quantity-high") return b.quantity - a.quantity;
      if (sortBy === "price-high") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const quantity = Number(formData.quantity);
    const price = Number(formData.price);

    if (!trimmedName || !formData.quantity || !formData.price) {
      setFormError("All fields are required.");
      return;
    }

    if (quantity <= 0) {
      setFormError("Quantity must be greater than 0.");
      return;
    }

    if (price <= 0) {
      setFormError("Price must be greater than 0.");
      return;
    }

    setFormError("");

    if (editingItemId) {
      const updatedItems = items.map((item) =>
        item.id === editingItemId
          ? { ...item, name: trimmedName, quantity, price }
          : item
      );
      persistItems(updatedItems);
      setSelectedItemId(editingItemId);
      setEditingItemId(null);
      setFormData(emptyForm);
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now(),
      name: trimmedName,
      quantity,
      price,
      createdAt: new Date().toLocaleString(),
    };

    persistItems([newItem, ...items]);
    setSelectedItemId(newItem.id);
    setFormData(emptyForm);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      quantity: String(item.quantity),
      price: String(item.price),
    });
    setFormError("");
  };

  const deleteItem = (itemId: number) => {
    const targetItem = items.find((item) => item.id === itemId);
    if (!targetItem) return;

    const confirmed = window.confirm(`Delete ${targetItem.name}? This cannot be undone.`);
    if (!confirmed) return;

    const remainingItems = items.filter((item) => item.id !== itemId);
    persistItems(remainingItems);

    if (editingItemId === itemId) {
      setEditingItemId(null);
      setFormData(emptyForm);
      setFormError("");
    }

    setSelectedItemId((prev) => (prev === itemId ? remainingItems[0]?.id ?? null : prev));
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(6,95,70,0.5),_transparent_55%),linear-gradient(120deg,_#111827_0%,_#1f2937_35%,_#0f172a_100%)]">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-white md:px-8">
          {/* Header Section */}
          <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="mt-1 text-sm text-white/70">
              Track stock levels, monitor item prices, and manage your product catalog.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by name..."
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="quantity-high">Sort: Quantity (High to Low)</option>
                <option value="price-high">Sort: Price (High to Low)</option>
              </select>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* List View Section */}
            <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
              <h2 className="text-xl font-semibold">Inventory List</h2>
              <p className="mt-1 text-sm text-white/70">
                {isLoading ? "Loading inventory..." : `${filteredItems.length} item(s) in stock`}
              </p>

              <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:bg-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-sm text-white/75">Qty: {item.quantity}</p>
                        <p className="text-sm text-white/75">
                          ₱{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-white/50 mt-1">Added: {item.createdAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedItemId(item.id)}
                          className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-amber-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {filteredItems.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/25 p-5 text-center text-white/70">
                    No items found. Add your first inventory item!
                  </p>
                )}
              </div>
            </section>

            <div className="space-y-6">
              {/* Form Section */}
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold">
                  {editingItemId ? "Edit Item" : "Add New Item"}
                </h2>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm">
                    Item Name
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g., Hair Clippers, Shampoo, Scissors"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Quantity
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                      }
                      placeholder="0"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Price (₱)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: e.target.value }))
                      }
                      placeholder="0.00"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
                    />
                  </label>
                </div>

                {formError && <p className="mt-3 text-sm text-red-300">{formError}</p>}

                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
                  >
                    {editingItemId ? "Save Changes" : "Add Item"}
                  </button>
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-md border border-white/30 px-4 py-2 font-semibold text-white hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Detail View Section */}
              <article className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
                <h2 className="text-xl font-semibold">Item Details</h2>

                {selectedItem ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-white/85">Name:</span> {selectedItem.name}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Quantity:</span> {selectedItem.quantity}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Price:</span> ₱{selectedItem.price.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Total Value:</span> ₱{(selectedItem.quantity * selectedItem.price).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Item ID:</span> {selectedItem.id}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Date Added:</span> {selectedItem.createdAt}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteItem(selectedItem.id)}
                      className="mt-2 rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                    >
                      Delete This Item
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">
                    Select an item from the list to view full details.
                  </p>
                )}
              </article>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}