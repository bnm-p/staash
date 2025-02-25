import { db } from "@/lib/db";
import type { TOrgCreateSchema, TOrgSlugSchema, TOrgUpdateSchema } from "@/validators/orgs.schema";
import { HTTPException } from "hono/http-exception";
import { errorService } from "./error.service";
import { Prisma } from "@prisma/client";

export const orgsService = {
	getOrgBySlug: async (orgSlug: string) => {
		try {
			const org = await db.organization.findUnique({
				where: { slug: orgSlug },
			});

			if (!org) {
				throw new HTTPException(404, { message: "No organization with this slug" });
			}

			return org;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error in getting organization by org slug", error);
		}
	},

	getOrgById: async (orgId: string) => {
		try {
			const org = await db.organization.findUnique({
				where: { id: orgId },
			});

			if (!org) {
				throw new HTTPException(404, { message: "No organization with this id" });
			}

			return org;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error in getting organization by orgId", error);
		}
	},

	createOrganization: async (userId: string, data: TOrgCreateSchema) => {
		try {
			const org = await db.$transaction(async (tx) => {
				const org = await tx.organization.create({
					data: {
						name: data.name,
						slug: data.slug,
						logo: data.logo,
					},
				});

				if (!org) {
					throw new HTTPException(500, { message: "Failed to create organization" });
				}

				const member = await tx.member.create({
					data: {
						userId: userId,
						organizationId: org.id,
						role: "owner",
					},
				});

				if (!member) {
					throw new HTTPException(500, { message: "Failed to assign owner to organization" });
				}

				return org;
			});

			return org;
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new HTTPException(400, { message: "Organization with this slug already exists" });
				}
			}
			return errorService.handleServiceError("Error while creating Organization", error);
		}
	},

	updateOrganization: async (userId: string, orgSlug: string, data: TOrgUpdateSchema) => {
		try {
			const isOwner = await orgsService.isUserOwner(userId, orgSlug);
			if (!isOwner) {
				throw new HTTPException(403, { message: "Forbidden: Only owner can update the organization" });
			}

			const org = await orgsService.getOrgBySlug(orgSlug);

			const cleanData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

			const updatedOrg = await db.organization.update({
				where: {
					id: org.id,
				},
				data: {
					...cleanData,
				},
			});

			return updatedOrg;
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new HTTPException(400, { message: "Organization with this slug already exists" });
				}
			}
			return errorService.handleServiceError("Error while trying to update organization", error);
		}
	},

	deleteOrganization: async (userId: string, { orgSlug }: TOrgSlugSchema) => {
		try {
			const isOwner = await orgsService.isUserOwner(userId, orgSlug);
			if (!isOwner) {
				throw new HTTPException(403, { message: "Forbidden: Only Owner is allowed to delete Organization" });
			}

			const org = await orgsService.getOrgBySlug(orgSlug);

			const deletedOrg = await db.organization.delete({
				where: { id: org.id },
			});

			if (!deletedOrg) {
				throw new HTTPException(500, { message: "Failed to delete organization" });
			}

			return true;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while deleting Organization", error);
		}
	},

	isUserOwner: async (userId: string, orgSlug: string) => {
		try {
			const member = await db.member.findFirst({
				where: { organization: { slug: orgSlug }, userId: userId },
				select: { role: true },
			});

			return member?.role === "owner";
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while checking if user is the owner", error);
		}
	},

	doesSlugExist: async (orgSlug: string) => {
		try {
			const org = await db.organization.findUnique({
				where: {
					slug: orgSlug,
				},
			});

			if (org) {
				return false;
			}

			return true;
		} catch (error: unknown) {
			return errorService.handleServiceError("Error while checking org slug", error);
		}
	},
};
