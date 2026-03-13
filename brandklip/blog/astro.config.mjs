import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://www.brandklip.com",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "BrandKlip",
      customCss: ["./src/styles/tailwind.css"],
      description: "BrandKlip guides and blogs on zero-risk UGC, creator workflows, and D2C growth.",
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
        ThemeSelect: "./src/components/MyThemeSelect.astro",
        Head: "./src/components/HeadWithOGImage.astro",
        PageTitle: "./src/components/TitleWithBannerImage.astro",
      },
      social: {
        github: "https://github.com/divyanknagpal/microfluencers",
        twitter: "https://x.com/brandklip",
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
        {
          label: "Guides",
          items: [
            {
              label: "Example Guide",
              link: "/guides/example/",
            },
          ],
        },
      ],
      plugins: [
        starlightBlog({
          title: "Blogs",
          customCss: ["./src/styles/tailwind.css"],
          authors: {
            BrandKlip: {
              name: "BrandKlip Team",
              title: "BrandKlip",
              picture: "/favicon.svg",
              url: "https://www.brandklip.com",
            },
          },
        }),
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
