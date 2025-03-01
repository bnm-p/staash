import type { TOrgCreateSchema, TOrgUpdateSchema } from "@/validators/orgs.schema";
import { test, expect } from "@playwright/test";

import { auth } from "@/lib/auth";
/*test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});*/

const BASE_URL = "http://localhost:3000/api/orgs";
//TODO NED MITCOMITTEN
const sessionCookie =
	"better-auth.session_token=r2gI7LFlGSoK3uEr4T4XxwR6KdVOAtbN.XM0CxiNYvplPgktYbCMmR%2Fn3XbdjVBC%2Bg4XuZcTEn3s%3D";

test("Organisation API Flow", async ({ request }) => {
	const orgSlug = "ApiTestOrg";

	const exampleOrg: TOrgCreateSchema = {
		slug: orgSlug,
		name: "TestOrg",
	};

	const updatedOrg: TOrgUpdateSchema = {
		name: "UpdatedOrg",
	};

	

	await test.step("POST /orgs - Create Organisation", async () => {
		const uri = `${BASE_URL}`;

		const response = await request.post(uri, {
			data: exampleOrg,
			headers: {
				"Content-Type": "application/json",
				cookie: sessionCookie,
			},
		});

		console.log(response);

		expect(response.status()).toBe(201);
		const body = await response.json();
		expect(body.message).toBe("Sucessfully created Organization");
		expect(body.body.slug).toBe(orgSlug);
	});

	await test.step("GET /orgs/:orgSlug - Fetch an organisation", async () => {
		const response = await request.get(`${BASE_URL}/${orgSlug}`, {
			headers: {
				cookie: sessionCookie,
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.slug).toBe(exampleOrg.slug);
		expect(body.name).toBe(exampleOrg.name);
	});

	await test.step("PATCH /orgs/:orgSlug - update and Organisation", async () => {
		const response = await request.patch(`${BASE_URL}/${orgSlug}`, {
			data: updatedOrg,
			headers: {
				"Content-Type": "application/json",
				cookie: sessionCookie,
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.message).toBe("Organization updated successfully");
		expect(body.body.name).toBe(updatedOrg.name);
	});

	await test.step("DELETE /orgs/:orgSlug - Delete an organization", async () => {
		const response = await request.delete(`${BASE_URL}/${orgSlug}`, {
			headers: {
				cookie: sessionCookie,
			},
		});
		expect(response.status()).toBe(202);
		const body = await response.json();
		expect(body.message).toBe("Organization deleted successfully");
	});
});
