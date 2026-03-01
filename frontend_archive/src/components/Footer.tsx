import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-foreground text-white px-6 pt-20 pb-6 overflow-hidden">
            {/* 1. Top Section: Columns */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24 md:mb-40">

                {/* Column 1: Contact */}
                <div className="flex flex-col space-y-8">
                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">Contact</h4>
                    <div className="flex flex-col space-y-2">
                        <a href="mailto:hello@brandklip.com" className="text-lg md:text-xl font-medium hover:text-white/70 transition-colors">
                            hello@brandklip.com
                        </a>
                        <Link href="#waitlist" className="text-lg md:text-xl font-medium hover:text-white/70 transition-colors">
                            Join the Waitlist
                        </Link>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                            BrandKlip connects D2C brands with vetted creators. They buy your product on Amazon and shoot the video—payouts are released automatically upon content verification.
                        </p>
                    </div>
                </div>

                {/* Column 2: Connect */}
                <div className="flex flex-col space-y-8 md:border-l border-white/10 md:pl-12">
                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">Connect</h4>
                    <div className="flex flex-col space-y-2">
                        <a href="https://www.instagram.com/usebrandklip" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg md:text-xl font-medium hover:text-white/70 transition-colors group">
                            Instagram <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a href="https://www.linkedin.com/company/brandklip/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg md:text-xl font-medium hover:text-white/70 transition-colors group">
                            LinkedIn <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <a href="https://x.com/brandklip" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg md:text-xl font-medium hover:text-white/70 transition-colors group">
                            Twitter <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

                {/* Column 3: Newsletter */}
                <div className="flex flex-col space-y-8 md:border-l border-white/10 md:pl-12">
                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">Newsletter</h4>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-transparent border-b border-white/20 pb-4 text-xl placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="absolute right-0 bottom-4 text-white hover:text-white/70 transition-colors">
                            →
                        </button>
                    </div>
                </div>

            </div>

            {/* 2. Massive Typography Brand Name */}
            <div className="relative border-t border-white/10 pt-4">
                <span className="text-[12vw] md:text-[14vw] leading-[0.8] font-heading font-semibold tracking-tighter text-center select-none text-white pointer-events-none block" aria-hidden="true">
                    BRANDKLIP
                </span>
            </div>

            {/* 3. Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-white/5 text-xs text-white/30 font-mono">
                <div>
                    © {new Date().getFullYear()} BRANDKLIP
                </div>
                <div className="flex gap-8">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
