import { HTTPException } from "hono/http-exception";
export const errorService = {
	handleServiceError: (message: string, error: unknown): never => {
		if (error instanceof HTTPException) {
			throw error;
		}
		throw new HTTPException(500, { message, cause: error });
	},
};
