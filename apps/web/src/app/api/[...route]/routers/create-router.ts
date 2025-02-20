import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";

export const createRouter = new Hono()
	.post("/org", async (c) => {
		return c.json({});
	})
	.post(
		"/space",
		zValidator(
			"form",
			z.object({
				name: z.string(),
				slug: z.string(),
				orgId: z.string(),
			}),
		),
		async (c) => {
			const validated = c.req.valid("form");

			const space = await db.space.create({
				data: {
					name: validated.name,
					slug: validated.slug,
					organizationId: validated.orgId,
				},
			});

			return c.json(space);
		},
	);
