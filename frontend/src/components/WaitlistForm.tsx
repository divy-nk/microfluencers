"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle2, Search, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EDGE_FUNCTION_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/waitlist-submit`
        : "https://pwjlzpjbozbtrddvddhv.supabase.co/functions/v1/waitlist-submit";

const CATEGORIES = [
    "Skincare",
    "Haircare",
    "Makeup & Beauty",
    "Health & Wellness",
    "Fitness & Sports",
    "Nutrition & Supplements",
    "Fashion & Apparel",
    "Jewellery & Accessories",
    "Footwear",
    "Home & Kitchen",
    "Home Décor",
    "Baby & Kids",
    "Pet Care",
    "Personal Care & Hygiene",
    "Oral Care",
    "Men's Grooming",
    "Electronics & Gadgets",
    "Mobile Accessories",
    "Books & Education",
    "Stationery & Art Supplies",
    "Food & Beverages",
    "Organic & Natural Products",
    "Ayurveda",
    "Travel & Lifestyle",
    "Gaming",
    "Automotive",
    "Sexual Wellness",
    "Bags & Luggage",
    "Eyewear",
    "Sustainable / Eco-Friendly",
];

// ─── Searchable Category Dropdown ───────────────────────────
function CategorySelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = CATEGORIES.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    // close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => {
                    setOpen(!open);
                    setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className={`flex items-center justify-between w-full bg-white border rounded-xl px-4 h-12 text-base transition-colors ${open
                    ? "border-black/30"
                    : "border-black/10 hover:border-black/20"
                    } ${value ? "text-foreground" : "text-foreground/20"}`}
            >
                <span className="truncate">
                    {value || "Select a category..."}
                </span>
                <span className="flex items-center gap-1 ml-2 shrink-0">
                    {value && (
                        <span
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-0.5 rounded-full hover:bg-black/5 transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-foreground/40" />
                        </span>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-foreground/30 transition-transform ${open ? "rotate-180" : ""
                            }`}
                    />
                </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="mt-1.5 bg-white border border-black/10 rounded-xl shadow-xl shadow-black/[0.08] overflow-hidden"
                    >
                        {/* Search input */}
                        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/[0.06]">
                            <Search className="w-4 h-4 text-foreground/30 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search categories…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-sm bg-transparent outline-none placeholder:text-foreground/25 text-foreground"
                            />
                        </div>

                        {/* Options list */}
                        <div
                            className="max-h-[400px] overflow-y-auto overscroll-contain py-1 pb-2"
                            onWheel={(e) => e.stopPropagation()}
                        >
                            {filtered.length === 0 && !search.trim() ? (
                                <div className="px-4 py-3 text-sm text-foreground/30 text-center">
                                    No categories found
                                </div>
                            ) : (
                                <>
                                    {filtered.map((cat) => (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => {
                                                onChange(cat);
                                                setSearch("");
                                                setOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${cat === value
                                                ? "bg-black/[0.04] font-medium text-foreground"
                                                : "text-foreground/70 hover:bg-black/[0.03]"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    {/* Show "Other" when search doesn't exactly match a category */}
                                    {search.trim() && !CATEGORIES.some(c => c.toLowerCase() === search.trim().toLowerCase()) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange("Other");
                                                setSearch("");
                                                setOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-t border-black/[0.04] mt-1 ${"Other" === value
                                                ? "bg-black/[0.04] font-medium text-foreground"
                                                : "text-foreground/50 hover:bg-black/[0.03]"
                                                }`}
                                        >
                                            Other
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main Form ──────────────────────────────────────────────
export default function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<"brand" | "creator">("creator");
    const [instagramHandle, setInstagramHandle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rank, setRank] = useState<number | null>(null);
    const [submittedRecently, setSubmittedRecently] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side debounce
        if (submittedRecently) {
            setError("Please wait a moment before submitting again.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                email,
                name: role === "creator" ? name : null,
                role,
                category: category || null,
                instagram_handle:
                    role === "creator" ? instagramHandle || null : null,
                company_name: role === "brand" ? companyName || null : null,
            };

            const res = await fetch(EDGE_FUNCTION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong. Please try again.");
            }

            if (data.rank) {
                setRank(data.rank);
            }

            setSuccess(true);
            setEmail("");
            setName("");
            setInstagramHandle("");
            setCompanyName("");
            setCategory("");

            // Debounce: prevent rapid re-submissions
            setSubmittedRecently(true);
            setTimeout(() => setSubmittedRecently(false), 10000);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "bg-white border border-black/10 rounded-xl px-4 h-12 focus:border-black/30 transition-colors placeholder:text-foreground/20 focus:ring-0 text-base text-foreground";

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center p-12"
                    >
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-heading font-semibold mb-3 text-foreground">
                            You&apos;re In. We&apos;ll Be in Touch Soon.
                        </h3>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="max-w-md mx-auto space-y-8 p-1 sm:p-0"
                    >
                        <div className="space-y-2 text-center mb-8">
                            <h3 className="text-3xl font-heading font-semibold text-foreground">
                                Claim Your Spot
                            </h3>
                            <p className="text-foreground/50">
                                Early members get first access to exclusive
                                brand drops and campaigns.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* ── Role Toggle ── */}
                            <div className="space-y-3">
                                <Label className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1">
                                    I am a...
                                </Label>
                                <RadioGroup
                                    defaultValue="creator"
                                    value={role}
                                    onValueChange={(val: any) => setRole(val)}
                                    className="flex gap-3"
                                >
                                    {["brand", "creator"].map((option) => {
                                        const isActive = role === option;
                                        return (
                                            <div
                                                key={option}
                                                className="flex items-center"
                                            >
                                                <RadioGroupItem
                                                    value={option}
                                                    id={`role-${option}`}
                                                    className="sr-only"
                                                />
                                                <Label
                                                    htmlFor={`role-${option}`}
                                                    onClick={() =>
                                                        setRole(option as any)
                                                    }
                                                    className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 capitalize text-sm font-medium ${isActive
                                                        ? "bg-foreground text-white border-foreground"
                                                        : "border-black/10 bg-white hover:bg-gray-50 text-foreground/50"
                                                        }`}
                                                >
                                                    {option}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>

                            {/* ── Role-Specific Fields ── */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={role}
                                    initial={{ opacity: 0, x: role === "creator" ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: role === "creator" ? 10 : -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-5"
                                >
                                    {role === "creator" ? (
                                        <>
                                            {/* Name */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="name"
                                                    className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1"
                                                >
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Jane Doe"
                                                    value={name}
                                                    maxLength={100}
                                                    onChange={(e) =>
                                                        setName(e.target.value)
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1"
                                                >
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    maxLength={100}
                                                    placeholder="jane@example.com"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* Instagram Handle */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="instagram"
                                                    className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1"
                                                >
                                                    Instagram Handle
                                                </Label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 text-base font-medium">
                                                        @
                                                    </span>
                                                    <Input
                                                        id="instagram"
                                                        placeholder="yourhandle"
                                                        maxLength={50}
                                                        value={instagramHandle}
                                                        onChange={(e) =>
                                                            setInstagramHandle(
                                                                e.target.value.replace(
                                                                    /^@/,
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                        className={`${inputClass} pl-9`}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Company Name */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="company"
                                                    className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1"
                                                >
                                                    Company Name
                                                </Label>
                                                <Input
                                                    id="company"
                                                    placeholder="Acme Inc."
                                                    maxLength={100}
                                                    value={companyName}
                                                    onChange={(e) =>
                                                        setCompanyName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1"
                                                >
                                                    Work Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    maxLength={100}
                                                    placeholder="hello@acme.com"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* ── Category (both roles) ── */}
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-1">
                                            Product Category
                                        </Label>
                                        <CategorySelect
                                            value={category}
                                            onChange={setCategory}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-foreground text-white rounded-full h-12 text-base font-semibold hover:scale-[1.02] transition-transform shadow-lg shadow-black/10 mt-8"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Lock In My Spot"
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
