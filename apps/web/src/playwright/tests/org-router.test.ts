import type { TOrgCreateSchema, TOrgUpdateSchema } from "@/validators/orgs.schema";
import { test, expect } from "@playwright/test";
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

		console.log(response);

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
