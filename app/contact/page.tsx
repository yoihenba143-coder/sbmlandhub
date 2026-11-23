"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        title: "Let's talk about your property.",
        phone: "+91 7005316378",
        email: "sbmlandhub@gmail.com",
        address: "SBM LAND HUB Headquarters, MG Avenue, Imphal, Manipur 795001",
        workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM",
        whatsapp: "+91 7005316378",
    });

    useEffect(() => {
        // Fetch dynamic contact info
        fetch("/api/admin/content")
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.content?.contact) {
                    setContactInfo(data.content.contact);
                }
            })
            .catch(() => {});
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "");
        const phone = String(formData.get("phone") || "");
        const email = String(formData.get("email") || "");
        const enquiryType = String(formData.get("enquiryType") || "GENERAL");
        const propertyType = formData.get("propertyType") ? String(formData.get("propertyType")) : null;
        const message = String(formData.get("message") || "");

        setSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    enquiryType,
                    propertyType,
                    message,
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Error submitting contact inquiry:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F5F3EE] text-[#1F2937]">
            {/* Hero */}
            <section className="bg-[#1F2937] px-6 pb-20 pt-36 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#DDB86A]">
                        Contact SBM LAND HUB
                    </p>

                    <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
                        {contactInfo.title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                        Have a question about a property, want to sell your
                        property, or need help finding the right opportunity?
                        Get in touch with our team.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                    {/* Contact Information */}
                    <div className="space-y-5">
                        <div className="rounded-3xl bg-[#1F2937] p-8 text-white">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DDB86A]">
                                Get In Touch
                            </p>

                            <h2 className="mt-4 text-3xl font-semibold">
                                We&apos;re here to help.
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/55">
                                Contact us for property enquiries, buying and
                                selling assistance, or general questions about SBM
                                LAND HUB.
                            </p>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/35">
                                        Phone / WhatsApp
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">
                                        {contactInfo.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/35">
                                        Email
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">
                                        {contactInfo.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-white/35">
                                        Location &amp; Hours
                                    </p>
                                    <p className="mt-2 text-sm font-semibold">
                                        {contactInfo.address}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-400">
                                        {contactInfo.workingHours}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-8 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B88A44]">
                                Property Enquiry
                            </p>

                            <h3 className="mt-3 text-2xl font-bold">
                                Looking for a property?
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                                Tell us what you are looking for and our team can
                                help you explore suitable opportunities.
                            </p>

                            <Link
                                href="/properties"
                                className="mt-6 inline-block rounded-full bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                            >
                                Browse Properties
                            </Link>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                        {submitted ? (
                            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F3EE] text-3xl font-bold text-[#B88A44]">
                                    ✓
                                </div>

                                <h2 className="mt-6 text-3xl font-bold">
                                    Message sent
                                </h2>

                                <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                                    Thank you for contacting SBM LAND HUB. We have
                                    received your message and will get back to you
                                    soon.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    className="mt-8 rounded-full bg-[#1F2937] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-zinc-100 pb-7">
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A44]">
                                        Send Us A Message
                                    </p>

                                    <h2 className="mt-3 text-3xl font-semibold">
                                        How can we help?
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                                        Complete the form and our team will contact you.
                                    </p>
                                </div>



                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-6"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                                Full Name
                                            </label>

                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                placeholder="Your full name"
                                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
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
                                                className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            Enquiry Type
                                        </label>

                                        <select
                                            required
                                            name="enquiryType"
                                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
                                        >
                                            <option value="">
                                                Select enquiry type
                                            </option>
                                            <option value="BUY">
                                                I want to buy a property
                                            </option>
                                            <option value="SELL">
                                                I want to sell a property
                                            </option>
                                            <option value="PROPERTY">
                                                Property enquiry
                                            </option>
                                            <option value="GENERAL">
                                                General enquiry
                                            </option>
                                            <option value="OTHER">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            Property Type
                                        </label>

                                        <select
                                            name="propertyType"
                                            className="mt-2 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition focus:border-[#C59D5F]"
                                        >
                                            <option value="">
                                                Select property type
                                            </option>
                                            <option value="LAND">Land</option>
                                            <option value="HOUSE">House</option>
                                            <option value="FIELD">
                                                Agricultural Field
                                            </option>
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
                                            Message
                                        </label>

                                        <textarea
                                            required
                                            name="message"
                                            rows={7}
                                            placeholder="Tell us how we can help..."
                                            className="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-[#FAFAF8] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#C59D5F]"
                                        />
                                    </div>

                                    <div className="border-t border-zinc-100 pt-6">
                                        <label className="flex items-start gap-3">
                                            <input
                                                required
                                                type="checkbox"
                                                className="mt-1 h-4 w-4 accent-[#C59D5F]"
                                            />

                                            <span className="text-sm leading-6 text-zinc-500">
                                                I agree to be contacted by SBM LAND HUB
                                                regarding my enquiry.
                                            </span>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="mt-7 w-full rounded-xl bg-[#1F2937] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#C59D5F] disabled:opacity-60"
                                        >
                                            {submitting ? "Sending Message..." : "Send Message"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#C59D5F]">
                <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
                    <h2 className="text-3xl font-semibold text-[#1F2937] sm:text-4xl">
                        Ready to find your next property?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#1F2937]/70">
                        Explore our available properties and find an
                        opportunity that fits your needs.
                    </p>

                    <Link
                        href="/properties"
                        className="mt-7 inline-block rounded-full bg-[#1F2937] px-8 py-4 text-sm font-bold text-white transition hover:bg-black"
                    >
                        Explore Properties
                    </Link>
                </div>
            </section>
        </main>
    );
}

