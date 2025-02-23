import { db } from "@/lib/db";
import type { TOrgCreateSchema, TOrgSlugSchema } from "@/validators/orgs.schema";
import { HTTPException } from "hono/http-exception";

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

	getOrgById: async (orgId: string) => {
		const org = await db.organization.findUnique({
			where: {
				id: orgId,
			},
		});

		if (!org) {
			throw new HTTPException(400, { message: "No organization with this slug" });
		}

		return org;
	},

	createOrganization: async (userId: string, data: TOrgCreateSchema) => {
		const org = await db.organization.create({
			data: {
				name: data.name,
				slug: data.slug,
				logo: data.logo,
			},
		});

		await db.member.create({
			data: {
				userId: userId,
				organizationId: org.id,
				role: "owner",
			},
		});

		return org;
	},

	deleteOrganization: async (userId: string, data: TOrgSlugSchema) => {
		const isOwner = await orgsService.isUserOwner(userId, data.orgSlug);

		if (!isOwner) {
			throw new HTTPException(403, { message: "Forbidden: Only Owner is allowed to delete Organization" });
		}

		const org = await orgsService.getOrgBySlug(data.orgSlug);

		await db.organization.delete({
			where: { id: org.id },
		});

		return true;
	},

	isUserOwner: async (userId: string, orgSlug: string) => {
		const member = await db.member.findFirst({
			where: { organization: { slug: orgSlug }, userId: userId },
			select: { role: true },
		});

		return member?.role === "owner";
	},
};
