import { z } from "zod";

export const orgCreateSchema = z.object({
	name: z.string(),
	slug: z.string(),
	logo: z.string().optional(),
});

export const orgSlugSchema = z.object({
	orgSlug: z.string(),
});

export const orgSlugAndIdSchema = z.object({
	orgSlug: z.string().optional(),
	orgId: z.string().optional(),
});

export type TOrgCreateSchema = z.infer<typeof orgCreateSchema>;
export type TOrgSlugSchema = z.infer<typeof orgSlugSchema>;
export type TOrgSlugAndId = z.infer<typeof orgSlugAndIdSchema>;
