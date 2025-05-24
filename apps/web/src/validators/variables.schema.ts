import { TypeOf, z } from "zod";

export const variableCreateSchema = z.object({
	name: z.string().nonempty("Variable Name can not be empty!"),
	value: z.string(),
	spaceId: z.string().nonempty("Space ID can not be empty!"),
});

export const variableUpdateSchema = z.object({
	name: z.string().optional(),
	value: z.string().optional(),
	spaceId: z.string().optional(),
});

export const variableIdSchema = z.object({
	variableId: z.string().nonempty("Variable ID can not be empty!"),
});

export type TVariableCreateSchema = z.infer<typeof variableCreateSchema>;
export type TVariableUpdateSchema = z.infer<typeof variableUpdateSchema>;
export type TVariableIdSchema = z.infer<typeof variableIdSchema>;
