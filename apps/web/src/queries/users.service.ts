import { db } from "@/lib/db";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { orgsService } from "./orgs.service";
import type { TOrgSlugAndId } from "@/validators/orgs.schema";
import { errorService } from "./error.service";
import type { TUserCreateAccountSchema, TUserCreateSchema } from "@/validators/users.schema";
import { scryptAsync } from "@noble/hashes/scrypt";
import { getRandomValues } from "@better-auth/utils";
import { hex } from "@better-auth/utils/hex";
import { createHash } from "@better-auth/utils/hash";

const config = {
	N: 16384,
	r: 16,
	p: 1,
	dkLen: 64,
};

async function generateKey(password: string, salt: string) {
	return await scryptAsync(password.normalize("NFKC"), salt, {
		N: config.N,
		p: config.p,
		r: config.r,
		dkLen: config.dkLen,
		maxmem: 128 * config.N * config.r * 2,
	});
}

const hashPassword = async (password: string) => {
	const salt = hex.encode(getRandomValues(new Uint8Array(16)));
	const key = await generateKey(password, salt);
	return `${salt}:${hex.encode(key)}`;
};

export const usersService = {
	getUser: async (c: Context) => {
		try {
			const user = c.get("user");

			if (!user) {
				throw new HTTPException(401, { message: "Unauthorized" });
			}

			return user;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching user", error);
		}
	},

	createUser: async (data: TUserCreateSchema) => {
		try {
			const currentDate = new Date();

			const user = await db.user.create({
				data: {
					email: data.email,
					emailVerified: false,
					createdAt: currentDate,
					updatedAt: currentDate,
					status: "pending",
				},
			});

			if (!user) {
				throw new HTTPException(500, { message: "Failed to create user" });
			}

			return user;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while creating User", error);
		}
	},

	createAccount: async (data: TUserCreateAccountSchema) => {
		try {
			const user = await db.user.update({
				where: { email: data.email },
				data: { name: data.name },
			});

			if (!user) {
				throw new HTTPException(500, { message: "Failed to create user" });
			}

			const password = await hashPassword(data.password);

			const account = await db.account.create({
				data: {
					userId: user.id,
					accountId: user.id,
					providerId: "credential",
					password,
				},
			});

			return account;
		} catch (error) {
			return errorService.handleServiceError("Unexpected error while creating User", error);
		}
	},

	getUserById: async (userId: string) => {
		try {
			const user = db.user.findUnique({
				where: {
					id: userId,
				},
			});

			if (!user) {
				throw new HTTPException(401, { message: "Unauthorized" });
			}

			return user;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching User", error);
		}
	},

	getAllOrgsForCurrentUser: async (userId: string) => {
		try {
			const members = await db.member.findMany({
				where: {
					userId: userId,
				},
				include: {
					organization: {
						include: {
							spaces: true,
						},
					},
				},
			});

			const orgs = members.map((member) => {
				return member.organization;
			});

			return orgs;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching all organization for current user", error);
		}
	},
	getActiveOrg: async (userId: string) => {
		try {
			const user = await db.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					lastActiveOrgId: true,
				},
			});

			if (!user?.lastActiveOrgId) {
				return null;
			}

			return await orgsService.getOrgById(user.lastActiveOrgId);
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while fetching last active organization", error);
		}
	},

	setActiveOrg: async (userId: string, { orgId, orgSlug }: TOrgSlugAndId) => {
		try {
			if (!orgId && !orgSlug) {
				throw new HTTPException(400, { message: "Requires either orgId or orgSlug." });
			}

			if (orgSlug) {
				const org = await orgsService.getOrgBySlug(orgSlug); //check if Org exists and fetch ID
				orgId = org.id;
			} else if (orgId) {
				await orgsService.getOrgById(orgId); //check if Org exists
			}

			const org = await db.user.update({
				where: {
					id: userId,
				},
				data: {
					lastActiveOrgId: orgId,
				},
			});

			if (!org) {
				throw new HTTPException(500, { message: "Failed to update last active organization" });
			}

			return org;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while updating last active organization", error);
		}
	},

	setUserActive: async (userId: string) => {
		try {
			const user = await db.user.update({
				where: {
					id: userId,
				},
				data: {
					status: "active",
				},
			});

			return user;
		} catch (error: unknown) {
			return errorService.handleServiceError("Unexpected error while setting user to active", error);
		}
	},
};
