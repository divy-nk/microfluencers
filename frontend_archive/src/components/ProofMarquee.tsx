"use client";

import React, { useEffect, useState } from "react";
import MagneticVideoCard from "./MagneticVideoCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface ProofCard {
    id: string | number;
    videoSrc: string;
    retention: string;
    tag: string;
}

// Fallback Mock Data for the Marquee
const DEFAULT_CARDS: ProofCard[] = [
    {
        id: "fallback-1",
        videoSrc: "/product1.mp4",
        retention: "88.4",
        tag: "Problem/Solution",
    },
    {
        id: "fallback-2",
        videoSrc: "/product2.mp4",
        retention: "92.1",
        tag: "Product Demo",
    },
];

export default function ProofMarquee() {
    const [proofCards, setProofCards] = useState<ProofCard[]>(DEFAULT_CARDS);

    useEffect(() => {
        async function fetchVideos() {
            try {
                // Fetch from the custom table
                const { data, error } = await supabase
                    .from("custom_hook_videos")
                    .select("id, video_url, retention, tag")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false })
                    .limit(10);

                if (!error && data && data.length > 0) {
                    const fetchedCards = data.map((row) => ({
                        id: row.id,
                        videoSrc: row.video_url,
                        retention: row.retention,
                        tag: row.tag
                    }));

                    // We need enough copies for the infinite scroll to work seamlessly
                    // If we only have 2 cards, duplicate them to fill the marquee width
                    const repeatedCards = fetchedCards.length < 5
                        ? [...fetchedCards, ...fetchedCards, ...fetchedCards].slice(0, 5)
                        : fetchedCards;

                    setProofCards(repeatedCards);
                }
            } catch (err) {
                console.error("Error fetching custom hook videos:", err);
            }
        }

        fetchVideos();
    }, []);

    return (
        <div className="relative w-full overflow-hidden py-20 bg-black/50 backdrop-blur-sm border-y border-white/5">
            {/* Gradient Masks for smooth fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {/* Marquee Header */}
            <div className="text-center mb-12 relative z-10">
                <p className="text-sm font-mono text-white/40 uppercase tracking-widest mb-2">The Performance Vault</p>
                <h3 className="text-2xl md:text-3xl font-heading font-medium text-white/90">
                    Real Results. <span className="text-white/40">Real Revenue.</span>
                </h3>
            </div>

            {/* Infinite Scroll Container */}
            <div className="flex w-full">
                <motion.div
                    className="flex gap-8 px-4"
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ width: "max-content" }}
                >
                    {/* Duplicate list for seamless loop */}
                    {[...proofCards, ...proofCards].map((card, index) => (
                        <MagneticVideoCard
                            key={`${card.id}-${index}`}
                            videoSrc={card.videoSrc}
                            retention={card.retention}
                            tag={card.tag}
                            className="flex-shrink-0"
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
