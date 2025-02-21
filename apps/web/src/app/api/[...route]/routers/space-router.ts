import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { orgs } from "@/queries/orgs";
import { HTTPException } from "hono/http-exception";
import SpaceSlugPage from "@/app/(dashboard)/[orgSlug]/[spaceSlug]/page";

export const spaceRouter = new Hono()
	.post(
		"/",
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
	)
	.get(
		"/",
		zValidator(
			"param",
			z.object({
				orgSlug: z.string(),
			}),
		),
		async (c) => {
			const { orgSlug } = c.req.valid("param");

			const org = await orgs.getOrgBySlug(orgSlug);

			const spaces = await db.space.findMany({
				where: {
					organizationId: org.id,
				},
			});

			return c.json(spaces);
		},
	)
	.get(
		"/:spaceSlug",
		zValidator(
			"param",
			z.object({
				orgSlug: z.string(),
				spaceSlug: z.string(),
			}),
		),
		async (c) => {
			const { orgSlug, spaceSlug } = c.req.valid("param");

			const org = await orgs.getOrgBySlug(orgSlug);

			const space = await db.space.findUnique({
				where: {
					slug_organizationId: {
						slug: spaceSlug,
						organizationId: org.id,
					},
				},
			});

			return c.json(space);
		},
	);
