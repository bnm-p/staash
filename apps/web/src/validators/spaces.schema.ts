import { z } from "zod";

export const spaceCreateSchema = z.object({
	name: z.string().nonempty(),
	slug: z.string().nonempty(),
	icon: z.string().optional(),
	orgId: z.string(),
});

export const spaceUpdateSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),
});

export const orgAndSpaceSlug = z.object({
	orgSlug: z.string(),
	spaceSlug: z.string(),
});

export type TSpaceCreateSchema = z.infer<typeof spaceCreateSchema>;
export type TSpaceUpdateSchema = z.infer<typeof spaceUpdateSchema>;
export type TOrgAndSpaceSlug = z.infer<typeof orgAndSpaceSlug>;
