"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, TrendingUp, Instagram, Youtube, Link } from "lucide-react";

// Mock Data for the custom graphics
const mockProfileStats = [
    { label: "Posts", value: "342" },
    { label: "Followers", value: "114K" },
    { label: "Following", value: "24" }
];

const mockRecentVideos = [
    { id: 1, views: "12.4K", color: "bg-purple-100" },
    { id: 2, views: "8.1K", color: "bg-blue-100" },
    { id: 3, views: "45K", color: "bg-emerald-100" }
];

const cardVariants = {
    hiddenLeft: { opacity: 0, x: -60 },
    hiddenRight: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
    },
};

export default function ScrollFeatures() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const lineHeight = useTransform(smoothProgress, [0.1, 0.85], ["0%", "100%"]);

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 sm:py-32 overflow-hidden bg-transparent"
        >
            <div className="w-full max-w-5xl mx-auto px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-widest mb-4 border border-slate-200">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight text-foreground mb-4">
                        Everything you need,<br className="hidden sm:block" />
                        in one place.
                    </h2>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative">

                    {/* Vertical Line (center) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block z-0">
                        <div className="absolute inset-0 bg-black/[0.04]" />
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-green-500 origin-top shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    <div className="space-y-24 md:space-y-32 relative z-10">

                        {/* FEATURE 1: Vetted Creators (Left Card) */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between">
                            {/* Timeline Dot */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="hidden md:flex absolute flex items-center justify-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-200 z-20 shadow-sm"
                            />

                            <motion.div
                                initial="hiddenLeft"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                variants={cardVariants}
                                className="w-full md:w-[45%] bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col gap-6"
                            >
                                <h3 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                                    Only vetted creators. <br /> Zero guesswork.
                                </h3>

                                {/* High Fidelity Graphic: Phone Mockup */}
                                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-black/[0.04] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Mock Phone Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                            <span className="font-bold text-sm text-purple-700">SR</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="font-semibold text-sm">Sarah Reviews</div>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                                            </div>
                                            <div className="text-xs text-slate-500">Beauty & Skincare</div>
                                        </div>
                                    </div>

                                    {/* Mock Phone Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {mockProfileStats.map((stat, i) => (
                                            <div key={i} className="bg-white rounded-lg py-2 px-1 text-center border border-black/[0.03] shadow-sm">
                                                <div className="font-semibold text-sm">{stat.value}</div>
                                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock Phone Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {mockRecentVideos.map((video) => (
                                            <div key={video.id} className={`aspect-[3/4] ${video.color} rounded-lg relative overflow-hidden border border-black/[0.03]`}>
                                                <div className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[10px] font-medium text-black/70 bg-white/60 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                                                    <TrendingUp className="w-2.5 h-2.5" />
                                                    {video.views}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    We handpick creators by niche, engagement rate, and content style. Only the top 1% make it through our vetting pipeline so you never waste product on bad content.
                                </p>
                            </motion.div>
                            <div className="hidden md:block w-[45%]" /> {/* Spacer */}
                        </div>

                        {/* FEATURE 2: High Conversion Flowchart (Right Card) */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="hidden md:flex flex items-center justify-center absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-200 z-20 shadow-sm"
                            />

                            <div className="hidden md:block w-[45%]" /> {/* Spacer */}
                            <motion.div
                                initial="hiddenRight"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                variants={cardVariants}
                                className="w-full md:w-[45%] bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col gap-6"
                            >
                                <h3 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                                    Use links that <br /> actually convert.
                                </h3>

                                {/* High Fidelity Graphic: Flowchart/Diagram */}
                                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-black/[0.04] relative py-10 flex flex-col items-center justify-center">

                                    {/* Top Row (Inputs) */}
                                    <div className="flex gap-8 mb-6">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative translate-y-4">
                                            <Instagram className="w-4 h-4 text-pink-500" />
                                            <div className="absolute -bottom-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative z-10">
                                            <Youtube className="w-4 h-4 text-red-500" />
                                            <div className="absolute -bottom-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative translate-y-4">
                                            <Link className="w-4 h-4 text-blue-500" />
                                            <div className="absolute -bottom-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                        </div>
                                    </div>

                                    {/* Horizontal connector wire */}
                                    <div className="w-24 h-px bg-slate-300 mb-6 relative">
                                        <div className="absolute top-0 left-1/2 w-px h-6 bg-slate-300 -translate-x-1/2" />
                                    </div>

                                    {/* Central Router Node */}
                                    <div className="w-12 h-12 bg-green-50 rounded-full border border-green-200 flex items-center justify-center z-10 shadow-sm shadow-green-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    </div>

                                    {/* Bottom connector wire */}
                                    <div className="w-px h-6 bg-slate-300 relative">
                                        <div className="absolute bottom-0 left-1/2 w-48 h-px bg-slate-300 -translate-x-1/2" />
                                    </div>

                                    {/* Bottom Row (Outputs) */}
                                    <div className="flex gap-16 mt-6">
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative -translate-y-4">
                                            <div className="absolute -top-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                            <span className="text-xl">🛍️</span>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative z-10">
                                            <div className="absolute -top-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                            <span className="text-xl">💳</span>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-black/[0.04] flex items-center justify-center relative -translate-y-4">
                                            <div className="absolute -top-6 w-px h-6 bg-slate-300 left-1/2 -translate-x-1/2" />
                                            <span className="text-xl">📦</span>
                                        </div>
                                    </div>

                                </div>

                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    Stop losing users to internal browser blocks. Our deeplinks route traffic efficiently across social platforms directly to your checkout page.
                                </p>
                            </motion.div>
                        </div>

                        {/* FEATURE 3: Hook-First Videos (Left Card) */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="hidden md:flex absolute flex items-center justify-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-200 z-20 shadow-sm"
                            />

                            <motion.div
                                initial="hiddenLeft"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                variants={cardVariants}
                                className="w-full md:w-[45%] bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col gap-6"
                            >
                                <h3 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                                    Hook-first videos. <br /> Built for scale.
                                </h3>

                                {/* High Fidelity Graphic: Video Timeline */}
                                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-black/[0.04] relative">

                                    {/* Video Player Mockup */}
                                    <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden relative shadow-lg shadow-black/10 mb-6">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-60 mix-blend-overlay" />

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                                                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[12px] border-l-white ml-1" />
                                            </div>
                                        </div>

                                        {/* Retention Graph Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-4">
                                            <div className="w-full h-8 relative flex items-end gap-1">
                                                {/* Simulated retention curve */}
                                                {[95, 88, 85, 82, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52, 50, 48, 45, 42, 40].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: "0%" }}
                                                        whileInView={{ height: `${h}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                                        className={`flex-1 rounded-t-sm ${i < 4 ? 'bg-green-500' : 'bg-primary/60'}`}
                                                    />
                                                ))}
                                                <div className="absolute top-0 left-[20%] w-px h-full bg-white/50 border-r border-dashed border-white/50" />
                                                <div className="absolute -top-4 left-[20%] text-[8px] font-bold text-white bg-green-500 px-1 rounded -translate-x-1/2">HOOK</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-stats */}
                                    <div className="flex items-center justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="font-semibold">78%</span>
                                            <span className="text-slate-500 text-xs">Avg. Retention</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    Creators shoot using proven hook templates designed specifically for scroll-stopping performance. Stop burning budget on aesthetic videos that don't hold attention.
                                </p>
                            </motion.div>
                            <div className="hidden md:block w-[45%]" /> {/* Spacer */}
                        </div>

                        {/* FEATURE 4: Zero Upfront Cash (Right Card) */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="hidden md:flex absolute flex items-center justify-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-200 z-20 shadow-sm"
                            />

                            <div className="hidden md:block w-[45%]" /> {/* Spacer */}
                            <motion.div
                                initial="hiddenRight"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-80px" }}
                                variants={cardVariants}
                                className="w-full md:w-[45%] bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/[0.03] border border-black/[0.04] flex flex-col gap-6"
                            >
                                <h3 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
                                    Zero upfront cash. <br /> Pay only for results.
                                </h3>

                                {/* High Fidelity Graphic: Payout UI */}
                                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-black/[0.04] relative">

                                    <div className="max-w-[240px] mx-auto bg-white rounded-xl shadow-sm border border-black/[0.06] p-4 relative">
                                        {/* Floating Success Badge */}
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", delay: 0.4 }}
                                            className="absolute -right-3 -top-3 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </motion.div>

                                        <div className="text-center mb-4">
                                            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Total Payout</div>
                                            <div className="text-3xl font-heading font-bold text-black border-b border-black/[0.04] pb-4">
                                                ₹0.00
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">14 Videos Generated</span>
                                                <span className="font-semibold">₹0</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Creator Fees</span>
                                                <span className="font-semibold">₹0</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Product Value</span>
                                                <span className="font-medium text-slate-400">₹24,500</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    Run entirely on our product-only barter model to generate dozens of high-quality assets without spending a single rupee on creator fees or agency retainers.
                                </p>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
