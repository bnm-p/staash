import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const errorHandler = async (c: Context, next: Next) => {
	try {
		await next();
	} catch (error) {
		console.error(error);

		if (error instanceof z.ZodError) {
			return c.json(
				{
					status: "error",
					errors: error.errors.map((err) => ({
						path: err.path.join("."),
						message: err.message,
					})),
				},
				400,
			);
		}

		if (error instanceof HTTPException) {
			return c.json({ error: error.message }, error.status);
		}

		return c.json(
			{
				status: "error",
				message: "Internal server error",
			},
			500,
		);
	}
};
