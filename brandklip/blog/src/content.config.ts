import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { defineCollection, z } from "astro:content";
import { blogSchema } from "starlight-blog/schema";
import { glob } from "astro/loaders";

export const collections = {
  blog: defineCollection({
    loader: glob({ base: "src/content/blog", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      subtitle: z.string().optional(),
      hideBannerImage: z.boolean().optional(),
      readTime: z.string().optional(),
    }),
  }),
  docs: defineCollection({
    schema: docsSchema({
      extend: (context) => {
        const blogSchemaResult = blogSchema(context);
        return z.object({
          ...blogSchemaResult.shape,
          subtitle: z.string().optional(),
          hideBannerImage: z.boolean().optional(),
        });
      },
    }),
  }),
  i18n: defineCollection({
    type: "data",
    schema: i18nSchema(),
  }),
};
