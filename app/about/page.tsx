import Link from "next/link";

const values = [
    {
        number: "01",
        title: "Transparency",
        description:
            "We believe property information should be clear, simple and easy to understand.",
    },
    {
        number: "02",
        title: "Local Understanding",
        description:
            "We focus on understanding local property markets and the needs of buyers and sellers.",
    },
    {
        number: "03",
        title: "Customer First",
        description:
            "Every property journey is different, so we aim to provide helpful and personal support.",
    },
    {
        number: "04",
        title: "Better Opportunities",
        description:
            "We connect people with land, homes and commercial properties that match their goals.",
    },
];

const propertyTypes = [
    "Residential Land",
    "Houses",
    "Agricultural Fields",
    "Shops",
    "Commercial Properties",
];

import { getSiteContent } from "@/lib/content";

export default function AboutPage() {
    const siteContent = getSiteContent();
    const { about } = siteContent;

    return (
        <main className="min-h-screen bg-[#F5F3EE] text-[#1F2937]">
            {/* Hero */}
            <section className="bg-[#1F2937] px-6 pb-24 pt-36 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DDB86A]">
                        {about.subtitle || "About SBM LAND HUB"}
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                        {about.title}
                    </h1>

                    <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
                        {about.description}
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                            Who We Are
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            A better way to discover property.
                        </h2>

                        <div className="mt-7 space-y-5 text-base leading-8 text-zinc-600">
                            <p>
                                Finding the right property can be complicated.
                                Location, price, size, property type and future
                                potential all matter when making an important
                                decision.
                            </p>

                            <p>
                                SBM LAND HUB brings these opportunities together
                                in one place, helping buyers explore properties
                                and helping owners present their properties to
                                potential buyers.
                            </p>

                            <p>
                                Our goal is simple: make the property journey
                                easier, clearer and more convenient.
                            </p>
                        </div>

                        <Link
                            href="/properties"
                            className="mt-8 inline-block rounded-full bg-[#1F2937] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                        >
                            Explore Properties
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-white p-7 shadow-sm">
                            <p className="text-4xl font-bold text-[#C59D5F]">
                                01
                            </p>

                            <h3 className="mt-5 text-xl font-bold">
                                Simple Search
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Find properties based on type, location and
                                budget.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-[#1F2937] p-7 text-white shadow-sm">
                            <p className="text-4xl font-bold text-[#DDB86A]">
                                02
                            </p>

                            <h3 className="mt-5 text-xl font-bold">
                                Local Focus
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-white/50">
                                Property opportunities with a focus on local
                                markets.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-[#C59D5F] p-7 shadow-sm">
                            <p className="text-4xl font-bold text-[#1F2937]">
                                03
                            </p>

                            <h3 className="mt-5 text-xl font-bold">
                                Clear Information
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#1F2937]/65">
                                Important property details presented clearly.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white p-7 shadow-sm">
                            <p className="text-4xl font-bold text-[#C59D5F]">
                                04
                            </p>

                            <h3 className="mt-5 text-xl font-bold">
                                Personal Support
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Assistance throughout your property journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                            Our Mission
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            Connecting people with the right property
                            opportunities.
                        </h2>

                        <p className="mt-6 text-base leading-8 text-zinc-500">
                            We want to create a trusted and easy-to-use platform
                            where property owners can showcase their properties
                            and buyers can discover opportunities with greater
                            confidence.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-5 md:grid-cols-3">
                        <div className="rounded-3xl border border-zinc-200 bg-[#F5F3EE] p-7">
                            <span className="text-3xl">⌕</span>

                            <h3 className="mt-5 text-xl font-bold">
                                Discover
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Browse different types of properties and find
                                opportunities that match your requirements.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-zinc-200 bg-[#F5F3EE] p-7">
                            <span className="text-3xl">◇</span>

                            <h3 className="mt-5 text-xl font-bold">
                                Compare
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Review important details such as location, price,
                                property type and area.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-zinc-200 bg-[#F5F3EE] p-7">
                            <span className="text-3xl">→</span>

                            <h3 className="mt-5 text-xl font-bold">
                                Connect
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Get in touch with the team and take the next step
                                toward your property goal.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-[#1F2937] text-white">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#DDB86A]">
                            What Matters To Us
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                            Built around trust and simplicity.
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-5 md:grid-cols-2">
                        {values.map((value) => (
                            <div
                                key={value.number}
                                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:border-[#C59D5F]/60"
                            >
                                <span className="text-sm font-bold text-[#DDB86A]">
                                    {value.number}
                                </span>

                                <h3 className="mt-5 text-xl font-bold">
                                    {value.title}
                                </h3>

                                <p className="mt-3 max-w-md text-sm leading-6 text-white/50">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Property Types */}
            <section className="bg-[#F5F3EE]">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                                What We Cover
                            </p>

                            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                                Property for every goal.
                            </h2>
                        </div>

                        <Link
                            href="/properties"
                            className="font-semibold text-[#1F2937] underline decoration-[#C59D5F] decoration-2 underline-offset-4 hover:text-[#B88A44]"
                        >
                            View properties →
                        </Link>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {propertyTypes.map((type, index) => (
                            <div
                                key={type}
                                className="rounded-2xl border border-zinc-200 bg-white p-6"
                            >
                                <span className="text-xs font-bold text-[#C59D5F]">
                                    0{index + 1}
                                </span>

                                <h3 className="mt-5 font-bold">
                                    {type}
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    Explore available opportunities.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#C59D5F]">
                <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1F2937]">
                        Start Your Property Journey
                    </p>

                    <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2937] sm:text-5xl">
                        Looking to buy or sell?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-[#1F2937]/70">
                        Explore properties or tell us about the property you
                        want to sell.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/properties"
                            className="rounded-full bg-[#1F2937] px-8 py-4 text-sm font-bold text-white transition hover:bg-black"
                        >
                            Find a Property
                        </Link>

                        <Link
                            href="/sell"
                            className="rounded-full border border-[#1F2937] px-8 py-4 text-sm font-bold text-[#1F2937] transition hover:bg-white"
                        >
                            List Your Property
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
