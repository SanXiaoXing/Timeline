import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['in_progress', 'paused', 'completed']),
    achievementTags: z.array(z.string()),
    currentStage: z.string(),
    progressPct: z.number(),
    milestones: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        pct: z.number(),
        description: z.string(),
      })
    ).optional().default([]),
    timeline: z.array(
      z.object({
        id: z.string(),
        milestoneId: z.string(),
        title: z.string(),
        date: z.string(),
        detail: z.string(),
        result: z.string().optional(),
      })
    ).optional().default([]),
  }),
});

const achievements = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/achievements" }),
  schema: z.object({
    list: z.array(
      z.object({
        id: z.string(),
        icon: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.array(z.enum(['life', 'study', 'career', 'skill', 'mindset'])),
        rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
        progressPct: z.number(),
        unlocked: z.boolean(),
        unlockedAt: z.string().optional(),
      })
    )
  }),
});

const xing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/xing" }),
  schema: z.object({
    quotes: z.array(
      z.object({
        date: z.string(),
        items: z.array(z.string()),
      })
    ).optional().default([]),
  }),
});

export const collections = { projects, achievements, xing };
