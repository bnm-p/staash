import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { orgs } from "@/queries/orgs";
import { HTTPException } from "hono/http-exception";
import SpaceSlugPage from "@/app/(dashboard)/[orgSlug]/[spaceSlug]/page";
import { users } from "@/queries/users";
import { spaces } from "@/queries/spaces";

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
	)
	.delete(
		"/:spaceSlug",
		zValidator(
			"param",
			z.object({
				orgSlug: z.string(),
				spaceSlug: z.string(),
			}),
		),
		async (c) => {
			const user = await users.getUser(c);
			const { orgSlug, spaceSlug } = c.req.valid("param");

			const org = await orgs.getOrgBySlug(orgSlug);
			const space = await spaces.getSpaceBySpaceSlugAndOrgId(spaceSlug, org.id);

			const member = await db.member.findFirst({
				//TODO auf FindUnique ändern
				where: { organizationId: org.id, userId: user.id },
			});

			if (member?.role !== "owner") {
				throw new HTTPException(403, { message: "Forbidden: Only Owner is alowed to delete spaces" });
			}

			await db.space.delete({
				where: { id: space.id },
			});

			return c.json({ message: "Space deleted successfully" });
		},
	);
