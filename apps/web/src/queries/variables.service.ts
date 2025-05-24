import { db } from "@/lib/db";
import { errorService } from "./error.service";
import type { TOrgAndSpaceSlug } from "@/validators/spaces.schema";
import { spacesService } from "./spaces.service";
import type { TVariableCreateSchema, TVariableIdSchema, TVariableUpdateSchema } from "@/validators/variables.schema";
import { HTTPException } from "hono/http-exception";
import { AES } from "@/encrypting/AES256GCM";

export const variablesService = {
	getAllVariablesBySpaceAndOrgSlug: async ({ orgSlug, spaceSlug }: TOrgAndSpaceSlug) => {
		try {
			const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug(spaceSlug, orgSlug);

			const variables = await db.variable.findMany({
				where: { spaceId: space.id },
			});

			return variables;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to fetch Variables", error);
		}
	},
	createVariable: async (data: TVariableCreateSchema) => {
		try {
			const variable = await db.variable.create({
				data: {
					name: data.name,
					value: AES.encrypt(data.value),
					spaceId: data.spaceId,
					type: "", //TODO Remove from DB schema
				},
			});

			if (!variable) {
				throw new HTTPException(500, { message: "Failed to create variable" });
			}
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to create Variable", error);
		}
	},
	updateVariable: async ({ variableId }: TVariableIdSchema, data: TVariableUpdateSchema) => {
		const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

		const updatedVariable = await db.variable.update({
			where: {
				id: variableId,
			},
			data: {
				...cleanData,
			},
		});

		return updatedVariable;
	},
	deleteVariable: async ({ variableId }: TVariableIdSchema) => {
		try {
			const deletedVariable = await db.variable.delete({
				where: { id: variableId },
			});

			if (!deletedVariable) {
				throw new HTTPException(500, { message: "Failed to delete variable" });
			}

			return true;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to delete Variable", error);
		}
	},
};
