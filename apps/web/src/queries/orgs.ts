import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";

export const orgs = {
	getOrgBySlug: async (orgSlug: string) => {
		const org = await db.organization.findUnique({
			where: {
				slug: orgSlug,
			},
		});

		if (!org) {
			throw new HTTPException(400, { message: "No organisation with this slug" });
		}

		return org;
	},
};
