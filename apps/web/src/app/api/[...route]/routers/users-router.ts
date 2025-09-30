import { usersService } from "@/queries/users.service";
import { orgSlugAndIdSchema } from "@/validators/orgs.schema";
import { userCreateAccountSchema, userCreateSchema } from "@/validators/users.schema";
import { zValidator } from "@/validators/validator-wrapper";
import { Hono } from "hono";

export const userRouter = new Hono()
	.get("/activeOrg", async (c) => {
		const user = await usersService.getUser(c);

		return c.json(await usersService.getActiveOrg(user.id));
	})
	.put("/activeOrg", zValidator("json", orgSlugAndIdSchema), async (c) => {
		const user = await usersService.getUser(c);
		const org = await usersService.setActiveOrg(user.id, c.req.valid("json"));

		return c.json({ message: "Successfully updated activeOrg", body: org }, 200);
	})
	.put("/activeUser", async (c) => {
		const user = await usersService.getUser(c);
		const updatedUser = await usersService.setUserActive(user.id);

		return c.json({ message: "Set user active", body: updatedUser }, 200);
	})
	.get("/orgs", async (c) => {
		return c.json(await usersService.getAllOrgsForCurrentUser((await usersService.getUser(c)).id));
	})
	.post("/", zValidator("json", userCreateSchema), async (c) => {
		return c.json(await usersService.createUser(c.req.valid("json")));
	})
	.post("/account", zValidator("json", userCreateAccountSchema), async (c) => {
		return c.json(await usersService.createAccount(c.req.valid("json")));
	});
