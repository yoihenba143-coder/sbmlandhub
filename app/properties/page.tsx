"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

type PropertyType =
    | "ALL"
    | "LAND"
    | "HOUSE"
    | "FIELD"
    | "SHOP"
    | "COMMERCIAL";

type Property = {
    id: number;
    title: string;
    location: string;
    type: Exclude<PropertyType, "ALL">;
    price: number;
    area: string;
    image: string;
    images?: string[];
    video?: string | null;
    featured: boolean;
};

const propertyTypes: PropertyType[] = [
    "ALL",
    "LAND",
    "HOUSE",
    "FIELD",
    "SHOP",
    "COMMERCIAL",
];

export default function PropertiesPage() {
    const [selectedType, setSelectedType] =
        useState<PropertyType>("ALL");

    const [location, setLocation] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [loading, setLoading] = useState(true);
    const [propertyList, setPropertyList] = useState<Property[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && Array.isArray(data.properties)) {
                    setPropertyList(data.properties);
                }
            })
            .catch(() => { })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredProperties = useMemo(() => {
        let result = propertyList.filter((property) => {
            const matchesType =
                selectedType === "ALL" ||
                property.type === selectedType;

            const matchesLocation =
                location.trim() === "" ||
                property.location
                    .toLowerCase()
                    .includes(location.toLowerCase());

            const matchesPrice =
                maxPrice === "" ||
                property.price <= Number(maxPrice);

            return matchesType && matchesLocation && matchesPrice;
        });

        if (sortBy === "price-low") {
            result = [...result].sort(
                (a, b) => a.price - b.price
            );
        }

        if (sortBy === "price-high") {
            result = [...result].sort(
                (a, b) => b.price - a.price
            );
        }

        if (sortBy === "featured") {
            result = [...result].sort(
                (a, b) =>
                    Number(b.featured) - Number(a.featured)
            );
        }

        return result;
    }, [selectedType, location, maxPrice, sortBy]);

    const resetFilters = () => {
        setSelectedType("ALL");
        setLocation("");
        setMaxPrice("");
        setSortBy("featured");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getWhatsAppCardUrl = (prop: Property) => {
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://sbmlandhub.com";
        const propertyUrl = `${origin}/properties/${prop.id}`;
        const rawImage = prop.image || (prop.images && prop.images[0]) || "/image/land1.avif";
        const fullImageUrl = rawImage.startsWith("http") ? rawImage : `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

        const msg = [
            `Hello SBM LAND HUB, I am inquiring about this property:`,
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
            `Please share further details, title verification status, and site visit schedule.`
        ].join("\n");

        return `https://wa.me/917005316378?text=${encodeURIComponent(msg)}`;
    };

    return (
        <main className="min-h-screen bg-[#F5F3EE] text-[#1F2937]">
            {/* Page Header */}
            <section className="bg-[#1F2937] px-6 pb-20 pt-36 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DDB86A]">
                        SBM LAND HUB
                    </p>

                    <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                        Find the right property
                        <span className="block text-[#DDB86A]">
                            for your future.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                        Explore land, houses, agricultural fields, shops
                        and commercial properties available through SBM
                        LAND HUB.
                    </p>
                </div>
            </section>

            {/* Search & Filters */}
            <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-6 lg:px-8">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-7">
                    <div className="grid gap-4 lg:grid-cols-4">
                        {/* Property Type */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Property Type
                            </label>

                            <select
                                value={selectedType}
                                onChange={(event) =>
                                    setSelectedType(
                                        event.target.value as PropertyType
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm font-semibold outline-none focus:border-[#C59D5F]"
                            >
                                {propertyTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "ALL"
                                            ? "All Properties"
                                            : type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Location
                            </label>

                            <input
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                placeholder="Search location"
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#C59D5F]"
                            />
                        </div>

                        {/* Maximum Price */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Maximum Price
                            </label>

                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(event) =>
                                    setMaxPrice(event.target.value)
                                }
                                placeholder="e.g. 5000000"
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#C59D5F]"
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm font-semibold outline-none focus:border-[#C59D5F]"
                            >
                                <option value="featured">
                                    Featured
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-500">
                            <span className="font-bold text-[#1F2937]">
                                {filteredProperties.length}
                            </span>{" "}
                            properties found
                        </p>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-sm font-bold text-[#B88A44] transition hover:text-[#1F2937]"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </section>

            {/* Property Listings */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C59D5F] border-t-transparent" />
                        <p className="mt-4 text-sm font-semibold text-zinc-500">
                            Loading properties...
                        </p>
                    </div>
                ) : propertyList.length === 0 ? (
                    /* Database Empty - No Properties Yet */
                    <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F3EE] text-3xl">
                            🏡
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-[#1F2937]">
                            No Properties Listed Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                            We are currently updating our listings. Properties uploaded by SBM LAND HUB will appear here soon.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/sell"
                                className="rounded-full bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                            >
                                List Your Property
                            </Link>
                            <Link
                                href="/contact"
                                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-bold text-[#1F2937] transition hover:border-[#1F2937]"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProperties.map((property) => (
                            <article
                                key={property.id}
                                className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={property.image || (property.images && property.images[0]) || "/image/land1.avif"}
                                        alt={property.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                    {/* Type Badge */}
                                    <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1F2937] shadow-sm">
                                        {property.type}
                                    </span>

                                    {/* Featured Badge */}
                                    {property.featured && (
                                        <span className="absolute right-5 top-5 rounded-full bg-[#C59D5F] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                            Featured
                                        </span>
                                    )}

                                    {/* Video Tour Badge */}
                                    {property.video && (
                                        <span className="absolute left-5 bottom-4 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-xs font-bold text-white flex items-center gap-1.5 shadow-md border border-white/20">
                                            <span>🎥</span> Video Tour
                                        </span>
                                    )}

                                    {/* Photos Count Badge */}
                                    {property.images && property.images.length > 1 && (
                                        <span className="absolute right-5 bottom-4 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1 shadow-md">
                                            <span>📷</span> {property.images.length}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-sm text-zinc-500">
                                        📍 {property.location}
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-[#1F2937]">
                                        {property.title}
                                    </h2>

                                    <div className="mt-5 flex items-end justify-between border-t border-zinc-100 pt-5">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-400">
                                                Price
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-[#1F2937]">
                                                {formatPrice(property.price)}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-wider text-zinc-400">
                                                Area
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-zinc-600">
                                                {property.area}
                                            </p>
                                        </div>
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
                ) : (
                    /* No Results Matching Filters */
                    <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-20 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F3EE] text-2xl">
                            🔍
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-[#1F2937]">
                            No properties found
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                            Try changing your property type, location or
                            maximum price.
                        </p>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="mt-7 rounded-full bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>

            {/* Sell CTA */}
            <section className="bg-[#C59D5F]">
                <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1F2937]">
                        Have a Property?
                    </p>

                    <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2937] sm:text-5xl">
                        Want to sell your property?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-[#1F2937]/70">
                        List your land, house, field, shop or commercial
                        property with SBM LAND HUB.
                    </p>

                    <Link
                        href="/sell"
                        className="mt-8 inline-block rounded-full bg-[#1F2937] px-8 py-4 text-sm font-bold text-white transition hover:bg-black"
                    >
                        List Your Property
                    </Link>
                </div>
            </section>
        </main>
    );
}

