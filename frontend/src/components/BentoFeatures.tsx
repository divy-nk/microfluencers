"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, UserPlus, Fingerprint, ShieldCheck, FileCheck, Instagram, Youtube, Twitter, Smartphone, ExternalLink, IndianRupee, Link, ShoppingBag, CreditCard, Package, User, ArrowRight, Video } from "lucide-react";
import WaitlistModal from "./WaitlistModal";

interface BentoFeaturesProps {
    variant?: 'main' | 'brands' | 'creators';
}

export default function BentoFeatures({ variant = 'main' }: BentoFeaturesProps) {
    const content = {
        main: {
            header: "Everyone has a good reason to choose brandklip",
            headerBtn: "Create an account",
            card1Title: <>All your assets,<br />in one place.</>,
            card2Stat: "×3",
            card2Label: <>average<br />conversion<br />rate</>,
            card3Title: "Get videos that actually convert.",
            card3Desc: "Stop paying for polished ads that get ignored. Our creators ship native, hook-first UGC.",
            card4Title: "Say goodbye to legal risks",
            card4Desc: "Automated ASCI compliance and perpetual licensing.",
            card5Title: "Instant UPI Payouts",
            card5Desc: "Creators get paid the second you approve their content.",
            card5VisualLabel: "Payment Sent",
            card5VisualValue: "24,500"
        },
        brands: {
            header: "The Brandklip Advantage",
            headerBtn: "Launch a campaign",
            card1Title: <>Hyper-Targeted<br />Matching.</>,
            card2Stat: "₹0",
            card2Label: <>get<br />video<br />for</>,
            card3Desc: "Integrate with Blinkit/Zepto for instant gratification shipping.",
            card4Title: "Customer → Creator",
            card4Desc: "Turn your satisfied customers into a perpetual content engine.",
            card5Title: "Real-Time Analytics",
            card5Desc: "Track views, CPM, engagement rates, and spend live.",
            card5VisualLabel: "Average CPM",
            card5VisualValue: "8.50"
        },
        creators: {
            header: "Why Creators Love Brandklip",
            headerBtn: "Join the Vault",
            card1Title: <>Inbound Drops<br />Only.</>,
            card2Stat: "0",
            card2Label: <>days waiting<br />for net-30<br />payouts</>,
            card3Desc: "Get crystal clear briefs. Brands tell you exactly what hook they need.",
            card4Title: "Premium D2C Products",
            card4Desc: "Keep the products forever. No returning, no strings attached.",
            card5Title: "Instant UPI Payouts",
            card5Desc: "The moment your video is approved, your payout hits your UPI.",
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
                            {/* Profile Header */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-50 border-4 border-white shadow-sm mb-3 overflow-hidden flex items-center justify-center">
                                <span className="text-xl font-bold tracking-tight text-slate-400">SR</span>
                            </div>
                            <h4 className="font-semibold text-base text-foreground mb-0.5">Sarah Reviews</h4>
                            <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wide">124k Followers</div>
                            <p className="text-[10px] text-slate-400 mb-5 uppercase tracking-widest font-bold">Beauty Creator</p>

                            {/* Video grid mockup */}
                            <div className="w-full flex gap-3 mt-auto">
                                <div className="flex-1 aspect-[9/16] bg-slate-200 rounded-xl overflow-hidden relative border border-white shadow-inner">
                                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-400 border border-white" />
                                </div>
                                <div className="flex-1 aspect-[9/16] bg-slate-200 rounded-xl overflow-hidden relative border border-white shadow-inner">
                                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-pink-400 border border-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- COLUMN 2 --- */}
                <div className="flex flex-col gap-6 md:h-[600px]">
                    {/* Card 2: 3x Conversion */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex items-center justify-center gap-6 h-[220px]"
                    >
                        <div className="text-slate-500 font-medium leading-[1.15] text-xl">
                            {content.card2Label}
                        </div>
                        <div className="text-7xl md:text-[6rem] -ml-2 font-bold tracking-tighter text-foreground leading-none">
                            {content.card2Stat}
                        </div>
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
                            <div className="flex justify-center items-center gap-6 w-full mt-6 scale-90 md:scale-100">
                                <div className="w-24 h-24 rounded-3xl bg-[#F8CB46] shadow-xl flex items-center justify-center border border-black/5 transform -rotate-12 transition-transform hover:rotate-0">
                                    <span className="font-extrabold text-[#1C1C1C] text-2xl tracking-tighter">blinkit</span>
                                </div>
                                <div className="w-24 h-24 rounded-3xl bg-[#370A6D] shadow-xl flex items-center justify-center border border-black/5 transform rotate-12 translate-y-2 transition-transform hover:rotate-0">
                                    <span className="font-bold text-white text-2xl tracking-tighter">zepto</span>
                                </div>
                            </div>
                        ) : content.card3Title === "Get videos that actually convert." ? (
                            <div className="w-full h-full flex flex-col pt-2 pb-0">
                                <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground tracking-tight leading-tight">{content.card3Title}</h3>

                                {/* Network Diagram */}
                                <div className="relative w-full h-[160px] bg-transparent mt-3 mb-2 flex items-center justify-center -ml-2">
                                    {/* Horizontal Lines */}
                                    <div className="absolute top-[35%] w-[45%] left-[27.5%] h-px bg-slate-200"></div>
                                    <div className="absolute top-[65%] w-[45%] left-[27.5%] h-px bg-slate-200"></div>

                                    {/* Vertical Lines */}
                                    <div className="absolute top-[25%] left-[27.5%] h-[10%] w-px bg-slate-200"></div>
                                    <div className="absolute top-[25%] left-1/2 h-[10%] w-px bg-slate-200"></div>
                                    <div className="absolute top-[25%] right-[27.5%] h-[10%] w-px bg-slate-200"></div>

                                    <div className="absolute top-[35%] left-1/2 h-[15%] w-px bg-slate-200"></div>
                                    <div className="absolute top-[50%] left-1/2 h-[15%] w-px bg-slate-200"></div>

                                    <div className="absolute top-[65%] left-[27.5%] h-[10%] w-px bg-slate-200"></div>
                                    <div className="absolute top-[65%] left-1/2 h-[10%] w-px bg-slate-200"></div>
                                    <div className="absolute top-[65%] right-[27.5%] h-[10%] w-px bg-slate-200"></div>

                                    {/* Top Nodes */}
                                    <div className="absolute top-[25%] left-[27.5%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-default">
                                        <Instagram className="w-4 h-4 text-pink-500" />
                                    </div>
                                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-default">
                                        <Youtube className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="absolute top-[25%] right-[27.5%] translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-default">
                                        <Link className="w-4 h-4 text-blue-500" />
                                    </div>

                                    {/* Center Node */}
                                    <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4.5rem] h-[4.5rem] bg-emerald-50/50 rounded-full border border-emerald-200 flex items-center justify-center z-10 shadow-sm transition-transform hover:scale-110 cursor-default">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Video className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    </div>

                                    {/* Bottom Nodes */}
                                    <div className="absolute top-[75%] left-[27.5%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-default">
                                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 text-xl transition-transform hover:scale-110 cursor-default">
                                        💳
                                    </div>
                                    <div className="absolute top-[75%] right-[27.5%] translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-black/[0.03] flex items-center justify-center z-10 text-xl transition-transform hover:scale-110 cursor-default">
                                        📦
                                    </div>
                                </div>
                            </div>
                        ) : content.card3Title ? (
                            <div className="w-full h-full flex flex-col pt-2 pb-0">
                                <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">{content.card3Title}</h3>

                                {/* Video Production Visual */}
                                <div className="relative w-full h-[200px] bg-slate-50/50 rounded-2xl border border-black/[0.04] mt-6 mb-6 flex items-center justify-center">
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
                        ) : (
                            <div className="flex justify-center gap-4 w-full mt-6">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center border border-black/[0.02]">
                                    <Target className="w-7 h-7 text-emerald-500" />
                                </div>
                                <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center border border-black/[0.02] -translate-y-4">
                                    <UserPlus className="w-7 h-7 text-blue-500" />
                                </div>
                                <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center border border-black/[0.02]">
                                    <Fingerprint className="w-7 h-7 text-purple-500" />
                                </div>
                            </div>
                        )}
                        {content.card3Title !== "Get videos that actually convert." && (
                            <>
                                {content.card3Title && (
                                    <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">{content.card3Title}</h3>
                                )}
                                <p className={`font-semibold text-foreground leading-snug text-center mt-auto px-2 ${content.card3Title ? 'text-[15px] font-normal text-slate-500 text-left px-0 pb-1' : 'text-lg'}`}>
                                    {content.card3Desc}
                                </p>
                            </>
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
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col h-[320px]"
                    >
                        <div className="mb-4 flex flex-col">
                            <h3 className="text-xl font-semibold mb-1 tracking-tight text-foreground">
                                {content.card4Title}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {content.card4Desc}
                            </p>
                        </div>

                        {content.card4Title === "Customer → Creator" ? (
                            <div className="flex items-center justify-center gap-4 mt-6 mb-8 flex-1 w-full bg-slate-50/50 rounded-3xl border border-black/[0.03]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                        <Instagram className="w-6 h-6 text-pink-500" />
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                        <Youtube className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center shadow-inner border border-white">
                                        <Video className="w-7 h-7 text-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        ) : content.card4Title === "Premium D2C Products" ? (
                            <div className="flex items-center justify-center gap-6 mt-8 mb-6 flex-1 w-full bg-slate-50/50 rounded-3xl border border-black/[0.03]">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center border border-black/5">
                                    <Package className="w-10 h-10 text-amber-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-6 mt-8 mb-6 flex-1 w-full relative">
                                <div className="absolute inset-x-8 inset-y-2 bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-3xl opacity-80 blur-lg"></div>
                                <div className="z-10 w-20 h-20 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center border border-black/5 -rotate-6 transition-transform hover:rotate-0">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div className="z-10 w-20 h-20 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center border border-black/5 rotate-6 transition-transform hover:rotate-0">
                                    <FileCheck className="w-10 h-10 text-indigo-500" />
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
