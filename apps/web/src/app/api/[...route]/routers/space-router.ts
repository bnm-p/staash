import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { spacesService } from "@/queries/spaces.service";
import { orgAndSpaceSlug, spaceCreateSchema } from "@/validators/spaces.schema";
import { orgSlugSchema } from "@/validators/orgs.schema";
import { usersService } from "@/queries/users.service";

export const spaceRouter = new Hono()
	.post("/", zValidator("form", spaceCreateSchema), async (c) => {
		return c.json(await spacesService.createSpace(c.req.valid("form")));
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
			? c.json({ message: "Space deleted successfully" })
			: c.json({ message: "Space not deleted successfully" });
	});
