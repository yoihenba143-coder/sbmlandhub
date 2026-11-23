"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SellPropertyPage() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const payload = {
            title: String(formData.get("title") || ""),
            type: String(formData.get("type") || "LAND"),
            listingType: String(formData.get("listingType") || "SALE"),
            price: String(formData.get("price") || "0"),
            area: String(formData.get("area") || "1000"),
            areaUnit: String(formData.get("areaUnit") || "sq.ft"),
            location: String(formData.get("location") || ""),
            district: String(formData.get("district") || ""),
            state: String(formData.get("state") || "Manipur"),
            pincode: String(formData.get("pincode") || ""),
            description: String(formData.get("description") || ""),
            ownerName: String(formData.get("name") || ""),
            ownerPhone: String(formData.get("phone") || ""),
            ownerEmail: String(formData.get("email") || ""),
        };

        setSubmitting(true);
        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F3EE] text-[#1F2937]">
            {/* Header */}
            <section className="bg-[#1F2937] px-6 pb-20 pt-36 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DDB86A]">
                        SBM LAND HUB
                    </p>

                    <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                        List your property
                        <span className="block text-[#DDB86A]">
                            with confidence.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                        Tell us about your property and our team will review
                        your information and help connect you with potential
                        buyers.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                    {/* Form */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                        {submitted ? (
                            <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F3EE] text-3xl">
                                    ✓
                                </div>

                                <h2 className="mt-6 text-3xl font-bold">
                                    Property submitted
                                </h2>

                                <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                                    Thank you for submitting your property details.
                                    Our team will review the information and contact
                                    you soon.
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center gap-3">
                                    <Link
                                        href="/properties"
                                        className="rounded-full bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                                    >
                                        Browse Properties
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setSubmitted(false)}
                                        className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-bold text-[#1F2937] transition hover:border-[#C59D5F]"
                                    >
                                        Submit Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-zinc-100 pb-7">
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                                        Property Information
                                    </p>

                                    <h2 className="mt-2 text-3xl font-semibold">
                                        Tell us about your property
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                                        Fill in the details below. You can provide
                                        additional information later.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-8"
                                >
                                    {/* Property Details */}
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            Property Details
                                        </h3>

                                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Property Title
                                                </label>

                                                <input
                                                    required
                                                    type="text"
                                                    name="title"
                                                    placeholder="e.g. Premium Residential Land"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Property Type
                                                </label>

                                                <select
                                                    required
                                                    name="type"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                >
                                                    <option value="">
                                                        Select property type
                                                    </option>
                                                    <option value="LAND">Land</option>
                                                    <option value="HOUSE">House</option>
                                                    <option value="FIELD">Agricultural Field</option>
                                                    <option value="SHOP">Shop</option>
                                                    <option value="COMMERCIAL">
                                                        Commercial Property
                                                    </option>
                                                    <option value="RESIDENTIAL">
                                                        Residential Property
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Listing Type
                                                </label>

                                                <select
                                                    required
                                                    name="listingType"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                >
                                                    <option value="">
                                                        Select listing type
                                                    </option>
                                                    <option value="SALE">
                                                        For Sale
                                                    </option>
                                                    <option value="PURCHASE">
                                                        Looking for Buyer
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Expected Price
                                                </label>

                                                <input
                                                    required
                                                    type="number"
                                                    min="0"
                                                    name="price"
                                                    placeholder="₹ Enter amount"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Property Area
                                                </label>

                                                <div className="mt-2 flex">
                                                    <input
                                                        required
                                                        type="number"
                                                        min="0"
                                                        name="area"
                                                        placeholder="Enter area"
                                                        className="min-w-0 flex-1 rounded-l-xl border border-r-0 border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                    />

                                                    <select
                                                        name="areaUnit"
                                                        className="rounded-r-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none"
                                                    >
                                                        <option value="sq.ft">
                                                            sq.ft
                                                        </option>
                                                        <option value="sq.m">
                                                            sq.m
                                                        </option>
                                                        <option value="acre">
                                                            Acre
                                                        </option>
                                                        <option value="bigha">
                                                            Bigha
                                                        </option>
                                                        <option value="katha">
                                                            Katha
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="border-t border-zinc-100 pt-8">
                                        <h3 className="text-lg font-bold">
                                            Property Location
                                        </h3>

                                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Address / Area
                                                </label>

                                                <input
                                                    required
                                                    type="text"
                                                    name="location"
                                                    placeholder="Enter property address or area"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    District
                                                </label>

                                                <input
                                                    type="text"
                                                    name="district"
                                                    placeholder="District"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    State
                                                </label>

                                                <input
                                                    type="text"
                                                    name="state"
                                                    placeholder="State"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    PIN Code
                                                </label>

                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    placeholder="PIN Code"
                                                    maxLength={6}
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="border-t border-zinc-100 pt-8">
                                        <h3 className="text-lg font-bold">
                                            Property Description
                                        </h3>

                                        <div className="mt-5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                Description
                                            </label>

                                            <textarea
                                                name="description"
                                                rows={6}
                                                placeholder="Describe your property, nearby facilities, road access, surroundings, documents available, etc."
                                                className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm leading-6 outline-none focus:border-[#C59D5F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="border-t border-zinc-100 pt-8">
                                        <h3 className="text-lg font-bold">
                                            Your Contact Information
                                        </h3>

                                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Full Name
                                                </label>

                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    placeholder="Your full name"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Phone Number
                                                </label>

                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                    Email Address
                                                </label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="you@example.com"
                                                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none focus:border-[#C59D5F]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="border-t border-zinc-100 pt-8">
                                        <label className="flex items-start gap-3">
                                            <input
                                                required
                                                type="checkbox"
                                                className="mt-1 h-4 w-4 accent-[#C59D5F]"
                                            />

                                            <span className="text-sm leading-6 text-zinc-500">
                                                I confirm that the information provided is
                                                accurate and I agree to be contacted by SBM
                                                LAND HUB regarding this property.
                                            </span>
                                        </label>

                                        <button
                                            type="submit"
                                            className="mt-7 w-full rounded-xl bg-[#1F2937] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                                        >
                                            Submit Property
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-5">
                        <div className="rounded-3xl bg-white p-7 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B88A44]">
                                Why List With Us?
                            </p>

                            <div className="mt-6 space-y-6">
                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3EE] font-bold text-[#B88A44]">
                                        01
                                    </div>

                                    <h3 className="mt-4 font-bold">
                                        Reach Potential Buyers
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        Present your property to people actively
                                        looking for real estate opportunities.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3EE] font-bold text-[#B88A44]">
                                        02
                                    </div>

                                    <h3 className="mt-4 font-bold">
                                        Clear Property Listings
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        Showcase your property with important details
                                        such as location, price and area.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3EE] font-bold text-[#B88A44]">
                                        03
                                    </div>

                                    <h3 className="mt-4 font-bold">
                                        Personal Support
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        Our team can help you through the property
                                        listing process.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-[#1F2937] p-7 text-white">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DDB86A]">
                                Need Help?
                            </p>

                            <h3 className="mt-3 text-2xl font-semibold">
                                Have questions about listing?
                            </h3>

                            <p className="mt-4 text-sm leading-6 text-white/55">
                                Contact our team if you need assistance with your
                                property listing.
                            </p>

                            <Link
                                href="/contact"
                                className="mt-6 inline-block rounded-full bg-[#C59D5F] px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#1F2937]"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

