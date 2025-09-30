import { db } from "@/lib/db";
import { errorService } from "./error.service";
import type { TOrgAndSpaceSlug } from "@/validators/spaces.schema";
import { spacesService } from "./spaces.service";
import type { TVariableCreateSchema, TVariableIdSchema, TVariableUpdateSchema } from "@/validators/variables.schema";
import { HTTPException } from "hono/http-exception";
import { AES } from "@/encrypting/AES256GCM";
import { Prisma } from "@prisma/client";

export const variablesService = {
	getAllVariablesBySpaceAndOrgSlugDecrypted: async (data: TOrgAndSpaceSlug) => {
		try {
			const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug(data);

			const variables = await db.variable.findMany({
				where: { spaceId: space.id },
			});

			for (const v of variables) {
				v.value = AES.decrypt(v.value);
			}
			return variables;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching variables decrypted", error);
		}
	},

	getAllVariablesBySpaceAndOrgSlug: async (data: TOrgAndSpaceSlug) => {
		try {
			const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug(data);

			return await db.variable.findMany({
				where: { spaceId: space.id },
			});
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching variables", error);
		}
	},
	createVariable: async (data: TVariableCreateSchema) => {
		try {
			return await db.variable.create({
				data: {
					name: data.name,
					value: AES.encrypt(data.value),
					spaceId: data.spaceId,
					type: "", //TODO Remove from DB schema
				},
			});
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new HTTPException(400, { message: "Variable with this name already exists in this Space." });
				}
			}
			return errorService.handleServiceError("Unexpected error while creating Variable", error);
		}
	},
	updateVariable: async ({ variableId }: TVariableIdSchema, data: TVariableUpdateSchema) => {
		try {
			const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

			return await db.variable.update({
				where: {
					id: variableId,
				},
				data: {
					...cleanData,
				},
			});
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new HTTPException(400, { message: "Variable with this name already exists in this Space." });
				}
			}
			return errorService.handleServiceError("Unexpected error while updating Variable", error);
		}
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
			return errorService.handleServiceError("Unexpected error while deleting Variable", error);
		}
	},
};
