import { Organization } from "./../../../../../../../node_modules/.pnpm/@prisma+client@6.4.0_prisma@6.4.0_typescript@5.7.2__typescript@5.7.2/node_modules/.prisma/client/index.d";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { spaceRouter } from "./space-router";
import { orgs } from "@/queries/orgs";
import { users } from "@/queries/users";
import { orgMiddleware } from "../middleware/org-middleware";

export const orgRouter = new Hono()
	.route("/:orgSlug/spaces", spaceRouter)
	.post(
		"/",
		zValidator(
			"form",
			z.object({
				name: z.string(),
				slug: z.string(),
				logo: z.string(),
			}),
		),
		async (c) => {
			const validate = c.req.valid("form");

			const user = await users.getUser(c);

			const org = await db.organization.create({
				data: {
					name: validate.name,
					slug: validate.slug,
					logo: validate.logo,
				},
			});

			const member = await db.member.create({
				data: {
					userId: user.id,
					organizationId: org.id,
					role: "owner",
				},
			});

			return c.json(org);
		},
	)
	.get(
		"/:orgSlug",
		zValidator(
			"param",
			z.object({
				orgSlug: z.string(),
			}),
		),
		async (c) => {
			const { orgSlug } = c.req.valid("param");

			return c.json(await orgs.getOrgBySlug(orgSlug));
		},
	)
	.delete(
		"/:orgSlug",
		zValidator(
			"param",
			z.object({
				orgSlug: z.string(),
			}),
		),
		async (c) => {
			const user = await users.getUser(c);
			const { orgSlug } = c.req.valid("param");

			const org = await orgs.getOrgBySlug(orgSlug);

			const member = await db.member.findFirst({
				//TODO auf FindUnique ändern
				where: { organizationId: org.id, userId: user.id },
			});

			if (member?.role !== "owner") {
				throw new HTTPException(403, { message: "Forbidden: Only Owner is alowed to delete Organization" });
			}

			await db.organization.delete({
				where: { id: org.id },
			});

			return c.json({ message: "Organization deleted successfully" });
		},
	);
