import { getCollection, type CollectionEntry } from "astro:content";

export type BlogEntry = CollectionEntry<"blog">;

export const getBlogSlug = (entry: BlogEntry) =>
  entry.id.replace(/^blog\//, "").replace(/\.(md|mdx)$/, "");

export const formatBlogDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

export const getBlogDate = (entry: BlogEntry) => {
  const value = entry.data.date;
  return value instanceof Date ? value : new Date(0);
};

export const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
};

export const getBlogReadTime = (entry: BlogEntry) => {
  const value = (entry.data as { readTime?: string }).readTime;
  return value || estimateReadTime(entry.body);
};

export async function getBlogPosts() {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => getBlogDate(b).getTime() - getBlogDate(a).getTime());
}
