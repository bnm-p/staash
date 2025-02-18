import { Hono } from "hono";
import { handle } from "hono/vercel";
import { helloRouter } from "./routers/hello-router";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app.route("/hello", helloRouter);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
