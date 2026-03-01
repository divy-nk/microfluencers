"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

/** Only render the landing-page Navbar on public routes */
export default function NavbarWrapper() {
    const pathname = usePathname();

    // Hide navbar on dashboard and auth routes (these have their own nav)
    const hideOnRoutes = ["/creator", "/brand", "/auth", "/onboarding"];
    const shouldHide = hideOnRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (shouldHide) return null;
    return <Navbar />;
}
