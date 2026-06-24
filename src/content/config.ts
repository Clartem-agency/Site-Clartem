import { defineCollection, z } from 'astro:content';

// Collection "blog" — piliers, clusters et guide client.
// Le corps (.md) contient le <main> HTML de l'article ; les métadonnées SEO
// (title, description, headline JSON-LD, FAQ des piliers) sont en front-matter.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    headline: z.string().optional(),
    isPillar: z.boolean().default(false),
    isGuide: z.boolean().default(false),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
  }),
});

export const collections = { blog };
