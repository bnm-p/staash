import { z } from "zod";

export const userCreateSchema = z.object({
	email: z.string().email(),
});

export const userCreateAccountSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1, "Name cannot be empty").max(20, "Name cannot be longer than 20 characters"),
	password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must be at most 20 characters"),
});

export type TUserCreateSchema = z.infer<typeof userCreateSchema>;
export type TUserCreateAccountSchema = z.infer<typeof userCreateAccountSchema>;
