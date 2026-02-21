"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import WaitlistModal from "./WaitlistModal";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-xl rounded-full border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)] text-foreground transition-all hover:shadow-[0_4px_30px_rgba(0,0,0,0.06)]">

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

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
                <Link href="/brands" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
                    For Brands
                </Link>
                <Link href="/creators" className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
                    For Creators
                </Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
                <WaitlistModal>
                    <Button size="default" className="bg-foreground text-white hover:bg-foreground/90 rounded-full px-5 font-semibold text-sm transition-transform hover:scale-105">
                        Join the Waitlist
                    </Button>
                </WaitlistModal>
            </div>
        </nav>
    );
}
