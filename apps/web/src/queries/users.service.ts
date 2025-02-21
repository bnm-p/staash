import { db } from "@/lib/db";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const usersService = {
	getUser: async (c: Context) => {
		const user = c.get("user");

		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		return user;
	},
};
