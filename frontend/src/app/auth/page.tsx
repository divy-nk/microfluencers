"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, ArrowLeft, Mail, Lock, User, Building2, Video } from "lucide-react";

function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
    const defaultRole = searchParams.get("role") || "creator";

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [role, setRole] = useState<"brand" | "creator">(defaultRole as "brand" | "creator");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            // Fetch profile to see role
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user?.id)
                .single();

            if (profile?.role === "brand") {
                router.push("/brand");
            } else {
                router.push("/creator");
            }
        } catch (err: any) {
            setMessage(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role,
                    }
                }
            });
            if (error) throw error;

            if (role === "creator") {
                router.push("/onboarding/creator");
            } else {
                router.push("/brand");
            }
        } catch (err: any) {
            setMessage(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background" />

            <div className="relative z-10 w-full max-w-md">
                {/* Back to home */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                {/* Logo */}
                <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary animate-glow">
                        <Rocket className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Micro<span className="text-gradient">fluencers</span>
                    </span>
                </div>

                <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {activeTab === "signin" ? "Welcome back" : "Create an account"}
                        </CardTitle>
                        <CardDescription>
                            {activeTab === "signin"
                                ? "Sign in to your account to continue"
                                : "Join the product-for-content revolution"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signin-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signin-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        disabled={loading}
                                    >
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    {/* Role picker */}
                                    <div className="space-y-2">
                                        <Label>I am a</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setRole("brand")}
                                                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${role === "brand"
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/30"
                                                    }`}
                                            >
                                                <Building2 className="h-6 w-6" />
                                                <span className="text-sm font-medium">Brand</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRole("creator")}
                                                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${role === "creator"
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/30"
                                                    }`}
                                            >
                                                <Video className="h-6 w-6" />
                                                <span className="text-sm font-medium">Creator</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">
                                            {role === "brand" ? "Brand Name" : "Full Name"}
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-name"
                                                type="text"
                                                placeholder={role === "brand" ? "Your Brand" : "John Doe"}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating account..." : `Sign Up as ${role === "brand" ? "Brand" : "Creator"}`}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        {message && (
                            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                                {message}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
