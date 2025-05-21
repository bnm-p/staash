import { z } from "zod";

export const spaceCreateSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	slug: z.string().min(1, "Slug cannot be empty"),
	icon: z.string().optional(),
	orgId: z.string(),
});

export const spaceUpdateSchema = z.object({
	name: z.string().min(1, "Name cannot be empty").optional(),
	slug: z.string().min(1, "Slug cannot be empty").optional(),
});

export const orgAndSpaceSlug = z.object({
	orgSlug: z.string(),
	spaceSlug: z.string(),
});

export type TSpaceCreateSchema = z.infer<typeof spaceCreateSchema>;
export type TSpaceUpdateSchema = z.infer<typeof spaceUpdateSchema>;
export type TOrgAndSpaceSlug = z.infer<typeof orgAndSpaceSlug>;
