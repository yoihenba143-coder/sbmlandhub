import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy | SBM LAND HUB",
    description:
        "Learn how SBM LAND HUB collects, protects, and handles your personal information, property submissions, and inquiry data.",
};

const sections = [
    { id: "overview", label: "1. Overview & Commitment" },
    { id: "information-we-collect", label: "2. Information We Collect" },
    { id: "how-we-use", label: "3. How We Use Data" },
    { id: "sharing", label: "4. Information Sharing" },
    { id: "security", label: "5. Security & Protection" },
    { id: "cookies", label: "6. Cookies & Tracking" },
    { id: "user-rights", label: "7. Your Rights & Controls" },
    { id: "contact-us", label: "8. Contact Us" },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#F8F7F4] text-[#1F2937] pt-28 pb-24">
            {/* Hero Section */}
            <section className="bg-[#1F2937] px-6 py-20 text-white lg:px-8 border-b border-zinc-800">
                <div className="mx-auto max-w-5xl">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-[#DDB86A] font-semibold">Privacy Policy</span>
                    </nav>

                    <div className="inline-flex items-center gap-2 rounded-full bg-[#DDB86A]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#DDB86A] border border-[#DDB86A]/40 mb-4">
                        <span>🔒</span> Privacy &amp; Data Protection
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
                        At SBM LAND HUB, we are committed to respecting your privacy and protecting the personal and property information you share with us. This policy details how we collect, store, and safeguard your data.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-zinc-400 border-t border-zinc-800 pt-6">
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Effective Date:</span>{" "}
                            <span className="text-white font-medium">January 1, 2026</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Last Updated:</span>{" "}
                            <span className="text-white font-medium">October 2026</span>
                        </div>
                        <div>
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Applicability:</span>{" "}
                            <span className="text-white font-medium">All SBM LAND HUB Users &amp; Visitors</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Pills */}
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

            {/* Content Container */}
            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8 space-y-12">
                {/* Highlights Card Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">🛡️</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Zero Unsolicited Sharing</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            We never sell, rent, or trade your personal telephone numbers or emails to third-party telemarketers.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">🔐</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Encrypted Storage</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            All passwords, authentication sessions, and owner contact details are stored securely using industry best practices.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
                        <div className="text-2xl mb-2">⚖️</div>
                        <h2 className="text-sm font-bold text-[#1F2937]">Owner Verification</h2>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            Property submission details are handled with legal confidentiality and verified before public indexing.
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <article id="overview" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            01
                        </span>
                        Overview &amp; Commitment
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        SBM LAND HUB (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the premier real estate and property platform in Manipur, connecting property buyers, landowners, home seekers, and investors.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        This Privacy Policy applies to all individuals accessing our website, submitting property listings, registering user accounts, or making inquiries regarding residential land, houses, agricultural fields, commercial shops, and properties. By utilizing our services, you acknowledge the terms described in this policy.
                    </p>
                </article>

                {/* Section 2 */}
                <article id="information-we-collect" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-5">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            02
                        </span>
                        Information We Collect
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        We collect only the information necessary to provide reliable real estate connections, ensure title clarity, and deliver verified property services.
                    </p>

                    <div className="space-y-4 pt-2">
                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80">
                            <h3 className="text-sm font-bold text-zinc-900">A. Personal Identification Information</h3>
                            <ul className="mt-2 list-disc list-inside text-xs sm:text-sm text-zinc-600 space-y-1">
                                <li>Full Name and contact telephone / WhatsApp numbers.</li>
                                <li>Email address when registering an account or submitting an inquiry.</li>
                                <li>Encrypted password credentials for user authentication.</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80">
                            <h3 className="text-sm font-bold text-zinc-900">B. Property Listing &amp; Ownership Data</h3>
                            <ul className="mt-2 list-disc list-inside text-xs sm:text-sm text-zinc-600 space-y-1">
                                <li>Property title, category (Land, House, Field, Shop, Commercial), and location details (district, area, landmark, pincode).</li>
                                <li>Property pricing expectations, total area, and measurement units.</li>
                                <li>Photographs, site boundary plans, and video tour walkthrough media.</li>
                                <li>Owner or legal representative identity details required to confirm listing authenticity.</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl bg-[#F8F7F4] p-5 border border-zinc-200/80">
                            <h3 className="text-sm font-bold text-zinc-900">C. Technical &amp; Inquiry Logs</h3>
                            <ul className="mt-2 list-disc list-inside text-xs sm:text-sm text-zinc-600 space-y-1">
                                <li>Messages submitted through property inquiry forms and contact requests.</li>
                                <li>Device type, browser configuration, IP address, and platform usage analytics.</li>
                            </ul>
                        </div>
                    </div>
                </article>

                {/* Section 3 */}
                <article id="how-we-use" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            03
                        </span>
                        How We Use Your Data
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        Your information is utilized solely for legitimate business operations and enhancing your property discovery experience:
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                        {[
                            { title: "Property Marketing", desc: "Publishing verified listing descriptions, photos, and video tours to interested buyers." },
                            { title: "Direct Inquiries", desc: "Connecting prospective buyers with relevant landowners and licensed agents for site visits." },
                            { title: "Fraud Prevention", desc: "Screening duplicate, disputed, or unauthorized property postings." },
                            { title: "Customer Assistance", desc: "Providing responsive support via WhatsApp, phone, and email for transaction guidance." },
                            { title: "Legal Recordkeeping", desc: "Maintaining audit trails for verified property submissions and approvals." },
                            { title: "Platform Reliability", desc: "Monitoring server performance and improving search and filtering features." },
                        ].map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-zinc-200/80 p-4 bg-zinc-50/50">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">{item.title}</h3>
                                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Section 4 */}
                <article id="sharing" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            04
                        </span>
                        Information Sharing &amp; Disclosure
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        We value your trust. We do not sell or trade your personal contact details to external marketing agencies. Disclosure occurs only under the following transparent scenarios:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2.5 pl-2 leading-relaxed">
                        <li>
                            <strong className="text-zinc-800">Buyer-Seller Connection:</strong> When a user registers strong buying interest in a listed property, verified contact coordinates are shared with the property owner or authorized broker to arrange inspections.
                        </li>
                        <li>
                            <strong className="text-zinc-800">Legal Compliance:</strong> We may disclose data if mandated by applicable law, court order, or governmental authorities in accordance with Indian legislation.
                        </li>
                        <li>
                            <strong className="text-zinc-800">Safety &amp; Title Protection:</strong> To protect the rights, property, or safety of SBM LAND HUB users, land owners, and the public against unlawful land grabbing or fraudulent listings.
                        </li>
                    </ul>
                </article>

                {/* Section 5 */}
                <article id="security" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            05
                        </span>
                        Security &amp; Data Protection
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        We apply multi-layered technical safeguards to protect your personal information:
                    </p>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-2 text-xs sm:text-sm text-emerald-950">
                        <p className="font-semibold flex items-center gap-2">
                            <span>🛡️</span> Technical Safeguards in Place:
                        </p>
                        <p>• Strong password hashing algorithms preventing plain-text password storage.</p>
                        <p>• Secured HTTPS/TLS encryption across all communications and file uploads.</p>
                        <p>• Restricted administrative access controls limiting database management to authorized administrators.</p>
                    </div>
                </article>

                {/* Section 6 */}
                <article id="cookies" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            06
                        </span>
                        Cookies &amp; Local Storage
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        We use necessary cookies and local storage strictly to ensure our platform operates seamlessly:
                    </p>
                    <ul className="list-disc list-inside text-sm text-zinc-600 space-y-2 pl-2">
                        <li><strong>Authentication:</strong> Keeping you logged in securely between pages.</li>
                        <li><strong>Preferences:</strong> Remembering your property category and location search filters.</li>
                        <li><strong>Performance:</strong> Ensuring fast image loading and responsive media playback.</li>
                    </ul>
                    <p className="text-xs text-zinc-500">
                        You can configure your browser to reject cookies, though certain interactive features (e.g. user dashboard, submission tracking) may require authentication tokens.
                    </p>
                </article>

                {/* Section 7 */}
                <article id="user-rights" className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-xs space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F2937] flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDB86A]/20 text-sm font-bold text-[#8C6B1C]">
                            07
                        </span>
                        Your Rights &amp; Controls
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
                        As an SBM LAND HUB user, you maintain rights regarding your personal information:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm">
                        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200">
                            <strong>Access &amp; Review:</strong> Request a summary of the personal information and property submissions associated with your account.
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200">
                            <strong>Correction &amp; Updates:</strong> Request correction of inaccurate property details, pricing, phone numbers, or photos.
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200">
                            <strong>Listing Deactivation:</strong> Request immediate removal or marking as &quot;SOLD&quot; once a transaction completes.
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-200">
                            <strong>Account Deletion:</strong> Request full erasure of your user profile and history from active databases.
                        </div>
                    </div>
                </article>

                {/* Section 8 */}
                <article id="contact-us" className="rounded-3xl border border-zinc-800 bg-[#1F2937] p-8 sm:p-10 text-white shadow-xl space-y-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#DDB86A]">
                            Questions &amp; Concerns
                        </span>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-black">
                            Contact Our Privacy Officer
                        </h2>
                        <p className="mt-2 text-sm text-zinc-300">
                            For any inquiries, requests to delete data, or questions regarding this Privacy Policy, please contact our team directly:
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm pt-2">
                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Email</p>
                            <a href="mailto:sbmlandhub@gmail.com" className="mt-1 font-semibold text-[#DDB86A] hover:underline block truncate">
                                sbmlandhub@gmail.com
                            </a>
                        </div>

                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Phone &amp; WhatsApp</p>
                            <a href="tel:+917005316378" className="mt-1 font-semibold text-white hover:text-[#DDB86A] block">
                                +91 7005316378
                            </a>
                        </div>

                        <div className="rounded-2xl bg-zinc-800/80 p-4 border border-zinc-700">
                            <p className="text-zinc-400 uppercase text-[10px] font-bold">Headquarters</p>
                            <p className="mt-1 font-semibold text-zinc-200">
                                MG Avenue, Imphal, Manipur 795001
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-6 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/terms"
                            className="text-xs font-bold text-[#DDB86A] hover:underline flex items-center gap-1.5"
                        >
                            Read Terms &amp; Conditions →
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-xl bg-[#DDB86A] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md"
                        >
                            Reach Us on Contact Page
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}
