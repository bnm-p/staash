import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { spaceRouter } from "./space-router";
import { orgsService } from "@/queries/orgs.service";
import { orgCreateSchema, orgSlugSchema } from "@/validators/orgs.schema";
import { usersService } from "@/queries/users.service";

export const orgRouter = new Hono()
	.route("/:orgSlug/spaces", spaceRouter)
	.post("/", zValidator("json", orgCreateSchema), async (c) => {
		const user = await usersService.getUser(c);

		return c.json(await orgsService.createOrganization(user.id, c.req.valid("json")));
	})
	.get("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		return c.json(await orgsService.getOrgBySlug(c.req.valid("param").orgSlug));
	})
	.delete("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		const user = await usersService.getUser(c);

		return (await orgsService.deleteOrganization(user.id, c.req.valid("param")))
			? c.json({ message: "Organization deleted successfully" })
			: c.json({ message: "Organization not deleted successfully" });
	});
