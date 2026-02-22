"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Package,
    Upload,
    Wallet,
    ExternalLink,
    Clock,
    CheckCircle2,
    ShoppingCart,
    DollarSign,
    Sparkles,
    TrendingUp,
    Zap,
} from "lucide-react";

type Drop = {
    id: string;
    title: string;
    description: string | null;
    product_link: string;
    quantity: number;
    campaign_type: string;
    product_value: number | null;
    niche: string[] | null;
    brand: { full_name: string | null } | null;
    created_at: string;
};

type Application = {
    id: string;
    status: string;
    approval_status: string;
    payout_status: string;
    created_at: string;
    drop: {
        id: string;
        title: string;
        product_link: string;
        campaign_type: string;
        product_value: number | null;
        brand: { full_name: string | null } | null;
    };
};

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    applied: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock, label: "Applied" },
    purchased: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: ShoppingCart, label: "Purchased" },
    uploaded: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Upload, label: "Uploaded" },
    approved: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Approved" },
    paid: { color: "bg-green-50 text-green-700 border-green-200", icon: DollarSign, label: "Paid" },
};

const campaignIcons: Record<string, React.ElementType> = {
    barter: Package,
    performance: TrendingUp,
    boosted: Zap,
};

export default function CreatorDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [liveDrops, setLiveDrops] = useState<Drop[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingDropId, setApplyingDropId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch creator profile for niche matching
        const { data: profile } = await supabase
            .from("profiles")
            .select("niche")
            .eq("id", session.user.id)
            .single();

        const creatorNiches = profile?.niche || [];

        // Fetch applications with drop details
        const { data: apps } = await supabase
            .from("applications")
            .select(`
                id, status, approval_status, payout_status, created_at,
                drop:drops(id, title, product_link, campaign_type, product_value, brand:profiles!drops_brand_id_fkey(full_name))
            `)
            .eq("creator_id", session.user.id)
            .order("created_at", { ascending: false });

        // Fetch active drops
        const { data: drops } = await supabase
            .from("drops")
            .select(`
                id, title, description, product_link, quantity, campaign_type, product_value, niche, created_at,
                brand:profiles!drops_brand_id_fkey(full_name)
            `)
            .eq("status", "active")
            .order("created_at", { ascending: false });

        // Filter drops by niche overlap
        const appliedDropIds = (apps || []).map((a: any) => a.drop?.id).filter(Boolean);
        const filteredDrops = (drops || []).filter((drop: any) => {
            // Don't show drops the creator already applied to
            if (appliedDropIds.includes(drop.id)) return false;
            // If creator has no niches, show all; if drop has no niches, show to all
            if (creatorNiches.length === 0 || !drop.niche || drop.niche.length === 0) return true;
            // Check niche overlap
            return drop.niche.some((n: string) => creatorNiches.includes(n));
        });

        setApplications((apps || []) as unknown as Application[]);
        setLiveDrops(filteredDrops as unknown as Drop[]);
        setLoading(false);
    };

    const handleApply = async (dropId: string) => {
        setApplyingDropId(dropId);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase.from("applications").insert({
            drop_id: dropId,
            creator_id: session.user.id,
        });

        if (!error) {
            setSuccessMessage("Applied successfully! You'll hear back soon.");
            setTimeout(() => setSuccessMessage(""), 4000);
            fetchData(); // Refresh
        }
        setApplyingDropId(null);
    };

    // Stats
    const activeDrops = applications.filter(
        (a) => a.status === "applied" || a.status === "purchased"
    ).length;
    const pendingSubs = applications.filter(
        (a) => a.status === "uploaded" && a.approval_status === "pending"
    ).length;
    const pendingPayout = applications.filter(
        (a) => a.payout_status === "pending" && a.approval_status === "approved"
    ).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-heading font-semibold tracking-tight text-foreground">
                    Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Welcome back! Here&apos;s your overview.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {successMessage}
                </div>
            )}

            {/* Stat Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: "Active Drops",
                        value: activeDrops,
                        icon: Package,
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                    },
                    {
                        label: "Pending Submissions",
                        value: pendingSubs,
                        icon: Upload,
                        color: "text-purple-600",
                        bg: "bg-purple-50",
                    },
                    {
                        label: "Pending Payout",
                        value: pendingPayout,
                        icon: Wallet,
                        color: "text-amber-600",
                        bg: "bg-amber-50",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/[0.04] shadow-sm"
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                        >
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold tracking-tight text-foreground">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Drops (user's signed-up drops) */}
            {applications.length > 0 && (
                <section>
                    <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Your Active Drops
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applications.map((app) => {
                            const config = statusConfig[app.status] || statusConfig.applied;
                            const StatusIcon = config.icon;
                            const drop = app.drop as any;
                            const CampaignIcon = campaignIcons[drop?.campaign_type] || Package;

                            return (
                                <div
                                    key={app.id}
                                    className="p-5 rounded-2xl bg-white border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.03]">
                                                <CampaignIcon className="h-4 w-4 text-foreground/60" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {drop?.title || "Drop"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {drop?.brand?.full_name || "Brand"}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            className={`text-[10px] font-medium border ${config.color}`}
                                        >
                                            {config.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <a
                                            href={drop?.product_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View Product
                                        </a>
                                        <span>
                                            Applied{" "}
                                            {new Date(app.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>
                                    </div>

                                    {drop?.product_value && (
                                        <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center gap-1 text-xs text-muted-foreground">
                                            <span>Product Value:</span>
                                            <span className="font-semibold text-foreground">
                                                ₹{drop.product_value}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Live Drops (niche-filtered) */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                        Live Drops For You
                    </h2>
                </div>

                {liveDrops.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white border border-black/[0.04]">
                        <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">No new drops matching your niche right now.</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveDrops.map((drop) => {
                            const brand = drop.brand as any;
                            const CampaignIcon = campaignIcons[drop.campaign_type] || Package;

                            return (
                                <div
                                    key={drop.id}
                                    className="group p-5 rounded-2xl bg-white border border-black/[0.04] shadow-sm hover:shadow-md hover:border-black/[0.08] transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge className="text-[10px] font-medium bg-black/[0.04] text-foreground/60 border-transparent capitalize">
                                            {drop.campaign_type}
                                        </Badge>
                                        {drop.niche && drop.niche.length > 0 && (
                                            <div className="flex gap-1">
                                                {drop.niche.slice(0, 2).map((n) => (
                                                    <span
                                                        key={n}
                                                        className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium capitalize"
                                                    >
                                                        {n}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm font-semibold text-foreground mb-1">
                                        {drop.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                        {drop.description || `by ${brand?.full_name || "Brand"}`}
                                    </p>

                                    {/* Details */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                        <span>{drop.quantity} slots available</span>
                                        {drop.product_value && (
                                            <span className="font-semibold text-foreground">
                                                ₹{drop.product_value}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleApply(drop.id)}
                                            disabled={applyingDropId === drop.id}
                                            className="flex-1 h-9 text-xs bg-foreground text-white hover:bg-foreground/90 rounded-xl"
                                        >
                                            {applyingDropId === drop.id
                                                ? "Applying..."
                                                : "Apply Now"}
                                        </Button>
                                        <a
                                            href={drop.product_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                variant="outline"
                                                className="h-9 text-xs rounded-xl border-black/[0.06]"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
