import { z } from "zod";

export const orgCreateSchema = z.object({
	name: z.string().nonempty(),
	slug: z.string().nonempty(),
	logo: z.string().optional(),
});

export const orgUpdateSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),
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
export type TOrgUpdateSchema = z.infer<typeof orgUpdateSchema>;
export type TOrgSlugSchema = z.infer<typeof orgSlugSchema>;
export type TOrgSlugAndId = z.infer<typeof orgSlugAndIdSchema>;
