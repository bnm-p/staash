import { z } from "zod";

export const orgCreateSchema = z.object({
	name: z.string().min(1, "Name cannot be empty").max(20, "Name cannot be longer than 20 Characters"),
	slug: z.string().min(1, "Slug cannot be empty").max(20, "Name cannot be longer than 20 Characters"),
	logo: z.string().optional(),
});

export const orgUpdateSchmea = z.object({
	name: z.string().min(1, "Name cannot be empty").max(20, "Name cannot be longer than 20 Characters").optional(),
	slug: z.string().min(1, "Slug cannot be empty").max(20, "Name cannot be longer than 20 Characters").optional(),
});

export const orgSlugSchema = z.object({
	orgSlug: z.string(),
});

export const orgSlugAndIdSchema = z.object({
	orgSlug: z.string().optional(),
	orgId: z.string().optional(),
});

export type TOrgCreateSchema = z.infer<typeof orgCreateSchema>;
export type TOrgUpdateSchema = z.infer<typeof orgUpdateSchmea>;
export type TOrgSlugSchema = z.infer<typeof orgSlugSchema>;
export type TOrgSlugAndId = z.infer<typeof orgSlugAndIdSchema>;
