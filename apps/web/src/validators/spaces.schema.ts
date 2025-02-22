import { z } from "zod";

export const spaceCreateSchema = z.object({
	name: z.string(),
	slug: z.string(),
	orgId: z.string(),
});

export const orgAndSpaceSlug = z.object({
	orgSlug: z.string(),
	spaceSlug: z.string(),
});

export type TSpaceCreateSchema = z.infer<typeof spaceCreateSchema>;
export type TOrgAndSpaceSlug = z.infer<typeof orgAndSpaceSlug>;
