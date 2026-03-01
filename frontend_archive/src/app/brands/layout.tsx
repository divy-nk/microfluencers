import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "For Brands — Zero-Risk UGC from Vetted Creators",
    description:
        "Get authentic UGC for your D2C brand without shipping inventory. Vetted creators, pay-on-approval model, real-time view tracking. Launch your first drop today.",
    alternates: {
        canonical: "/brands",
    },
    openGraph: {
        title: "BrandKlip for Brands — Zero-Risk UGC from Vetted Creators",
        description:
            "Authentic UGC without inventory risk. Pay only for approved content. Real-time performance tracking.",
        url: "https://brandklip.com/brands",
    },
};

export default function BrandsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
