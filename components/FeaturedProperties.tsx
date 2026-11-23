"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Property = {
    id: number;
    title: string;
    location: string;
    type: string;
    price: number;
    area: string;
    image?: string;
    images?: string[];
    featured?: boolean;
    status?: string;
};

export default function FeaturedProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.properties)) {
                    const featuredOnly = data.properties.filter((p: Property) => p.featured);
                    const toShow = featuredOnly.length > 0 ? featuredOnly.slice(0, 3) : data.properties.slice(0, 3);
                    setProperties(toShow);
                }
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹ ${(price / 10000000).toFixed(2)} Cr`;
        }
        if (price >= 100000) {
            return `₹ ${(price / 100000).toFixed(2)} Lakhs`;
        }
        return `₹ ${price.toLocaleString("en-IN")}`;
    };

    const getWhatsAppCardUrl = (prop: Property) => {
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://sbmlandhub.com";
        const propertyUrl = `${origin}/properties/${prop.id}`;
        const rawImage = prop.image || (prop.images && prop.images[0]) || "/image/land1.avif";
        const fullImageUrl = rawImage.startsWith("http") ? rawImage : `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

        const msg = [
            `Hello SBM LAND HUB, I am inquiring about this featured property:`,
            ``,
            `🏡 *${prop.title}*`,
            `🆔 *Property ID:* #${prop.id}`,
            `📍 *Location:* ${prop.location}`,
            `💰 *Price:* ${formatPrice(prop.price)}`,
            `📐 *Area:* ${prop.area}`,
            `📋 *Category:* ${prop.type}`,
            ``,
            `🔗 *Property Link:*`,
            propertyUrl,
            ``,
            `📸 *Property Picture:*`,
            fullImageUrl,
            ``,
            `Please share further details and site visit inspection schedule.`
        ].join("\n");

        return `https://wa.me/917005316378?text=${encodeURIComponent(msg)}`;
    };

    if (loading) {
        return (
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm animate-pulse"
                    >
                        <div className="h-64 bg-zinc-200" />
                        <div className="p-6 space-y-3">
                            <div className="h-4 bg-zinc-200 rounded w-1/3" />
                            <div className="h-6 bg-zinc-200 rounded w-4/5" />
                            <div className="pt-4 border-t border-zinc-100 flex justify-between">
                                <div className="h-5 bg-zinc-200 rounded w-1/4" />
                                <div className="h-5 bg-zinc-200 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <div className="mt-12 rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFECE6] text-2xl">
                    🏡
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#1F2937]">
                    No Featured Properties Listed Yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                    Real estate listings will appear here once uploaded by SBM LAND HUB.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/properties"
                        className="inline-flex rounded-full bg-[#1F2937] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#C59D5F]"
                    >
                        Browse All Properties
                    </Link>
                    <Link
                        href="/sell"
                        className="inline-flex rounded-full border border-zinc-300 px-6 py-2.5 text-xs font-bold text-[#1F2937] transition hover:border-[#1F2937]"
                    >
                        List Your Property
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <article
                        key={property.id}
                        className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={
                                    property.image ||
                                    (property.images && property.images[0]) ||
                                    "/image/land1.avif"
                                }
                                alt={property.title}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1F2937] shadow-sm">
                                {property.type}
                            </span>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-zinc-500">
                                📍 {property.location}
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-[#1F2937]">
                                {property.title}
                            </h3>

                            <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-5">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-zinc-400">
                                        Price
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-[#1F2937]">
                                        {formatPrice(property.price)}
                                    </p>
                                </div>

                                <p className="text-sm font-medium text-zinc-500">
                                    {property.area}
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <Link
                                    href={`/properties/${property.id}`}
                                    className="flex-1 rounded-xl bg-[#1F2937] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                                >
                                    View Property
                                </Link>
                                <a
                                    href={getWhatsAppCardUrl(property)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-3.5 py-3 text-white transition hover:bg-[#20ba5a] shadow-sm"
                                    title="WhatsApp Inquiry (with Picture & Link)"
                                >
                                    <span className="text-base">💬</span>
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/properties"
                    className="inline-flex rounded-full border border-[#1F2937] px-7 py-3 text-sm font-bold text-[#1F2937] transition hover:bg-[#1F2937] hover:text-white"
                >
                    Browse All Properties
                </Link>
            </div>
        </>
    );
}
