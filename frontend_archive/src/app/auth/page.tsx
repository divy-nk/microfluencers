"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Lock, User, Building2, Video } from "lucide-react";

function AuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "signin";
    const defaultRole = searchParams.get("role") || "creator";

    // Redirect to home if on production
    if (process.env.NODE_ENV === "production") {
        router.push("/");
        return null;
    }

    // Map raw Supabase errors to user-friendly messages
    const getSafeErrorMessage = (err: any): string => {
        const msg = err?.message?.toLowerCase() || "";
        if (msg.includes("invalid login")) return "Invalid email or password.";
        if (msg.includes("email not confirmed")) return "Please check your email to confirm your account.";
        if (msg.includes("already registered")) return "An account with this email already exists.";
        if (msg.includes("rate limit")) return "Too many attempts. Please try again later.";
        if (msg.includes("weak password") || msg.includes("password")) return "Password is too weak. Use at least 8 characters.";
        return "Something went wrong. Please try again.";
    };

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
            setMessage(getSafeErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Strict Name Validation (Combat XSS / Invalid Input)
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(name) || name.trim().length < 2) {
            setMessage("Please enter a valid name (letters, spaces, hyphens only).");
            return;
        }

        // 2. Strict Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setMessage("Password must be ≥8 chars with uppercase, lowercase, number, and special character.");
            return;
        }

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
            setMessage(getSafeErrorMessage(err));
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
                    <Link href="/">
                        <Image
                            src="/logo-black.png"
                            alt="BrandKlip"
                            width={140}
                            height={32}
                            className="h-7 w-auto"
                        />
                    </Link>
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
                                                maxLength={100}
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
                                                maxLength={128}
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
                                                maxLength={100}
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
                                                maxLength={100}
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
                                                maxLength={128}
                                                minLength={8}
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
