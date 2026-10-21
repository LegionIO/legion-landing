import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(), description: z.string(), section: z.string(), order: z.number(),
    sources: z.array(z.string()).min(1),
    special: z.enum(['none', 'defaults', 'cli', 'sources', 'catalog', 'metrics', 'routing', 'tasks', 'context', 'pipeline']).default('none'),
  }),
});
export const collections = { docs };
