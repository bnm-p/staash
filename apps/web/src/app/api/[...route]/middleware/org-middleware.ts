import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import { orgsService } from "@/queries/orgs.service";
import { usersService } from "@/queries/users.service";

export const orgMiddleware = createMiddleware(async (c, next) => {
	const user = await usersService.getUser(c);
	const orgSlug = c.req.param("orgSlug");

	if (!orgSlug) {
		throw new HTTPException(400, { message: "Slug can not be undefined" });
	}

	const org = await orgsService.getOrgBySlug(orgSlug);

	const member = await db.member.findFirst({
		//TODO auf findUnique ändern
		where: {
			userId: user.id,
			organizationId: org.id,
		},
	});

	if (!member) {
		throw new HTTPException(403, { message: "Forbidden: Not a member of this organization" });
	}

	await next();
});
