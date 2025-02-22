import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { spaceRouter } from "./space-router";
import { orgsService } from "@/queries/orgs.service";
import { orgCreateSchema, orgSlugSchema } from "@/validators/orgs.schema";

export const orgRouter = new Hono()
	.route("/:orgSlug/spaces", spaceRouter)
	.post("/", zValidator("form", orgCreateSchema), async (c) => {
		return c.json(await orgsService.createOrganization(c, c.req.valid("form")));
	})
	.get("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		return c.json(await orgsService.getOrgBySlug(c.req.valid("param").orgSlug));
	})
	.delete("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		return (await orgsService.deleteOrganization(c, c.req.valid("param")))
			? c.json({ message: "Organization deleted successfully" })
			: c.json({ message: "Organization not deleted successfully" });
	});
