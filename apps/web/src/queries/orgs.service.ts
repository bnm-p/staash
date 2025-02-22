import { db } from "@/lib/db";
import type { TOrgCreateSchema, TOrgSlugSchema } from "@/validators/orgs.schema";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { usersService } from "./users.service";
import type { User } from "@prisma/client";

export const orgsService = {
	getOrgBySlug: async (orgSlug: string) => {
		const org = await db.organization.findUnique({
			where: {
				slug: orgSlug,
			},
		});

		if (!org) {
			throw new HTTPException(400, { message: "No organization with this slug" });
		}

		return org;
	},

	createOrganization: async (c: Context, data: TOrgCreateSchema) => {
		const user = await usersService.getUser(c);

		const org = await db.organization.create({
			data: {
				name: data.name,
				slug: data.slug,
				logo: data.logo,
			},
		});

		await db.member.create({
			data: {
				userId: user.id,
				organizationId: org.id,
				role: "owner",
			},
		});

		return org;
	},

	deleteOrganization: async (c: Context, data: TOrgSlugSchema) => {
		const isOwner = await orgsService.isUserOwner(c, data.orgSlug);

		if (!isOwner) {
			throw new HTTPException(403, { message: "Forbidden: Only Owner is allowed to delete Organization" });
		}

		const org = await orgsService.getOrgBySlug(data.orgSlug);

		await db.organization.delete({
			where: { id: org.id },
		});

		return true;
	},

	isUserOwner: async (c: Context, orgSlug: string) => {
		const user = await usersService.getUser(c);

		const member = await db.member.findFirst({
			where: { organization: { slug: orgSlug }, userId: user.id },
			select: { role: true },
		});

		return member?.role === "owner";
	},
};