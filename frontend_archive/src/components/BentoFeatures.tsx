"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, UserPlus, Fingerprint, ShieldCheck, FileCheck, Instagram, Youtube, Twitter, Smartphone, ExternalLink, IndianRupee, Link, ShoppingBag, CreditCard, Package, User, ArrowRight, Video, Zap, Heart, MessageCircle, Play, Share2 } from "lucide-react";
import Image from "next/image";
import WaitlistModal from "./WaitlistModal";

interface BentoFeaturesProps {
    variant?: 'main' | 'brands' | 'creators';
}

const brandLogos = [
    { name: "Amazon", domain: "amazon.in" },
    { name: "Flipkart", domain: "flipkart.com" },
    { name: "Swiggy", domain: "swiggy.com" },
    { name: "Myntra", domain: "myntra.com" },
    { name: "Meesho", domain: "meesho.com" },
    { name: "Nykaa", domain: "nykaa.com" },
    { name: "Blinkit", domain: "blinkit.com" },
    { name: "Zepto", domain: "zeptonow.com" }
];

const brandRow1 = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];
const row2Brands = [...brandLogos].reverse();
const brandRow2 = [...row2Brands, ...row2Brands, ...row2Brands, ...row2Brands];

export default function BentoFeatures({ variant = 'main' }: BentoFeaturesProps) {
    const content = {
        main: {
            header: "Claim Exclusive Drops from Top D2C Brands",
            headerBtn: "Join the Waitlist",
            card1Title: <>All your assets,<br />in one place.</>,
            card2Stat: "×3",
            card2Label: <>average<br />conversion<br />rate</>,
            card3Title: "Videos That Sell. Not Just Look Pretty.",
            card3Desc: "Your customers trust real people, not studio ads. Our creators shoot authentic UGC that drives clicks and sales.",
            card4Title: "ASCI-Compliant. Legally Bulletproof.",
            card4Desc: "Automated ASCI compliance and perpetual licensing.",
            card5Title: "Instant UPI Payouts",
            card5Desc: "No net-30. No invoice chasing. Creators get reimbursed via UPI the second you verify the content.",
            card5VisualLabel: "Payment Sent",
            card5VisualValue: "24,500"
        },
        brands: {
            header: "Stop Chasing Creators. Start Scaling Content.",
            headerBtn: "Join the Brand Waitlist",
            card1Title: <>Hyper-Targeted<br />Matching.</>,
            card2Stat: "₹0",
            card2Label: <>get<br />video<br />for</>,
            card3Title: "Creator buys from your chosen platform",
            card3Desc: "All major stores supported.",
            card4Title: "Turn Customers Into Your Content Engine",
            card4Desc: "Your satisfied customers already love your product. Turn them into a perpetual UGC machine.",
            card5Title: "Real-Time Analytics",
            card5Desc: "Track views, CPM, engagement rates, and spend live. No spreadsheets. No guessing.",
            card5VisualLabel: "Average CPM",
            card5VisualValue: "8.50"
        },
        creators: {
            header: "Stop Sending DMs. Start Getting Paid.",
            headerBtn: "Apply for Early Access",
            card1Title: <>Inbound Drops<br />Only.</>,
            card2Stat: "0",
            card2Label: <>days waiting<br />for net-30<br />payouts</>,
            card3Title: "Brief-to-Payout",
            card3Desc: "No guesswork. Brands give you a clear brief. You shoot the video, submit it, and get fully reimbursed.",
            card4Title: "Keep Every Product. No Strings.",
            card4Desc: "Skincare, tech, apparel — it's yours permanently. No returns, no catch.",
            card5Title: "Instant UPI Payouts",
            card5Desc: "The moment your video is accepted, your payout hits your UPI. No waiting 30 days.",
            card5VisualLabel: "Recent Payout",
            card5VisualValue: "15,200"
        }
    }[variant];

    return (
        <section className="py-24 px-6 max-w-[1100px] mx-auto relative z-10">
            {/* Header section matching taap.it */}
            <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-4xl md:text-[2.75rem] font-heading font-semibold text-foreground mb-6 tracking-tight">
                    {content.header}
                </h2>
                <WaitlistModal>
                    <button className="px-6 py-3 bg-[#2A2A2A] text-white rounded-xl font-medium text-sm hover:bg-black transition-colors shadow-sm">
                        {content.headerBtn}
                    </button>
                </WaitlistModal>
            </div>

            {/* Masonry/Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">

                {/* --- COLUMN 1 --- */}
                <div className="flex flex-col gap-6 md:h-[600px]">
                    {/* Card 1: All your assets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2.5rem] p-8 pb-0 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col h-full overflow-hidden group"
                    >
                        <div className="text-center mb-10 pt-4">
                            <h3 className="text-2xl font-semibold text-foreground tracking-tight leading-snug">
                                {content.card1Title}
                            </h3>
                        </div>

                        {/* UI Mockup Visual */}
                        <div className="relative flex-1 w-[90%] mx-auto bg-slate-50/80 rounded-t-3xl border-x border-t border-black/[0.04] p-6 flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {variant === 'creators' ? (
                                <div className="w-full h-full flex flex-col gap-3 justify-center mb-8 mt-4">
                                    <div className="w-full bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.04] flex items-center gap-4 relative z-30">
                                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center border border-pink-200">
                                            <Package className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-foreground mb-0.5">Brand Drop</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Beauty Collab</div>
                                        </div>
                                        <div className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-bold uppercase tracking-wider">Accept</div>
                                    </div>
                                    <div className="w-full bg-white/90 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.04] flex items-center gap-4 relative z-20 -mt-2 scale-95 opacity-90">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                                            <Target className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-foreground mb-0.5">Campaign</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Skincare Mix</div>
                                        </div>
                                        <div className="px-2 py-1 rounded-md bg-transparent text-slate-400 border border-slate-200 text-[9px] font-bold uppercase tracking-wider">Review</div>
                                    </div>
                                    <div className="w-full bg-white/60 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-black/[0.04] flex items-center gap-4 relative z-10 -mt-2 scale-90 opacity-60">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
                                            <Zap className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-foreground mb-0.5">Boosted Hit</div>
                                            <div className="text-[10px] text-slate-400 font-medium">100k+ Views</div>
                                        </div>
                                        <div className="px-2 py-1 rounded-md bg-transparent text-slate-400 border border-slate-200 text-[9px] font-bold uppercase tracking-wider">Review</div>
                                    </div>
                                </div>
                            ) : variant === 'brands' ? (
                                <div className="w-full h-full flex flex-col gap-3 justify-center mb-8 mt-4">
                                    <div className="w-full bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-emerald-500/20 flex items-center gap-3 relative z-30 ring-1 ring-emerald-500/10">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold tracking-tight text-slate-400">SR</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-foreground truncate">Sarah Reviews</div>
                                            <div className="text-[9px] text-slate-400 font-medium truncate">98% Match Score</div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/90 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.04] flex items-center gap-3 relative z-20 -mt-2 scale-95 opacity-90">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold tracking-tight text-slate-400">JD</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-foreground truncate">John Does Beauty</div>
                                            <div className="text-[9px] text-slate-400 font-medium truncate">92% Match Score</div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/60 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-black/[0.04] flex items-center gap-3 relative z-10 -mt-2 scale-90 opacity-60">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold tracking-tight text-slate-400">MK</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-foreground truncate">Makeup By K</div>
                                            <div className="text-[9px] text-slate-400 font-medium truncate">85% Match Score</div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Profile Header */}
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-50 border-4 border-white shadow-sm mb-3 overflow-hidden flex items-center justify-center mt-2">
                                        <span className="text-xl font-bold tracking-tight text-slate-400">SR</span>
                                    </div>
                                    <h4 className="font-semibold text-base text-foreground mb-0.5">Sarah Reviews</h4>
                                    <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wide">124k Followers</div>
                                    <p className="text-[10px] text-slate-400 mb-5 uppercase tracking-widest font-bold">Beauty Creator</p>

                                    {/* Video grid mockup */}
                                    <div className="w-full flex gap-3 mt-auto">
                                        <div className="flex-1 aspect-[9/16] bg-slate-200 rounded-xl overflow-hidden relative border border-white shadow-inner">
                                            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-400 border border-white z-10 shadow-sm" />
                                            <Image src="/sarah-mockup/image.png" alt="Video Mockup 1" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 aspect-[9/16] bg-slate-200 rounded-xl overflow-hidden relative border border-white shadow-inner">
                                            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-pink-400 border border-white z-10 shadow-sm" />
                                            <Image src="/sarah-mockup/image copy.png" alt="Video Mockup 2" fill className="object-cover" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* --- COLUMN 2 --- */}
                <div className="flex flex-col gap-6 md:h-[600px]">
                    {/* Card 2: Stat/Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex items-center justify-center gap-6 h-[220px]"
                    >
                        {variant === 'brands' ? (
                            <>
                                <div className="text-slate-500 font-medium leading-[1.15] text-xl">
                                    {content.card2Label}
                                </div>
                                <div className="text-7xl md:text-[6rem] font-bold tracking-tighter text-foreground leading-none">
                                    {content.card2Stat}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-7xl md:text-[6rem] font-bold tracking-tighter text-foreground leading-none">
                                    {content.card2Stat}
                                </div>
                                <div className="text-slate-500 font-medium leading-[1.15] text-xl">
                                    {content.card2Label}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Card 3: Icons Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col items-center flex-1 justify-between overflow-hidden"
                    >
                        {variant === "brands" ? (
                            <div className="w-full h-full flex flex-col pt-2 pb-0">
                                <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">{content.card3Title}</h3>
                                <p className="text-[15px] font-normal text-slate-500 mb-6 leading-relaxed">
                                    {content.card3Desc}
                                </p>
                                <div className="relative w-full overflow-hidden mt-auto mb-2 select-none flex flex-col pt-1" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                                    <motion.div
                                        className="flex gap-4 w-max mb-4"
                                        animate={{ x: ["0%", "-50%"] }}
                                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                                    >
                                        {brandRow1.map((brand, i) => (
                                            <div key={i} className="w-14 h-14 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center shrink-0 overflow-hidden relative" title={brand.name}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`} alt={brand.name} className="w-7 h-7 object-contain mix-blend-multiply" />
                                            </div>
                                        ))}
                                    </motion.div>
                                    <motion.div
                                        className="flex gap-4 w-max"
                                        animate={{ x: ["-50%", "0%"] }}
                                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                                    >
                                        {brandRow2.map((brand, i) => (
                                            <div key={i} className="w-14 h-14 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center shrink-0 overflow-hidden relative" title={brand.name}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`} alt={brand.name} className="w-7 h-7 object-contain mix-blend-multiply" />
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        ) : variant === "main" ? (
                            <div className="w-full h-full flex flex-col pt-0 pb-0">
                                <div className="mb-2">
                                    <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground tracking-tight leading-snug">{content.card3Title}</h3>
                                    <p className="text-[13px] font-normal text-slate-500 leading-snug">
                                        {content.card3Desc}
                                    </p>
                                </div>

                                {/* Reel Visualization */}
                                <div className="relative w-full h-[150px] bg-transparent mt-auto flex items-center justify-center mb-0 scale-[0.8] md:scale-90 origin-bottom">
                                    {/* Phone/Reel Frame */}
                                    <div className="w-[85px] h-[140px] bg-slate-100 rounded-[1.25rem] border-[3px] border-white shadow-2xl relative overflow-hidden flex items-center justify-center">
                                        <Image src="/sarah-mockup/image copy 3.png" alt="Reel Mockup" fill className="object-cover z-0" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0"></div>
                                        <Play className="w-8 h-8 text-white fill-white/20 drop-shadow-md z-10" />

                                        {/* Simple Mock UGC Content */}
                                        <div className="absolute bottom-2 left-2 right-2 h-8 flex flex-col gap-1 z-10">
                                            <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                                            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                                        </div>

                                        {/* Social Icons Overlay */}
                                        <div className="absolute right-1.5 bottom-4 flex flex-col gap-2 z-10">
                                            <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                                <Heart className="w-2.5 h-2.5 text-white/80" />
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                                <MessageCircle className="w-2.5 h-2.5 text-white/80" />
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                                <Share2 className="w-2.5 h-2.5 text-white/80" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Side Floating Icons to denote distribution */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-40">
                                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100">
                                            <Instagram className="w-4 h-4 text-pink-500" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                                            <Youtube className="w-4 h-4 text-red-500" />
                                        </div>
                                    </div>

                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-40">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                            <Smartphone className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                            <ShoppingBag className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col pt-2 pb-0">
                                <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">{content.card3Title}</h3>
                                <p className="text-[15px] font-normal text-slate-500 mb-6 leading-relaxed">
                                    {content.card3Desc}
                                </p>

                                {/* Video Production Visual */}
                                <div className="relative w-full h-[200px] bg-slate-50/50 rounded-2xl border border-black/[0.04] mt-auto mb-6 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-black/5">
                                            <Video className="w-10 h-10 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5">
                                        <Instagram className="w-6 h-6 text-pink-500" />
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5">
                                        <Youtube className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5">
                                        <Smartphone className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5">
                                        <User className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </div>

                {/* --- COLUMN 3 --- */}
                <div className="flex flex-col gap-6 md:h-[600px]">
                    {/* Card 4: Legal / Icons Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col h-[280px]"
                    >
                        <div className="flex flex-col mb-2">
                            <h3 className="text-xl font-semibold mb-1 tracking-tight text-foreground">
                                {content.card4Title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-snug">
                                {content.card4Desc}
                            </p>
                        </div>

                        {content.card4Title === "Turn Customers Into Your Content Engine" ? (
                            <div className="flex items-center justify-center gap-3 mt-auto mb-2 flex-1 w-full bg-slate-50/50 rounded-3xl border border-black/[0.03] overflow-hidden scale-[0.85] md:scale-90 origin-bottom">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                        <Instagram className="w-6 h-6 text-pink-500" />
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                        <Youtube className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center shadow-inner border border-white">
                                        <Video className="w-7 h-7 text-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        ) : content.card4Title === "Keep Every Product. No Strings." ? (
                            <div className="flex items-center justify-center gap-6 mt-auto mb-2 flex-1 w-full bg-slate-50/50 rounded-3xl border border-black/[0.03] scale-90 origin-bottom">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                    <Package className="w-8 h-8 text-amber-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4 mt-auto mb-2 flex-1 w-full relative scale-90 origin-bottom">
                                <div className="absolute inset-x-8 inset-y-2 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-3xl opacity-80 blur-lg"></div>
                                <div className="z-10 w-16 h-16 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center border border-black/5 -rotate-6 transition-transform hover:rotate-0">
                                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="z-10 w-16 h-16 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center border border-black/5 rotate-6 transition-transform hover:rotate-0">
                                    <FileCheck className="w-8 h-8 text-indigo-500" />
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Card 5: Payouts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col flex-1"
                    >
                        <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">{content.card5Title}</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{content.card5Desc}</p>

                        <div className="mt-auto w-full bg-slate-50 rounded-2xl p-4 border border-black/[0.04]">
                            <div className="text-xs text-slate-400 font-medium tracking-wider mb-1 uppercase">{content.card5VisualLabel}</div>
                            <div className="text-2xl font-bold font-heading text-green-600 flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 stroke-[3]" />
                                {content.card5VisualValue}
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
