"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { setStoredUser } from "@/lib/auth";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberAdmin, setRememberAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const urlError = params.get("error");
            if (urlError) setError(urlError);
        }
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                setError("Please enter both email and password.");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, isAdmin: true }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || "Authentication failed. Check your credentials.");
                setLoading(false);
                return;
            }

            setStoredUser(data.user);
            window.location.href = "/admin";
        } catch {
            setError("An error occurred during authentication.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F3EE] text-[#1F2937]">
            <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32 sm:pb-24 sm:pt-36">
                <div className="w-full max-w-md">
                    {/* Brand Header */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-flex flex-col items-center">
                            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-md">
                                <img
                                    src="/image/sbm%20logo.jpg"
                                    alt="SBM LAND HUB Logo"
                                    className="h-full w-full object-contain p-1"
                                />
                            </div>

                            <p className="mt-3 text-2xl font-black tracking-tight text-[#1F2937]">
                                SBM LAND HUB
                            </p>

                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#B88A44]">
                                Administration Portal
                            </p>
                        </Link>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl sm:p-9">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F3EE] text-2xl text-[#B88A44]">
                                🔐
                            </div>

                            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                                Secure Access
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F2937]">
                                Admin Sign In
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                Enter your authorized credentials to access the administrative panel.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
                                <span className="text-base">⚠️</span>
                                <p className="leading-snug">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            {/* Admin Email */}
                            <div>
                                <label
                                    htmlFor="admin-email"
                                    className="block text-xs font-bold uppercase tracking-wider text-zinc-500"
                                >
                                    Admin Email
                                </label>

                                <div className="relative mt-2">
                                    <input
                                        id="admin-email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="sbmlandhub@gmail.com"
                                        className="w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3.5 text-sm font-medium outline-none transition focus:border-[#C59D5F] focus:ring-2 focus:ring-[#C59D5F]/10"
                                    />
                                </div>
                            </div>

                            {/* Admin Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="admin-password"
                                        className="block text-xs font-bold uppercase tracking-wider text-zinc-500"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        href="/contact"
                                        className="text-xs font-semibold text-[#B88A44] transition hover:text-[#1F2937]"
                                    >
                                        Need Help?
                                    </Link>
                                </div>

                                <div className="relative mt-2">
                                    <input
                                        id="admin-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••••••"
                                        className="w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3.5 pr-20 text-sm font-medium outline-none transition focus:border-[#C59D5F] focus:ring-2 focus:ring-[#C59D5F]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-bold text-zinc-500 transition hover:bg-zinc-200/60 hover:text-[#B88A44]"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Device */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex cursor-pointer select-none items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={rememberAdmin}
                                        onChange={(e) => setRememberAdmin(e.target.checked)}
                                        className="h-4 w-4 rounded accent-[#C59D5F]"
                                    />

                                    <span className="text-sm font-medium text-zinc-600">
                                        Remember this device
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#1F2937] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#C59D5F] disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    "Sign In to Admin Panel"
                                )}
                            </button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-zinc-100 bg-[#FAFAF8] p-4">
                            <span className="text-base text-zinc-500">🛡️</span>
                            <p className="text-xs leading-5 text-zinc-500">
                                This portal is restricted to authorized SBM LAND HUB personnel. All access attempts are logged and monitored.
                            </p>
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="mt-8 flex items-center justify-center text-xs font-semibold text-zinc-500">
                        <Link href="/" className="transition hover:text-[#C59D5F]">
                            ← Back to Homepage
                        </Link>
                    </div>

                    <p className="mt-5 text-center text-[11px] text-zinc-400">
                        © {new Date().getFullYear()} SBM LAND HUB. All rights reserved.
                    </p>
                </div>
            </section>
        </main>
    );
}

