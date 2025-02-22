import { z } from "zod";

export const orgCreateSchema = z.object({
	name: z.string(),
	slug: z.string(),
	logo: z.string().optional(),
});

export const orgSlugSchema = z.object({
	orgSlug: z.string(),
});

export type TOrgCreateSchema = z.infer<typeof orgCreateSchema>;
export type TOrgSlugSchema = z.infer<typeof orgSlugSchema>;
