"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getStoredUser, UserSession, AUTH_EVENT } from "@/lib/auth";

interface Property {
    id: number;
    title: string;
    description: string | null;
    location: string;
    district: string | null;
    state?: string | null;
    pincode?: string | null;
    type: string;
    listingType?: string;
    price: number;
    area: string;
    areaUnit?: string | null;
    image: string;
    images?: string[];
    video?: string | null;
    featured: boolean;
    status: string;
    highlights?: string[];
    legalVerification?: string[];
    createdAt?: string;
}

function getEmbedVideoInfo(url: string): { type: "youtube" | "vimeo" | "direct" | "unknown"; src: string } {
    if (!url || typeof url !== "string") return { type: "unknown", src: "" };
    const trimmed = url.trim();
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
        return { type: "youtube", src: `https://www.youtube.com/embed/${ytMatch[1]}` };
    }
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
    }
    return { type: "direct", src: trimmed };
}

export default function ViewPropertyPage() {
    const params = useParams();
    const router = useRouter();
    const idParam = params?.id as string | undefined;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [activeMediaMode, setActiveMediaMode] = useState<"photos" | "video">("photos");
    const [user, setUser] = useState<UserSession | null>(null);
    const [copied, setCopied] = useState(false);

    // Enquiry form
    const [inquiryName, setInquiryName] = useState("");
    const [inquiryPhone, setInquiryPhone] = useState("");
    const [inquiryEmail, setInquiryEmail] = useState("");
    const [inquiryMessage, setInquiryMessage] = useState("");
    const [submittingInquiry, setSubmittingInquiry] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);
    const [inquiryError, setInquiryError] = useState("");

    useEffect(() => {
        const u = getStoredUser();
        setUser(u);
        if (u) {
            setInquiryName(u.name || "");
            setInquiryEmail(u.email || "");
            setInquiryPhone(u.phone || "");
        }

        const handleAuth = () => {
            const updated = getStoredUser();
            setUser(updated);
        };
        window.addEventListener(AUTH_EVENT, handleAuth);
        return () => window.removeEventListener(AUTH_EVENT, handleAuth);
    }, []);

    useEffect(() => {
        if (!idParam) return;
        const numId = parseInt(idParam, 10);
        if (isNaN(numId)) {
            setProperty(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`/api/properties?id=${numId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.property) {
                    setProperty(data.property);
                    setSelectedImage(
                        data.property.image ||
                        (Array.isArray(data.property.images) && data.property.images.length > 0
                            ? data.property.images[0]
                            : "/image/land1.avif")
                    );
                    setInquiryMessage(
                        `Hello SBM LAND HUB, I am interested in viewing this property: "${data.property.title}" (ID: #${data.property.id}) located at ${data.property.location}. Please get back to me with further details.`
                    );
                } else {
                    setProperty(null);
                }
            })
            .catch(() => {
                setProperty(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [idParam]);

    useEffect(() => {
        if (!property || typeof window === "undefined") return;
        const origin = window.location.origin;
        const rawImg = property.image || (property.images && property.images.length > 0 ? property.images[0] : "/image/land1.avif");
        const fullImageUrl = rawImg.startsWith("http") ? rawImg : `${origin}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;

        document.title = `${property.title} | SBM LAND HUB`;

        const updateMeta = (propName: string, content: string) => {
            let el = document.querySelector(`meta[property="${propName}"]`) || document.querySelector(`meta[name="${propName}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute("property", propName);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        updateMeta("og:title", `${property.title} - ${formatPrice(property.price)} | SBM LAND HUB`);
        updateMeta("og:description", `${property.type} at ${property.location} - Area: ${property.area}. Verified listing by SBM LAND HUB.`);
        updateMeta("og:image", fullImageUrl);
        updateMeta("og:url", `${origin}/properties/${property.id}`);
        updateMeta("twitter:card", "summary_large_image");
        updateMeta("twitter:image", fullImageUrl);
    }, [property]);

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹ ${(price / 10000000).toFixed(2)} Cr`;
        }
        if (price >= 100000) {
            return `₹ ${(price / 100000).toFixed(2)} Lakhs`;
        }
        return `₹ ${price.toLocaleString("en-IN")}`;
    };

    const getWhatsAppInquiryUrl = () => {
        if (!property) return "https://wa.me/917005316378";
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://sbmlandhub.com";
        const propertyUrl = `${origin}/properties/${property.id}`;
        const rawImage = property.image || (property.images && property.images.length > 0 ? property.images[0] : "/image/land1.avif");
        const fullImageUrl = rawImage.startsWith("http") ? rawImage : `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

        const locationText = [
            property.location,
            property.district,
            property.state,
            property.pincode ? `PIN: ${property.pincode}` : null,
        ].filter(Boolean).join(", ");

        const msg = [
            `Hello SBM LAND HUB, I am inquiring about this property:`,
            ``,
            `🏡 *${property.title}*`,
            `🆔 *Property ID:* #${property.id}`,
            `📍 *Location:* ${locationText}`,
            `💰 *Price:* ${formatPrice(property.price)}`,
            `📐 *Area:* ${property.area} ${property.areaUnit || "sq.ft"}`,
            `📋 *Category:* ${property.type} (${property.listingType || "FOR SALE"})`,
            ``,
            `🔗 *Property Link:*`,
            propertyUrl,
            ``,
            `📸 *Property Picture:*`,
            fullImageUrl,
            ``,
            `Please share further details, title verification documents, and arrange a site inspection.`
        ].join("\n");

        return `https://wa.me/917005316378?text=${encodeURIComponent(msg)}`;
    };

    const getWhatsAppShareUrl = () => {
        if (!property) return "https://api.whatsapp.com/send?text=";
        const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://sbmlandhub.com";
        const propertyUrl = `${origin}/properties/${property.id}`;
        const rawImage = property.image || (property.images && property.images.length > 0 ? property.images[0] : "/image/land1.avif");
        const fullImageUrl = rawImage.startsWith("http") ? rawImage : `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

        const locationText = [
            property.location,
            property.district,
            property.state,
            property.pincode ? `PIN: ${property.pincode}` : null,
        ].filter(Boolean).join(", ");

        const msg = [
            `Check out this property on SBM LAND HUB:`,
            ``,
            `🏡 *${property.title}*`,
            `💰 *Price:* ${formatPrice(property.price)} | *Area:* ${property.area} ${property.areaUnit || "sq.ft"}`,
            `📍 *Location:* ${locationText}`,
            ``,
            `🔗 *View Property Online:*`,
            propertyUrl,
            ``,
            `📸 *Property Picture:*`,
            fullImageUrl
        ].join("\n");

        return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    };

    const handleCopyLink = () => {
        if (!property || typeof window === "undefined") return;
        const origin = window.location.origin;
        const propertyUrl = `${origin}/properties/${property.id}`;

        if (navigator.share) {
            navigator.share({
                title: `${property.title} | SBM LAND HUB`,
                text: `${property.title} located at ${property.location} - ${formatPrice(property.price)}`,
                url: propertyUrl,
            }).catch(() => {
                navigator.clipboard.writeText(propertyUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            });
            return;
        }

        navigator.clipboard.writeText(propertyUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInquiryError("");
        setInquirySuccess(false);

        if (!inquiryName || !inquiryPhone || !inquiryMessage) {
            setInquiryError("Please enter your name, phone number, and message.");
            return;
        }

        setSubmittingInquiry(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: inquiryName,
                    phone: inquiryPhone,
                    email: inquiryEmail,
                    enquiryType: `Property Inquiry (#${property?.id}: ${property?.title})`,
                    propertyType: property?.type || "LAND",
                    message: inquiryMessage,
                    userId: user?.id || null,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setInquirySuccess(true);
            } else {
                setInquiryError(data.error || "Failed to submit enquiry. Please try again.");
            }
        } catch {
            setInquiryError("Network error. Please try again or contact via WhatsApp/Call.");
        } finally {
            setSubmittingInquiry(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F5F3EE] pt-32 pb-24 text-[#1F2937]">
                <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C59D5F] border-t-transparent" />
                    <p className="mt-4 text-sm font-semibold text-zinc-500">
                        Loading property details...
                    </p>
                </div>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="min-h-screen bg-[#F5F3EE] pt-32 pb-24 text-[#1F2937]">
                <div className="mx-auto max-w-lg px-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-200 text-3xl">
                        🏡
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1F2937]">
                        Property Not Found
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                        The property listing you are looking for may have been removed, sold, or is temporarily unavailable.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/properties"
                            className="rounded-xl bg-[#1F2937] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                        >
                            ← Browse All Properties
                        </Link>
                        <Link
                            href="/"
                            className="rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                            Homepage
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const allImages = property.images && property.images.length > 0
        ? property.images
        : [property.image || "/image/land1.avif"];

    const isAvailable = property.status === "AVAILABLE";

    return (
        <main className="min-h-screen bg-[#F8F7F4] text-[#1F2937] pt-24 pb-20 sm:pt-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb & Navigation Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <Link href="/" className="hover:text-[#1F2937] transition">Home</Link>
                        <span>/</span>
                        <Link href="/properties" className="hover:text-[#1F2937] transition">Properties</Link>
                        <span>/</span>
                        <span className="font-semibold text-zinc-900 truncate max-w-xs sm:max-w-md">
                            {property.title}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/properties"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-[#1F2937]"
                        >
                            ← Back to Listings
                        </Link>

                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                        >
                            {copied ? "✓ Copied Link!" : "🔗 Share"}
                        </button>

                        <a
                            href={getWhatsAppShareUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                        >
                            <span>💬</span> Share to WhatsApp
                        </a>

                        {/* Admin Direct Edit Shortcut */}
                        {user && user.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F2937] px-3.5 py-1.5 text-xs font-bold text-[#DDB86A] shadow-sm transition hover:bg-black"
                            >
                                ✏️ Edit in Admin Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-10 lg:grid-cols-12">
                    {/* Left Column: Media & Details (8 Cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Title & Badge Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="rounded-lg bg-[#1F2937] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#DDB86A]">
                                    {property.type}
                                </span>
                                <span className="rounded-lg bg-zinc-200 px-3 py-1 text-xs font-bold text-zinc-800 uppercase">
                                    {property.listingType || "FOR SALE"}
                                </span>
                                {property.featured && (
                                    <span className="rounded-lg bg-[#C59D5F] px-3 py-1 text-xs font-bold text-white shadow-sm">
                                        ★ FEATURED
                                    </span>
                                )}
                                {property.video && (
                                    <span className="rounded-lg bg-black px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 border border-white/20">
                                        🎥 VIDEO TOUR
                                    </span>
                                )}
                                <span
                                    className={`rounded-lg px-3 py-1 text-xs font-bold uppercase ${
                                        isAvailable
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {property.status}
                                </span>
                            </div>

                            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1F2937] sm:text-4xl">
                                {property.title}
                            </h1>

                            <p className="mt-2 text-sm sm:text-base text-zinc-600 flex items-center gap-1.5">
                                <span>📍</span>
                                <span>{property.location}</span>
                                {property.district && <span className="font-semibold text-zinc-800">({property.district})</span>}
                            </p>
                        </div>

                        {/* Main Media Showcase (Photos & Video) */}
                        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900 shadow-md">
                            {/* Media Mode Header Tabs if Video exists */}
                            {property.video && (
                                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-3">
                                    <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => setActiveMediaMode("photos")}
                                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                                                activeMediaMode === "photos"
                                                    ? "bg-[#DDB86A] text-[#0F172A] shadow-sm"
                                                    : "text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <span>📸</span> Photos ({allImages.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveMediaMode("video")}
                                            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                                                activeMediaMode === "video"
                                                    ? "bg-[#DDB86A] text-[#0F172A] shadow-sm"
                                                    : "text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <span>🎥</span> Video Tour Walkthrough
                                        </button>
                                    </div>

                                    <span className="text-[11px] font-semibold text-zinc-400 hidden sm:inline">
                                        {activeMediaMode === "photos" ? "Click thumbnails below to browse" : "Interactive Video Player"}
                                    </span>
                                </div>
                            )}

                            {/* Media Display Area */}
                            {activeMediaMode === "photos" || !property.video ? (
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                                    <img
                                        src={selectedImage || property.image || "/image/land1.avif"}
                                        alt={property.title}
                                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 rounded-xl bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white flex items-center gap-2">
                                        <span>🛡️</span> Verified by SBM LAND HUB
                                    </div>
                                    {property.video && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveMediaMode("video")}
                                            className="absolute bottom-4 right-4 rounded-xl bg-black/80 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white hover:bg-[#DDB86A] hover:text-[#0F172A] transition flex items-center gap-2 border border-white/20 shadow-lg"
                                        >
                                            <span>▶</span> Watch Video Tour
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black flex items-center justify-center">
                                    {(() => {
                                        const videoInfo = getEmbedVideoInfo(property.video);
                                        if (videoInfo.type === "youtube" || videoInfo.type === "vimeo") {
                                            return (
                                                <iframe
                                                    src={videoInfo.src}
                                                    title={property.title}
                                                    className="h-full w-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            );
                                        }
                                        return (
                                            <video
                                                src={videoInfo.src}
                                                controls
                                                autoPlay
                                                className="h-full w-full object-contain"
                                            />
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Gallery Thumbnails */}
                            {(allImages.length > 1 || property.video) && (
                                <div className="flex gap-3 overflow-x-auto p-4 bg-zinc-900/90 border-t border-zinc-800 items-center">
                                    {property.video && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveMediaMode("video")}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition flex flex-col items-center justify-center bg-black/60 ${
                                                activeMediaMode === "video"
                                                    ? "border-[#DDB86A] ring-2 ring-[#DDB86A]/40 text-[#DDB86A]"
                                                    : "border-zinc-700 text-zinc-300 opacity-80 hover:opacity-100"
                                            }`}
                                        >
                                            <span className="text-lg">🎥</span>
                                            <span className="text-[10px] font-bold mt-0.5">Video Tour</span>
                                        </button>
                                    )}

                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(img);
                                                setActiveMediaMode("photos");
                                            }}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                                activeMediaMode === "photos" && selectedImage === img
                                                    ? "border-[#DDB86A] ring-2 ring-[#DDB86A]/40"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Key Specs Card Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                            <div className="border-r border-zinc-100 pr-4 last:border-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Price</p>
                                <p className="mt-1 text-xl font-black text-[#B88A44] sm:text-2xl">
                                    {formatPrice(property.price)}
                                </p>
                                <p className="text-[10px] text-zinc-400">₹{property.price.toLocaleString("en-IN")}</p>
                            </div>

                            <div className="border-r border-zinc-100 pr-4 last:border-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Area</p>
                                <p className="mt-1 text-xl font-black text-[#1F2937] sm:text-2xl">
                                    {property.area}
                                </p>
                                <p className="text-[10px] text-zinc-400">{property.areaUnit || "sq.ft"}</p>
                            </div>

                            <div className="border-r border-zinc-100 pr-4 last:border-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Property Type</p>
                                <p className="mt-1 text-lg font-black text-[#1F2937]">
                                    {property.type}
                                </p>
                                <p className="text-[10px] text-zinc-400">Verified Category</p>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Property ID</p>
                                <p className="mt-1 text-lg font-mono font-bold text-zinc-700">
                                    #{property.id}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-semibold">Active Listing</p>
                            </div>
                        </div>

                        {/* Dedicated Video Tour Section if video is present */}
                        {property.video && (
                            <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#C59D5F]">
                                            Virtual Walkthrough
                                        </span>
                                        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] flex items-center gap-2 mt-0.5">
                                            <span>🎥</span> Property Video Tour
                                        </h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
                                        ✓ Verified Video Footage
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-zinc-500">
                                    Watch an immersive walkthrough of {property.title} to inspect road connectivity, frontage, surrounding development, and boundary demarcations before scheduling an in-person site visit.
                                </p>

                                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-black aspect-video w-full shadow-inner">
                                    {(() => {
                                        const videoInfo = getEmbedVideoInfo(property.video);
                                        if (videoInfo.type === "youtube" || videoInfo.type === "vimeo") {
                                            return (
                                                <iframe
                                                    src={videoInfo.src}
                                                    title={`Video tour for ${property.title}`}
                                                    className="h-full w-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            );
                                        }
                                        return (
                                            <video
                                                src={videoInfo.src}
                                                controls
                                                className="h-full w-full object-contain"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Detailed Description */}
                        <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                <span>📄</span> Overview &amp; Description
                            </h2>
                            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 whitespace-pre-line">
                                {property.description ||
                                    "This verified property is listed with complete title clarity, high accessibility, and prime location benefits. Connect directly with SBM LAND HUB agents for a site inspection and legal verification dossier."}
                            </p>

                            {/* Highlights Section */}
                            {((property.highlights && property.highlights.length > 0) || !property.legalVerification) && (
                                <div className="mt-8 border-t border-zinc-100 pt-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
                                        <span>✨</span> Key Property Highlights
                                    </h3>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {(property.highlights && property.highlights.length > 0
                                            ? property.highlights
                                            : [
                                                "Direct Motor-able Road Access & Frontage",
                                                "Electricity & Potable Water Utilities Accessible",
                                                "Demarcated & Well-Defined Boundaries",
                                            ]
                                        ).map((feat, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 font-medium bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                                                <span className="text-amber-500 font-bold">★</span>
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Legal Verification Section */}
                            <div className="mt-8 border-t border-zinc-100 pt-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                                        <span>🛡️</span> Legal Verification &amp; Due Diligence
                                    </h3>
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                        Verified Listing
                                    </span>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {(property.legalVerification && property.legalVerification.length > 0
                                        ? property.legalVerification
                                        : [
                                            "Verified 100% Clear Title & Ownership Records",
                                            "Non-Encumbered & Dispute-Free Land Title",
                                            "Ready for Immediate Registration & Transfer",
                                        ]
                                    ).map((feat, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 font-medium bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 rounded-xl bg-[#F8F7F4] p-3 text-[11px] text-zinc-500 flex items-center gap-2 border border-zinc-200/60">
                                    <span>📜</span>
                                    <span>All land revenue records, dag/patta entries, and documentation verified through SBM LAND HUB legal counsel.</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Details Card */}
                        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                                <span>📍</span> Location &amp; Regional Details
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
                                <div className="rounded-2xl bg-[#F8F7F4] p-4 border border-zinc-200/70">
                                    <p className="font-bold text-zinc-400 uppercase text-[10px]">Location</p>
                                    <p className="mt-1 font-bold text-zinc-800">{property.location}</p>
                                </div>
                                <div className="rounded-2xl bg-[#F8F7F4] p-4 border border-zinc-200/70">
                                    <p className="font-bold text-zinc-400 uppercase text-[10px]">District &amp; State</p>
                                    <p className="mt-1 font-bold text-zinc-800">
                                        {property.district || "Imphal West"}, {property.state || "Manipur"}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-[#F8F7F4] p-4 border border-zinc-200/70">
                                    <p className="font-bold text-zinc-400 uppercase text-[10px]">Pincode</p>
                                    <p className="mt-1 font-bold text-zinc-800">{property.pincode || "795001"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & Action Panel (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Instant Price & CTA Box */}
                        <div className="sticky top-28 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xl">
                            <div className="border-b border-zinc-100 pb-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Guide Price
                                </span>
                                <p className="mt-1 text-3xl font-black text-[#1F2937]">
                                    {formatPrice(property.price)}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Area: {property.area} {property.areaUnit || "sq.ft"}
                                </p>
                            </div>

                            {/* Quick Action Buttons: Phone & WhatsApp */}
                            <div className="mt-5 space-y-3">
                                <a
                                    href="tel:+917005316378"
                                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#1F2937] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#C59D5F]"
                                >
                                    <span>📞</span> Call Agent (+91 7005316378)
                                </a>

                                <a
                                    href={getWhatsAppInquiryUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#20ba5a]"
                                >
                                    <span>💬</span> WhatsApp Inquiry (with Picture &amp; Link)
                                </a>

                                <a
                                    href={getWhatsAppShareUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#25D366] bg-[#25D366]/10 px-5 py-2.5 text-xs font-bold text-[#1a9347] transition hover:bg-[#25D366] hover:text-white"
                                >
                                    <span>📤</span> Forward Property on WhatsApp
                                </a>
                            </div>

                            {/* Contact Form */}
                            <div className="mt-7 border-t border-zinc-100 pt-6">
                                <h3 className="text-base font-bold text-[#1F2937]">
                                    Schedule a Site Visit
                                </h3>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Leave your contact details and our property advisors will arrange a site inspection.
                                </p>

                                {inquirySuccess ? (
                                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                                        <p className="text-lg">🎉</p>
                                        <p className="mt-1 text-sm font-bold text-emerald-800">Enquiry Sent Successfully!</p>
                                        <p className="mt-1 text-xs text-emerald-700">
                                            Our representative will contact you shortly regarding this property.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquirySubmit} className="mt-4 space-y-3.5">
                                        {inquiryError && (
                                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                                                {inquiryError}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={inquiryName}
                                                onChange={(e) => setInquiryName(e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="mt-1 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-[#C59D5F]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={inquiryPhone}
                                                onChange={(e) => setInquiryPhone(e.target.value)}
                                                placeholder="e.g. 9876543210"
                                                className="mt-1 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-[#C59D5F]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                                Email (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={inquiryEmail}
                                                onChange={(e) => setInquiryEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="mt-1 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-[#C59D5F]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                                Message *
                                            </label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={inquiryMessage}
                                                onChange={(e) => setInquiryMessage(e.target.value)}
                                                className="mt-1 w-full rounded-xl border border-zinc-200 bg-[#FAFAF8] px-3.5 py-2 text-xs text-zinc-800 outline-none focus:border-[#C59D5F]"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingInquiry}
                                            className="w-full rounded-xl bg-[#C59D5F] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#B88A44] disabled:opacity-60"
                                        >
                                            {submittingInquiry ? "Sending Enquiry..." : "Send Property Enquiry"}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="mt-6 border-t border-zinc-100 pt-5 text-center">
                                <p className="text-[11px] text-zinc-400">
                                    🔒 Safe &amp; verified real estate transactions by SBM LAND HUB.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
