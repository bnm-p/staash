import { HTTPException } from "hono/http-exception";

export class ValidationException extends HTTPException {
	constructor(errors: { path: string; message: string }[]) {
		super(400, {
			message: "Validation error",
			cause: errors,
		});
		this.name = "ValidationException";
	}
}
