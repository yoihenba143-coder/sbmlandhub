"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, clearStoredUser, UserSession, AUTH_EVENT } from "@/lib/auth";

interface AdminStats {
    properties: number;
    users: number;
    submissions: number;
    inquiries: number;
}

interface PropertyItem {
    id: number;
    title: string;
    description: string | null;
    location: string;
    district: string | null;
    state?: string | null;
    pincode?: string | null;
    type: string;
    listingType: string;
    price: number;
    area: string;
    areaUnit: string;
    image: string;
    images?: string[];
    video?: string | null;
    featured: boolean;
    status: string;
    highlights?: string[];
    legalVerification?: string[];
    createdAt: string;
}

interface SubmissionItem {
    id: string;
    title: string;
    type: string;
    listingType: string;
    price: number;
    area: string;
    location: string;
    description: string | null;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string | null;
    status: string;
    createdAt: string;
}

interface InquiryItem {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    enquiryType: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface SiteContent {
    about: {
        title: string;
        subtitle: string;
        description: string;
        mission: string;
        experienceYears: string;
        propertiesSold: string;
        happyClients: string;
        verifiedLocations: string;
    };
    contact: {
        title: string;
        phone: string;
        email: string;
        address: string;
        pincode?: string;
        workingHours: string;
        whatsapp: string;
    };
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

export default function AdminDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<"overview" | "properties" | "submissions" | "inquiries" | "website" | "edit-property">("overview");

    // Stats
    const [stats, setStats] = useState<AdminStats>({ properties: 0, users: 0, submissions: 0, inquiries: 0 });

    // Properties state
    const [properties, setProperties] = useState<PropertyItem[]>([]);
    const [propertyFilter, setPropertyFilter] = useState("ALL");
    const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
    const [propertyForm, setPropertyForm] = useState({
        title: "",
        type: "LAND",
        listingType: "SALE",
        price: "",
        area: "",
        areaUnit: "sq.ft",
        location: "",
        district: "Imphal West",
        state: "Manipur",
        pincode: "795001",
        image: "/image/land1.avif",
        images: ["/image/land1.avif"] as string[],
        video: "",
        description: "",
        featured: false,
        status: "AVAILABLE",
        highlights: [
            "Direct Motor-able Road Access & Frontage",
            "Electricity & Potable Water Utilities Accessible",
            "Demarcated & Well-Defined Boundaries",
        ] as string[],
        legalVerification: [
            "Verified 100% Clear Title & Ownership Records",
            "Non-Encumbered & Dispute-Free Land Title",
            "Ready for Immediate Registration & Transfer",
        ] as string[],
    });

    const [newHighlightInput, setNewHighlightInput] = useState("");
    const [newLegalInput, setNewLegalInput] = useState("");

    // Media Studio state
    const [mediaTab, setMediaTab] = useState<"pictures" | "video">("pictures");
    const [customImageUrl, setCustomImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    // Submissions & Inquiries state
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

    // Website Content Editor state
    const [siteContent, setSiteContent] = useState<SiteContent>({
        about: {
            title: "Making property decisions simpler.",
            subtitle: "Property & Real Estate Excellence",
            description: "SBM LAND HUB is a premier property platform.",
            mission: "Our mission is to bring transparency and confidence to property transactions.",
            experienceYears: "12+",
            propertiesSold: "450+",
            happyClients: "1,200+",
            verifiedLocations: "50+",
        },
        contact: {
            title: "Let's talk about your property.",
            phone: "+91 7005316378",
            email: "sbmlandhub@gmail.com",
            address: "SBM LAND HUB Headquarters, MG Avenue, Imphal, Manipur",
            pincode: "795001",
            workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM",
            whatsapp: "+91 7005316378",
        },
    });

    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const currentUser = getStoredUser();
        setUser(currentUser);
        setLoading(false);

        if (currentUser && currentUser.role === "ADMIN") {
            loadDashboardData();
        }

        const handleAuthChange = () => {
            const updated = getStoredUser();
            setUser(updated);
            if (updated && updated.role === "ADMIN") {
                loadDashboardData();
            }
        };

        window.addEventListener(AUTH_EVENT, handleAuthChange);
        return () => window.removeEventListener(AUTH_EVENT, handleAuthChange);
    }, []);

    const showToast = (text: string, type: "success" | "error" = "success") => {
        setActionMessage({ type, text });
        setTimeout(() => setActionMessage(null), 4000);
    };

    const loadDashboardData = async () => {
        try {
            // Fetch stats
            const resStats = await fetch("/api/admin/stats");
            const dataStats = await resStats.json();
            if (dataStats.success) {
                setStats(dataStats.stats);
            }

            // Fetch properties
            const resProps = await fetch("/api/properties");
            const dataProps = await resProps.json();
            if (dataProps.success) {
                setProperties(dataProps.properties);
            }

            // Fetch submissions
            const resSubs = await fetch("/api/submissions");
            const dataSubs = await resSubs.json();
            if (dataSubs.success) {
                setSubmissions(dataSubs.submissions);
            }

            // Fetch inquiries
            const resInq = await fetch("/api/contact");
            const dataInq = await resInq.json();
            if (dataInq.success) {
                setInquiries(dataInq.inquiries);
            }

            // Fetch site content
            const resContent = await fetch("/api/admin/content");
            const dataContent = await resContent.json();
            if (dataContent.success) {
                setSiteContent(dataContent.content);
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
        }
    };

    // -------------------------------------------------------------
    // Property Handlers
    // -------------------------------------------------------------
    const handleSaveProperty = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (editingProperty) {
                // Update
                const res = await fetch("/api/properties", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editingProperty.id,
                        ...propertyForm,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    showToast("Property updated successfully!");
                    setShowAddPropertyModal(false);
                    setEditingProperty(null);
                    setActiveSection("properties");
                    loadDashboardData();
                } else {
                    showToast(data.error || "Failed to update property", "error");
                }
            } else {
                // Create
                const res = await fetch("/api/properties", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(propertyForm),
                });
                const data = await res.json();
                if (data.success) {
                    showToast("New property added successfully!");
                    setShowAddPropertyModal(false);
                    setActiveSection("properties");
                    loadDashboardData();
                } else {
                    showToast(data.error || "Failed to add property", "error");
                }
            }
        } catch {
            showToast("Network error saving property", "error");
        }
    };

    const handleDeleteProperty = async (id: number) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            const res = await fetch(`/api/properties?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Property deleted successfully.");
                loadDashboardData();
            } else {
                showToast(data.error || "Failed to delete property", "error");
            }
        } catch {
            showToast("Network error deleting property", "error");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadingImage(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.files) {
                const newUrls: string[] = data.files.map((f: { url: string }) => f.url);
                const currentImages = propertyForm.images || [];
                const updatedImages = [...currentImages, ...newUrls];
                const cover = (!propertyForm.image || propertyForm.image === "/image/land1.avif") && newUrls.length > 0
                    ? newUrls[0]
                    : propertyForm.image || newUrls[0];
                setPropertyForm((prev) => ({
                    ...prev,
                    image: cover,
                    images: updatedImages,
                }));
                showToast(`Uploaded ${newUrls.length} picture${newUrls.length > 1 ? "s" : ""}!`);
            } else {
                showToast(data.error || "Failed to upload pictures", "error");
            }
        } catch {
            showToast("Network error uploading pictures", "error");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadingVideo(true);
        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.url) {
                setPropertyForm((prev) => ({
                    ...prev,
                    video: data.url,
                }));
                showToast("Property video uploaded successfully!");
            } else {
                showToast(data.error || "Failed to upload video", "error");
            }
        } catch {
            showToast("Network error uploading video", "error");
        } finally {
            setUploadingVideo(false);
            e.target.value = "";
        }
    };

    const handleAddCustomImageUrl = () => {
        if (!customImageUrl.trim()) return;
        const url = customImageUrl.trim();
        const current = propertyForm.images || [];
        const updated = [...current, url];
        const cover = (!propertyForm.image || propertyForm.image === "/image/land1.avif") ? url : propertyForm.image;
        setPropertyForm((prev) => ({
            ...prev,
            image: cover,
            images: updated,
        }));
        setCustomImageUrl("");
        showToast("Picture added to gallery!");
    };

    const handleSetCoverImage = (img: string) => {
        setPropertyForm((prev) => ({
            ...prev,
            image: img,
        }));
        showToast("Set as primary cover photo!");
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const current = propertyForm.images || [];
        const removed = current[indexToRemove];
        const updated = current.filter((_, idx) => idx !== indexToRemove);
        let newCover = propertyForm.image;
        if (propertyForm.image === removed) {
            newCover = updated.length > 0 ? updated[0] : "/image/land1.avif";
        }
        setPropertyForm((prev) => ({
            ...prev,
            image: newCover,
            images: updated,
        }));
    };

    const handleRemoveVideo = () => {
        setPropertyForm((prev) => ({
            ...prev,
            video: "",
        }));
        showToast("Video removed from property");
    };

    const openEditProperty = (prop: PropertyItem) => {
        setEditingProperty(prop);
        const initialImages = Array.isArray(prop.images) && prop.images.length > 0
            ? prop.images
            : (prop.image ? [prop.image] : ["/image/land1.avif"]);
        setPropertyForm({
            title: prop.title,
            type: prop.type,
            listingType: prop.listingType || "SALE",
            price: String(prop.price),
            area: prop.area,
            areaUnit: prop.areaUnit || "sq.ft",
            location: prop.location,
            district: prop.district || "Imphal West",
            state: prop.state || "Manipur",
            pincode: prop.pincode || "795001",
            image: prop.image || initialImages[0] || "/image/land1.avif",
            images: initialImages,
            video: prop.video || "",
            description: prop.description || "",
            featured: prop.featured,
            status: prop.status,
            highlights: Array.isArray(prop.highlights) && prop.highlights.length > 0 ? prop.highlights : [
                "Direct Motor-able Road Access & Frontage",
                "Electricity & Potable Water Utilities Accessible",
                "Demarcated & Well-Defined Boundaries",
            ],
            legalVerification: Array.isArray(prop.legalVerification) && prop.legalVerification.length > 0 ? prop.legalVerification : [
                "Verified 100% Clear Title & Ownership Records",
                "Non-Encumbered & Dispute-Free Land Title",
                "Ready for Immediate Registration & Transfer",
            ],
        });
        setNewHighlightInput("");
        setNewLegalInput("");
        setActiveSection("edit-property");
    };

    const openAddProperty = () => {
        setEditingProperty(null);
        setPropertyForm({
            title: "",
            type: "LAND",
            listingType: "SALE",
            price: "",
            area: "",
            areaUnit: "sq.ft",
            location: "",
            district: "Imphal West",
            state: "Manipur",
            pincode: "795001",
            image: "/image/land1.avif",
            images: ["/image/land1.avif"],
            video: "",
            description: "",
            featured: false,
            status: "AVAILABLE",
            highlights: [
                "Direct Motor-able Road Access & Frontage",
                "Electricity & Potable Water Utilities Accessible",
                "Demarcated & Well-Defined Boundaries",
            ],
            legalVerification: [
                "Verified 100% Clear Title & Ownership Records",
                "Non-Encumbered & Dispute-Free Land Title",
                "Ready for Immediate Registration & Transfer",
            ],
        });
        setNewHighlightInput("");
        setNewLegalInput("");
        setActiveSection("edit-property");
    };

    const addHighlight = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const current = propertyForm.highlights || [];
        if (!current.includes(trimmed)) {
            setPropertyForm((prev) => ({
                ...prev,
                highlights: [...(prev.highlights || []), trimmed],
            }));
            showToast(`Added highlight: "${trimmed}"`);
        }
        setNewHighlightInput("");
    };

    const removeHighlight = (index: number) => {
        setPropertyForm((prev) => ({
            ...prev,
            highlights: (prev.highlights || []).filter((_, i) => i !== index),
        }));
    };

    const addLegalVerification = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const current = propertyForm.legalVerification || [];
        if (!current.includes(trimmed)) {
            setPropertyForm((prev) => ({
                ...prev,
                legalVerification: [...(prev.legalVerification || []), trimmed],
            }));
            showToast(`Added legal check: "${trimmed}"`);
        }
        setNewLegalInput("");
    };

    const removeLegalVerification = (index: number) => {
        setPropertyForm((prev) => ({
            ...prev,
            legalVerification: (prev.legalVerification || []).filter((_, i) => i !== index),
        }));
    };

    // -------------------------------------------------------------
    // Submission Handlers
    // -------------------------------------------------------------
    const handleApproveSubmission = async (id: string) => {
        try {
            const res = await fetch("/api/submissions", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, approveToProperty: true }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Submission approved and published as live property!");
                loadDashboardData();
            } else {
                showToast(data.error || "Failed to approve submission", "error");
            }
        } catch {
            showToast("Network error approving submission", "error");
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm("Delete this submission?")) return;
        try {
            const res = await fetch(`/api/submissions?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                showToast("Submission removed.");
                loadDashboardData();
            }
        } catch {
            showToast("Network error", "error");
        }
    };

    // -------------------------------------------------------------
    // Inquiry Handlers
    // -------------------------------------------------------------
    const handleToggleInquiryRead = async (id: string, currentRead: boolean) => {
        try {
            await fetch("/api/contact", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isRead: !currentRead }),
            });
            loadDashboardData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteInquiry = async (id: string) => {
        if (!confirm("Delete this inquiry?")) return;
        try {
            await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
            showToast("Inquiry deleted.");
            loadDashboardData();
        } catch (err) {
            console.error(err);
        }
    };

    // -------------------------------------------------------------
    // Website Content Editor Handler
    // -------------------------------------------------------------
    const handleSaveSiteContent = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(siteContent),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Website content (About & Contact) saved successfully!");
            } else {
                showToast(data.error || "Failed to save website content", "error");
            }
        } catch {
            showToast("Network error saving website content", "error");
        }
    };

    const handleLogout = () => {
        clearStoredUser();
        setUser(null);
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111827] text-white pt-28 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DDB86A] border-t-transparent"></div>
                    <p className="text-sm font-semibold text-zinc-400">Loading Admin Dashboard...</p>
                </div>
            </main>
        );
    }

    // Access Denied / Not Admin State
    if (!user || user.role !== "ADMIN") {
        return (
            <main className="min-h-screen bg-[#F5F3EE] pt-32 pb-20 px-6">
                <div className="mx-auto max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 text-center shadow-2xl">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1F2937] text-3xl font-black text-[#DDB86A] shadow-md">
                        🔒
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1F2937]">
                        Administrator Access Only
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                        {user
                            ? `You are signed in as ${user.email} (Role: ${user.role}). Administrator privileges are required to view the dashboard.`
                            : "Please log in with an administrator account to access the administration portal."}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/admin/login"
                            className="rounded-xl bg-[#1F2937] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C59D5F]"
                        >
                            Admin Sign In
                        </Link>
                        <Link
                            href="/"
                            className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const filteredProperties = properties.filter((p) =>
        propertyFilter === "ALL" ? true : p.type === propertyFilter
    );

    return (
        <main className="min-h-screen bg-[#0F172A] text-zinc-100">
            {/* Top Admin Bar */}
            <header className="sticky top-20 z-30 border-b border-zinc-800 bg-[#1E293B]/95 backdrop-blur-xl px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDB86A] text-lg font-black text-[#0F172A] shadow-sm">
                            ★
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                                SBM Admin Dashboard
                                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-[#DDB86A] border border-[#DDB86A]/40 uppercase">
                                    Live
                                </span>
                            </h1>
                            <p className="text-xs text-zinc-400">
                                Connected DB: <span className="text-emerald-400 font-mono font-semibold">sbmlandhub</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className="hidden sm:inline-flex rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                        >
                            User Profile
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                        >
                            View Site ↗
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            {actionMessage && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div
                        className={`rounded-2xl px-5 py-3.5 text-sm font-bold shadow-2xl backdrop-blur-xl border ${actionMessage.type === "success"
                            ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/50"
                            : "bg-red-950/90 text-red-200 border-red-500/50"
                            }`}
                    >
                        {actionMessage.text}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Dashboard Tabs Navigation */}
                <div className="flex gap-2 border-b border-zinc-800 pb-px overflow-x-auto">
                    {[
                        { id: "overview", label: "📊 Overview" },
                        { id: "properties", label: "🏡 Properties Management" },
                        { id: "submissions", label: "📥 User Submissions" },
                        { id: "inquiries", label: "✉️ Contact Enquiries" },
                        { id: "website", label: "⚙️ Website Content Editor" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveSection(tab.id as typeof activeSection)}
                            className={`pb-4 px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeSection === tab.id
                                ? "border-[#DDB86A] text-[#DDB86A]"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ------------------------------------------------------------- */}
                {/* SECTION 1: OVERVIEW */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "overview" && (
                    <div className="mt-8 space-y-8">
                        {/* 4 Stat Cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Properties</p>
                                    <span className="text-2xl">🏡</span>
                                </div>
                                <p className="mt-4 text-3xl font-black text-white">{stats.properties}</p>
                                <button
                                    onClick={() => setActiveSection("properties")}
                                    className="mt-3 text-xs font-semibold text-[#DDB86A] hover:underline"
                                >
                                    Manage listings →
                                </button>
                            </div>

                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">User Submissions</p>
                                    <span className="text-2xl">📥</span>
                                </div>
                                <p className="mt-4 text-3xl font-black text-white">{stats.submissions}</p>
                                <button
                                    onClick={() => setActiveSection("submissions")}
                                    className="mt-3 text-xs font-semibold text-[#DDB86A] hover:underline"
                                >
                                    Review submissions →
                                </button>
                            </div>

                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Inquiries</p>
                                    <span className="text-2xl">✉️</span>
                                </div>
                                <p className="mt-4 text-3xl font-black text-white">{stats.inquiries}</p>
                                <button
                                    onClick={() => setActiveSection("inquiries")}
                                    className="mt-3 text-xs font-semibold text-[#DDB86A] hover:underline"
                                >
                                    View inquiries →
                                </button>
                            </div>

                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Registered Users</p>
                                    <span className="text-2xl">👥</span>
                                </div>
                                <p className="mt-4 text-3xl font-black text-white">{stats.users}</p>
                                <p className="mt-3 text-xs text-zinc-400">In PostgreSQL Database</p>
                            </div>
                        </div>

                        {/* Quick Dashboard Action Cards */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Properties Quick Action */}
                            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDB86A]/20 text-2xl text-[#DDB86A] shrink-0">
                                        🏡
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Properties Directory &amp; Editing</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Add new land, houses, shops, or edit existing property details, pricing, and live status.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection("properties")}
                                        className="rounded-xl bg-[#DDB86A] px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md"
                                    >
                                        ✏️ Edit Properties →
                                    </button>
                                    <button
                                        type="button"
                                        onClick={openAddProperty}
                                        className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
                                    >
                                        + Add New
                                    </button>
                                </div>
                            </div>

                            {/* Website Content Quick Action */}
                            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDB86A]/20 text-2xl text-[#DDB86A] shrink-0">
                                        ⚙️
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Website Content &amp; Page Editing</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Customize About page headline, mission, company statistics, phone, email &amp; headquarters address.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection("website")}
                                        className="rounded-xl bg-[#DDB86A] px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md"
                                    >
                                        Edit Website Content →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Inquiries and Submissions Quick View */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Inquiries */}
                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-white">Recent Enquiries</h3>
                                    <button
                                        onClick={() => setActiveSection("inquiries")}
                                        className="text-xs text-[#DDB86A] hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                {inquiries.length > 0 ? (
                                    <div className="divide-y divide-zinc-800">
                                        {inquiries.slice(0, 4).map((inq) => (
                                            <div key={inq.id} className="py-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold text-white">{inq.name} ({inq.phone})</p>
                                                    <span className="text-[10px] text-zinc-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-zinc-300 line-clamp-2">{inq.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500 py-6 text-center">No inquiries yet.</p>
                                )}
                            </div>

                            {/* Submissions */}
                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-white">Recent User Property Submissions</h3>
                                    <button
                                        onClick={() => setActiveSection("submissions")}
                                        className="text-xs text-[#DDB86A] hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                {submissions.length > 0 ? (
                                    <div className="divide-y divide-zinc-800">
                                        {submissions.slice(0, 4).map((sub) => (
                                            <div key={sub.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-white">{sub.title}</p>
                                                    <p className="text-xs text-zinc-400">{sub.location} • ₹{sub.price.toLocaleString("en-IN")}</p>
                                                    <p className="text-[10px] text-zinc-500">By {sub.ownerName} ({sub.ownerPhone})</p>
                                                </div>
                                                <span className="rounded-md bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-[#DDB86A]">
                                                    {sub.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500 py-6 text-center">No property submissions pending.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SECTION 2: PROPERTIES MANAGEMENT */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "properties" && (
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Properties Directory</h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Manage, add, edit and delete real estate properties stored in <span className="text-emerald-400">sbmlandhub</span> database.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 self-start sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection("overview")}
                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                                >
                                    ← Back to Dashboard
                                </button>
                                <button
                                    type="button"
                                    onClick={openAddProperty}
                                    className="rounded-2xl bg-[#DDB86A] px-5 py-2.5 text-xs font-bold text-[#0F172A] shadow-md transition hover:bg-[#C59D5F] flex items-center gap-2"
                                >
                                    <span>+</span> Add New Property
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {["ALL", "LAND", "HOUSE", "FIELD", "SHOP", "COMMERCIAL", "RESIDENTIAL"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setPropertyFilter(t)}
                                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${propertyFilter === t
                                        ? "bg-[#DDB86A] text-[#0F172A]"
                                        : "bg-[#1E293B] text-zinc-300 hover:bg-zinc-800"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Properties Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProperties.map((prop) => (
                                <div
                                    key={prop.id}
                                    className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#1E293B] shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-44 w-full bg-zinc-900">
                                            <img
                                                src={prop.image || "/image/land1.avif"}
                                                alt={prop.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="rounded-md bg-[#0F172A]/80 px-2 py-1 text-[10px] font-bold text-[#DDB86A] backdrop-blur-md">
                                                    {prop.type}
                                                </span>
                                                {prop.featured && (
                                                    <span className="rounded-md bg-amber-500 px-2 py-1 text-[10px] font-black text-black">
                                                        FEATURED
                                                    </span>
                                                )}
                                            </div>
                                            <span
                                                className={`absolute top-3 right-3 rounded-md px-2 py-1 text-[10px] font-bold uppercase backdrop-blur-md ${prop.status === "AVAILABLE"
                                                    ? "bg-emerald-600/90 text-white"
                                                    : "bg-red-600/90 text-white"
                                                    }`}
                                            >
                                                {prop.status}
                                            </span>

                                            {prop.video && (
                                                <span className="absolute bottom-3 left-3 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1 border border-white/20">
                                                    <span>🎥</span> Video
                                                </span>
                                            )}

                                            {prop.images && prop.images.length > 1 && (
                                                <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
                                                    <span>📷</span> {prop.images.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <p className="text-xl font-black text-[#DDB86A]">
                                                ₹{prop.price.toLocaleString("en-IN")}
                                            </p>
                                            <h3 className="mt-1 text-base font-bold text-white line-clamp-1">{prop.title}</h3>
                                            <p className="mt-1 text-xs text-zinc-400 line-clamp-1">📍 {prop.location}</p>
                                            <p className="mt-1 text-xs text-zinc-500">Area: {prop.area} {prop.areaUnit || "sq.ft"}</p>
                                        </div>
                                    </div>

                                    {/* Merged Single Action button */}
                                    <div className="border-t border-zinc-800/80 p-4 bg-zinc-900/40 flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => openEditProperty(prop)}
                                            className="flex-1 rounded-xl bg-[#DDB86A] px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md flex items-center justify-center gap-2"
                                        >
                                            <span>✏️</span> Edit &amp; View Property Card →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteProperty(prop.id)}
                                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                            title="Delete Property"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProperties.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                                <p className="text-base font-semibold text-zinc-400">
                                    No properties found {propertyFilter !== "ALL" ? `matching category: ${propertyFilter}` : "in database"}.
                                </p>
                                {properties.length === 0 && (
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={openAddProperty}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#DDB86A] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition shadow-md"
                                        >
                                            + Upload Your First Property
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SECTION 3: USER PROPERTY SUBMISSIONS */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "submissions" && (
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">User Submissions</h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Properties submitted by users through the &quot;Sell Property&quot; page. Approve to publish immediately to live properties.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveSection("overview")}
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition self-start sm:self-auto"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>

                        <div className="space-y-4">
                            {submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-white">{sub.title}</h3>
                                            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-[#DDB86A]">
                                                {sub.type}
                                            </span>
                                            <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-base font-black text-[#DDB86A]">
                                            ₹{sub.price.toLocaleString("en-IN")} • {sub.area} sq.ft
                                        </p>
                                        <p className="text-xs text-zinc-400">📍 Location: {sub.location}</p>
                                        <div className="pt-2 text-xs text-zinc-300">
                                            <span className="font-bold text-zinc-200">Owner:</span> {sub.ownerName} | <span className="font-bold text-zinc-200">Phone:</span> {sub.ownerPhone} {sub.ownerEmail && `| Email: ${sub.ownerEmail}`}
                                        </div>
                                        {sub.description && (
                                            <p className="text-xs text-zinc-400 mt-2 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                                                {sub.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 self-end lg:self-center">
                                        <button
                                            type="button"
                                            onClick={() => handleApproveSubmission(sub.id)}
                                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-sm"
                                        >
                                            ✓ Approve & Publish Live
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubmission(sub.id)}
                                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {submissions.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                                    No property submissions received yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SECTION 4: CONTACT ENQUIRIES */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "inquiries" && (
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Contact Enquiries</h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Messages received from visitors on the &quot;Contact&quot; page.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveSection("overview")}
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition self-start sm:self-auto"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>

                        <div className="space-y-4">
                            {inquiries.map((inq) => (
                                <div
                                    key={inq.id}
                                    className={`rounded-3xl border p-6 transition ${inq.isRead
                                        ? "border-zinc-800/80 bg-[#1E293B]/70"
                                        : "border-[#DDB86A]/40 bg-[#1E293B]"
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white">{inq.name}</h3>
                                                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase text-[#DDB86A]">
                                                    {inq.enquiryType}
                                                </span>
                                                {!inq.isRead && (
                                                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-0.5">
                                                📞 {inq.phone} {inq.email && `• ✉️ ${inq.email}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] text-zinc-400">
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleInquiryRead(inq.id, inq.isRead)}
                                                className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                                            >
                                                {inq.isRead ? "Mark Unread" : "Mark Read"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteInquiry(inq.id)}
                                                className="rounded-lg border border-red-500/30 text-red-400 px-2.5 py-1 text-xs hover:bg-red-500 hover:text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-4 rounded-xl bg-zinc-900/60 p-4 text-xs sm:text-sm text-zinc-200 leading-relaxed border border-zinc-800/80">
                                        {inq.message}
                                    </p>
                                </div>
                            ))}

                            {inquiries.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                                    No contact enquiries found.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SECTION 5: WEBSITE CONTENT EDITOR (ABOUT & CONTACT) */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "website" && (
                    <div className="mt-8 space-y-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Website Content Editor</h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Customize and update public copy, About page story &amp; stats, and official Contact details across the website.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveSection("overview")}
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition self-start sm:self-auto"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>

                        <form onSubmit={handleSaveSiteContent} className="space-y-8">
                            {/* ABOUT PAGE EDITING */}
                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-[#DDB86A] flex items-center gap-2">
                                    <span>📄</span> About Page Settings
                                </h3>
                                <p className="text-xs text-zinc-400 mt-1 mb-6">
                                    Content shown on the /about page and brand presentation.
                                </p>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Main Tagline / Headline
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.title}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, title: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Subtitle / Badge
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.subtitle}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, subtitle: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Description / Company Summary
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={siteContent.about.description}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, description: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Mission Statement
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={siteContent.about.mission}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, mission: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    {/* Stats */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Years Experience Stat
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.experienceYears}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, experienceYears: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Properties Sold Stat
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.propertiesSold}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, propertiesSold: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Happy Clients Stat
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.happyClients}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, happyClients: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Verified Locations Stat
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.about.verifiedLocations}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    about: { ...siteContent.about, verifiedLocations: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CONTACT PAGE EDITING */}
                            <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 sm:p-8">
                                <h3 className="text-lg font-bold text-[#DDB86A] flex items-center gap-2">
                                    <span>📞</span> Contact Page &amp; Company Info Settings
                                </h3>
                                <p className="text-xs text-zinc-400 mt-1 mb-6">
                                    Official contact telephone, email, WhatsApp, and headquarters address.
                                </p>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Official Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.contact.phone}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    contact: { ...siteContent.contact, phone: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            WhatsApp Support Number
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.contact.whatsapp}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    contact: { ...siteContent.contact, whatsapp: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Official Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={siteContent.contact.email}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    contact: { ...siteContent.contact, email: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                            Office Operating Hours
                                        </label>
                                        <input
                                            type="text"
                                            value={siteContent.contact.workingHours}
                                            onChange={(e) =>
                                                setSiteContent({
                                                    ...siteContent,
                                                    contact: { ...siteContent.contact, workingHours: e.target.value },
                                                })
                                            }
                                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Headquarters / Physical Office Address
                                            </label>
                                            <input
                                                type="text"
                                                value={siteContent.contact.address}
                                                onChange={(e) =>
                                                    setSiteContent({
                                                        ...siteContent,
                                                        contact: { ...siteContent.contact, address: e.target.value },
                                                    })
                                                }
                                                className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Office PIN Code
                                            </label>
                                            <input
                                                type="text"
                                                value={siteContent.contact.pincode || ""}
                                                onChange={(e) =>
                                                    setSiteContent({
                                                        ...siteContent,
                                                        contact: { ...siteContent.contact, pincode: e.target.value },
                                                    })
                                                }
                                                placeholder="e.g. 795001"
                                                className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <button
                                    type="submit"
                                    className="rounded-2xl bg-[#DDB86A] px-8 py-3.5 text-sm font-bold text-[#0F172A] shadow-xl transition hover:bg-[#C59D5F]"
                                >
                                    💾 Save Website Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSection("overview")}
                                    className="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                                >
                                    ← Back to Dashboard
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* SECTION 6: PROPERTIES SINGLE CARD EDITING PAGE */}
                {/* ------------------------------------------------------------- */}
                {activeSection === "edit-property" && (
                    <div className="mt-8 space-y-8">
                        {/* Top Header & Navigation */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection("overview")}
                                        className="hover:text-[#DDB86A] transition"
                                    >
                                        Dashboard
                                    </button>
                                    <span>/</span>
                                    <button
                                        type="button"
                                        onClick={() => setActiveSection("properties")}
                                        className="hover:text-[#DDB86A] transition"
                                    >
                                        Properties
                                    </button>
                                    <span>/</span>
                                    <span className="text-[#DDB86A]">
                                        {editingProperty ? `Edit Card #${editingProperty.id}` : "Create Property Card"}
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                                    <span>{editingProperty ? "✏️ Edit Property Card" : "✨ Create New Property Card"}</span>
                                    {editingProperty && (
                                        <span className="text-xs font-mono font-bold bg-[#DDB86A]/20 text-[#DDB86A] border border-[#DDB86A]/40 px-2.5 py-1 rounded-lg">
                                            ID #{editingProperty.id}
                                        </span>
                                    )}
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Customize card details, pricing, location, and photos with real-time live preview.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection("properties")}
                                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                                >
                                    ← Back to Properties
                                </button>

                                {editingProperty && (
                                    <>
                                        <Link
                                            href={`/properties/${editingProperty.id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DDB86A]/40 bg-[#DDB86A]/10 px-4 py-2.5 text-xs font-bold text-[#DDB86A] hover:bg-[#DDB86A] hover:text-[#0F172A] transition"
                                        >
                                            👁️ View Public Page ↗
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleDeleteProperty(editingProperty.id);
                                                setActiveSection("properties");
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Split Editor: Form (Left) & Real-time Live Card Preview (Right) */}
                        <div className="grid gap-8 lg:grid-cols-12">
                            {/* Left Column: Property Card Edit Form (7 cols) */}
                            <div className="lg:col-span-7">
                                <form onSubmit={handleSaveProperty} className="space-y-6">
                                    {/* Card Basic Info Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                            <span>📋</span> 1. Card Identity &amp; Category
                                        </h3>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Property Card Title *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={propertyForm.title}
                                                onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                                                placeholder="e.g. Premium Residential Land"
                                                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Property Category *
                                                </label>
                                                <select
                                                    value={propertyForm.type}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value })}
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                >
                                                    <option value="LAND">LAND</option>
                                                    <option value="HOUSE">HOUSE</option>
                                                    <option value="FIELD">FIELD</option>
                                                    <option value="SHOP">SHOP</option>
                                                    <option value="COMMERCIAL">COMMERCIAL</option>
                                                    <option value="RESIDENTIAL">RESIDENTIAL</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Listing Type
                                                </label>
                                                <select
                                                    value={propertyForm.listingType}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, listingType: e.target.value })}
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                >
                                                    <option value="SALE">FOR SALE</option>
                                                    <option value="RENT">FOR RENT</option>
                                                    <option value="PURCHASE">PURCHASE</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing & Area Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                            <span>💰</span> 2. Price &amp; Sizing
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="sm:col-span-1">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Price (₹) *
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={propertyForm.price}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                                                    placeholder="4500000"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Area Size *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={propertyForm.area}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, area: e.target.value })}
                                                    placeholder="2,500"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Area Unit
                                                </label>
                                                <input
                                                    type="text"
                                                    value={propertyForm.areaUnit}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, areaUnit: e.target.value })}
                                                    placeholder="sq.ft or Acres"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                            <span>📍</span> 3. Location &amp; Address Details
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Address / Specific Location *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={propertyForm.location}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                                                    placeholder="e.g. MG Avenue, Thangal Bazar, Imphal"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    PIN Code (Postal Code) *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={propertyForm.pincode}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, pincode: e.target.value })}
                                                    placeholder="e.g. 795001"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    District
                                                </label>
                                                <input
                                                    type="text"
                                                    value={propertyForm.district}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, district: e.target.value })}
                                                    placeholder="e.g. Imphal West"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    value={propertyForm.state}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, state: e.target.value })}
                                                    placeholder="e.g. Manipur"
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media Studio: Pictures & Video Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-6">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                                            <div>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                                    <span>🎬</span> 4. Property Pictures &amp; Video Studio
                                                </h3>
                                                <p className="text-xs text-zinc-400 mt-1">
                                                    Add photo gallery and property walkthrough video for buyers.
                                                </p>
                                            </div>

                                            {/* Media Type Switcher Tabs */}
                                            <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                                                <button
                                                    type="button"
                                                    onClick={() => setMediaTab("pictures")}
                                                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${mediaTab === "pictures"
                                                        ? "bg-[#DDB86A] text-[#0F172A] shadow-sm"
                                                        : "text-zinc-400 hover:text-white"
                                                        }`}
                                                >
                                                    <span>📸</span> Pictures ({propertyForm.images?.length || 0})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setMediaTab("video")}
                                                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${mediaTab === "video"
                                                        ? "bg-[#DDB86A] text-[#0F172A] shadow-sm"
                                                        : "text-zinc-400 hover:text-white"
                                                        }`}
                                                >
                                                    <span>🎥</span> Video Tour {propertyForm.video ? "✓" : ""}
                                                </button>
                                            </div>
                                        </div>

                                        {/* TAB 1: PICTURES */}
                                        {mediaTab === "pictures" && (
                                            <div className="space-y-6">
                                                {/* Upload from Device & Add URL */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* File Upload from Device */}
                                                    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 text-center hover:border-[#DDB86A] transition flex flex-col items-center justify-center">
                                                        <input
                                                            type="file"
                                                            id="propertyPhotosUpload"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                            disabled={uploadingImage}
                                                        />
                                                        <label
                                                            htmlFor="propertyPhotosUpload"
                                                            className="cursor-pointer flex flex-col items-center w-full"
                                                        >
                                                            <div className="h-10 w-10 rounded-full bg-[#DDB86A]/20 text-[#DDB86A] flex items-center justify-center text-lg mb-2">
                                                                {uploadingImage ? "⏳" : "📁"}
                                                            </div>
                                                            <span className="text-xs font-bold text-white">
                                                                {uploadingImage ? "Uploading Pictures..." : "Upload Pictures from Device"}
                                                            </span>
                                                            <span className="text-[11px] text-zinc-400 mt-0.5">
                                                                Supports JPG, PNG, WEBP (multiple allowed)
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {/* Add via URL */}
                                                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                                Or Add Picture by URL / Path
                                                            </label>
                                                            <div className="mt-2 flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={customImageUrl}
                                                                    onChange={(e) => setCustomImageUrl(e.target.value)}
                                                                    placeholder="/image/land.jpg or https://..."
                                                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-[#DDB86A]"
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault();
                                                                            handleAddCustomImageUrl();
                                                                        }
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddCustomImageUrl}
                                                                    className="rounded-xl bg-[#DDB86A] px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition whitespace-nowrap"
                                                                >
                                                                    + Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-zinc-500 mt-2">
                                                            Press Add to include in gallery.
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Quick Presets */}
                                                <div>
                                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                                        Quick Visual Presets (Click to add to gallery):
                                                    </span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                                        {[
                                                            { label: "Land 1", path: "/image/land1.avif" },
                                                            { label: "Land 2", path: "/image/land.jpg" },
                                                            { label: "House", path: "/image/house.jpg" },
                                                            { label: "Field", path: "/image/field.jpg" },
                                                            { label: "Shop", path: "/image/shop.jpg" },
                                                        ].map((preset) => (
                                                            <button
                                                                key={preset.path}
                                                                type="button"
                                                                onClick={() => {
                                                                    const current = propertyForm.images || [];
                                                                    if (!current.includes(preset.path)) {
                                                                        const updated = [...current, preset.path];
                                                                        setPropertyForm({
                                                                            ...propertyForm,
                                                                            image: propertyForm.image || preset.path,
                                                                            images: updated,
                                                                        });
                                                                        showToast(`Added ${preset.label} preset to gallery!`);
                                                                    } else {
                                                                        handleSetCoverImage(preset.path);
                                                                    }
                                                                }}
                                                                className={`overflow-hidden rounded-xl border p-1 text-center transition ${propertyForm.image === preset.path
                                                                    ? "border-[#DDB86A] bg-[#DDB86A]/10 ring-2 ring-[#DDB86A]/40"
                                                                    : "border-zinc-700 bg-zinc-900/80 hover:border-zinc-500"
                                                                    }`}
                                                            >
                                                                <img
                                                                    src={preset.path}
                                                                    alt={preset.label}
                                                                    className="h-12 w-full rounded-lg object-cover"
                                                                />
                                                                <span className="mt-1 block text-[10px] font-bold text-zinc-300">
                                                                    {preset.label}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Attached Pictures Gallery Manager */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                                            Attached Gallery Pictures ({propertyForm.images?.length || 0})
                                                        </label>
                                                        <span className="text-[11px] text-zinc-400">
                                                            ⭐ Click &quot;Make Cover&quot; to pick the main thumbnail
                                                        </span>
                                                    </div>

                                                    {(!propertyForm.images || propertyForm.images.length === 0) ? (
                                                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-xs text-zinc-500">
                                                            No pictures attached yet. Upload or pick a preset above.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                            {propertyForm.images.map((img, idx) => {
                                                                const isCover = propertyForm.image === img;
                                                                return (
                                                                    <div
                                                                        key={`${img}-${idx}`}
                                                                        className={`group relative overflow-hidden rounded-2xl border bg-zinc-900 p-1.5 transition ${isCover
                                                                            ? "border-[#DDB86A] ring-2 ring-[#DDB86A]/50 bg-[#DDB86A]/10"
                                                                            : "border-zinc-700 hover:border-zinc-500"
                                                                            }`}
                                                                    >
                                                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950">
                                                                            <img
                                                                                src={img}
                                                                                alt={`Property picture ${idx + 1}`}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                            {isCover && (
                                                                                <span className="absolute top-1.5 left-1.5 rounded-md bg-[#DDB86A] px-2 py-0.5 text-[9px] font-black text-[#0F172A] shadow">
                                                                                    ⭐ COVER
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="mt-2 flex items-center justify-between gap-1 px-1">
                                                                            {!isCover ? (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleSetCoverImage(img)}
                                                                                    className="text-[10px] font-bold text-zinc-300 hover:text-[#DDB86A] transition"
                                                                                >
                                                                                    Set as Cover
                                                                                </button>
                                                                            ) : (
                                                                                <span className="text-[10px] font-bold text-[#DDB86A]">
                                                                                    Primary Cover
                                                                                </span>
                                                                            )}

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveImage(idx)}
                                                                                className="rounded-lg bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                                                                title="Remove picture"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 2: VIDEO */}
                                        {mediaTab === "video" && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Video Upload from Device */}
                                                    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 p-4 text-center hover:border-[#DDB86A] transition flex flex-col items-center justify-center">
                                                        <input
                                                            type="file"
                                                            id="propertyVideoUpload"
                                                            accept="video/*"
                                                            onChange={handleVideoUpload}
                                                            className="hidden"
                                                            disabled={uploadingVideo}
                                                        />
                                                        <label
                                                            htmlFor="propertyVideoUpload"
                                                            className="cursor-pointer flex flex-col items-center w-full"
                                                        >
                                                            <div className="h-10 w-10 rounded-full bg-[#DDB86A]/20 text-[#DDB86A] flex items-center justify-center text-lg mb-2">
                                                                {uploadingVideo ? "⏳" : "🎥"}
                                                            </div>
                                                            <span className="text-xs font-bold text-white">
                                                                {uploadingVideo ? "Uploading Video..." : "Upload Video File from Device"}
                                                            </span>
                                                            <span className="text-[11px] text-zinc-400 mt-0.5">
                                                                Supports MP4, WebM, MOV video files
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {/* Video Link Option */}
                                                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                            Or Paste YouTube / Video Link
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={propertyForm.video || ""}
                                                            onChange={(e) => setPropertyForm({ ...propertyForm, video: e.target.value })}
                                                            placeholder="https://www.youtube.com/watch?v=... or /uploads/..."
                                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-[#DDB86A]"
                                                        />
                                                        <p className="text-[10px] text-zinc-500">
                                                            Paste any YouTube, Vimeo, or direct MP4 video link.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Live Video Player Preview */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                                            Property Video Preview &amp; Status
                                                        </label>
                                                        {propertyForm.video && (
                                                            <button
                                                                type="button"
                                                                onClick={handleRemoveVideo}
                                                                className="rounded-lg bg-red-500/20 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                                                            >
                                                                🗑️ Remove Video
                                                            </button>
                                                        )}
                                                    </div>

                                                    {propertyForm.video ? (
                                                        <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-black">
                                                            {(() => {
                                                                const videoInfo = getEmbedVideoInfo(propertyForm.video);
                                                                if (videoInfo.type === "youtube" || videoInfo.type === "vimeo") {
                                                                    return (
                                                                        <div className="relative aspect-video w-full">
                                                                            <iframe
                                                                                src={videoInfo.src}
                                                                                title="Property Video Tour Preview"
                                                                                className="h-full w-full border-0"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                                return (
                                                                    <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                                                                        <video
                                                                            src={videoInfo.src}
                                                                            controls
                                                                            className="h-full w-full object-contain"
                                                                        />
                                                                    </div>
                                                                );
                                                            })()}
                                                            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs">
                                                                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                                                    <span>✓</span> Video attached and ready to publish
                                                                </span>
                                                                <span className="text-zinc-500 truncate max-w-xs font-mono text-[11px]">
                                                                    {propertyForm.video}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center text-xs text-zinc-500">
                                                            <div className="text-2xl mb-1">🎬</div>
                                                            No video attached yet. Upload a video file or paste a YouTube tour link above to give buyers an immersive walkthrough.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Highlights & Legal Verification Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-6">
                                        <div className="border-b border-zinc-800 pb-4">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                                <span>✨</span> 5. Highlights &amp; Legal Verification
                                            </h3>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                Admin can edit key selling highlights and certified legal verification records shown directly to prospective buyers.
                                            </p>
                                        </div>

                                        {/* PART A: HIGHLIGHTS */}
                                        <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/70 p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                                        <span>⭐</span> Property Highlights ({propertyForm.highlights?.length || 0})
                                                    </label>
                                                    <p className="text-[11px] text-zinc-400 mt-0.5">
                                                        Key property features, accessibility advantages, and location benefits.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Add Highlight Input */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newHighlightInput}
                                                    onChange={(e) => setNewHighlightInput(e.target.value)}
                                                    placeholder="Type a highlight and click Add (or press Enter)..."
                                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-xs text-white outline-none focus:border-[#DDB86A]"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addHighlight(newHighlightInput);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addHighlight(newHighlightInput)}
                                                    className="rounded-xl bg-[#DDB86A] px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#C59D5F] transition whitespace-nowrap shadow-sm"
                                                >
                                                    + Add Highlight
                                                </button>
                                            </div>

                                            {/* Active Highlights Badges */}
                                            {propertyForm.highlights && propertyForm.highlights.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {propertyForm.highlights.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-200 group"
                                                        >
                                                            <span>✨ {item}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeHighlight(idx)}
                                                                className="h-4 w-4 rounded-full bg-amber-500/20 text-amber-300 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-[10px]"
                                                                title="Remove highlight"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-zinc-500 italic">No highlights added yet. Type above or click a quick suggestion below.</p>
                                            )}

                                            {/* Quick Highlight Presets */}
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                                    Quick Preset Suggestions (Click to Add):
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        "Direct Motor-able Road Access & Frontage",
                                                        "Electricity & Potable Water Utilities Accessible",
                                                        "Demarcated & Well-Defined Boundaries",
                                                        "High-Demand Commercial Zone / Footfall",
                                                        "Corner Plot with Dual-Road Frontage",
                                                        "Peaceful Residential Neighborhood",
                                                        "Fertile Soil with Year-Round Irrigation",
                                                        "Near High School, Hospital & Market",
                                                    ].map((preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() => addHighlight(preset)}
                                                            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-[#DDB86A] hover:text-[#DDB86A] transition"
                                                        >
                                                            + {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* PART B: LEGAL VERIFICATION */}
                                        <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/70 p-5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                                                        <span>🛡️</span> Legal Verification ({propertyForm.legalVerification?.length || 0})
                                                    </label>
                                                    <p className="text-[11px] text-zinc-400 mt-0.5">
                                                        Government revenue checks, title verification, and document authenticity badges.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Add Legal Verification Input */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newLegalInput}
                                                    onChange={(e) => setNewLegalInput(e.target.value)}
                                                    placeholder="Type a legal check and click Add (or press Enter)..."
                                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addLegalVerification(newLegalInput);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addLegalVerification(newLegalInput)}
                                                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition whitespace-nowrap shadow-sm"
                                                >
                                                    + Add Legal Check
                                                </button>
                                            </div>

                                            {/* Active Legal Verification Badges */}
                                            {propertyForm.legalVerification && propertyForm.legalVerification.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {propertyForm.legalVerification.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-200 group"
                                                        >
                                                            <span>✓ {item}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLegalVerification(idx)}
                                                                className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-[10px]"
                                                                title="Remove legal check"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-zinc-500 italic">No legal verification items added yet. Type above or click a quick suggestion below.</p>
                                            )}

                                            {/* Quick Legal Presets */}
                                            <div>
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                                    Quick Legal Verification Presets (Click to Add):
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {[
                                                        "Verified 100% Clear Title & Ownership Records",
                                                        "Non-Encumbered & Dispute-Free Land Title",
                                                        "Ready for Immediate Registration & Transfer",
                                                        "Patta & Jamabandi Verified by Revenue Dept",
                                                        "Mutation & Dag Number Clearance Certified",
                                                        "Single Direct Owner / No Family Dispute",
                                                        "Sub-Registrar Office Verified Documents",
                                                        "Legal Verification Dossier Available at Office",
                                                    ].map((preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() => addLegalVerification(preset)}
                                                            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 transition"
                                                        >
                                                            + {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description & Status Card */}
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-sm space-y-5">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#DDB86A] flex items-center gap-2">
                                            <span>📝</span> 6. Details &amp; Visibility
                                        </h3>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Full Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={propertyForm.description}
                                                onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                                placeholder="Provide detailed description of the property, road access, boundaries, etc."
                                                className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                    Listing Status
                                                </label>
                                                <select
                                                    value={propertyForm.status}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, status: e.target.value })}
                                                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-[#DDB86A]"
                                                >
                                                    <option value="AVAILABLE">AVAILABLE (Active)</option>
                                                    <option value="PENDING">PENDING (Under Discussion)</option>
                                                    <option value="SOLD">SOLD</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-3 sm:pt-6">
                                                <input
                                                    type="checkbox"
                                                    id="featuredCardCheck"
                                                    checked={propertyForm.featured}
                                                    onChange={(e) => setPropertyForm({ ...propertyForm, featured: e.target.checked })}
                                                    className="h-5 w-5 rounded accent-[#DDB86A]"
                                                />
                                                <label htmlFor="featuredCardCheck" className="text-xs sm:text-sm font-semibold text-zinc-200 cursor-pointer">
                                                    Mark as Featured Card (Gold Star Badge)
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="rounded-2xl bg-[#DDB86A] px-8 py-4 text-sm font-bold text-[#0F172A] shadow-xl transition hover:bg-[#C59D5F] flex items-center gap-2"
                                        >
                                            <span>💾</span> {editingProperty ? "Save Property Card Changes" : "Create & Publish Property Card"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveSection("properties")}
                                            className="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                                        >
                                            ← Back to Properties Dashboard
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right Column: Live Single Card Preview (5 cols) */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-28 space-y-6">
                                    <div className="rounded-3xl border border-zinc-800 bg-[#1E293B] p-6 shadow-xl">
                                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                                            <div>
                                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                                    Live Card Preview (Real-time)
                                                </h3>
                                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                                    Exact visual representation rendered for visitors:
                                                </p>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-[#DDB86A]">
                                                {propertyForm.type}
                                            </span>
                                        </div>

                                        {/* Card Render Preview */}
                                        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white text-[#1F2937] shadow-lg">
                                            {/* Preview Image */}
                                            <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                                                <img
                                                    src={propertyForm.image || "/image/land1.avif"}
                                                    alt={propertyForm.title || "Property Preview"}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                                {/* Type Badge */}
                                                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1F2937] shadow-sm">
                                                    {propertyForm.type || "LAND"}
                                                </span>

                                                {/* Featured Badge */}
                                                {propertyForm.featured && (
                                                    <span className="absolute right-4 top-4 rounded-full bg-[#C59D5F] px-3 py-1 text-xs font-bold text-white shadow-sm">
                                                        ★ Featured
                                                    </span>
                                                )}

                                                {/* Photos count */}
                                                {propertyForm.images && propertyForm.images.length > 1 && (
                                                    <span className="absolute right-4 top-11 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                                                        <span>📷</span> {propertyForm.images.length}
                                                    </span>
                                                )}

                                                {/* Video Badge */}
                                                {propertyForm.video && (
                                                    <span className="absolute left-4 bottom-4 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                                                        <span>🎥</span> Video Tour
                                                    </span>
                                                )}

                                                {/* Status Badge */}
                                                <span
                                                    className={`absolute right-4 bottom-4 rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md ${propertyForm.status === "AVAILABLE"
                                                        ? "bg-emerald-600/90 text-white"
                                                        : "bg-red-600/90 text-white"
                                                        }`}
                                                >
                                                    {propertyForm.status || "AVAILABLE"}
                                                </span>
                                            </div>

                                            {/* Preview Content */}
                                            <div className="p-5">
                                                <p className="text-xs text-zinc-500">
                                                    📍 {propertyForm.location || "Location not set"}
                                                    {propertyForm.district && `, ${propertyForm.district}`}
                                                    {propertyForm.state && `, ${propertyForm.state}`}
                                                    {propertyForm.pincode && ` - ${propertyForm.pincode}`}
                                                </p>

                                                <h4 className="mt-1.5 text-lg font-bold text-[#1F2937] line-clamp-1">
                                                    {propertyForm.title || "Untitled Property"}
                                                </h4>

                                                <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">Price</p>
                                                        <p className="mt-0.5 text-lg font-bold text-[#B88A44]">
                                                            {propertyForm.price
                                                                ? Number(propertyForm.price) >= 10000000
                                                                    ? `₹ ${(Number(propertyForm.price) / 10000000).toFixed(2)} Cr`
                                                                    : Number(propertyForm.price) >= 100000
                                                                        ? `₹ ${(Number(propertyForm.price) / 100000).toFixed(2)} Lakhs`
                                                                        : `₹ ${Number(propertyForm.price).toLocaleString("en-IN")}`
                                                                : "₹ 0"}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">Area</p>
                                                        <p className="mt-0.5 text-xs font-semibold text-zinc-600">
                                                            {propertyForm.area || "0"} {propertyForm.areaUnit || "sq.ft"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Highlights & Legal Verification preview chips */}
                                                <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100">
                                                    {propertyForm.highlights && propertyForm.highlights.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                                            <span>✨</span> {propertyForm.highlights.length} Highlights
                                                        </span>
                                                    )}
                                                    {propertyForm.legalVerification && propertyForm.legalVerification.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                            <span>🛡️</span> {propertyForm.legalVerification.length} Verified Legal Checks
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 block rounded-xl bg-[#1F2937] px-4 py-2.5 text-center text-xs font-bold text-white opacity-90 cursor-default">
                                                    View Property Card
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Quick Info Box */}
                                        <div className="mt-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 text-xs space-y-2">
                                            <div className="flex justify-between text-zinc-400">
                                                <span>Listing Type:</span>
                                                <span className="font-semibold text-white">{propertyForm.listingType || "SALE"}</span>
                                            </div>
                                            <div className="flex justify-between text-zinc-400">
                                                <span>Live Status:</span>
                                                <span className={`font-semibold ${propertyForm.status === "AVAILABLE" ? "text-emerald-400" : "text-amber-400"}`}>
                                                    {propertyForm.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-zinc-400">
                                                <span>Highlights:</span>
                                                <span className="font-semibold text-amber-400">{propertyForm.highlights?.length || 0} active</span>
                                            </div>
                                            <div className="flex justify-between text-zinc-400">
                                                <span>Legal Verification:</span>
                                                <span className="font-semibold text-emerald-400">{propertyForm.legalVerification?.length || 0} verified</span>
                                            </div>
                                            {editingProperty && (
                                                <div className="flex justify-between text-zinc-400">
                                                    <span>Live Public URL:</span>
                                                    <Link
                                                        href={`/properties/${editingProperty.id}`}
                                                        target="_blank"
                                                        className="text-[#DDB86A] hover:underline"
                                                    >
                                                        /properties/{editingProperty.id} ↗
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
