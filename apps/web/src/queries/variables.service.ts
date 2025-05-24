import { db } from "@/lib/db";
import { errorService } from "./error.service";
import type { TOrgAndSpaceSlug } from "@/validators/spaces.schema";
import { spacesService } from "./spaces.service";
import { AES256GCM } from "@/encrypting/AES256GCM";

export const variablesService = {
	getAllVariablesBySpaceAndOrgSlug: async ({ orgSlug, spaceSlug }: TOrgAndSpaceSlug) => {
		try {
			const AES = new AES256GCM();
			const text = "Hello, World! This is AES-256 GCM with Node.js!";

			const encrypted = AES.encrypt(text);

			const decrypted = AES.decrypt(encrypted);
			console.log(decrypted);

			const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug(spaceSlug, orgSlug);

			const variables = await db.variable.findMany({
				where: { spaceId: space.id },
			});

			return variables;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to fetch Variables", error);
		}
	},
};
