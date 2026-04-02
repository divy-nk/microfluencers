import type { APIRoute } from "astro";
import { getBlogPosts, getBlogSlug } from "../lib/blog";

const SITE_URL = "https://www.brandklip.com";

type UrlEntry = {
  loc: string;
  changefreq: "weekly" | "monthly";
  priority: string;
  lastmod?: string;
};

const toXmlDate = (date: Date) => date.toISOString().split("T")[0];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildUrlNode = (entry: UrlEntry) => {
  const fields = [
    `<loc>${escapeXml(entry.loc)}</loc>`,
    `<changefreq>${entry.changefreq}</changefreq>`,
    `<priority>${entry.priority}</priority>`,
  ];

  if (entry.lastmod) {
    fields.push(`<lastmod>${entry.lastmod}</lastmod>`);
  }

  return `<url>${fields.join("")}</url>`;
};

export const GET: APIRoute = async () => {
  const posts = await getBlogPosts();
  const blogEntries: UrlEntry[] = [];

  for (const post of posts) {
    blogEntries.push({
      loc: `${SITE_URL}/blog/${getBlogSlug(post)}`,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: toXmlDate(post.data.date instanceof Date ? post.data.date : new Date(post.data.date)),
    });
  }

  const entries: UrlEntry[] = [
    {
      loc: `${SITE_URL}/`,
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: `${SITE_URL}/creators`,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: `${SITE_URL}/blog`,
      changefreq: "weekly",
      priority: "0.7",
    },
    ...blogEntries,
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries.map(buildUrlNode).join("") +
    '</urlset>';

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
