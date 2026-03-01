"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Rocket,
    Video,
    Upload,
    Instagram,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Camera,
    Play,
    X,
    Smartphone,
    MapPin,
    Sparkles,
    Search,
    Clock
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// --- Components ---

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
    return (
        <div className="mb-8 flex items-center justify-between px-2">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${currentStep === step
                            ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : currentStep > step
                                ? "border-primary bg-primary/20 text-primary"
                                : "border-border bg-muted/50 text-muted-foreground"
                            }`}
                    >
                        {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                    </div>
                    <span className={`hidden text-sm font-medium sm:block ${currentStep === step ? "text-foreground" : "text-muted-foreground"}`}>
                        {step === 1 ? "The Intro" : step === 2 ? "The Proof" : "Waiting Room"}
                    </span>
                    {step < 3 && <div className="mx-2 h-[2px] w-8 bg-border sm:w-16" />}
                </div>
            ))}
        </div>
    );
};

// --- Step 1: The Intro ---
const IntroStep = ({ onNext }: { onNext: (data: any) => void }) => {
    const [video, setVideo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <Badge variant="secondary" className="mb-2 border-primary/20 bg-primary/10 text-primary">
                    Step 1: The Elevator Pitch
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight">Show us your personality</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    "Tell us your name, your primary niche, and one brand you’d die to work with. Keep it high energy!" (20s)
                </p>
            </div>

            <div className="relative mx-auto aspect-[9/16] max-w-[280px] overflow-hidden rounded-3xl border-4 border-border bg-muted/30 shadow-2xl">
                {/* Viewfinder overlay */}
                <div className="absolute inset-4 z-10 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none" />

                {preview ? (
                    <div className="relative h-full w-full">
                        <video src={preview} controls className="h-full w-full object-cover" />
                        <button
                            onClick={() => { setVideo(null); setPreview(null); }}
                            className="absolute top-2 right-2 z-20 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
                            <Camera className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium">No video recorded yet</p>
                        <p className="mt-1 text-xs text-muted-foreground italic">Brands love bright, clear faces!</p>

                        <div className="mt-8 grid w-full gap-3">
                            <Label className="cursor-pointer">
                                <Input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                                    <Upload className="h-4 w-4" /> Upload Video
                                </div>
                            </Label>
                            <Button variant="outline" className="rounded-xl border-primary/30 hover:bg-primary/5">
                                <Play className="mr-2 h-4 w-4" /> Record (Demo)
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    disabled={!video || isUploading}
                    onClick={() => onNext({ video })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    {isUploading ? "Processing..." : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// --- Step 2: The Proof ---
const ProofStep = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
    const [topVideoUrl, setTopVideoUrl] = useState("");
    const [instaLink, setInstaLink] = useState("");
    const [views, setViews] = useState("");
    const [engagement, setEngagement] = useState("");
    const [niche, setNiche] = useState<string[]>([]);
    const [location, setLocation] = useState("");
    const [device, setDevice] = useState("");

    const niches = ["Skincare", "Fintech", "Pet-care", "Fashion", "Tech", "Lifestyle", "Gaming"];

    const toggleNiche = (n: string) => {
        if (niche.includes(n)) setNiche(niche.filter(i => i !== n));
        else if (niche.length < 2) setNiche([...niche, n]);
    };

    const isFormValid = topVideoUrl && instaLink && niche.length > 0 && location && device;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <Badge variant="secondary" className="mb-2 border-primary/20 bg-primary/10 text-primary">
                    Step 2: The Proof
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight">Show us your clout</h2>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                    What's your best work? Why did it go viral?
                    We'll fetch your analytics from your Instagram profile.
                </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <div className="space-y-2">
                    <Label htmlFor="top-video">Link to your best-performing video</Label>
                    <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="top-video"
                            placeholder="Instagram, TikTok, or YouTube link"
                            className="pl-10"
                            value={topVideoUrl}
                            onChange={(e) => setTopVideoUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="insta-link">Instagram Profile Link</Label>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="insta-link"
                            placeholder="https://instagram.com/yourusername"
                            className="pl-10"
                            value={instaLink}
                            onChange={(e) => setInstaLink(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="views">Approx. View Count</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="views"
                                placeholder="e.g. 50k"
                                className="pl-10"
                                value={views}
                                onChange={(e) => setViews(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="engagement">Engagement Rate (%)</Label>
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="engagement"
                                placeholder="e.g. 5%"
                                className="pl-10"
                                value={engagement}
                                onChange={(e) => setEngagement(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-6 bg-white/5" />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select your niche (Max 2)</Label>
                        <div className="flex flex-wrap gap-2">
                            {niches.map(n => (
                                <button
                                    key={n}
                                    onClick={() => toggleNiche(n)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${niche.includes(n)
                                        ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                        : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    placeholder="e.g. Bangalore, India"
                                    className="pl-10"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="device">Primary Device</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="device"
                                    placeholder="e.g. iPhone 15 Pro"
                                    className="pl-10"
                                    value={device}
                                    onChange={(e) => setDevice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
                <Button variant="ghost" onClick={onBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                    disabled={!isFormValid}
                    onClick={() => onNext({ topVideoUrl, instaLink, views, engagement, niche, location, device })}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                    Submit Application <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// --- Step 3: Waiting Room ---
const WaitingRoom = () => {
    return (
        <div className="space-y-8 py-10 text-center animate-fade-in">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">The Lab is Vetting</h2>
                <p className="mx-auto max-w-sm text-muted-foreground">
                    Our curators are reviewing your vibe. You’ll be notified on <span className="text-emerald-400 font-semibold">WhatsApp</span> when your first Drop is ready.
                </p>
            </div>

            <Card className="mx-auto max-w-sm border-white/5 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-left">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Current Wait Time</p>
                            <p className="text-xs text-muted-foreground">Est. 12-24 hours for review</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="pt-4">
                <Link href="/">
                    <Button variant="outline" className="rounded-xl border-primary/30 hover:bg-primary/5">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

// --- Page Main ---
export default function CreatorOnboarding() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nextStep = async (data: any) => {
        const updatedData = { ...formData, ...data };
        setFormData(updatedData);

        if (step === 2) {
            await handleSubmit(updatedData);
        } else {
            setStep(step + 1);
        }
    };

    const handleSubmit = async (finalData: any) => {
        setSubmitting(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // 1. Upload Intro Video
            const introFile = finalData.video;
            const introExt = introFile.name.split('.').pop();
            const introPath = `${user.id}/intro_${Date.now()}.${introExt}`;

            const { error: introError } = await supabase.storage
                .from('creator-onboarding')
                .upload(introPath, introFile);

            if (introError) throw introError;
            const { data: { publicUrl: introUrl } } = supabase.storage
                .from('creator-onboarding')
                .getPublicUrl(introPath);

            // 2. Submit to DB
            const { error: dbError } = await supabase
                .from('onboarding_submissions')
                .insert({
                    creator_id: user.id,
                    intro_video_url: introUrl,
                    top_video_url: finalData.topVideoUrl,
                    insta_link: finalData.instaLink,
                    views_count: finalData.views,
                    engagement_rate: finalData.engagement,
                    viral_reasoning: finalData.viral_reasoning || "",
                    niche_tags: finalData.niche,
                    location: finalData.location,
                    device_info: finalData.device,
                    status: 'pending'
                });

            if (dbError) throw dbError;
            setStep(3);
        } catch (err: any) {
            console.error("Submission failed:", err);
            setError(err.message || "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar Minimal */}
            <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Rocket className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Micro<span className="text-gradient">fluencers</span>
                        </span>
                    </Link>
                    <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                        The Talent Filter
                    </Badge>
                </div>
            </nav>

            <main className="mx-auto max-w-2xl px-6 py-12">
                <ProgressIndicator currentStep={step} />

                <Card className="border-border/50 bg-card/50 shadow-2xl overflow-hidden">
                    <CardContent className="p-8">
                        {error && (
                            <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                                {error}
                            </div>
                        )}
                        {step === 1 && <IntroStep onNext={nextStep} />}
                        {step === 2 && <ProofStep onNext={nextStep} onBack={prevStep} />}
                        {step === 3 && <WaitingRoom />}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
