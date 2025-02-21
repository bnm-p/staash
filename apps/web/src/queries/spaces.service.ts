import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { orgsService } from "./orgs.service";
import type { TSpaceCreateSchema } from "@/validators/spaces.schema";
import type { TOrgSlugSchema } from "@/validators/orgs.schema";

export const spacesService = {
	getSpaceBySpaceSlugAndOrgId: async (spaceSlug: string, organizationId: string) => {
		const spaces = await db.space.findUnique({
			where: {
				slug_organizationId: {
					slug: spaceSlug,
					organizationId: organizationId,
				},
			},
		});

		if (!spaces) {
			throw new HTTPException(400, { message: "No space with such slug in this organization" });
		}

		return spaces;
	},
	getSpaceBySpaceSlugAndOrgSlug: async (spaceSlug: string, orgSlug: string) => {
		const org = await orgsService.getOrgBySlug(orgSlug);

		const space = await spacesService.getSpaceBySpaceSlugAndOrgId(spaceSlug, org.id);

		return space;
	},

	createSpace: async (data: TSpaceCreateSchema) => {
		const space = await db.space.create({
			data: {
				name: data.name,
				slug: data.slug,
				organizationId: data.orgId,
			},
		});

		return space;
	},

	getAllSpacesByOrgSlug: async (data: TOrgSlugSchema) => {
		const org = await orgsService.getOrgBySlug(data.orgSlug);

		const spaces = await db.space.findMany({
			where: {
				organizationId: org.id,
			},
		});

		return spaces;
	},
};
