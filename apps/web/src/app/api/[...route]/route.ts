import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";
import { orgRouter } from "./routers/org-router";
import { orgMiddleware } from "./middleware/org-middleware";
import { userRouter } from "./routers/users-router";
import { errorHandler } from "./middleware/error-middleware";
import { cleanupRouter } from "./routers/cleanup-router";

declare module "hono" {
	interface ContextVariableMap {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	}
}

const app = new Hono().basePath("/api");

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.use(
	"/auth/*", // or replace with "*" to enable cors for all routes
	cors({
		origin: "http://localhost:3000", // replace with your origin
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("/orgs/:orgSlug/*", orgMiddleware);

app.onError((err, c) => {
	return errorHandler(c, err);
});

app.on(["POST", "GET"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

const routes = app.route("/orgs", orgRouter).route("/users", userRouter).route("/cleanups", cleanupRouter);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
