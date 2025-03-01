import { test, expect } from "@playwright/test";

test("UI Test: Check if the organization is created and displayed", async ({ page }) => {
	// Go to your page where the organization is created (e.g., /create-org)
	await page.goto("http://localhost:3000/create-org");

	// Fill out the form to create an organization
	await page.fill("input[name='orgName']", "Test Organization");
	await page.fill("input[name='orgSlug']", "test-org");

	// Click the create button
	await page.click("button[type='submit']");

	// Wait for a success message
	await expect(page.locator(".success-message")).toHaveText("Sucessfully created Organization");

	// Now, check if the organization is visible on the page
	await page.goto("http://localhost:3000/orgs/test-org");

	// Verify the organization's name and slug are displayed
	await expect(page.locator("h1")).toHaveText("Test Organization");
	await expect(page.locator("p.slug")).toHaveText("test-org");
});
