"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Rocket,
    Plus,
    ExternalLink,
    Package,
    Video,
    Users,
    TrendingUp,
    LogOut,
    LayoutGrid,
    Eye,
} from "lucide-react";

// Mock data for demo
const mockDrops = [
    {
        id: "1",
        product_link: "https://amazon.in/dp/B0EXAMPLE1",
        quantity: 10,
        status: "active",
        created_at: "2026-02-15T10:30:00Z",
        applications_count: 5,
    },
    {
        id: "2",
        product_link: "https://amazon.in/dp/B0EXAMPLE2",
        quantity: 25,
        status: "active",
        created_at: "2026-02-12T08:15:00Z",
        applications_count: 12,
    },
    {
        id: "3",
        product_link: "https://amazon.in/dp/B0EXAMPLE3",
        quantity: 5,
        status: "closed",
        created_at: "2026-02-01T14:00:00Z",
        applications_count: 5,
    },
];

const templates = [
    { id: "1", name: "Unboxing", description: "Product unboxing experience with first impressions", icon: "📦" },
    { id: "2", name: "Review", description: "In-depth product review with pros and cons", icon: "⭐" },
    { id: "3", name: "Tutorial", description: "How-to guide showing the product in use", icon: "🎓" },
    { id: "4", name: "Comparison", description: "Side-by-side comparison with alternatives", icon: "⚖️" },
];

export default function BrandDashboard() {
    const [productLink, setProductLink] = useState("");
    const [quantity, setQuantity] = useState(10);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const handleCreateDrop = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("Demo: Drop created successfully!");
        setShowCreateForm(false);
        setProductLink("");
        setQuantity(10);
        setSelectedTemplate(null);
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
                            Brand Dashboard
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">brand@demo.com</span>
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
                        { icon: Package, label: "Active Drops", value: "2", color: "text-emerald-400" },
                        { icon: Users, label: "Total Applications", value: "22", color: "text-blue-400" },
                        { icon: Video, label: "Videos Received", value: "8", color: "text-purple-400" },
                        { icon: TrendingUp, label: "Completion Rate", value: "87%", color: "text-amber-400" },
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

                {/* Create Drop Section */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Drops</h2>
                        <Button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {showCreateForm ? "Cancel" : "New Drop"}
                        </Button>
                    </div>

                    {showCreateForm && (
                        <Card className="mb-6 animate-slide-up border-primary/20 bg-card/80">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LayoutGrid className="h-5 w-5 text-primary" />
                                    Create New Drop
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateDrop} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="product-link">Product Link (Amazon)</Label>
                                            <Input
                                                id="product-link"
                                                type="url"
                                                placeholder="https://amazon.in/dp/..."
                                                value={productLink}
                                                onChange={(e) => setProductLink(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Quantity (Units)</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min={1}
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Template Selection */}
                                    <div className="space-y-3">
                                        <Label>Video Template</Label>
                                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                            {templates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setSelectedTemplate(t.id)}
                                                    className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${selectedTemplate === t.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-border hover:border-primary/30"
                                                        }`}
                                                >
                                                    <div className="mb-2 text-2xl">{t.icon}</div>
                                                    <div className="text-sm font-semibold">{t.name}</div>
                                                    <div className="mt-1 text-xs text-muted-foreground">{t.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Launch Drop
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Drops Table */}
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Qty
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Applications
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Created
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {mockDrops.map((drop) => (
                                        <tr
                                            key={drop.id}
                                            className="transition hover:bg-muted/30"
                                        >
                                            <td className="px-6 py-4">
                                                <a
                                                    href={drop.product_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    {drop.product_link.split("/").pop()}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{drop.quantity}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="font-semibold text-primary">{drop.applications_count}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={drop.status === "active" ? "default" : "secondary"}
                                                    className={
                                                        drop.status === "active"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                            : "bg-muted text-muted-foreground"
                                                    }
                                                >
                                                    {drop.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(drop.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
