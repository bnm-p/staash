import { cleanupService } from "@/queries/cleanup.services";
import { Hono } from "hono";

export const cleanupRouter = new Hono().get("/", async (c) => {
	await cleanupService.cleanupPendingUsers();

	return c.json({ message: "Cleanup successfully" }, 202);
});
