import { z } from "zod";

export const orgCreateSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	slug: z.string().min(1, "Slug cannot be empty"),
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
