import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The "projects" collection is the single source of truth for every case study.
// One Markdown file per project in src/content/projects/. The frontmatter below
// is the structured-data contract; the Markdown body is the narrative prose.
//
// EDITING RULE: text/copy lives in Markdown. This schema defines structured
// metadata that the layout renders into fixed UI regions (hero, meta sidebar,
// gallery grid). Add fields here when a new layout region needs data — then
// populate them in the Markdown frontmatter.
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    // Required
    title: z.string(),
    summary: z.string(),
    year: z.number(),
    role: z.array(z.string()).min(1),

    // Recommended
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),

    // Optional metadata
    slug: z.string().optional(),
    client: z.string().optional(),
    team: z.array(z.string()).optional(),
    duration: z.string().optional(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),

    // Structured image gallery — rendered as a grid by the case-study layout.
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      )
      .default([]),

    // External links (live site, store, extended write-up).
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects };
