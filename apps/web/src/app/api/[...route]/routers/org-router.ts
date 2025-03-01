import { Hono } from "hono";
import { spaceRouter } from "./space-router";
import { orgsService } from "@/queries/orgs.service";
import { orgCreateSchema, orgSlugSchema, orgUpdateSchema } from "@/validators/orgs.schema";
import { usersService } from "@/queries/users.service";
import { zValidator } from "@/validators/validator-wrapper";

export const orgRouter = new Hono()
	.route("/:orgSlug/spaces", spaceRouter)
	.post("/", zValidator("json", orgCreateSchema), async (c) => {
		const user = await usersService.getUser(c);
		const org = await orgsService.createOrganization(user.id, c.req.valid("json"));

		return c.json({ message: "Successfully created Organization", body: org }, 201);
	})
	.get("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		return c.json(await orgsService.getOrgBySlug(c.req.valid("param").orgSlug));
	})
	.delete("/:orgSlug", zValidator("param", orgSlugSchema), async (c) => {
		const user = await usersService.getUser(c);

		return (await orgsService.deleteOrganization(user.id, c.req.valid("param")))
			? c.json({ message: "Organization deleted successfully" }, 202)
			: c.json({ message: "Organization not deleted successfully" }, 500);
	})
	.patch("/:orgSlug", zValidator("json", orgUpdateSchema), zValidator("param", orgSlugSchema), async (c) => {
		const user = await usersService.getUser(c);
		const { orgSlug } = c.req.valid("param");
		const updateData = c.req.valid("json");

		const updatedOrg = await orgsService.updateOrganization(user.id, orgSlug, updateData);

		return c.json({ message: "Organization updated successfully", body: updatedOrg }, 200);
	});
