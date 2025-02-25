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
		const org = await usersService.setActiveOrg(user.id, c.req.valid("json"));

		return c.json({ message: "Sucessfully updated activeOrg", body: org }, 200);
	})
	.get("/orgs", async (c) => {
		return c.json(await usersService.getAllOrgsForCurrentUser((await usersService.getUser(c)).id));
	});
