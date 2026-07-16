import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
	loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		draft: z.boolean().optional(),
	}),
});

/* The rail's structure, ordered as listed here. These are keys, not labels:
   every project's front matter names one, and the rail shows whatever
   `projectGroupNames` in data/i18n.ts maps them to in the current language. */
export const projectGroups = ["Products", "Tools", "Systems"] as const;

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	/* `image()` needs the schema as a function. It resolves each `src` at build
	   time, giving Shot the real dimensions and turning a bad path into a build
	   error rather than a 404. */
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/* One line: the meta description, and the rail's sub-label. */
			description: z.string(),
			group: z.enum(projectGroups),
			/* Rank within the group; ties fall back to title. */
			order: z.number(),
			years: z.string(),
			role: z.string(),
			status: z.string(),
			tech: z.string(),
			links: z
				.array(z.object({ label: z.string(), href: z.string() }))
				.optional(),
			features: z.array(z.object({ title: z.string(), body: z.string() })),
			/* Omit `src` and a placeholder frame renders in its place. */
			shots: z
				.array(
					z.object({
						src: image().optional(),
						alt: z.string().optional(),
						caption: z.string(),
					}),
				)
				.optional(),
			featured: z.boolean().optional(),
			draft: z.boolean().optional(),
		}),
});

export const collections = { writing, projects };
