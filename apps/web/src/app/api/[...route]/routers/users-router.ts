import { usersService } from "@/queries/users.service";
import { Hono } from "hono";

export const userRouter = new Hono()
	.get("/activeOrg", async (c) => {
        
    })
	.post("/activeOrg")
	.get("/orgs", async (c) => {
		return c.json(usersService.getAllOrgsForCurrentUser((await usersService.getUser(c)).id));
	});
