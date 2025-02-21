import { db } from "@/lib/db";
import type { TOrgCreateSchema, TOrgSlugSchema } from "@/validators/orgs.schema";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { usersService } from "./users.service";

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
		const user = await usersService.getUser(c);

		const org = await orgsService.getOrgBySlug(data.orgSlug);

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

		return true;
	},
};
