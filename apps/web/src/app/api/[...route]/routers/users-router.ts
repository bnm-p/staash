import { usersService } from "@/queries/users.service";
import { orgSlugAndIdSchema } from "@/validators/orgs.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const userRouter = new Hono()
	.get("/activeOrg", async (c) => {
		const user = await usersService.getUser(c);

		return c.json(await usersService.getActiveOrg(user.id));
	})
	.put("/activeOrg", zValidator("json", orgSlugAndIdSchema), async (c) => {
		const user = await usersService.getUser(c);

		return c.json(await usersService.setActiveOrg(user.id, c.req.valid("json")));
	})
	.get("/orgs", async (c) => {
		return c.json(await usersService.getAllOrgsForCurrentUser((await usersService.getUser(c)).id));
	});
