import type { ZodSchema } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { ValidationException } from "@/errors/validation.exception";

export const zValidator = <T extends ZodSchema, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
	zv(target, schema, (result, c) => {
		if (!result.success) {
			const errorDetails = result.error.errors.map((err) => ({
				path: err.path.join("."),
				message: err.message,
			}));

			throw new ValidationException(errorDetails);
		}
	});
