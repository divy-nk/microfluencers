import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/auth", "/onboarding/", "/brand", "/creator"],
        },
        sitemap: "https://www.brandklip.com/sitemap.xml",
    };
}
