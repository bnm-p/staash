import { Hono } from "hono";

export const helloRouter = new Hono().get("/", async (c) => {
	const user = c.get("user");
	const message = user ? `Hello ${user.name}!` : "Hello from Hono!";

	return c.json({ message: message });
});
