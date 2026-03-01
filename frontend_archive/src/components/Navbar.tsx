"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import WaitlistModal from "./WaitlistModal";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-xl rounded-full border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)] text-foreground transition-all hover:shadow-[0_4px_30px_rgba(0,0,0,0.06)]">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <Image
                        src="/logo-black.png"
                        alt="Brandklip Logo"
                        width={180}
                        height={40}
                        className="object-contain h-8 w-auto group-hover:opacity-80 transition-opacity"
                        priority
                    />
                    <span className="text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-80">
                        BrandKlip
                    </span>
                </Link>

                {/* Center Links — Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/brands" className={`text-sm font-medium transition-colors ${pathname === "/brands" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}>
                        For Brands
                    </Link>
                    <Link href="/creators" className={`text-sm font-medium transition-colors ${pathname === "/creators" ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}>
                        For Creators
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <WaitlistModal>
                        <Button size="default" className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-4 sm:px-5 font-semibold text-sm transition-transform hover:scale-105">
                            <span className="max-sm:hidden">Join the Waitlist</span>
                            <span className="sm:hidden">Join Today</span>
                        </Button>
                    </WaitlistModal>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[5.5rem] left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm md:hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-xl shadow-black/[0.06] p-4"
                    >
                        <Link
                            href="/brands"
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === "/brands" ? "bg-black/[0.04] text-foreground" : "text-foreground/60 hover:bg-black/[0.03]"}`}
                        >
                            For Brands
                        </Link>
                        <Link
                            href="/creators"
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === "/creators" ? "bg-black/[0.04] text-foreground" : "text-foreground/60 hover:bg-black/[0.03]"}`}
                        >
                            For Creators
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
