import { z } from "zod";

export const spaceCreateSchema = z.object({
	name: z.string(),
	slug: z.string(),
	orgId: z.string(),
});

export type TSpaceCreateSchema = z.infer<typeof spaceCreateSchema>;
