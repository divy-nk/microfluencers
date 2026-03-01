"use client";

import { motion } from "framer-motion";
import { Package, Video, TrendingUp, CheckCircle2, Play } from "lucide-react";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function ProductSeedingModule() {
    return (
        <section className="relative w-full py-24 sm:py-32 bg-[#050505] overflow-hidden flex flex-col items-center border-t border-white/5">

            {/* Background Light Shedding - Monochrome Theme */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none flex justify-center">
                {/* Central Soft White Glow */}
                <div className="absolute top-[-100px] w-[800px] h-[500px] bg-white/[0.04] rounded-full blur-[100px] mix-blend-plus-lighter"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6 lg:px-8">

                {/* Module Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="text-center max-w-3xl mx-auto mb-20 sm:mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"></span>
                        Performance Hooks Model
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight text-white/90 mb-6 drop-shadow-sm">
                        Pay Influencers with just your products <br />
                        <span className="text-white/60">and get high-performance ads in return.</span>
                    </h2>
                    <p className="text-lg text-white/40 font-light leading-relaxed">
                        Get high quality videos and real feedback from our vetted creators for your online stores and social media. We manage everything end to end so you can focus on what matters the most - your business.
                    </p>
                </motion.div>

                {/* Section 1: The Brand Funnel & Section 2: Creator Loop (Bento Grid Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-24">

                    {/* Brand Funnel Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-900/20 to-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10 mb-12">
                            <Package className="w-8 h-8 text-white/80 mb-6" strokeWidth={1.5} />
                            <h3 className="text-2xl font-heading font-semibold text-white/90 mb-3">Brands: Create Campaigns & Ship</h3>
                            <p className="text-white/40 font-light leading-relaxed">
                                Seamlessly create drops, select performance-driven hooks, and attach your product link. Our automated platform tracks delivery and enforces content deadlines.
                            </p>
                        </div>

                        {/* Visual: Shipping to Screen Flow */}
                        <div className="relative z-10 w-full aspect-video bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 overflow-hidden">
                            <div className="relative w-20 h-20 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-white/40" strokeWidth={1.5} />
                                <motion.div
                                    animate={{ x: [0, 40, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-8"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/30"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </motion.div>
                            </div>

                            <div className="relative w-24 h-40 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.05] to-transparent"></div>
                                <Play className="w-8 h-8 text-white/60" strokeWidth={1.5} />
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                                    <div className="bg-white/90 text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                        70% Hook Ret.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Creator Loop Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-900/20 to-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10 mb-12">
                            <Video className="w-8 h-8 text-white/80 mb-6" strokeWidth={1.5} />
                            <h3 className="text-2xl font-heading font-semibold text-white/90 mb-3">Influencers: Claim, Film & Get Paid</h3>
                            <p className="text-white/40 font-light leading-relaxed">
                                Browse curated drops, order high-end D2C products for free, and shoot a video using the brand's chosen hook. Submit for verification and get reimbursed instantly.
                            </p>
                        </div>

                        {/* Visual: Curated Drop Feed */}
                        <div className="relative z-10 w-full aspect-video flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10"></div>

                            {/* Mock UI Cards */}
                            <div className="w-[85%] bg-[#111] border border-white/5 rounded-2xl p-4 mb-3 transform -rotate-2 opacity-50 blur-[1px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-white/5"></div>
                                    <div className="flex-1 space-y-2"><div className="w-1/2 h-2 bg-white/10 rounded"></div><div className="w-1/3 h-2 bg-white/5 rounded"></div></div>
                                </div>
                            </div>

                            <div className="w-[95%] bg-[#111] border border-white/10 rounded-2xl p-5 shadow-2xl z-20 hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <span className="font-bold text-white/70 text-xs">SKIN</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white/90 font-medium tracking-wide">Hydration Serum Drop</h4>
                                        <p className="text-white/40 text-xs mt-1">Value: ₹1,499</p>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-medium text-sm transition-colors border border-white/5">
                                    Apply with Intro Video
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>

                {/* Section 3: The 'How it Works' Steps */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-heading font-medium text-white/90 mb-4">The Sync</h3>
                        <p className="text-white/40 font-light text-sm">Three steps to scalable creative testing.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Step 1 */}
                        <motion.div variants={fadeIn} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white/70 font-mono text-lg mb-6 group-hover:bg-white/5 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10">01</span>
                            </div>
                            <h4 className="text-lg font-heading font-medium text-white/90 mb-3">Brands</h4>
                            <p className="text-white/40 font-light text-sm leading-relaxed">Create "drops", select "hooks" and add your product link.</p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div variants={fadeIn} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-white/70 font-mono text-lg mb-6 group-hover:bg-white/5 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative z-10">02</span>
                            </div>
                            <h4 className="text-lg font-heading font-medium text-white/90 mb-3">Influencers</h4>
                            <p className="text-white/40 font-light text-sm leading-relaxed">Claim drops, order products, shoot a video with the brand's hook, and submit for verification.</p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div variants={fadeIn} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/90 font-mono text-lg mb-6 shadow-[0_0_30px_rgba(255,255,255,0.04)]">
                                <CheckCircle2 className="w-5 h-5 opacity-80" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-heading font-medium text-white/90 mb-3 flex items-center justify-center gap-2">
                                Payout
                            </h4>
                            <p className="text-white/40 font-light text-sm leading-relaxed">Upon content verification, get reimbursed instantly and enjoy the product for free.</p>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
