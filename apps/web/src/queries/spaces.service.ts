import { db } from "@/lib/db";
import { HTTPException } from "hono/http-exception";
import { orgsService } from "./orgs.service";
import type { TOrgAndSpaceSlug, TSpaceCreateSchema, TSpaceUpdateSchema } from "@/validators/spaces.schema";
import type { TOrgSlugSchema } from "@/validators/orgs.schema";
import { errorService } from "./error.service";
import { Prisma } from "@prisma/client";

export const spacesService = {
	getSpaceBySpaceSlugAndOrgId: async (spaceSlug: string, organizationId: string) => {
		try {
			const spaces = await db.space.findUnique({
				where: {
					slug_organizationId: {
						slug: spaceSlug,
						organizationId: organizationId,
					},
				},
			});

			if (!spaces) {
				throw new HTTPException(404, { message: "No space with such slug in this organization" });
			}

			return spaces;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error in getting space by space slug and ordId", error);
		}
	},
	getSpaceBySpaceSlugAndOrgSlug: async (spaceSlug: string, orgSlug: string) => {
		try {
			const org = await orgsService.getOrgBySlug(orgSlug);

			const space = await spacesService.getSpaceBySpaceSlugAndOrgId(spaceSlug, org.id);

			return space;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error in getting Space by org and space slug", error);
		}
	},

	createSpace: async (data: TSpaceCreateSchema) => {
		try {
			const space = await db.space.create({
				data: {
					name: data.name,
					slug: data.slug,
					icon: data.icon,
					organizationId: data.orgId,
				},
			});

			if (!space) {
				throw new HTTPException(500, { message: "Failed to create space" });
			}

			return space;
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new HTTPException(400, { message: "Space with this slug already exists in this Organisation." });
				}
			}
			return errorService.handleServiceError("Error while creating Space", error);
		}
	},

	getAllSpacesByOrgSlug: async ({ orgSlug }: TOrgSlugSchema) => {
		try {
			const org = await orgsService.getOrgBySlug(orgSlug);

			const spaces = await db.space.findMany({
				where: {
					organizationId: org.id,
				},
			});

			return spaces;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to fetch Spaces", error);
		}
	},

	getSingleSpaceBySpaceSlugAndOrgSlug: async ({ orgSlug, spaceSlug }: TOrgAndSpaceSlug) => {
		try {
			const org = await orgsService.getOrgBySlug(orgSlug);

			const space = await db.space.findUnique({
				where: {
					slug_organizationId: {
						slug: spaceSlug,
						organizationId: org.id,
					},
				},
			});

			if (!space) {
				throw new HTTPException(404, { message: "No space with this slug in this organization" });
			}

			return space;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to fetch spaces", error);
		}
	},

	updateSpace: async (userId: string, orgSlug: string, spaceSlug: string, data: TSpaceUpdateSchema) => {
		try {
			const isOwner = await orgsService.isUserOwner(userId, orgSlug);

			if (!isOwner) {
				throw new HTTPException(403, { message: "Forbidden: Only Owner is allowed to delete Organization" });
			}

			const org = await orgsService.getOrgBySlug(orgSlug);

			const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

			const updatedSpace = await db.space.update({
				where: {
					slug_organizationId: {
						slug: spaceSlug,
						organizationId: org.id,
					},
				},
				data: {
					...cleanData,
				},
			});

			return updatedSpace;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to update space", error);
		}
	},

	deleteSpace: async (userId: string, { orgSlug, spaceSlug }: TOrgAndSpaceSlug) => {
		try {
			const isOwner = await orgsService.isUserOwner(userId, orgSlug);

			if (!isOwner) {
				throw new HTTPException(403, { message: "Forbidden: Only Owner is allowed to delete Organization" });
			}

			const space = await spacesService.getSpaceBySpaceSlugAndOrgSlug(spaceSlug, orgSlug);

			const deletedSpace = await db.space.delete({
				where: { id: space.id },
			});

			if (!deletedSpace) {
				throw new HTTPException(500, { message: "Failed to delete space" });
			}

			return true;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while trying to fetch Spaces", error);
		}
	},
};
