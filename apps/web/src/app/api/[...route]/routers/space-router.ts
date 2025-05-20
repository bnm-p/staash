import { Hono } from "hono";
import { spacesService } from "@/queries/spaces.service";
import { orgAndSpaceSlug, spaceCreateSchema, spaceUpdateSchema } from "@/validators/spaces.schema";
import { orgSlugSchema } from "@/validators/orgs.schema";
import { usersService } from "@/queries/users.service";
import { zValidator } from "@/validators/validator-wrapper";

export const spaceRouter = new Hono()
	.post("/", zValidator("json", spaceCreateSchema), async (c) => {
		console.log(c.req.valid("json"));
		const space = await spacesService.createSpace(c.req.valid("json"));

		return c.json({ message: "Sucessfully created space", body: space }, 201);
	})
	.get("/", zValidator("param", orgSlugSchema), async (c) => {
		return c.json(await spacesService.getAllSpacesByOrgSlug(c.req.valid("param")));
	})
	.get("/:spaceSlug", zValidator("param", orgAndSpaceSlug), async (c) => {
		return c.json(await spacesService.getSingleSpaceBySpaceSlugAndOrgSlug(c.req.valid("param")));
	})
	.delete("/:spaceSlug", zValidator("param", orgAndSpaceSlug), async (c) => {
		const user = await usersService.getUser(c);

		return (await spacesService.deleteSpace(user.id, c.req.valid("param")))
			? c.json({ message: "Space deleted successfully" }, 202)
			: c.json({ message: "Space not deleted successfully" }, 500);
	})
	.patch("/:spaceSlug", zValidator("json", spaceUpdateSchema), zValidator("param", orgAndSpaceSlug), async (c) => {
		const user = await usersService.getUser(c);
		const { orgSlug, spaceSlug } = c.req.valid("param");
		const updateData = c.req.valid("json");

		const updatedSpace = await spacesService.updateSpace(user.id, orgSlug, spaceSlug, updateData);

		return c.json({ message: "Space updated successfully", body: updatedSpace }, 200);
	});
