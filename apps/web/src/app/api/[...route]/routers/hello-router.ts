import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const helloRouter = new Hono().get("/", async (c) => {
  const user = c.get("user");

  if (!user) {
    throw new HTTPException(401, {message: 'Unauthorized'})
  }
  const message = user ? `Hello ${user.name}!` : "Hello from Hono!";

  return c.json({ message: message });
});
