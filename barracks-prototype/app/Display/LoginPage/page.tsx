"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/Display/LandingPage";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Please enter both username and password.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = (await response.json()) as { message?: string };

            if (!response.ok) {
                setError(data.message || "Login failed.");
                return;
            }

            window.location.assign(from);
        } catch {
            setError("Could not connect to the server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-md rounded-lg bg-blue-900 p-8 shadow-lg">
            <h1 className="mb-6 text-center text-3xl font-bold text-white">Login</h1>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    autoComplete="username"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    autoComplete="current-password"
                />

                {error ? <p className="text-sm text-red-200">{error}</p> : null}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-950 px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-200">
                Demo account: <span className="font-semibold">admin</span> / <span className="font-semibold">barracks123</span>
            </p>
        </div>
    );
}