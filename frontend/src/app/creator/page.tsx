"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Rocket,
    ExternalLink,
    Upload,
    Package,
    Video,
    DollarSign,
    CheckCircle2,
    Clock,
    LogOut,
    Send,
    ShoppingCart,
} from "lucide-react";

// Mock data
const mockAvailableDrops = [
    {
        id: "d1",
        product_link: "https://amazon.in/dp/B0WIRELESS",
        quantity: 10,
        brand_name: "TechGear Co.",
        template: "Unboxing",
        created_at: "2026-02-17T10:30:00Z",
    },
    {
        id: "d2",
        product_link: "https://amazon.in/dp/B0SKINCARE",
        quantity: 20,
        brand_name: "GlowUp Beauty",
        template: "Review",
        created_at: "2026-02-16T08:15:00Z",
    },
    {
        id: "d3",
        product_link: "https://amazon.in/dp/B0FITNESS",
        quantity: 15,
        brand_name: "FitLife",
        template: "Tutorial",
        created_at: "2026-02-14T14:00:00Z",
    },
];

const mockApplications = [
    {
        id: "a1",
        drop_id: "d1",
        product_link: "https://amazon.in/dp/B0WIRELESS",
        brand_name: "TechGear Co.",
        status: "applied",
        created_at: "2026-02-17T12:00:00Z",
    },
    {
        id: "a2",
        drop_id: "d2",
        product_link: "https://amazon.in/dp/B0SKINCARE",
        brand_name: "GlowUp Beauty",
        status: "uploaded",
        created_at: "2026-02-16T10:00:00Z",
    },
    {
        id: "a3",
        drop_id: "d3",
        product_link: "https://amazon.in/dp/B0FITNESS",
        brand_name: "FitLife",
        status: "approved",
        created_at: "2026-02-15T09:00:00Z",
    },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    applied: { color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: Clock, label: "Applied" },
    purchased: { color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: ShoppingCart, label: "Purchased" },
    uploaded: { color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: Upload, label: "Uploaded" },
    approved: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2, label: "Approved" },
    paid: { color: "text-green-400 bg-green-500/10 border-green-500/30", icon: DollarSign, label: "Paid" },
};

export default function CreatorDashboard() {
    const [activeTab, setActiveTab] = useState("browse");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState("");
    const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);

    const handleApply = (dropId: string) => {
        setMessage(`Demo: Applied to drop ${dropId} successfully!`);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleSubmit = (appId: string) => {
        setMessage(`Demo: Submitted order ID and video for application ${appId}!`);
        setUploadingAppId(null);
        setOrderId("");
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Nav */}
            <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Rocket className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">
                                Micro<span className="text-gradient">fluencers</span>
                            </span>
                        </Link>
                        <Separator orientation="vertical" className="h-6" />
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Creator Dashboard
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">creator@demo.com</span>
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Stats Row */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Send, label: "Applications", value: "3", color: "text-blue-400" },
                        { icon: Video, label: "Videos Uploaded", value: "1", color: "text-purple-400" },
                        { icon: CheckCircle2, label: "Approved", value: "1", color: "text-emerald-400" },
                        { icon: DollarSign, label: "Total Earned", value: "₹2,499", color: "text-amber-400" },
                    ].map((stat) => (
                        <Card key={stat.label} className="border-border/50 bg-card/50">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Success message */}
                {message && (
                    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary animate-fade-in">
                        {message}
                    </div>
                )}

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="browse">
                            <Package className="mr-2 h-4 w-4" />
                            Browse Drops
                        </TabsTrigger>
                        <TabsTrigger value="applications">
                            <Send className="mr-2 h-4 w-4" />
                            My Applications
                        </TabsTrigger>
                    </TabsList>

                    {/* Browse Drops */}
                    <TabsContent value="browse">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mockAvailableDrops.map((drop) => (
                                <Card
                                    key={drop.id}
                                    className="group border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-primary/10 text-primary">{drop.template}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(drop.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="mt-3 text-lg">{drop.brand_name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <a
                                            href={drop.product_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mb-4 flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View Product
                                        </a>

                                        <div className="mb-4 flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Available slots</span>
                                            <span className="font-semibold">{drop.quantity}</span>
                                        </div>

                                        <Button
                                            onClick={() => handleApply(drop.id)}
                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            Apply Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* My Applications */}
                    <TabsContent value="applications">
                        <div className="space-y-4">
                            {mockApplications.map((app) => {
                                const config = statusConfig[app.status] || statusConfig.applied;
                                const StatusIcon = config.icon;

                                return (
                                    <Card key={app.id} className="border-border/50 bg-card/50">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                                                        <StatusIcon className={`h-5 w-5 ${config.color.split(" ")[0]}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{app.brand_name}</h3>
                                                        <a
                                                            href={app.product_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            View Product
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={config.color}>{config.label}</Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Upload section for applied apps */}
                                            {app.status === "applied" && (
                                                <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                                                    {uploadingAppId === app.id ? (
                                                        <div className="space-y-4 animate-fade-in">
                                                            <div className="space-y-2">
                                                                <Label htmlFor={`order-${app.id}`}>Order ID</Label>
                                                                <Input
                                                                    id={`order-${app.id}`}
                                                                    placeholder="Enter your Amazon order ID"
                                                                    value={orderId}
                                                                    onChange={(e) => setOrderId(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Upload Video</Label>
                                                                <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-border transition hover:border-primary/30">
                                                                    <div className="text-center">
                                                                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                                                                        <span className="mt-1 block text-xs text-muted-foreground">
                                                                            Click or drag to upload
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() => handleSubmit(app.id)}
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                                    size="sm"
                                                                >
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    Submit
                                                                </Button>
                                                                <Button
                                                                    onClick={() => setUploadingAppId(null)}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-muted-foreground">
                                                                Purchase the product and submit your order details + video.
                                                            </p>
                                                            <Button
                                                                onClick={() => setUploadingAppId(app.id)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-primary/30 hover:bg-primary/10"
                                                            >
                                                                <Upload className="mr-2 h-4 w-4" />
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
