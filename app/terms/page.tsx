import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions | SBM LAND HUB",
    description:
        "Review the Terms and Conditions governing property listings, inquiries, seller responsibilities, and buyer due diligence on SBM LAND HUB.",
};

const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "platform-role", label: "2. Platform Role & Disclaimer" },
    { id: "accounts", label: "3. User Accounts & Registration" },
    { id: "seller-rules", label: "4. Listing & Seller Obligations" },
    { id: "buyer-diligence", label: "5. Buyer Due Diligence" },
    { id: "media-ip", label: "6. Media & Intellectual Property" },
    { id: "prohibited", label: "7. Prohibited Conduct" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "governing-law", label: "9. Governing Law & Jurisdiction" },
    { id: "contact-legal", label: "10. Contact & Inquiries" },
];

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-[#F8F7F4] text-[#1F2937] pt-28 pb-24">
            {/* Hero Section */}
            <section className="bg-[#1F2937] px-6 py-20 text-white lg:px-8 border-b border-zinc-800">
                <div className="mx-auto max-w-5xl">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-[#DDB86A] font-semibold">Terms &amp; Conditions</span>
                    </nav>

                    <div className="inline-flex items-center gap-2 rounded-full bg-[#DDB86A]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#DDB86A] border border-[#DDB86A]/40 mb-4">
                        <span>📜</span> Legal Agreement &amp; Platform Guidelines
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                        Terms &amp; Conditions
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
                        Please review these terms carefully before accessing, listing properties, or submitting inquiries on SBM LAND HUB. These guidelines ensure transparency, trust, and safety across all property interactions.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-zinc-400 border-t border-zinc-800 pt-6">
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Effective Date:</span>{" "}
                            <span className="text-white font-medium">January 1, 2026</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Last Modified:</span>{" "}
                            <span className="text-white font-medium">October 2026</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Jurisdiction:</span>{" "}
                            <span className="text-white font-medium">Imphal, Manipur, India</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Bar */}
            <section className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-xs">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {sections.map((sec) => (
                            <a
                                key={sec.id}
                                href={`#${sec.id}`}
                                className="rounded-full bg-zinc-100 hover:bg-[#1F2937] hover:text-white px-3.5 py-1 text-xs font-semibold text-zinc-600 transition"
                            >
                                {sec.label}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Body */}
            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 space-y-12">
                {/* Fast Summary Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">📑</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Clear Title Verification</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            Sellers must be legal owners or authorized representatives with undisputed land and property titles.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">🔍</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Independent Buyer Due Diligence</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            Buyers are advised to inspect revenue records, patta, jamabandi, and boundaries prior to final transactions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">🤝</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Ethical Transparency</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            Transparent pricing and accurate square-footage measurements are mandatory for all listings.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <article id="acceptance" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            01
                        </span>
                        Acceptance of Terms
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        These Terms and Conditions constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;) and SBM LAND HUB (&quot;Platform&quot;, &quot;we&quot;, &quot;our&quot;). By browsing our website, creating an account, submitting a property for sale or lease, or submitting an inquiry form, you agree to comply with and be bound by these terms.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        If you do not agree with any part of these Terms and Conditions, you must refrain from using the platform and its associated services immediately.
                    </p>
                </article>

                {/* Section 2 */}
                <article id="platform-role" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            02
                        </span>
                        Platform Role &amp; Real Estate Disclaimer
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        SBM LAND HUB operates as an online discovery and advertising platform designed to connect prospective buyers, tenants, property owners, and verified agents in Manipur:
                    </p>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-2 text-xs sm:text-sm text-amber-950">
                        <p className="font-bold flex items-center gap-1.5 text-amber-900">
                            <span>⚠️</span> Critical Real Estate Notice:
                        </p>
                        <p>
                            • SBM LAND HUB connects prospective parties and showcases property specifications provided by owners and agents.
                        </p>
                        <p>
                            • We do not act as the legal owner, deed registrar, or legal guarantor of any property unless explicitly specified in writing.
                        </p>
                        <p>
                            • All monetary transactions, token advancements, sale deed registrations, and mutation transfers must be executed through formal legal channels, registered sub-registrar offices, and competent revenue authorities.
                        </p>
                    </div>
                </article>

                {/* Section 3 */}
                <article id="accounts" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            03
                        </span>
                        User Accounts &amp; Registration
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        To access certain features, such as listing a property for sale or viewing personalized dashboards, you may be required to register an account:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2 pl-2">
                        <li>You must provide accurate, current, and complete registration information (name, valid phone number, and email address).</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You must notify SBM LAND HUB immediately of any unauthorized use or security breach of your account.</li>
                        <li>Users must be at least 18 years of age or possess legal capacity under Indian law to enter into binding real estate agreements.</li>
                    </ul>
                </article>

                {/* Section 4 */}
                <article id="seller-rules" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-5">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            04
                        </span>
                        Listing &amp; Seller Obligations
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        When submitting a property for publication on SBM LAND HUB, you warrant and agree to the following obligations:
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 pt-1 text-xs sm:text-sm">
                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80 space-y-1.5">
                            <h3 className="font-bold text-zinc-900">1. Authentic Ownership</h3>
                            <p className="text-zinc-600">You are the lawful owner or hold documented Power of Attorney or explicit authorization from the title holder to list the property.</p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80 space-y-1.5">
                            <h3 className="font-bold text-zinc-900">2. Disclose Encumbrances</h3>
                            <p className="text-zinc-600">You will clearly disclose any legal disputes, bank mortgages, inheritance claims, or court injunctions associated with the land or premises.</p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80 space-y-1.5">
                            <h3 className="font-bold text-zinc-900">3. True Photographs &amp; Video</h3>
                            <p className="text-zinc-600">All submitted pictures and video tours must portray the actual condition and boundaries of the specific property, without misleading alterations.</p>
                        </div>

                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80 space-y-1.5">
                            <h3 className="font-bold text-zinc-900">4. Status Updates</h3>
                            <p className="text-zinc-600">You agree to inform SBM LAND HUB promptly once a property is token-booked, sold, or withdrawn from the market to maintain accurate public records.</p>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-500">
                        SBM LAND HUB reserves the right to decline, modify, or remove any listing at our sole discretion if found non-compliant with our ethical standards or local laws.
                    </p>
                </article>

                {/* Section 5 */}
                <article id="buyer-diligence" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            05
                        </span>
                        Buyer Due Diligence &amp; Site Inspections
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        Prospective buyers and tenants acknowledge that purchasing real estate is a significant financial undertaking:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2.5 pl-2 leading-relaxed">
                        <li>
                            <strong className="text-zinc-800">Physical Inspection:</strong> Buyers are strongly advised to perform thorough on-site physical inspections of the property, examine road connectivity, water availability, and check adjoining demarcations.
                        </li>
                        <li>
                            <strong className="text-zinc-800">Title Search &amp; Document Verification:</strong> Buyers must verify official land revenue records (Patta, Jamabandi, Dag numbers, Mutation status, and Non-Encumbrance Certificates) through independent legal counsel or government land revenue offices.
                        </li>
                        <li>
                            <strong className="text-zinc-800">No Cash Advancements to Unauthorized Parties:</strong> Do not transfer advance booking deposits or cash to unverified parties without proper legal receipts and signed agreements.
                        </li>
                    </ul>
                </article>

                {/* Section 6 */}
                <article id="media-ip" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            06
                        </span>
                        Media &amp; Intellectual Property
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        All content hosted on SBM LAND HUB—including but not limited to branding, logos, layout designs, software code, custom photography, and curated video walkthroughs—is the intellectual property of SBM LAND HUB or its licensors.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        By uploading pictures or video tours, you grant SBM LAND HUB a non-exclusive, royalty-free license to host, display, watermark, and promote the media across our digital portals to market the property.
                    </p>
                </article>

                {/* Section 7 */}
                <article id="prohibited" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            07
                        </span>
                        Prohibited Conduct
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        Users agree not to engage in any of the following unauthorized activities:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-zinc-600">
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                            ✕ Posting fabricated, fraudulent, or non-existent property listings.
                        </div>
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                            ✕ Automated scraping, crawling, or unauthorized data harvesting.
                        </div>
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                            ✕ Transmitting spam inquiries, abusive communications, or malicious code.
                        </div>
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-red-950">
                            ✕ Re-listing another owner&apos;s property without documented authorization.
                        </div>
                    </div>
                </article>

                {/* Section 8 */}
                <article id="liability" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            08
                        </span>
                        Limitation of Liability
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        To the fullest extent permitted by applicable Indian law, SBM LAND HUB and its officers, directors, and staff shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-600 space-y-1.5 pl-2 leading-relaxed">
                        <li>Inaccuracies or typographical discrepancies in property measurements or seller descriptions.</li>
                        <li>Disputes or breaches of contract arising between buyers, sellers, or third-party brokers.</li>
                        <li>Physical incidents, boundary conflicts, or disputes occurring during private site inspections.</li>
                        <li>Temporary website downtime or network interruptions.</li>
                    </ul>
                </article>

                {/* Section 9 */}
                <article id="governing-law" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            09
                        </span>
                        Governing Law &amp; Jurisdiction
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of the Republic of India.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        Any dispute, claim, or controversy arising out of or in connection with the platform or these terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong className="text-zinc-900">Imphal, Manipur, India</strong>.
                    </p>
                </article>

                {/* Section 10 */}
                <article id="contact-legal" className="rounded-3xl border border-zinc-800 bg-[#1F2937] p-8 sm:p-10 text-white shadow-xl space-y-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DDB86A]">
                            Legal Inquiries &amp; Assistance
                        </span>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-black">
                            Questions Regarding These Terms?
                        </h2>
                        <p className="mt-2 text-sm text-zinc-300">
                            If you have questions regarding these Terms and Conditions or wish to report an inaccurate property listing, please contact our administrative desk:
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm pt-2">
                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Official Email</p>
                            <a href="mailto:sbmlandhub@gmail.com" className="mt-1 font-semibold text-[#DDB86A] hover:underline block truncate">
                                sbmlandhub@gmail.com
                            </a>
                        </div>

                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Helpline &amp; WhatsApp</p>
                            <a href="tel:+917005316378" className="mt-1 font-semibold text-white hover:text-[#DDB86A] block">
                                +91 7005316378
                            </a>
                        </div>

                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Head Office</p>
                            <p className="mt-1 font-semibold text-zinc-200">
                                Imphal, Manipur 795001
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-6 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/privacy"
                            className="text-xs font-bold text-[#DDB86A] hover:underline flex items-center gap-1.5"
                        >
                            ← Read Privacy Policy
                        </Link>
                        <Link
                            href="/properties"
                            className="rounded-xl bg-[#DDB86A] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md"
                        >
                            Browse All Verified Properties
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}
