import { Hono } from "hono";

export const helloRouter = new Hono().get("/", (c) =>
	c.json({ message: "Hello from Hono!" }),
);
