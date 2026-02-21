"use client";

import { motion } from "framer-motion";
import { IndianRupee, ArrowDown, Shirt, Laptop, CopyCheck, Zap, Eye, TrendingUp, BarChart3 } from "lucide-react";
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

const creatorsTabs = [
    {
        id: "barter",
        label: "Barter Drop",
        icon: Shirt,
        title: "Keep Free Products",
        description: "Skincare, tech, apparel, fitness — browse curated drops, claim what you love. The brand ships it to your door. Make a killer video. Keep the product forever.",
        cta: "Browse barter drops",
        features: ["Premium D2C products delivered free", "Clear briefs, no endless revisions", "Keep the product forever"],
        visual: {
            emoji: "🎁",
            stat: "₹5k+",
            statLabel: "value of products",
        }
    },
    {
        id: "performance",
        label: "Performance Challenge",
        icon: Eye,
        title: "Get Paid Per View",
        description: "Create content, post it on Instagram, and earn direct cash based on your unique views. The more eyes, the bigger your payout. Tracked in real-time.",
        cta: "Join a challenge",
        features: ["Real-time Instagram view tracking", "Automated UPI payouts", "Earn up to ₹200 per 1k views"],
        visual: {
            emoji: "📈",
            stat: "₹15k",
            statLabel: "avg monthly payout",
        }
    },
    {
        id: "boosted",
        label: "Boosted Drop",
        icon: Zap,
        title: "Product + Cash Bonus",
        description: "Get a free product AND earn a cash bonus if your content goes viral. Hit the view threshold and the bonus is triggered automatically. Maximum reward for maximum effort.",
        cta: "Find boosted drops",
        features: ["Automatic bonus at milestone views", "Product + cash in one campaign", "Maximum reward for effort"],
        visual: {
            emoji: "🚀",
            stat: "100%",
            statLabel: "motivation",
        }
    },
];

export default function CreatorsPage() {
    // Waitlist modal handles CTA click

    return (
        <div className="min-h-screen bg-white text-foreground pt-32 flex flex-col items-center">

            {/* Subtle Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[120px]"></div>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Creator Earnings Hub
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-[4.25rem] font-heading font-semibold tracking-tight mb-6 leading-[1.08]">
                        Free Products. Real Cash. <br className="hidden md:block" />
                        <span className="text-foreground/40">Your Choice.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-foreground/50 font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        Browse premium D2C drops, claim products for free, and earn real money through performance views. Three ways to get rewarded — pick the one that fits your style.
                    </p>
                    <WaitlistModal>
                        <button
                            className="px-8 py-3.5 bg-foreground text-white rounded-full font-semibold text-sm transition-transform hover:scale-105 shadow-lg shadow-black/10 inline-flex items-center gap-2"
                        >
                            Join the Creator Vault
                            <ArrowDown className="w-4 h-4" />
                        </button>
                    </WaitlistModal>
                </motion.div>
            </div>

            {/* ─── THREE EARNING MODELS (Now using TabbedFeatures) ─── */}
            <TabbedFeatures
                tabs={creatorsTabs}
                title="Three Ways to Earn"
                subtitle="Pick your reward model. Or do all three."
                badge="Earning Models"
            />

            {/* ─── WHY CREATORS LOVE US (Using BentoFeatures) ─── */}
            <BentoFeatures variant="creators" />

            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}
