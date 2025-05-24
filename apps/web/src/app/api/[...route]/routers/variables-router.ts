import { usersService } from "@/queries/users.service";
import { variablesService } from "@/queries/variables.service";
import { orgSlugAndIdSchema } from "@/validators/orgs.schema";
import { orgAndSpaceSlug } from "@/validators/spaces.schema";
import { userCreateAccountSchema, userCreateSchema } from "@/validators/users.schema";
import { zValidator } from "@/validators/validator-wrapper";
import { Hono } from "hono";

export const variablesRouter = new Hono().get("/", zValidator("param", orgAndSpaceSlug), async (c) => {
	return c.json(await variablesService.getAllVariablesBySpaceAndOrgSlug(c.req.valid("param")));
});
