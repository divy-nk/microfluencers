"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, TrendingUp, Zap } from "lucide-react";

interface MagneticVideoCardProps {
    videoSrc: string;
    thumbnailSrc?: string; // Optional, can fall back to video poster or first frame
    retention: string;
    tag: string;
    className?: string; // For additional styling/positioning
}

export default function MagneticVideoCard({
    videoSrc,
    thumbnailSrc,
    retention,
    tag,
    className = "",
}: MagneticVideoCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Lazy load: only load the video src when the card is in the viewport
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { rootMargin: "200px" }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Play/pause on hover
    useEffect(() => {
        if (!videoRef.current || !isVisible) return;
        if (isHovered) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
        }
    }, [isHovered, isVisible]);

    // Magnetic Motion Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the magnetic effect
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    // Glow effect position checks
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Apply magnetic pull (capped at a certain distance for usability)
        // We divide by a factor (e.g., 5) to make the pull subtle, not 1:1
        x.set(distanceX / 5);
        y.set(distanceY / 5);

        // For the glow effect: relative coordinates 0-100%
        setCursorPos({
            x: e.clientX - left,
            y: e.clientY - top
        });
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative w-[280px] h-[420px] rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm overflow-hidden group cursor-pointer ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseX, y: mouseY }}
        >
            {/* 1. Video / Thumbnail Layer */}
            <div className="absolute inset-0 w-full h-full bg-black">
                <video
                    ref={videoRef}
                    src={isVisible ? videoSrc : undefined}
                    poster={thumbnailSrc}
                    loop
                    muted
                    playsInline
                    preload="none"
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? "opacity-100 scale-105" : "opacity-60 scale-100 grayscale-[50%]"
                        }`}
                />

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* 2. Glow Effect (Border Follow) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,255,255,0.1), transparent 40%)`
                }}
            />

            {/* 3. Content Layer */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end z-10 pointer-events-none">

                {/* Play Icon (Fades out on hover) */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-300 ${isHovered ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                    <Play className="w-5 h-5 text-white fill-white" />
                </div>

                {/* Hook Retention Percentage */}
                <motion.div
                    initial={{ y: 0, opacity: 0.8 }}
                    animate={{ y: isHovered ? -10 : 0, opacity: isHovered ? 1 : 0.8 }}
                    className="mb-1"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Hook Retention</span>
                        <span className="flex items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1 font-heading">
                        {retention}
                        <span className="text-sm font-normal text-white/40">%</span>
                    </div>
                </motion.div>

                {/* Performance Tag (Slides in) */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                    className="overflow-hidden"
                >
                    <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-500/20 border border-blue-500/30">
                            <Zap className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-white/90">{tag}</span>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
}
