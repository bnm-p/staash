import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { orgsService } from "@/queries/orgs.service";
import { HTTPException } from "hono/http-exception";
import { usersService } from "@/queries/users.service";
import { spacesService } from "@/queries/spaces.service";
import { Prisma } from "@prisma/client";
import { spaceCreateSchema } from "@/validators/spaces.schema";
import { orgSlugSchema } from "@/validators/orgs.schema";

export const spaceRouter = new Hono()
	.post("/", zValidator("form", spaceCreateSchema), async (c) => {
		return c.json(await spacesService.createSpace(c.req.valid("form")));
	})
	.get("/", zValidator("param", orgSlugSchema), async (c) => {
		return c.json(await spacesService.getAllSpacesByOrgSlug(c.req.valid("param")));
	})
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

			const org = await orgsService.getOrgBySlug(orgSlug);

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
			const user = await usersService.getUser(c);
			const { orgSlug, spaceSlug } = c.req.valid("param");

			const org = await orgsService.getOrgBySlug(orgSlug);
			const space = await spacesService.getSpaceBySpaceSlugAndOrgId(spaceSlug, org.id);

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
