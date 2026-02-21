"use client";

import { motion } from "framer-motion";
import { Package, TrendingUp, ShieldCheck, ArrowDown, Video, Target, Repeat, Truck, Zap, BarChart3 } from "lucide-react";
import Footer from "@/components/Footer";
import TabbedFeatures from "@/components/TabbedFeatures";
import BentoFeatures from "@/components/BentoFeatures";
import WaitlistModal from "@/components/WaitlistModal";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const brandsTabs = [
    {
        id: "barter",
        label: "Barter Drop",
        icon: Package,
        title: "Product for Content",
        description: "Ship your inventory to vetted micro-influencers. They create authentic video hooks. You get diverse creative assets for ad testing — zero cash fees required.",
        cta: "Create a barter drop",
        features: ["Direct-ship or quick-commerce delivery", "Multiple hook angles per SKU", "Perpetual usage rights included"],
        visual: {
            emoji: "📦",
            stat: "₹0",
            statLabel: "cash cost per video",
        }
    },
    {
        id: "performance",
        label: "Performance Challenge",
        icon: TrendingUp,
        title: "Cash for Views",
        description: "Pay creators based on actual unique views, not guesswork. Set a CPM rate and budget cap. Our engine tracks Instagram views in real-time and auto-distributes payouts.",
        cta: "Launch a challenge",
        features: ["Real-time Instagram view tracking", "Set your own CPM rate", "Auto-close when budget exhausted"],
        visual: {
            emoji: "📈",
            stat: "₹8",
            statLabel: "average CPM",
        }
    },
    {
        id: "boosted",
        label: "Boosted Drop",
        icon: Zap,
        title: "Product + Performance Bonus",
        description: "The best of both worlds. Send a product for a base video. If the creator's content exceeds a view threshold, an automatic cash bonus is triggered.",
        cta: "Create a boosted drop",
        features: ["Automatic bonus trigger on milestone", "Maximizes creator motivation", "Product + cash in one flow"],
        visual: {
            emoji: "🚀",
            stat: "78%",
            statLabel: "avg hook retention",
        }
    },
];

export default function BrandsPage() {
    // Waitlist modal handles CTA click

    return (
        <div className="min-h-screen bg-white text-foreground pt-32 flex flex-col items-center">

            {/* Subtle Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8">

                {/* ─── HERO ─── */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="text-center max-w-4xl mx-auto mb-16 mt-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/[0.06] bg-white shadow-sm text-xs font-medium text-foreground/50 tracking-wide mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Two-Speed Growth Engine
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] font-heading font-semibold tracking-tight mb-6 leading-[1.08]">
                        One Platform. <br className="hidden md:block" />
                        <span className="text-foreground/40">Three Ways to Scale.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        Choose how you engage creators. Ship products for high-quality UGC, pay per view for guaranteed reach, or combine both for maximum ROI.
                    </p>
                    <WaitlistModal>
                        <button
                            className="px-8 py-3.5 bg-foreground text-white rounded-full font-semibold text-sm transition-transform hover:scale-105 shadow-lg shadow-black/10 inline-flex items-center gap-2"
                        >
                            Start Your First Campaign
                            <ArrowDown className="w-4 h-4" />
                        </button>
                    </WaitlistModal>
                </motion.div>
            </div>

            {/* ─── CAMPAIGN MODELS (Now using TabbedFeatures) ─── */}
            <TabbedFeatures
                tabs={brandsTabs}
                title="Choose Your Campaign Model"
                subtitle="Each model solves a different challenge. Mix and match as you scale."
                badge="Campaign Models"
            />


            {/* ─── VALUE PROPS (Using BentoFeatures) ─── */}
            <BentoFeatures variant="brands" />

            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}
