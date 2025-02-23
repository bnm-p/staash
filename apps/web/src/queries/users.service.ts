import { db } from "@/lib/db";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { orgsService } from "./orgs.service";
import type { TOrgSlugAndId } from "@/validators/orgs.schema";

export const usersService = {
	getUser: async (c: Context) => {
		const user = c.get("user");

		if (!user) {
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		return user;
	},
	getAllOrgsForCurrentUser: async (userId: string) => {
		const members = await db.member.findMany({
			where: {
				userId: userId,
			},
			include: {
				organization: {
					include: {
						spaces: true,
					},
				},
			},
		});

		const orgs = members.map((member) => {
			return member.organization;
		});

		return orgs;
	},
	getActiveOrg: async (userId: string) => {
		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				lastActiveOrgId: true,
			},
		});

		if (!user?.lastActiveOrgId) {
			return null;
		}

		return await orgsService.getOrgById(user.lastActiveOrgId);
	},

	setActiveOrg: async (userId: string, { orgId, orgSlug }: TOrgSlugAndId) => {
		if (!orgId && !orgSlug) {
			throw new Error("Requires either orgId or orgSlug.");
		}

		if (orgSlug) {
			const org = await orgsService.getOrgBySlug(orgSlug);
			orgId = org.id;
		} else if (orgId) {
			await orgsService.getOrgById(orgId);
		}

		const org = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				lastActiveOrgId: orgId,
			},
		});

		return org;
	},
};
