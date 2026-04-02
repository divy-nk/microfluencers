import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.brandklip.com",
  trailingSlash: "ignore",
  vite: {
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        const blocked = [
          "/login",
          "/signup",
          "/account",
          "/dashboard",
          "/branddashboard",
          "/creatordashboard",
        ];

        return !blocked.some((prefix) =>
          pathname === prefix || pathname.startsWith(`${prefix}/`)
        );
      },
    }),
    starlight({
      title: "BrandKlip",
      disable404Route: true,
      customCss: ["./src/styles/tailwind.css", "./src/styles/starlight-brandklip.css"],
      description: "BrandKlip blogs on zero-risk UGC, creator workflows, and D2C growth.",
      logo: {
        src: "./src/assets/logo.webp",
        alt: "BrandKlip",
      },
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://www.googletagmanager.com/gtag/js?id=G-SKBZLTYCVJ",
            async: true,
          },
        },
        {
          tag: "script",
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-SKBZLTYCVJ');
          `,
        },
      ],
      editLink: {
        baseUrl: "https://github.com/divyanknagpal/microfluencers/edit/main/brandklip/blog/src/content/docs/",
      },
      components: {
        SiteTitle: "./src/components/MyHeader.astro",
        Head: "./src/components/HeadWithOGImage.astro",
        PageTitle: "./src/components/TitleWithBannerImage.astro",
      },
      social: {
        github: "https://github.com/divyanknagpal/microfluencers",
        "x.com": "https://x.com/brandklip",
      },
      sidebar: [
        {
          label: "Start Here",
          items: [
            {
              label: "Introduction",
              link: "/",
            },
          ],
        },
      ],
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
