"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Package,
    Send,
    Wallet,
    LogOut,
    Instagram,
    Star,
    Menu,
    X,
} from "lucide-react";

type Profile = {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    trust_score: number | null;
    niche: string[] | null;
    successful_drops: number | null;
};

const navItems = [
    { href: "/creator", label: "Dashboard", icon: LayoutDashboard },
    { href: "/creator/drops", label: "Browse Drops", icon: Package },
    { href: "/creator/applications", label: "My Applications", icon: Send },
    { href: "/creator/payouts", label: "Payouts", icon: Wallet },
];

export default function CreatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth?tab=signin");
                return;
            }

            const { data: profileData } = await supabase
                .from("profiles")
                .select("id, full_name, email, avatar_url, trust_score, niche, successful_drops")
                .eq("id", session.user.id)
                .single();

            if (profileData) {
                setProfile(profileData as Profile);
            }
            setLoading(false);
        };

        checkAuth();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                    <p className="text-sm text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const initials = profile?.full_name
        ? profile.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 shadow-sm lg:hidden"
            >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white border-r border-black/[0.04] transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center gap-2.5 px-6 border-b border-black/[0.04]">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/logo-black.png"
                            alt="BrandKlip"
                            width={120}
                            height={28}
                            className="h-6 w-auto"
                        />
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="px-5 py-6 border-b border-black/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-white text-sm font-semibold">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                                {profile?.full_name || "Creator"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    {/* Trust Score */}
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-medium text-foreground">
                            Trust Score: {profile?.trust_score ?? 50}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all"
                                style={{ width: `${profile?.trust_score ?? 50}%` }}
                            />
                        </div>
                    </div>

                    {/* Niches */}
                    {profile?.niche && profile.niche.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {profile.niche.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/[0.04] text-foreground/60 capitalize"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-foreground text-white shadow-sm"
                                        : "text-foreground/60 hover:bg-black/[0.03] hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Drops count */}
                <div className="mx-5 mb-4 p-4 rounded-2xl bg-gradient-to-br from-black/[0.02] to-black/[0.05] border border-black/[0.04]">
                    <p className="text-xs font-medium text-foreground/60 mb-1">Completed Drops</p>
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                        {profile?.successful_drops ?? 0}
                    </p>
                </div>

                {/* Sign out */}
                <div className="px-3 pb-5">
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/40 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 lg:pl-0">
                <div className="p-6 lg:p-10 pt-20 lg:pt-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
