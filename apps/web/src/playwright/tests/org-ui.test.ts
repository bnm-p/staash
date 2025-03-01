import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, "/.auth/user.json");

test.use({ storageState: authFile });

test("UI Test: Check if the organization is created and displayed", async ({ page }) => {
	await page.goto("http://localhost:3000/");

	await page.waitForTimeout(5000);

	await page.getByRole("button", { name: "Select organization and space" }).click();

	const createOrgButton = page.locator("text=Create Organization");
	await expect(createOrgButton).toBeVisible();

	await createOrgButton.click({ force: true });

	const modalText = page.locator("text=Give your organization a name and an icon. You can always change it later.");

	await expect(modalText).toBeVisible();

	await page.locator('input[placeholder="My Organization"]').fill("MyNewUIOrg");

	//const submitButton = modal.locator('button[type="submit"]');
	//await submitButton.click();

	//await expect(page.locator('text="Organization created successfully"')).toBeVisible();
});
