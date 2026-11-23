"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, clearStoredUser, UserSession, AUTH_EVENT } from "@/lib/auth";

const navigation = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Properties",
        href: "/properties",
    },
    {
        name: "Sell",
        href: "/sell",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

export default function Navbar() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<UserSession | null>(null);
    const [mounted, setMounted] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const currentUser = getStoredUser();
        setUser(currentUser);

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Listen for login/logout changes
        const handleAuthChange = () => {
            setUser(getStoredUser());
        };

        window.addEventListener(AUTH_EVENT, handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        // Click outside dropdown handler
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener(AUTH_EVENT, handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        clearStoredUser();
        setUser(null);
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/");
    };

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? "border-b border-zinc-200/90 bg-white/95 shadow-md backdrop-blur-xl"
                : "border-b border-zinc-200/50 bg-white/85 backdrop-blur-md"
                }`}
        >
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                {/* LOGO */}
                <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3"
                >
                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white border border-zinc-200/60 shadow-xs">
                        <img
                            src="/image/sbm%20logo.jpg"
                            alt="SBM LAND HUB Logo"
                            className="h-full w-full object-contain p-0.5"
                        />
                    </div>

                    <div className="leading-none">
                        <p className="text-base font-black tracking-tight text-[#1F2937] sm:text-lg">
                            SBM LAND HUB
                        </p>

                        <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.25em] text-zinc-400 sm:text-[9px]">
                            Property & Real Estate
                        </p>
                    </div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden items-center gap-8 lg:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold text-[#374151] transition hover:text-[#C59D5F]"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* DESKTOP ACTIONS */}
                <div className="hidden items-center gap-3 lg:flex">
                    {mounted && user?.role === "ADMIN" ? (
                        /* LOGGED IN ADMIN: Administrator Menu */
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="group flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-zinc-50/80 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-[#1F2937] transition hover:border-[#C59D5F] hover:bg-white shadow-xs"
                                aria-label="Administrator Menu"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-[#DDB86A] shadow-xs group-hover:scale-105 transition-transform">
                                    A
                                </span>
                                <span className="max-w-[130px] truncate text-xs font-bold sm:text-sm">
                                    Admin
                                </span>
                                <svg
                                    className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180 text-[#C59D5F]" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                                    <div className="rounded-xl bg-[#F9F8F5] px-3.5 py-3 mb-1 border border-zinc-100">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#B88A44]">
                                            Administrator
                                        </p>
                                        <p className="text-sm font-bold text-[#1F2937] truncate mt-0.5">
                                            {user.name || "SBM Admin"}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Link
                                        href="/admin"
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200/60 px-3 py-2 text-sm font-bold text-amber-900 transition hover:bg-amber-100 mb-1"
                                    >
                                        <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Admin Dashboard
                                    </Link>

                                    <Link
                                        href="/sell"
                                        onClick={() => setProfileDropdownOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-[#F5F3EE] hover:text-[#C59D5F]"
                                    >
                                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        List Property
                                    </Link>

                                    <div className="my-1 border-t border-zinc-100" />

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : mounted ? (
                        /* ADMIN ACCESS ONLY */
                        <Link
                            href="/admin/login"
                            className="rounded-full bg-[#1F2937] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                        >
                            Admin
                        </Link>
                    ) : (
                        <div className="h-9 w-20 rounded-full bg-zinc-100 animate-pulse" />
                    )}
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-[#1F2937] transition hover:border-[#C59D5F] hover:text-[#C59D5F] lg:hidden"
                >
                    <span className="text-xl">
                        {mobileMenuOpen ? "×" : "☰"}
                    </span>
                </button>
            </div>

            {/* MOBILE NAVIGATION DROPDOWN */}
            {mobileMenuOpen && (
                <div className="border-t border-zinc-200/80 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-xl lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#F5F3EE] hover:text-[#C59D5F]"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="my-2 border-t border-zinc-200" />

                        {mounted && user?.role === "ADMIN" ? (
                            /* LOGGED IN ADMIN */
                            <div className="space-y-2 pt-1">
                                <Link
                                    href="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1F2937] py-3 text-center text-sm font-bold text-[#DDB86A] transition hover:bg-[#C59D5F] hover:text-black shadow-xs"
                                >
                                    ⚙️ Admin Dashboard
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full rounded-xl border border-red-200 bg-red-50/50 py-3 text-center text-sm font-bold text-red-600 transition hover:bg-red-50"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            /* ADMIN ACCESS ONLY */
                            <Link
                                href="/admin/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-2 rounded-xl bg-[#1F2937] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                            >
                                Admin Portal
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
