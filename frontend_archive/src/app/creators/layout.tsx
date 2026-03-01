import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "For Creators — Get Free Products & Earn Cash",
    description:
        "Join BrandKlip as a creator. Claim free D2C products, create authentic content, and earn performance-based payouts. No minimum followers required.",
    alternates: {
        canonical: "/creators",
    },
    openGraph: {
        title: "BrandKlip for Creators — Get Free Products & Earn Cash",
        description:
            "Claim free products from top D2C brands. Shoot content. Get reimbursed + performance bonuses.",
        url: "https://brandklip.com/creators",
    },
};

export default function CreatorsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
