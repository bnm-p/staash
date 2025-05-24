import { TypeOf, z } from "zod";

export const variableCreateSchema = z.object({
	name: z.string().nonempty(),
	value: z.string(),
	spaceId: z.string().nonempty(),
});

export const variableIdSchema = z.object({
	variableId: z.string().nonempty(),
});

export type TVariableCreateSchema = z.infer<typeof variableCreateSchema>;
