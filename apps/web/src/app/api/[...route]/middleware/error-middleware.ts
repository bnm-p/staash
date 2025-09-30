import { ValidationException } from "@/errors/validation.exception";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

export const errorHandler = async (c: Context, error: unknown) => {
	console.error(error);

	if (error instanceof ValidationException) {
		return c.json(
			{
				status: "error",
				message: error.cause,
			},
			400,
		);
	}

	if (error instanceof HTTPException) {
		return c.json({ message: error.message }, error.status);
	}

	return c.json(
		{
			status: "error",
			message: "Internal server error",
		},
		500,
	);
};
