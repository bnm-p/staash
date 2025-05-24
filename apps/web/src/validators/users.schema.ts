import { z } from "zod";

export const userCreateSchema = z.object({
	email: z.string().email(),
});

export const userCreateAccountSchema = z.object({
	email: z.string().email(),
	name: z.string().nonempty(),
	password: z.string().nonempty(),
});

export type TUserCreateSchema = z.infer<typeof userCreateSchema>;
export type TUserCreateAccountSchema = z.infer<typeof userCreateAccountSchema>;
