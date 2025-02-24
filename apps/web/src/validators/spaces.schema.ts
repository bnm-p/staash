import { z } from "zod";

export const spaceCreateSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	slug: z.string().min(1, "Slug cannot be empty"),
	orgId: z.string(),
});

export const orgAndSpaceSlug = z.object({
	orgSlug: z.string(),
	spaceSlug: z.string(),
});

export type TSpaceCreateSchema = z.infer<typeof spaceCreateSchema>;
export type TOrgAndSpaceSlug = z.infer<typeof orgAndSpaceSlug>;
