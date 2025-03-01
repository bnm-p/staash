import test, { test as setup, expect } from "@playwright/test";
import path from "node:path";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, "/.auth/user.json");

// Add @manual tag to run this test only manually
setup("authenticate", { tag: '@manual' }, async ({ page }) => {
	try {

		await page.goto("http://localhost:3000/auth/sign-in");

		await page.getByLabel("Email").fill(process.env.TESTUSER_EMAIL || "");
		await page.getByLabel("Password").fill(process.env.TESTUSER_PASSWORD || "");
		await page.getByRole("button", { name: "Login" }).click();

		// Ensure login was successful
		await page.waitForTimeout(1000); // Give time for backend to process login
		await page.goto("http://localhost:3000/");

		await page.waitForURL("http://localhost:3000/", { timeout: 5000 });

		// Save authentication state
		await page.context().storageState({ path: authFile });
	} catch (error) {
		console.error("Authentication failed:", error);
	}
});
