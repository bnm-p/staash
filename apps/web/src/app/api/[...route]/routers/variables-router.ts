import { usersService } from "@/queries/users.service";
import { variablesService } from "@/queries/variables.service";
import { orgSlugAndIdSchema } from "@/validators/orgs.schema";
import { orgAndSpaceSlug } from "@/validators/spaces.schema";
import { userCreateAccountSchema, userCreateSchema } from "@/validators/users.schema";
import { zValidator } from "@/validators/validator-wrapper";
import { variableCreateSchema, variableIdSchema, variableUpdateSchema } from "@/validators/variables.schema";
import { Hono } from "hono";

export const variablesRouter = new Hono()
	.get("/", zValidator("param", orgAndSpaceSlug), async (c) => {
		return c.json(await variablesService.getAllVariablesBySpaceAndOrgSlug(c.req.valid("param")));
	})
	.post("/", zValidator("json", variableCreateSchema), async (c) => {
		const createdVariable = await variablesService.createVariable(c.req.valid("json"));

		return c.json({ message: "Variable created successfully", body: createdVariable }, 200);
	})
	.patch("/:variableId", zValidator("param", variableIdSchema), zValidator("json", variableUpdateSchema), async (c) => {
		const updatedVariable = await variablesService.updateVariable(c.req.valid("param"), c.req.valid("json"));

		return c.json({ message: "Variable updated successfully", body: updatedVariable }, 200);
	})
	.delete("/:variableId", zValidator("param", variableIdSchema), async (c) => {
		return (await variablesService.deleteVariable(c.req.valid("param")))
			? c.json({ message: "Variable deleted successfully" }, 202)
			: c.json({ message: "Variable not deleted successfully" }, 500);
	});
