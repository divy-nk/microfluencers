"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WaitlistModal from "./WaitlistModal";

export type TabData = {
    id: string;
    label: string;
    icon: React.ElementType;
    title: string;
    description: string;
    cta: string;
    features: string[];
    visual: {
        emoji: React.ReactNode;
        stat: string;
        statLabel: string;
    };
};

interface TabbedFeaturesProps {
    tabs: TabData[];
    title: string;
    subtitle: string;
    badge?: string;
}

export default function TabbedFeatures({ tabs, title, subtitle, badge }: TabbedFeaturesProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const activeTab = tabs[activeIndex].id;
    const activeData = tabs[activeIndex];

    const handleTabChange = (index: number) => {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction * 50,
            opacity: 0,
            filter: "blur(4px)"
        }),
        center: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        exit: (direction: number) => ({
            x: direction * -50,
            opacity: 0,
            filter: "blur(4px)"
        })
    };

    return (
        <section className="relative w-full py-24 sm:py-32 bg-transparent overflow-hidden">
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    {badge && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-widest mb-4 border border-slate-200">
                            {badge}
                        </span>
                    )}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold tracking-tight text-foreground mb-4">
                        {title}
                    </h2>
                    <p className="text-foreground/50 text-lg font-light max-w-xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Tab Selector with Sliding Pill Micro-interaction */}
                <div className="flex justify-center mb-12">
                    <div className="relative inline-flex items-center bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5 gap-1 border border-black/[0.04]">
                        {tabs.map((tab, index) => {
                            const isActive = activeIndex === index;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(index)}
                                    className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/50 hover:text-foreground/80"
                                        }`}
                                >
                                    {/* The text and icon */}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </span>

                                    {/* The animated sliding background pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBackground"
                                            className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/[0.04]"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                bounce: 0,
                                                duration: 0.3,
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="relative">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                filter: { duration: 0.3 }
                            }}
                            className="bg-white rounded-[2.5rem] border border-black/[0.04] p-8 md:p-12 shadow-sm shadow-black/[0.02] relative overflow-hidden group"
                        >
                            {/* Subtle background glow that changes based on active tab to break up the gray */}
                            <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-slate-200/50 rounded-full blur-[80px] group-hover:bg-slate-300/50 transition-colors duration-700 pointer-events-none" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                                {/* Left: Text Content */}
                                <div>
                                    <h3 className="text-3xl font-heading font-semibold text-foreground mb-4">
                                        {activeData.title}
                                    </h3>
                                    <p className="text-foreground/60 font-light leading-relaxed mb-8 text-[15px]">
                                        {activeData.description}
                                    </p>

                                    <ul className="space-y-3 mb-10">
                                        {activeData.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-foreground/70 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <WaitlistModal>
                                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-lg shadow-black/10">
                                            {activeData.cta}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </WaitlistModal>
                                </div>

                                {/* Right: Premium Visual Card (taap.it style) */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="relative w-72 h-80 bg-white rounded-3xl border border-black/[0.04] shadow-sm shadow-black/[0.02] p-8 flex flex-col items-center justify-center text-center overflow-hidden hover:shadow-md transition-shadow duration-500">

                                        {/* Super subtle inner gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/0 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col items-center">
                                            {/* Emoji/Icon container with soft shadow */}
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-black/[0.04] shadow-sm flex items-center justify-center text-3xl mb-6">
                                                {activeData.visual.emoji}
                                            </div>

                                            <span className="text-5xl font-heading font-bold text-foreground tracking-tight mb-2">
                                                {activeData.visual.stat}
                                            </span>

                                            <span className="text-xs text-foreground/40 font-semibold tracking-widest uppercase mt-2">
                                                {activeData.visual.statLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
