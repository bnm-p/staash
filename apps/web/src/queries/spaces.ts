import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { orgs } from "./orgs";

export const spaces = {
	getSpaceBySpaceSlugAndOrgId: async (spaceSlug: string, organizationId: string) => {
		const space = await db.space.findUnique({
			where: {
				slug_organizationId: {
					slug: spaceSlug,
					organizationId: organizationId,
				},
			},
		});

		if (!space) {
			throw new HTTPException(400, { message: "No space with such slug in this organisation" });
		}

		return space;
	},
	getSpaceBySpaceSlugAndOrgSlug: async (spaceSlug: string, orgSlug: string) => {
		const org = await orgs.getOrgBySlug(orgSlug);

		const space = await db.space.findUnique({
			where: {
				slug_organizationId: {
					slug: spaceSlug,
					organizationId: org.id,
				},
			},
		});

		if (!space) {
			throw new HTTPException(400, { message: "No space with such slug in this organisation" });
		}
		return space;
	},
};
