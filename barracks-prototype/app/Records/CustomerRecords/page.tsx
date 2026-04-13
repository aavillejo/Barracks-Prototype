"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/Display/Header";
import seedCustomers from "@/app/data/customers.json";

type Customer = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
};

type CustomerForm = {
  name: string;
  email: string;
  contactNumber: string;
};

const STORAGE_KEY = "barracks.customers.records";

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  contactNumber: "",
};

const fallbackCustomers: Customer[] = (seedCustomers as Customer[]).map((customer) => ({
  ...customer,
}));

const isValidCustomer = (value: unknown): value is Customer => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const customer = value as Record<string, unknown>;

  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.contactNumber === "string" &&
    typeof customer.createdAt === "string"
  );
};

const getInitialCustomers = (): Customer[] => {
  if (typeof window === "undefined") {
    return fallbackCustomers;
  }

  const storedRecords = window.localStorage.getItem(STORAGE_KEY);

  if (!storedRecords) {
    return fallbackCustomers;
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isValidCustomer)) {
      return parsed;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCustomers));
    return fallbackCustomers;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCustomers));
    return fallbackCustomers;
  }
};

export default function CustomerRecordsPage() {
  const [customers, setCustomers] = useState<Customer[]>(() => getInitialCustomers());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "recent">("name-asc");
  const [formData, setFormData] = useState<CustomerForm>(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const persistCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
  };

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const visible = customers.filter((customer) =>
      customer.name.toLowerCase().includes(normalizedQuery),
    );

    return visible.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [customers, searchQuery, sortBy]);

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0] ?? null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedContactNumber = formData.contactNumber.trim();

    if (!trimmedName || !trimmedEmail || !trimmedContactNumber) {
      setFormError("Name, email, and contact number are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^[+()\-\d\s]{7,}$/.test(trimmedContactNumber)) {
      setFormError("Please enter a valid contact number.");
      return;
    }

    setFormError("");

    if (editingCustomerId) {
      const updatedCustomers = customers.map((customer) =>
        customer.id === editingCustomerId
          ? {
              ...customer,
              name: trimmedName,
              email: trimmedEmail,
              contactNumber: trimmedContactNumber,
            }
          : customer,
      );

      persistCustomers(updatedCustomers);
      setSelectedCustomerId(editingCustomerId);
      setEditingCustomerId(null);
      setFormData(emptyForm);
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      contactNumber: trimmedContactNumber,
      createdAt: new Date().toISOString(),
    };

    const updatedCustomers = [newCustomer, ...customers];
    persistCustomers(updatedCustomers);
    setSelectedCustomerId(newCustomer.id);
    setFormData(emptyForm);
  };

  const startEdit = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      contactNumber: customer.contactNumber,
    });
    setFormError("");
  };

  const deleteCustomer = (customerId: string) => {
    const targetCustomer = customers.find((customer) => customer.id === customerId);

    if (!targetCustomer) {
      return;
    }

    const confirmed = window.confirm(`Delete ${targetCustomer.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const remainingCustomers = customers.filter((customer) => customer.id !== customerId);
    persistCustomers(remainingCustomers);

    if (editingCustomerId === customerId) {
      setEditingCustomerId(null);
      setFormData(emptyForm);
      setFormError("");
    }

    setSelectedCustomerId((previous) =>
      previous === customerId ? remainingCustomers[0]?.id ?? null : previous,
    );
  };

  const cancelEdit = () => {
    setEditingCustomerId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.45),_transparent_60%),linear-gradient(135deg,_#111827_0%,_#1f2937_45%,_#0f172a_100%)]">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-white md:px-8">
          <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h1 className="text-3xl font-bold">Customer Records</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage customer data with search and sorting, then view full details in one click.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search customers by name"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
              />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "name-asc" | "name-desc" | "recent")
                }
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="recent">Sort: Recently Added</option>
              </select>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
              <h2 className="text-xl font-semibold">Record List View</h2>
              <p className="mt-1 text-sm text-white/70">{filteredCustomers.length} customer record(s)</p>

              <div className="mt-4 space-y-3">
                {filteredCustomers.map((customer) => (
                  <article
                    key={customer.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
                  >
                    <p className="text-lg font-semibold">{customer.name}</p>
                    <p className="text-sm text-white/75">{customer.email}</p>
                    <p className="text-sm text-white/75">{customer.contactNumber}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(customer)}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-amber-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomer(customer.id)}
                        className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}

                {filteredCustomers.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/25 p-5 text-center text-white/70">
                    No customer records match your search.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold">
                  {editingCustomerId ? "Edit Customer" : "Create Customer"}
                </h2>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm">
                    Name
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, name: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Email
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, email: event.target.value }))
                      }
                      placeholder="name@email.com"
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Contact Number
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, contactNumber: event.target.value }))
                      }
                      placeholder="+63 917 555 0111"
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
                    {editingCustomerId ? "Save Changes" : "Add Customer"}
                  </button>
                  {editingCustomerId && (
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

              <article className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
                <h2 className="text-xl font-semibold">Customer Detail View</h2>

                {selectedCustomer ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-white/85">Name:</span> {selectedCustomer.name}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Email:</span> {selectedCustomer.email}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Contact Number:</span>{" "}
                      {selectedCustomer.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Record ID:</span> {selectedCustomer.id}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Created At:</span>{" "}
                      {new Date(selectedCustomer.createdAt).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteCustomer(selectedCustomer.id)}
                      className="mt-2 rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                    >
                      Delete This Customer
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">Select a customer to view full info.</p>
                )}
              </article>
            </section>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
          <Link href="/Display/LandingPage" className="text-sm text-white/80 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}