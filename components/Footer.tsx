import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#101c16] text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                {/* FOOTER TOP */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* BRAND */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block">
                            <p className="text-2xl font-black tracking-tight">
                                SBM LAND HUB
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#d9b45f]">
                                Property & Real Estate
                            </p>
                        </Link>

                        <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
                            Helping people discover, buy and sell land, houses,
                            agricultural fields, shops and commercial properties.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <a
                                href="https://www.facebook.com/share/1DZmzt8PVq/"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:border-[#d9b45f] hover:text-[#d9b45f]"
                            >
                                f
                            </a>

                            <a
                                href="https://www.instagram.com/sbmlandhub?stkn=MWpscnZnY2VyaGcxZQ=="
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:border-[#d9b45f] hover:text-[#d9b45f]"
                            >
                                ig
                            </a>

                            <a
                                href="https://wa.me/+917005316378"
                                aria-label="WhatsApp"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition hover:border-[#d9b45f] hover:text-[#d9b45f]"
                            >
                                wa
                            </a>
                        </div>
                    </div>

                    {/* EXPLORE */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#d9b45f]">
                            Explore
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-white/50">
                            <Link
                                href="/properties"
                                className="transition hover:text-white"
                            >
                                All Properties
                            </Link>

                            <Link
                                href="/properties?type=LAND"
                                className="transition hover:text-white"
                            >
                                Land
                            </Link>

                            <Link
                                href="/properties?type=HOUSE"
                                className="transition hover:text-white"
                            >
                                Houses
                            </Link>

                            <Link
                                href="/properties?type=FIELD"
                                className="transition hover:text-white"
                            >
                                Fields
                            </Link>

                            <Link
                                href="/properties?type=SHOP"
                                className="transition hover:text-white"
                            >
                                Shops
                            </Link>
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#d9b45f]">
                            Company
                        </h3>

                        <div className="mt-5 flex flex-col gap-3 text-sm text-white/50">
                            <Link
                                href="/about"
                                className="transition hover:text-white"
                            >
                                About Us
                            </Link>

                            <Link
                                href="/sell"
                                className="transition hover:text-white"
                            >
                                Sell Property
                            </Link>

                            <Link
                                href="/contact"
                                className="transition hover:text-white"
                            >
                                Contact
                            </Link>

                            <Link
                                href="/admin/login"
                                className="transition hover:text-white"
                            >
                                Admin Portal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CONTACT STRIP */}
                <div className="mt-14 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-white/30">
                            Phone
                        </p>

                        <p className="mt-1 text-sm text-white/70">
                            +91 7005316378
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wider text-white/30">
                            Email
                        </p>

                        <p className="mt-1 text-sm text-white/70">
                            sbmlandhub@gmail.com
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wider text-white/30">
                            Location
                        </p>

                        <p className="mt-1 text-sm text-white/70">
                            Imphal, Manipur
                        </p>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} SBM LAND HUB. All rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <Link
                            href="/privacy"
                            className="hover:text-white"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="hover:text-white"
                        >
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}

