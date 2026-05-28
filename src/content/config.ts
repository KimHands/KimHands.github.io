import { defineCollection, z } from 'astro:content';
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    title_en: z.string(),
    role: z.string(),
    role_en: z.string(),
    summary: z.string(),
    summary_en: z.string(),
    tech: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    area: z.enum(['security','fullstack','ai']),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});
export const collections = { projects };
