import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import NavbarWrapper from "@/components/NavbarWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrandKlip — Where D2C Brands Meet Vetted Creators",
    template: "%s | BrandKlip",
  },
  description:
    "BrandKlip connects D2C brands with vetted micro-influencers. Ship products, get authentic UGC video content. Zero inventory risk. Instant creator payouts.",
  keywords: [
    "UGC platform",
    "micro-influencer marketing",
    "D2C brands",
    "creator marketplace",
    "influencer marketing India",
    "barter campaigns",
    "product seeding",
    "user generated content",
    "BrandKlip",
  ],
  metadataBase: new URL("https://brandklip.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "BrandKlip",
    title: "BrandKlip — Where D2C Brands Meet Vetted Creators",
    description:
      "Connect with vetted creators for authentic UGC. Zero inventory risk. Performance-based payouts.",
    url: "https://brandklip.com",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandKlip — Where D2C Brands Meet Vetted Creators",
    description:
      "Connect with vetted creators for authentic UGC. Zero inventory risk. Performance-based payouts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BrandKlip",
              url: "https://brandklip.com",
              description:
                "BrandKlip connects D2C brands with vetted micro-influencers for authentic UGC content.",
              foundingDate: "2025",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased text-foreground`}>
        <SmoothScroll />
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
