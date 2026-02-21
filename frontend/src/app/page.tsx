"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import WaitlistForm from "@/components/WaitlistForm";
import WaitlistModal from "@/components/WaitlistModal";
import TabbedFeatures from "@/components/TabbedFeatures";
import ScrollFeatures from "@/components/ScrollFeatures";
import BentoFeatures from "@/components/BentoFeatures";
import Footer from "@/components/Footer";
import { ArrowDown, Package, TrendingUp, Zap } from "lucide-react";

// The data for the landing page tabs (extracted from the old TabbedFeatures)
const landingTabs = [
  {
    id: "barter",
    label: "Barter Drop",
    icon: Package,
    title: "Product for Content",
    description: "Creators buy your product on Amazon and shoot authentic videos following your brief. You only reimburse them after you approve the content. Zero inventory risk. Zero cash wasted on bad videos.",
    cta: "Join the Waitlist",
    features: ["No inventory shipped — creators buy on Amazon", "Multiple creative angles per SKU", "Perpetual usage rights"],
    visual: {
      emoji: "📦",
      stat: "₹0",
      statLabel: "inventory risk",
    }
  },
  {
    id: "performance",
    label: "Performance Challenge",
    icon: TrendingUp,
    title: "Cash for Views",
    description: "Pay creators based on actual unique views, not follower counts. Set a CPM rate and budget cap. Our engine tracks Instagram views in real-time and auto-distributes payouts.",
    cta: "Join the Waitlist",
    features: ["Real-time view tracking", "Set your own CPM rate", "Auto-close at budget cap"],
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
    description: "Send a product for a base video. If the creator's content crosses a view threshold, an automatic cash bonus kicks in. Maximum incentive for maximum effort.",
    cta: "Join the Waitlist",
    features: ["Auto bonus on milestone", "Maximises creator effort", "Product + cash in one flow"],
    visual: {
      emoji: "🚀",
      stat: "78%",
      statLabel: "avg retention",
    }
  },
];


export default function LandingPage() {
  // Waitlist scrolling previously handled here, now handled by context/modal

  return (
    <div className="min-h-screen bg-transparent flex flex-col selection:bg-black/10">

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO (Clean, taap.it-inspired, light)
      ═══════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] overflow-hidden px-6 pt-36 pb-24">

        {/* Subtle background gradient orbs (light version) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-emerald-200/15 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">

          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/[0.06] bg-white shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground/50 tracking-wide">Zero-risk UGC — live in India</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-heading font-semibold tracking-tight text-foreground mb-6 leading-[1.08]"
          >
            Where D2C Brands Meet <br className="hidden md:block" />
            <span className="text-foreground/40">Vetted Creators. Zero Risk.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-foreground/50 max-w-2xl mb-10 leading-relaxed font-light"
          >
            Brands get authentic UGC without shipping inventory or chasing creators. Creators get free products, clear briefs, and instant payouts. One platform. No DMs. No ghosting.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10"
          >
            <WaitlistModal>
              <button
                className="group px-8 py-3.5 bg-foreground text-white rounded-full font-semibold text-sm overflow-hidden transition-all hover:scale-105 shadow-lg shadow-black/10"
              >
                <span className="flex items-center justify-center gap-2">
                  Join the Waitlist
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </span>
              </button>
            </WaitlistModal>
            <span className="text-xs text-foreground/30 self-center">(it&apos;s free)</span>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {['1.jpg', '2.png', '3.png', '4.avif', '5.avif', '6.avif'].map((filename, index) => (
                <div key={index} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center overflow-hidden shadow-sm bg-gray-100">
                  <Image
                    src={`/${filename}`}
                    alt={`Creator ${index + 1}`}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/40">10,000+ creators already on the waitlist</p>
          </motion.div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — TABBED FEATURES ("One platform, three ways")
      ═══════════════════════════════════════════════════════ */}
      <TabbedFeatures
        tabs={landingTabs}
        title="One Platform. Three Ways to Get Content."
        subtitle="Pick your campaign model. Mix and match as you scale."
      />


      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — SCROLL-TRIGGERED FEATURE CARDS (⭐ hero feature)
      ═══════════════════════════════════════════════════════ */}
      <ScrollFeatures />


      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — BENTO ADVANTAGES GRID
      ═══════════════════════════════════════════════════════ */}
      <BentoFeatures />


      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — CONTACT / WAITLIST
      ═══════════════════════════════════════════════════════ */}
      <section id="waitlist" className="relative z-10 w-full px-6 py-32 bg-transparent flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>

        <div className="relative z-20 w-full max-w-md mx-auto p-8 rounded-3xl bg-gray-50/80 backdrop-blur-xl border border-black/[0.06] shadow-xl">
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
