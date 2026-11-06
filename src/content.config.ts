import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
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
    shot: z.object({
      src: z.string(),
      alt: z.string(),
      alt_en: z.string(),
      source: z.enum(['live','demo']),
    }).optional(),
    area: z.enum(['security','fullstack','ai']),
    writeup: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});
export const collections = { projects };
