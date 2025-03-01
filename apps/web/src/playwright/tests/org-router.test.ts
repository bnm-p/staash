import type { TOrgCreateSchema, TOrgUpdateSchema } from "@/validators/orgs.schema";
import { test, expect, type APIRequestContext } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "http://localhost:3000/api/orgs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, "/.auth/user.json");

test.use({ storageState: authFile });

test("Organization API Flow", async ({ request }) => {
	const orgSlug = "ApiTestOrg";

	const exampleOrg: TOrgCreateSchema = {
		slug: orgSlug,
		name: "TestOrg",
	};

	const updatedOrg: TOrgUpdateSchema = {
		name: "UpdatedOrg",
	};

	await test.step("POST /orgs - Create Organization", async () => {
		const uri = `${BASE_URL}`;

		const response = await request.post(uri, {
			data: exampleOrg,
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(response.status()).toBe(201);
		const body = await response.json();
		expect(body.message).toBe("Successfully created Organization");
		expect(body.body.slug).toBe(orgSlug);
	});

	await test.step("GET /orgs/:orgSlug - Fetch an organization", async () => {
		const response = await request.get(`${BASE_URL}/${orgSlug}`);

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.slug).toBe(exampleOrg.slug);
		expect(body.name).toBe(exampleOrg.name);
	});

	await test.step("PATCH /orgs/:orgSlug - update and Organization", async () => {
		const response = await request.patch(`${BASE_URL}/${orgSlug}`, {
			data: updatedOrg,
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.message).toBe("Organization updated successfully");
		expect(body.body.name).toBe(updatedOrg.name);
	});

	await test.step("DELETE /orgs/:orgSlug - Delete an organization", async () => {
		const response = await request.delete(`${BASE_URL}/${orgSlug}`);
		expect(response.status()).toBe(202);
		const body = await response.json();
		expect(body.message).toBe("Organization deleted successfully");
	});
});

test.describe("Organization API Edge Cases", () => {
	// Cleanup helper function
	async function cleanupOrg(request: APIRequestContext, slug: string) {
		try {
			await request.delete(`${BASE_URL}/${slug}`);
		} catch (error) {
			// Ignore cleanup errors
		}
	}

	test("Should fail when creating organization with duplicate slug", async ({ request }) => {
		const testSlug = "duplicate-slug-test";
		try {
			const duplicateOrg: TOrgCreateSchema = {
				slug: testSlug,
				name: "First Org",
			};

			// Create first organization
			await request.post(BASE_URL, {
				data: duplicateOrg,
				headers: { "Content-Type": "application/json" },
			});

			// Attempt to create organization with same slug
			const response = await request.post(BASE_URL, {
				data: duplicateOrg,
				headers: { "Content-Type": "application/json" },
			});

			expect(response.status()).toBe(400);
			const body = await response.json();
			expect(body.error).toBe("Organization with this slug already exists");
		} finally {
			// Cleanup after test
			await cleanupOrg(request, testSlug);
		}
	});

	test("Should fail when fetching non-existent organization", async ({ request }) => {
		const response = await request.get(`${BASE_URL}/non-existent-org-${Date.now()}`);

		expect(response.status()).toBe(404);
		const body = await response.json();
		expect(body.error).toBe("No organization with this slug");
	});

	test("Should fail when updating non-existent organization", async ({ request }) => {
		const updateData: TOrgUpdateSchema = {
			name: "Updated Name",
		};

		const response = await request.patch(`${BASE_URL}/non-existent-org-${Date.now()}`, {
			data: updateData,
			headers: { "Content-Type": "application/json" },
		});

		expect(response.status()).toBe(404);
		const body = await response.json();
		expect(body.error).toBe("No organization with this slug");
	});

	test("Should fail when creating organization with invalid data", async ({ request }) => {
		const invalidOrg = {
			slug: "", // Empty slug
			name: "X".repeat(30), // Name too long (> 20 chars)
		};

		const response = await request.post(BASE_URL, {
			data: invalidOrg,
			headers: { "Content-Type": "application/json" },
		});

		expect(response.status()).toBe(400);
		const body = await response.json();
		expect(body.status).toBe("error");
	});

	test("Should fail when updating organization with invalid data", async ({ request }) => {
		const testSlug = `test-${Date.now() % 1000}`;
		try {
			// First create a valid organization
			const postResp = await request.post(BASE_URL, {
				data: { slug: testSlug, name: "Test" },
				headers: { "Content-Type": "application/json" },
			});

			expect(postResp.status()).toBe(201);

			// Try to update with invalid data
			const invalidUpdate = {
				name: "X".repeat(30), // Name too long (> 20 chars)
			};

			const response = await request.patch(`${BASE_URL}/${testSlug}`, {
				data: invalidUpdate,
				headers: { "Content-Type": "application/json" },
			});

			expect(response.status()).toBe(400);
			const body = await response.json();
			expect(body.status).toBe("error");
		} finally {
			// Cleanup after test
			await cleanupOrg(request, testSlug);
		}
	});

	test("Should fail when deleting non-existent organization", async ({ request }) => {
		const response = await request.delete(`${BASE_URL}/non-existent-org-${Date.now()}`);

		expect(response.status()).toBe(404);
		const body = await response.json();
		expect(body.error).toBe("No organization with this slug");
	});
});
