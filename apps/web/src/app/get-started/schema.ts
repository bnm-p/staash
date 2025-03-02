import { z } from "zod";

export const onboardingSchema = z.object({
	email: z.string({ required_error: "Email is required" }).email({ message: "Please enter a valid email address" }),
	password: z
		.string({
			required_error: "Password is required",
		})
		.min(8, {
			message: "Password must be at least 8 characters",
		})
		.max(20, {
			message: "Password must be at most 20 characters",
		})
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
			message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
		}),
	repeatPassword: z
		.string({
			required_error: "Password is required",
		})
		.min(8, {
			message: "Password must be at least 8 characters",
		})
		.max(20, {
			message: "Password must be at most 20 characters",
		}),
	name: z.string({ required_error: "Name is required" }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
